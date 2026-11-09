// 문제 업로드 · 승인 (설계 8장)
import { Hono } from 'hono';
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import {
  checkUploadFile, parseJSX, uploadTargetPath, uploadToJsx, validateCatalog, itemIdOf,
  type FileCheckResult, type SetDetail, type UploadFileView, type UploadJson, type UploadView, type QuestionType,
} from '@quiz/core';
import type { AppContext } from './context.ts';
import { vmEvaluate } from './content.ts';
import { all, get, run, tx } from './db.ts';
import { requireAdmin, requireUser, type Env } from './auth.ts';
import { git, hasRemote } from './git.ts';
import { body, fail, int, now } from './util.ts';

type Checked = FileCheckResult & { data: UploadJson | null };

async function readFiles(c: { req: { parseBody: (o: { all: true }) => Promise<Record<string, unknown>> } }, app: AppContext): Promise<{ name: string; text: string }[]> {
  let form: Record<string, unknown>;
  try { form = await c.req.parseBody({ all: true }); } catch { fail(400, 'multipart/form-data 로 files 를 보내세요.'); }
  const raw = form.files;
  const list = (Array.isArray(raw) ? raw : raw ? [raw] : []).filter((f): f is File => typeof f === 'object' && f !== null && 'arrayBuffer' in f);
  if (!list.length) fail(400, '파일이 없습니다(필드명 files).');
  if (list.length > app.config.uploadMaxFiles) fail(400, `한 번에 ${app.config.uploadMaxFiles}개까지 올릴 수 있습니다.`);
  const out: { name: string; text: string }[] = [];
  for (const f of list) {
    if (f.size > app.config.uploadMaxFileBytes) fail(413, `${f.name}: 파일이 너무 큽니다(최대 ${Math.round(app.config.uploadMaxFileBytes / 1024)}KB).`);
    out.push({ name: f.name || 'upload.json', text: await f.text() });
  }
  return out;
}

/** 파일들 검사 (스키마 · 형식 · 기존/같은 제출 내 비슷한 문제) */
export function checkFiles(app: AppContext, files: { name: string; text: string }[]): Checked[] {
  const parsed = files.map((f) => {
    try { return { name: f.name, raw: JSON.parse(f.text.replace(/^﻿/, '')) as unknown, err: null as string | null }; }
    catch (e) { return { name: f.name, raw: null, err: (e as Error).message }; }
  });
  const ok = parsed.filter((p) => !p.err && p.raw && typeof p.raw === 'object' && (p.raw as UploadJson).meta && typeof (p.raw as UploadJson).meta.subject === 'string')
    .map((p) => ({ name: p.name, data: p.raw as UploadJson }));
  const ctx = { catalog: app.content.data.catalog, existing: app.content.existingQuestions(), evaluate: vmEvaluate };
  return parsed.map((p) => {
    if (p.err) return { name: p.name, ok: false, messages: [{ level: 'error' as const, where: '파일', message: 'JSON 문법 오류: ' + p.err }], data: null };
    const r = checkUploadFile(p.name, p.raw, ctx, ok);
    const { parsed: _p, ...rest } = r;
    return rest;
  });
}
const strip = (r: Checked): FileCheckResult => { const { data: _d, ...rest } = r; return rest; };

interface FileRow { id: number; upload_id: number; original_name: string; raw_json: string; check_result: string; status: 'pending' | 'approved' | 'rejected'; reject_reason: string | null; target_path: string | null }
interface UploadRow { id: number; user_id: number; status: 'pending' | 'done' | 'cancelled'; created_at: number; decided_at: number | null; commit_sha: string | null }

export function uploadView(app: AppContext, u: UploadRow): UploadView {
  const user = get<{ username: string; nickname: string }>(app.db, 'SELECT username, nickname FROM users WHERE id = ?', u.user_id)!;
  const files: UploadFileView[] = all<FileRow>(app.db, 'SELECT * FROM upload_files WHERE upload_id = ? ORDER BY id', u.id).map((f) => ({
    ...(JSON.parse(f.check_result) as FileCheckResult), id: f.id, status: f.status, rejectReason: f.reject_reason, targetPath: f.target_path,
  }));
  return { id: u.id, status: u.status, createdAt: u.created_at, decidedAt: u.decided_at, commitSha: u.commit_sha, user, files };
}

/** 과목목록.json 을 한 줄에 한 과목 형식으로 쓴다 */
function writeCatalog(path: string, entries: { subject: string; grade: number; semester: number }[]): void {
  const lines = entries.map((e) => `  { "subject": ${JSON.stringify(e.subject)}, "grade": ${e.grade}, "semester": ${e.semester} }`);
  writeFileSync(path, '[\n' + lines.join(',\n') + '\n]\n');
}

