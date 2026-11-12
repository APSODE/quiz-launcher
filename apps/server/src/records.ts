// 콘텐츠 조회 · 풀이 세션 · 오답 분석 · 복습 · 리더보드 · 과목 표시 설정 (설계 3 · 5 · 6 · 7 · 10.4장)
import { Hono } from 'hono';
import {
  gradeAnswer, newCardState, reviewCard, EXAMS,
  type Analysis, type Exam, type LeaderboardRow, type RawAnswer, type ReviewBatch, type SessionKind, type SessionResult,
  type SessionSubmit, type SrsCardState, type SubjectPref,
} from '@quiz/core';
import type { AppContext } from './context.ts';
import { all, get, run, tx } from './db.ts';
import { requireUser, type Env } from './auth.ts';
import { body, fail, int, now, str } from './util.ts';

const KINDS_S: SessionKind[] = ['set', 'review', 'partial'];
const examOf = (v: unknown): Exam => { if (!EXAMS.includes(v as Exam)) fail(400, 'exam 은 중간고사 또는 기말고사'); return v as Exam; };

interface CardRow extends SrsCardState { user_id: number; item_id: string; subject: string }

function getCard(app: AppContext, userId: number, itemId: string): CardRow | undefined {
  return get<CardRow>(app.db, 'SELECT * FROM srs_cards WHERE user_id = ? AND item_id = ?', userId, itemId);
}
function putCard(app: AppContext, userId: number, itemId: string, subject: string, s: SrsCardState): void {
  run(app.db, `INSERT INTO srs_cards (user_id, item_id, subject, due, stability, difficulty, elapsed_days, scheduled_days, reps, lapses, state, last_review, learning_steps)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT (user_id, item_id) DO UPDATE SET subject = excluded.subject, due = excluded.due, stability = excluded.stability,
      difficulty = excluded.difficulty, elapsed_days = excluded.elapsed_days, scheduled_days = excluded.scheduled_days,
      reps = excluded.reps, lapses = excluded.lapses, state = excluded.state, last_review = excluded.last_review, learning_steps = excluded.learning_steps`,
    userId, itemId, subject, s.due, s.stability, s.difficulty, s.elapsed_days, s.scheduled_days, s.reps, s.lapses, s.state, s.last_review, s.learning_steps);
}
const cardState = (r: CardRow): SrsCardState => ({
  due: r.due, stability: r.stability, difficulty: r.difficulty, elapsed_days: r.elapsed_days, scheduled_days: r.scheduled_days,
  reps: r.reps, lapses: r.lapses, state: r.state, last_review: r.last_review, learning_steps: r.learning_steps,
});

function storedResult(app: AppContext, sessionId: number, duplicate: boolean): SessionResult {
  const s = get<{ id: number; score: number; total: number; counted: number }>(app.db, 'SELECT * FROM quiz_sessions WHERE id = ?', sessionId)!;
  const rows = all<{ item_id: string; correct: number }>(app.db, 'SELECT item_id, correct FROM session_answers WHERE session_id = ? ORDER BY seq', sessionId);
  return { sessionId, duplicate, counted: !!s.counted, score: s.score, total: s.total, results: rows.map((r) => ({ itemId: r.item_id, correct: !!r.correct })) };
}

