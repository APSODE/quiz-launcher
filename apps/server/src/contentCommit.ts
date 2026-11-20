// 콘텐츠 커밋 공용 절차 (업로드 승인 · 시험 범위 저장): pull → 준비 → 쓰기 → add · commit(훅) → 실패 시 되돌림 → push → reload.
// 반드시 app.lock.run 안에서 부를 것.
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { validateCatalog, type CatalogEntry } from '@quiz/core';
import type { AppContext } from './context.ts';
import { git, hasRemote } from './git.ts';
import { now } from './util.ts';

export interface ContentWrite { path: string; content: string }
export interface CommitPlan { writes: ContentWrite[]; message: string }
export interface CommitOutcome {
  ok: boolean;
  /** 로컬에 커밋이 만들어졌는가 (push 실패여도 true) */
  committed: boolean;
  commitSha?: string; hookOutput?: string; error?: string;
}

/**
 * prepare 는 pull · reload 뒤(최신 콘텐츠 기준)에 불린다. 쓸 파일과 커밋 메시지를 돌려주거나 { error } 로 중단한다.
 * prepare 안에서 fail() 을 던져도 된다(아직 아무것도 쓰지 않았으므로 되돌릴 것 없음).
 */
export async function commitContent(app: AppContext, prepare: () => CommitPlan | { error: string }): Promise<CommitOutcome> {
  const dir = app.config.contentDir;
  const id = { name: app.config.gitAuthorName, email: app.config.gitAuthorEmail };
  const remote = await hasRemote(dir);
  if (remote) {
    const p = await git(dir, ['pull', '--ff-only', 'origin', app.config.contentBranch]);
    if (p.code !== 0) return { ok: false, committed: false, error: 'git pull 실패: ' + (p.stdout + p.stderr).trim() };
    app.reloadNow();
  }
  const plan = prepare();
  if ('error' in plan) return { ok: false, committed: false, error: plan.error };

  // 원래 내용을 기억해 두고 쓴다(되돌림용; null = 새 파일)
  const originals = new Map<string, string | null>();
  for (const w of plan.writes) {
    const abs = join(dir, w.path);
    if (!originals.has(w.path)) originals.set(w.path, existsSync(abs) ? readFileSync(abs, 'utf8') : null);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, w.content);
  }
  const addList = [...originals.keys()];
  const rollback = async () => {
    await git(dir, ['reset', '-q', 'HEAD', '--', ...addList]);
    for (const [p, orig] of originals) {
      const abs = join(dir, p);
      if (orig != null) writeFileSync(abs, orig);
      else try { unlinkSync(abs); } catch { /* 없음 */ }
    }
  };
  const add = await git(dir, ['add', '--', ...addList]);
  if (add.code !== 0) { await rollback(); return { ok: false, committed: false, error: 'git add 실패: ' + add.stderr.trim() }; }
  const commit = await git(dir, ['commit', '-m', plan.message], id);
  const hookOutput = (commit.stdout + commit.stderr).trim();
  if (commit.code !== 0) { await rollback(); return { ok: false, committed: false, error: '커밋 실패(pre-commit 훅)', hookOutput }; }
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
        return { ok: false, committed: true, commitSha: app.headSha, hookOutput, error: 'git push 실패: ' + (push.stdout + push.stderr).trim() };
      }
    }
  }
  app.reloadNow();
  app.headSha = (await git(dir, ['rev-parse', 'HEAD'])).stdout.trim();
  return { ok: true, committed: true, commitSha: app.headSha || sha, hookOutput };
}

/** 작업 사본의 과목목록.json 을 읽는다(scope 포함, 쓰기용 복사본). 파일이 없으면 []. fatal = JSON 자체를 못 읽음(덮어쓰면 안 됨) */
export function readCatalogFile(dir: string): { entries: CatalogEntry[]; errors: string[]; fatal?: string } {
  const p = join(dir, '과목목록.json');
  if (!existsSync(p)) return { entries: [], errors: [] };
  try {
    const r = validateCatalog(JSON.parse(readFileSync(p, 'utf8')));
    return { entries: r.catalog.map((e) => ({ ...e, ...(e.scope ? { scope: { ...e.scope } } : {}) })), errors: r.errors };
  } catch (e) { const m = '과목목록.json 을 읽을 수 없습니다: ' + (e as Error).message; return { entries: [], errors: [m], fatal: m }; }
}