export interface DecideResult { ok: boolean; commitSha?: string; hookOutput?: string; error?: string }

/** 승인 반영: pull → 저장 → (새 과목) 과목목록 → add · commit(훅) → 실패 시 되돌림 → push → reload. 잠금 안에서 실행 */
async function commitApproved(app: AppContext, approved: { row: FileRow; data: UploadJson }[], uploader: { username: string; nickname: string }): Promise<DecideResult & { paths?: Map<number, string> }> {
  const dir = app.config.contentDir;
  const id = { name: app.config.gitAuthorName, email: app.config.gitAuthorEmail };
  const remote = await hasRemote(dir);
  if (remote) {
    const p = await git(dir, ['pull', '--ff-only', 'origin', app.config.contentBranch]);
    if (p.code !== 0) return { ok: false, error: 'git pull 실패: ' + (p.stdout + p.stderr).trim() };
    app.reloadNow();
  }
  // 최신 콘텐츠 기준으로 다시 검사
  const recheck = checkFiles(app, approved.map((a) => ({ name: a.row.original_name, text: a.row.raw_json })));
  const bad = recheck.filter((r) => !r.ok);
  if (bad.length) return { ok: false, error: '다시 검사에서 오류: ' + bad.map((b) => `${b.name}: ${b.messages.filter((m) => m.level === 'error').map((m) => m.message).join(' / ')}`).join('; ') };

  const catPath = join(dir, '과목목록.json');
  const catOrig = existsSync(catPath) ? readFileSync(catPath, 'utf8') : null;
  const catalog = catOrig ? validateCatalog(JSON.parse(catOrig)).catalog.map((e) => ({ ...e })) : [];
  let catChanged = false;
  const chosen = new Set<string>();
  const written: string[] = [];
  const paths = new Map<number, string>();
  const date = new Date().toISOString().slice(0, 10);
  let t = now();
  for (const a of approved) {
    const subject = a.data.meta.subject.normalize('NFC').trim();
    const entry = catalog.find((e) => e.subject === subject);
    if (!entry) {
      if (!Number.isInteger(a.data.meta.grade) || (a.data.meta.semester !== 1 && a.data.meta.semester !== 2)) return { ok: false, error: `${a.row.original_name}: 새 과목인데 grade · semester 가 없습니다.` };
      catalog.push({ subject, grade: a.data.meta.grade!, semester: a.data.meta.semester });
      catChanged = true;
    } else if ((a.data.meta.grade != null && a.data.meta.grade !== entry.grade) || (a.data.meta.semester != null && a.data.meta.semester !== entry.semester)) {
      return { ok: false, error: `${a.row.original_name}: ${subject} 의 학년 · 학기가 과목목록(${entry.grade}학년 ${entry.semester}학기)과 다릅니다.` };
    }
    const target = uploadTargetPath(a.data, (p) => chosen.has(p) || existsSync(join(dir, p)));
    chosen.add(target);
    const code = uploadToJsx(a.data, { uploaderUsername: uploader.username, uploaderNickname: uploader.nickname, date, now: t });
    t += 1000;
    mkdirSync(dirname(join(dir, target)), { recursive: true });
    writeFileSync(join(dir, target), code);
    written.push(target);
    paths.set(a.row.id, target);
  }
  if (catChanged) writeCatalog(catPath, catalog);
  const addList = [...written, ...(catChanged ? ['과목목록.json'] : [])];

  const rollback = async () => {
    await git(dir, ['reset', '-q', 'HEAD', '--', ...addList, 'quiz_bundle.js']);
    for (const p of written) { try { unlinkSync(join(dir, p)); } catch { /* 없음 */ } }
    if (catChanged) { if (catOrig != null) writeFileSync(catPath, catOrig); else try { unlinkSync(catPath); } catch { /* 없음 */ } }
    await git(dir, ['checkout', '--', 'quiz_bundle.js']);
  };
  const add = await git(dir, ['add', '--', ...addList]);
  if (add.code !== 0) { await rollback(); return { ok: false, error: 'git add 실패: ' + add.stderr.trim() }; }
  const titles = approved.map((a) => `${a.data.meta.subject} ${a.data.meta.title}`);
  const msg = `업로드: ${uploader.nickname} — ${titles[0]}${titles.length > 1 ? ` 외 ${titles.length - 1}개` : ''}`;
  const commit = await git(dir, ['commit', '-m', msg], id);
  const hookOutput = (commit.stdout + commit.stderr).trim();
  if (commit.code !== 0) { await rollback(); return { ok: false, error: '커밋 실패(pre-commit 훅)', hookOutput }; }
  const sha = (await git(dir, ['rev-parse', 'HEAD'])).stdout.trim();
  if (remote) {
    let push = await git(dir, ['push', 'origin', `HEAD:${app.config.contentBranch}`]);
    if (push.code !== 0) {
      const pr = await git(dir, ['pull', '--rebase', 'origin', app.config.contentBranch], id);
      push = pr.code === 0 ? await git(dir, ['push', 'origin', `HEAD:${app.config.contentBranch}`]) : pr;
      if (push.code !== 0) {
        app.pullWarning = { at: now(), output: 'push 실패(로컬에는 커밋됨): ' + (push.stdout + push.stderr).trim() };
        app.reloadNow();
        app.headSha = (await git(dir, ['rev-parse', 'HEAD'])).stdout.trim();
        return { ok: false, commitSha: app.headSha, hookOutput, error: 'git push 실패: ' + (push.stdout + push.stderr).trim(), paths };
      }
    }
  }
  app.reloadNow();
  app.headSha = (await git(dir, ['rev-parse', 'HEAD'])).stdout.trim();
  return { ok: true, commitSha: app.headSha || sha, hookOutput, paths };
}