/** 세션 저장 · 재채점 · 완료 판정 · SRS 반영 (설계 5 · 7장) */
export function submitSession(app: AppContext, userId: number, s: SessionSubmit): SessionResult {
  const dup = get<{ id: number }>(app.db, 'SELECT id FROM quiz_sessions WHERE user_id = ? AND client_session_id = ?', userId, s.clientSessionId);
  if (dup) return storedResult(app, dup.id, true);
  const subject = s.subject.normalize('NFC');
  // 재채점: 현재 콘텐츠에 없는 문항의 답은 버린다
  const graded: { itemId: string; raw: RawAnswer; correct: boolean; elapsedMs: number | null }[] = [];
  const seen = new Set<string>();
  for (const a of s.answers) {
    if (!a || typeof a.itemId !== 'string' || seen.has(a.itemId)) continue;
    const q = app.content.item(a.itemId);
    if (!q) continue;
    seen.add(a.itemId);
    graded.push({ itemId: a.itemId, raw: a.raw ?? null, correct: gradeAnswer(q, a.raw ?? null), elapsedMs: Number.isFinite(a.elapsedMs) ? Math.round(a.elapsedMs as number) : null });
  }
  let counted = false;
  let batch: { id: number; item_ids: string; completed_at: number | null; user_id: number; subject: string; exam: string } | undefined;
  if (s.kind === 'set') {
    const set = s.setPath ? app.content.data.sets.get(s.setPath.normalize('NFC')) : undefined;
    if (!set) fail(400, '세트를 찾을 수 없습니다(setPath).');
    if (set.summary.subject !== subject || set.summary.exam !== s.exam) fail(400, '세트의 과목 · 시험이 맞지 않습니다.');
    counted = set.items.length > 0 && set.items.every((i) => seen.has(i.itemId));
  } else if (s.kind === 'review') {
    batch = s.reviewBatchId != null ? get(app.db, 'SELECT * FROM review_batches WHERE id = ?', s.reviewBatchId) : undefined;
    if (!batch || batch.user_id !== userId) fail(400, '복습 목록을 찾을 수 없습니다(reviewBatchId).');
    const ids: string[] = JSON.parse(batch.item_ids);
    const answered = new Set([...seen].map((i) => app.resolve(i)));
    counted = !batch.completed_at && ids.length > 0 && ids.every((i) => answered.has(app.resolve(i)) || !app.content.item(app.resolve(i)));
  }
  const t = now();
  const finishedAt = Math.min(Number(s.finishedAt) || t, t);
  const score = graded.filter((g) => g.correct).length;
  const sessionId = tx(app.db, () => {
    const id = run(app.db, `INSERT INTO quiz_sessions (user_id, client_session_id, kind, subject, exam, set_path, review_batch_id, content_version,
      started_at, finished_at, score, total, counted, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      userId, s.clientSessionId, s.kind, subject, s.exam, s.setPath?.normalize('NFC') ?? null, s.reviewBatchId ?? null, app.content.data.contentVersion,
      Number(s.startedAt) || finishedAt, finishedAt, score, graded.length, counted, t).id;
    graded.forEach((g, seq) => run(app.db, 'INSERT INTO session_answers (session_id, user_id, item_id, seq, raw_answer, correct, elapsed_ms) VALUES (?, ?, ?, ?, ?, ?, ?)',
      id, userId, g.itemId, seq, JSON.stringify(g.raw), g.correct, g.elapsedMs));
    if (batch && counted) run(app.db, 'UPDATE review_batches SET completed_at = ? WHERE id = ?', t, batch.id);
    if (counted) {
      for (const g of graded) {
        const fid = app.resolve(g.itemId);
        const ref = app.content.data.items.get(g.itemId);
        const cur = getCard(app, userId, fid);
        const state = cur ? cardState(cur) : newCardState(finishedAt);
        putCard(app, userId, fid, ref?.subject ?? subject, reviewCard(state, g.correct, finishedAt));
      }
    }
    return id;
  });
  return storedResult(app, sessionId, false);
}

function analysis(app: AppContext, userId: number, subject: string, exam: Exam): Analysis {
  const reset = get<{ reset_at: number }>(app.db, 'SELECT reset_at FROM analysis_resets WHERE user_id = ? AND subject = ? AND exam = ?', userId, subject, exam)?.reset_at ?? 0;
  const rows = all<{ item_id: string; correct: number; finished_at: number }>(app.db,
    `SELECT a.item_id, a.correct, s.finished_at FROM session_answers a JOIN quiz_sessions s ON s.id = a.session_id
     WHERE s.user_id = ? AND s.subject = ? AND s.exam = ? AND s.finished_at > ? ORDER BY s.finished_at, a.seq`, userId, subject, exam, reset);
  const units = new Map<string, { n: number; wrong: number }>();
  const cats = new Map<string, { category: string; unit: string; n: number; wrong: number }>();
  const items = new Map<string, Analysis['items'][number]>();
  for (const r of rows) {
    const fid = app.resolve(r.item_id);
    const ref = app.content.data.items.get(fid) ?? app.content.data.items.get(r.item_id);
    const unit = ref?.unit || '기타', category = ref?.category || '일반';
    const ok = !!r.correct;
    const u = units.get(unit) ?? { n: 0, wrong: 0 }; u.n++; if (!ok) u.wrong++; units.set(unit, u);
    const ck = category + '\u0000' + unit;
    const cc = cats.get(ck) ?? { category, unit, n: 0, wrong: 0 }; cc.n++; if (!ok) cc.wrong++; cats.set(ck, cc);
    const it = items.get(fid) ?? { itemId: fid, setPath: ref?.setPath ?? fid.split('#')[0], category, unit, n: 0, wrong: 0, lastOk: ok, at: 0 };
    it.n++; if (!ok) it.wrong++;
    if (r.finished_at >= it.at) { it.lastOk = ok; it.at = r.finished_at; }
    items.set(fid, it);
  }
  const setRows = all<{ set_path: string; finished_at: number; score: number; total: number }>(app.db,
    `SELECT set_path, finished_at, score, total FROM quiz_sessions WHERE user_id = ? AND subject = ? AND exam = ? AND kind = 'set' AND counted = 1
     AND finished_at > ? ORDER BY finished_at`, userId, subject, exam, reset);
  const sets = new Map<string, Analysis['sets'][number]>();
  for (const r of setRows) {
    const s = sets.get(r.set_path) ?? { setPath: r.set_path, title: app.content.data.sets.get(r.set_path)?.summary.title ?? r.set_path.split('/').pop()!, runs: [] };
    s.runs.push({ at: r.finished_at, score: r.score, total: r.total });
    if (s.runs.length > 20) s.runs.shift();
    sets.set(r.set_path, s);
  }
  const pinned = all<{ item_id: string }>(app.db, 'SELECT item_id FROM pinned_items WHERE user_id = ? AND subject = ? ORDER BY created_at', userId, subject)
    .map((r) => app.resolve(r.item_id)).filter((id) => { const ref = app.content.data.items.get(id); return !ref || ref.exam === exam; });
  return { subject, exam, units: [...units.entries()].map(([unit, v]) => ({ unit, ...v })), categories: [...cats.values()], items: [...items.values()], sets: [...sets.values()], pinned };
}

function dueCards(app: AppContext, userId: number, subject: string, exam: Exam): CardRow[] {
  return all<CardRow>(app.db, 'SELECT * FROM srs_cards WHERE user_id = ? AND subject = ? AND due <= ? ORDER BY due', userId, subject, now())
    .filter((c) => { const ref = app.content.data.items.get(c.item_id); return ref && ref.exam === exam; });
}

export function leaderboard(app: AppContext): LeaderboardRow[] {
  const rows = all<{ user_id: number; item_id: string; correct: number }>(app.db,
    `SELECT a.user_id, a.item_id, a.correct FROM session_answers a JOIN quiz_sessions s ON s.id = a.session_id
     JOIN users u ON u.id = a.user_id WHERE s.counted = 1 AND u.status = 'active'`);
  const by = new Map<number, { solved: Set<string>; attempts: number; correct: number }>();
  for (const r of rows) {
    const x = by.get(r.user_id) ?? { solved: new Set<string>(), attempts: 0, correct: 0 };
    x.solved.add(app.resolve(r.item_id)); x.attempts++; if (r.correct) x.correct++;
    by.set(r.user_id, x);
  }
  const users = new Map(all<{ id: number; nickname: string; created_at: number }>(app.db, 'SELECT id, nickname, created_at FROM users').map((u) => [u.id, u]));
  return [...by.entries()].map(([id, x]) => ({
    nickname: users.get(id)!.nickname, solved: x.solved.size, attempts: x.attempts, correct: x.correct,
    accuracy: x.attempts ? x.correct / x.attempts : 0, _c: users.get(id)!.created_at,
  })).sort((a, b) => b.solved - a.solved || b.accuracy - a.accuracy || a._c - b._c)
    .map(({ _c, ...r }) => r);
}

export function recordRoutes(): Hono<Env> {
  const r = new Hono<Env>();

  // ── 콘텐츠 ──
  r.get('/content/manifest', (c) => { requireUser(c); const app = c.get('app'); return c.json({ ...app.content.manifest(app.nicknames()), appVersion: app.appVersion }); });
  r.get('/content/set', (c) => {
    requireUser(c);
    const app = c.get('app');
    const d = app.content.setDetail(c.req.query('path') || '', app.nicknames());
    if (!d) fail(404, '세트를 찾을 수 없습니다.');
    return c.json(d);
  });
  r.get('/content/terms', (c) => { requireUser(c); return c.json(c.get('app').content.terms(c.req.query('subject') || undefined, c.req.query('exam') || undefined)); });
  r.get('/content/raw', (c) => {
    requireUser(c);
    const app = c.get('app');
    const p = c.req.query('path') || '';
    if (!app.content.rawAllowed(p)) fail(404, '파일을 찾을 수 없습니다.');
    return c.body(app.content.readRaw(p), 200, { 'content-type': 'text/javascript; charset=utf-8' });
  });

  // ── 세션 ──
  r.post('/sessions', async (c) => {
    const u = requireUser(c);
    const b = await body(c);
    const kind = b.kind as SessionKind;
    if (!KINDS_S.includes(kind)) fail(400, 'kind 는 set · review · partial');
    if (!Array.isArray(b.answers)) fail(400, 'answers 는 배열이어야 합니다.');
    if (b.answers.length > 2000) fail(400, '답이 너무 많습니다.');
    const s: SessionSubmit = {
      clientSessionId: str(b.clientSessionId, 'clientSessionId', { max: 100 }), kind, subject: str(b.subject, 'subject'), exam: examOf(b.exam),
      setPath: typeof b.setPath === 'string' ? b.setPath : undefined, reviewBatchId: b.reviewBatchId != null ? int(b.reviewBatchId, 'reviewBatchId') : undefined,
      startedAt: Number(b.startedAt) || now(), finishedAt: Number(b.finishedAt) || now(), answers: b.answers as SessionSubmit['answers'],
    };
    return c.json(submitSession(c.get('app'), u.id, s));
  });

  // ── 오답 분석 · 📌 ──
  r.get('/me/analysis', (c) => {
    const u = requireUser(c);
    return c.json(analysis(c.get('app'), u.id, str(c.req.query('subject'), 'subject'), examOf(c.req.query('exam'))));
  });
  r.get('/me/pins', (c) => {
    const u = requireUser(c);
    const app = c.get('app');
    const subject = c.req.query('subject');
    const rows = subject
      ? all<{ item_id: string }>(app.db, 'SELECT item_id FROM pinned_items WHERE user_id = ? AND subject = ? ORDER BY created_at', u.id, subject)
      : all<{ item_id: string }>(app.db, 'SELECT item_id FROM pinned_items WHERE user_id = ? ORDER BY created_at', u.id);
    return c.json(rows.map((x) => app.resolve(x.item_id)));
  });
  r.put('/me/pins', async (c) => {
    const u = requireUser(c);
    const app = c.get('app');
    const b = await body(c);
    const subject = str(b.subject, 'subject');
    if (!Array.isArray(b.itemIds)) fail(400, 'itemIds 는 배열이어야 합니다.');
    const ids = (b.itemIds as unknown[]).filter((x): x is string => typeof x === 'string');
    tx(app.db, () => {
      for (const id of ids) {
        if (b.on) run(app.db, 'INSERT OR IGNORE INTO pinned_items (user_id, item_id, subject, created_at) VALUES (?, ?, ?, ?)', u.id, app.resolve(id), subject, now());
        else for (const src of app.sourcesOf(id)) run(app.db, 'DELETE FROM pinned_items WHERE user_id = ? AND item_id = ?', u.id, src);
      }
    });
    return c.json({ ok: true });
  });
  r.post('/me/analysis/reset', async (c) => {
    const u = requireUser(c);
    const b = await body(c);
    run(c.get('app').db, `INSERT INTO analysis_resets (user_id, subject, exam, reset_at) VALUES (?, ?, ?, ?)
      ON CONFLICT (user_id, subject, exam) DO UPDATE SET reset_at = excluded.reset_at`, u.id, str(b.subject, 'subject'), examOf(b.exam), now());
    return c.json({ ok: true });
  });

  // ── 과목 표시 설정 ──
  const prefs = (app: AppContext, userId: number): SubjectPref[] =>
    all<{ subject: string; hidden: number }>(app.db, 'SELECT subject, hidden FROM user_subject_prefs WHERE user_id = ? ORDER BY subject', userId)
      .map((p) => ({ subject: p.subject, hidden: !!p.hidden }));
  r.get('/me/subject-prefs', (c) => c.json(prefs(c.get('app'), requireUser(c).id)));
  r.put('/me/subject-prefs', async (c) => {
    const u = requireUser(c);
    const app = c.get('app');
    const b = await body(c);
    if (!Array.isArray(b.subjects)) fail(400, 'subjects 는 배열이어야 합니다.');
    tx(app.db, () => {
      for (const p of b.subjects as SubjectPref[]) {
        if (!p || typeof p.subject !== 'string') continue;
        run(app.db, `INSERT INTO user_subject_prefs (user_id, subject, hidden, updated_at) VALUES (?, ?, ?, ?)
          ON CONFLICT (user_id, subject) DO UPDATE SET hidden = excluded.hidden, updated_at = excluded.updated_at`, u.id, p.subject.normalize('NFC'), !!p.hidden, now());
      }
    });
    return c.json(prefs(app, u.id));
  });

  // ── 복습 ──
  r.get('/review/summary', (c) => {
    const u = requireUser(c);
    const subject = str(c.req.query('subject'), 'subject'), exam = examOf(c.req.query('exam'));
    return c.json({ subject, exam, due: dueCards(c.get('app'), u.id, subject, exam).length });
  });
  r.post('/review/batches', async (c) => {
    const u = requireUser(c);
    const app = c.get('app');
    const b = await body(c);
    const subject = str(b.subject, 'subject'), exam = examOf(b.exam);
    const cards = dueCards(app, u.id, subject, exam);
    if (!cards.length) return c.json({ batchId: 0, subject, exam, items: [] } satisfies ReviewBatch);   // 복습할 문항 없음 = 빈 목록
    const ids = cards.map((x) => x.item_id);
    const id = run(app.db, 'INSERT INTO review_batches (user_id, subject, exam, item_ids, created_at) VALUES (?, ?, ?, ?, ?)', u.id, subject, exam, JSON.stringify(ids), now()).id;
    const out: ReviewBatch = {
      batchId: id, subject, exam,
      items: ids.map((iid) => ({ ...app.content.item(iid)!, setPath: app.content.data.items.get(iid)!.setPath })),
    };
    return c.json(out);
  });

  // ── 리더보드 ──
  r.get('/leaderboard', (c) => { requireUser(c); return c.json(leaderboard(c.get('app'))); });

  return r;
}