export function uploadRoutes(): Hono<Env> {
  const r = new Hono<Env>();

  r.post('/uploads/check', async (c) => {
    requireUser(c);
    const app = c.get('app');
    return c.json(checkFiles(app, await readFiles(c, app)).map(strip));
  });

  r.post('/uploads', async (c) => {
    const u = requireUser(c);
    const app = c.get('app');
    const n = get<{ n: number }>(app.db, 'SELECT COUNT(*) AS n FROM uploads WHERE user_id = ? AND created_at > ?', u.id, now() - 86400000)!.n;
    if (n >= app.config.uploadDailyLimit) fail(429, `하루 제출은 ${app.config.uploadDailyLimit}건까지입니다.`);
    const files = await readFiles(c, app);
    const results = checkFiles(app, files);
    if (results.some((x) => !x.ok)) return c.json({ error: '오류가 있는 파일이 있어 제출하지 않았습니다.', results: results.map(strip) }, 400);
    const id = tx(app.db, () => {
      const uid = run(app.db, 'INSERT INTO uploads (user_id, status, created_at) VALUES (?, ?, ?)', u.id, 'pending', now()).id;
      results.forEach((x, i) => run(app.db, `INSERT INTO upload_files (upload_id, original_name, raw_json, subject, kind, title, exam, check_result)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, uid, files[i].name, files[i].text, x.subject, x.kind, x.title, x.exam, JSON.stringify(strip(x))));
      return uid;
    });
    return c.json({ upload: uploadView(app, get<UploadRow>(app.db, 'SELECT * FROM uploads WHERE id = ?', id)!), results: results.map(strip) });
  });

  r.get('/uploads/mine', (c) => {
    const u = requireUser(c);
    const app = c.get('app');
    return c.json(all<UploadRow>(app.db, 'SELECT * FROM uploads WHERE user_id = ? ORDER BY id DESC', u.id).map((x) => uploadView(app, x)));
  });

  r.delete('/uploads/:id', (c) => {
    const u = requireUser(c);
    const app = c.get('app');
    const up = get<UploadRow>(app.db, 'SELECT * FROM uploads WHERE id = ?', int(c.req.param('id'), 'id'));
    if (!up || (up.user_id !== u.id && u.role !== 'admin')) fail(404, '제출을 찾을 수 없습니다.');
    if (up.status !== 'pending') fail(409, '대기 중인 제출만 취소할 수 있습니다.');
    if (get(app.db, "SELECT 1 FROM upload_files WHERE upload_id = ? AND status = 'approved'", up.id)) fail(409, '이미 승인된 파일이 있어 취소할 수 없습니다.');
    run(app.db, "UPDATE uploads SET status = 'cancelled', decided_at = ? WHERE id = ?", now(), up.id);
    return c.json({ ok: true });
  });

  // ── 관리자 ──
  r.get('/admin/uploads', (c) => {
    requireAdmin(c);
    const app = c.get('app');
    const st = c.req.query('status');
    const rows = st ? all<UploadRow>(app.db, 'SELECT * FROM uploads WHERE status = ? ORDER BY id DESC', st) : all<UploadRow>(app.db, 'SELECT * FROM uploads ORDER BY id DESC');
    return c.json(rows.map((x) => uploadView(app, x)));
  });
  r.get('/admin/uploads/:id', (c) => {
    requireAdmin(c);
    const app = c.get('app');
    const up = get<UploadRow>(app.db, 'SELECT * FROM uploads WHERE id = ?', int(c.req.param('id'), 'id'));
    if (!up) fail(404, '제출을 찾을 수 없습니다.');
    return c.json(uploadView(app, up));
  });
  r.get('/admin/uploads/:id/files/:fileId/preview', (c) => {
    requireAdmin(c);
    const app = c.get('app');
    const f = get<FileRow>(app.db, 'SELECT * FROM upload_files WHERE id = ? AND upload_id = ?', int(c.req.param('fileId'), 'fileId'), int(c.req.param('id'), 'id'));
    if (!f) fail(404, '파일을 찾을 수 없습니다.');
    const data = JSON.parse(f.raw_json) as UploadJson;
    const path = `upload:${f.id}`;
    const subject = data.meta.subject.normalize('NFC').trim();
    const parsed = parseJSX(`${subject}/${data.meta.kind}/preview.jsx`, uploadToJsx(data, { uploaderUsername: 'preview', uploaderNickname: 'preview', date: '', assignIds: false }), { group: subject, evaluate: vmEvaluate });
    const typeCounts: Record<QuestionType, number> = { ox: 0, choice: 0, short: 0 };
    parsed.questions.forEach((q) => typeCounts[q.type]++);
    const out: SetDetail = {
      path, subject, exam: data.meta.exam, kind: data.meta.kind, title: parsed.title, topic: parsed.topic, unit: parsed.unit,
      questionCount: parsed.questions.length, typeCounts, termCount: parsed.terms.length, hash: '',
      items: parsed.questions.map((q) => ({ ...q, itemId: itemIdOf(path, q) })), terms: parsed.terms,
    };
    return c.json(out);
  });

  r.post('/admin/uploads/:id/decide', async (c) => {
    const admin = requireAdmin(c);
    const app = c.get('app');
    const up = get<UploadRow>(app.db, 'SELECT * FROM uploads WHERE id = ?', int(c.req.param('id'), 'id'));
    if (!up) fail(404, '제출을 찾을 수 없습니다.');
    if (up.status !== 'pending') fail(409, '대기 중인 제출이 아닙니다.');
    const b = await body(c);
    if (!Array.isArray(b.files) || !b.files.length) fail(400, 'files 가 필요합니다.');
    const decisions = (b.files as { id: unknown; approve: unknown; reason?: unknown }[]).map((d) => ({ id: int(d.id, 'files.id'), approve: !!d.approve, reason: typeof d.reason === 'string' ? d.reason.trim() : '' }));
    const rows = new Map(all<FileRow>(app.db, "SELECT * FROM upload_files WHERE upload_id = ? AND status = 'pending'", up.id).map((f) => [f.id, f]));
    for (const d of decisions) {
      if (!rows.has(d.id)) fail(400, `대기 중인 파일이 아닙니다: ${d.id}`);
      if (!d.approve && !d.reason) fail(400, '반려 사유가 필요합니다.');
    }
    const uploader = get<{ username: string; nickname: string }>(app.db, 'SELECT username, nickname FROM users WHERE id = ?', up.user_id)!;
    const approved = decisions.filter((d) => d.approve).map((d) => ({ row: rows.get(d.id)!, data: JSON.parse(rows.get(d.id)!.raw_json) as UploadJson }));
    let result: DecideResult & { paths?: Map<number, string> } = { ok: true };
    if (approved.length) result = await app.lock.run(() => commitApproved(app, approved, uploader));
    const committed = result.ok || (!!result.commitSha && !!result.paths);
    tx(app.db, () => {
      const t = now();
      for (const d of decisions) {
        if (d.approve) { if (committed) run(app.db, "UPDATE upload_files SET status = 'approved', target_path = ? WHERE id = ?", result.paths?.get(d.id) ?? null, d.id); }
        else run(app.db, "UPDATE upload_files SET status = 'rejected', reject_reason = ? WHERE id = ?", d.reason, d.id);
      }
      const left = get<{ n: number }>(app.db, "SELECT COUNT(*) AS n FROM upload_files WHERE upload_id = ? AND status = 'pending'", up.id)!.n;
      run(app.db, 'UPDATE uploads SET status = ?, decided_at = ?, commit_sha = COALESCE(?, commit_sha) WHERE id = ?', left ? 'pending' : 'done', t, committed ? result.commitSha ?? null : null, up.id);
    });
    void admin;
    const { paths: _p, ...out } = result;
    return c.json(out);
  });

  return r;
}
