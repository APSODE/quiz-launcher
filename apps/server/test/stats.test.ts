import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { makeTestApp, login, memberClient, answersFor } from './helpers.ts';
import { all, get, openDb, run } from '../src/db.ts';
import { SERVER_ROOT } from '../src/config.ts';

let t: Awaited<ReturnType<typeof makeTestApp>>;
beforeAll(async () => { t = await makeTestApp(); }, 60000);
afterAll(() => { if (t) rmSync(t.base, { recursive: true, force: true }); });

const someSet = () => [...t.ctx.content.data.sets.values()].find((x) => x.summary.subject === '운영체제' && x.items.length >= 4)!;
let cs = 0;
const submit = (c: Awaited<ReturnType<typeof login>>, set: ReturnType<typeof someSet>, items: any[], wrongEvery: number, finishedAt = Date.now()) =>
  c.post('/sessions', {
    clientSessionId: 'st-' + ++cs, kind: 'set', subject: set.summary.subject, exam: set.summary.exam, setPath: set.summary.path,
    startedAt: finishedAt - 1000, finishedAt, answers: answersFor(items, wrongEvery),
  });
const statsOf = async (c: Awaited<ReturnType<typeof login>>, path: string) =>
  new Map<string, any>(((await c.get('/content/set?path=' + encodeURIComponent(path))).json.items as any[]).map((q) => [q.itemId, q.stats]));

describe('첫 풀이 통계', () => {
  it('풀기 전에는 n=0, 두 번째 풀이는 세지 않고, 사용자마다 첫 풀이만 센다', async () => {
    const set = someSet();
    const a = await memberClient(t, 'stat_a', '통계에이');
    const b = await memberClient(t, 'stat_b', '통계비');
    const detail = (await a.get('/content/set?path=' + encodeURIComponent(set.summary.path))).json;
    expect(detail.items.every((q: any) => q.stats.n === 0 && q.stats.correct === 0)).toBe(true);

    expect((await submit(a, set, detail.items, 0)).status).toBe(200);          // 전부 정답
    expect((await submit(a, set, detail.items, 1)).status).toBe(200);          // 전부 오답(두 번째 → 안 셈)
    let s = await statsOf(a, set.summary.path);
    for (const q of detail.items) expect(s.get(q.itemId)).toEqual({ n: 1, correct: 1 });

    // 부분 세션도 첫 풀이로 센다
    expect((await b.post('/sessions', {
      clientSessionId: 'st-p', kind: 'partial', subject: set.summary.subject, exam: set.summary.exam,
      startedAt: Date.now() - 1000, finishedAt: Date.now(), answers: answersFor(detail.items.slice(0, 2), 1),
    })).status).toBe(200);
    s = await statsOf(b, set.summary.path);
    detail.items.forEach((q: any, i: number) => expect(s.get(q.itemId)).toEqual(i < 2 ? { n: 2, correct: 1 } : { n: 1, correct: 1 }));
    // 콘텐츠 캐시 원본은 건드리지 않는다
    expect((set.items[0] as any).stats).toBeUndefined();
  });

  it('복습 목록 문항에도 stats', async () => {
    const set = someSet();
    const c = await memberClient(t, 'stat_r', '통계복습');
    const detail = (await c.get('/content/set?path=' + encodeURIComponent(set.summary.path))).json;
    expect((await submit(c, set, detail.items, 2)).status).toBe(200);
    const u = get<{ id: number }>(t.ctx.db, "SELECT id FROM users WHERE username = 'stat_r'")!;
    run(t.ctx.db, 'UPDATE srs_cards SET due = 0 WHERE user_id = ?', u.id);
    const r = (await c.post('/review/batches', { subject: set.summary.subject, exam: set.summary.exam })).json;
    expect(r.items.length).toBeGreaterThan(0);
    for (const q of r.items) { expect(q.stats.n).toBeGreaterThanOrEqual(1); expect(q.setPath).toBeTruthy(); }
  });

  it('별칭 확정 → 옛 ID 첫 풀이를 새 ID 로 합산(같은 사용자는 더 이른 쪽)', async () => {
    const set = someSet();
    const target = set.items[set.items.length - 1].itemId;
    const admin = await login(t.app);
    const before = (await statsOf(admin, set.summary.path)).get(target);
    const ua = get<{ id: number }>(t.ctx.db, "SELECT id FROM users WHERE username = 'stat_a'")!.id;   // 새 ID 를 이미 정답으로 풂
    const fresh = get<{ id: number }>(t.ctx.db, "SELECT id FROM users WHERE username = 'admin'")!.id;
    const oldId = set.summary.path + '#zzold';
    run(t.ctx.db, 'INSERT INTO item_first_attempts (item_id, user_id, correct, at) VALUES (?, ?, 0, 1), (?, ?, 0, 2)', oldId, ua, oldId, fresh);
    const cid = run(t.ctx.db, `INSERT INTO alias_candidates (old_id, new_id, similarity, set_path, old_question, new_question, created_at)
      VALUES (?, ?, 0.9, ?, 'q', 'q', 0)`, oldId, target, set.summary.path).id;
    expect((await admin.post(`/admin/aliases/${cid}`, { confirm: true })).status).toBe(200);
    const after = (await statsOf(admin, set.summary.path)).get(target);
    // stat_a: 옛 ID(at=1, 오답)가 더 이르므로 정답 1 → 오답으로, admin: 새로 1명 추가(오답)
    expect(after).toEqual({ n: before.n + 1, correct: before.correct - 1 });
    expect(all(t.ctx.db, 'SELECT 1 FROM item_first_attempts WHERE item_id = ?', oldId)).toHaveLength(0);
  });
});

describe('마이그레이션: user_version 1 DB 백필', () => {
  it('세션 기록에서 첫 풀이를 채우고, 다시 열어도 그대로', () => {
    const dir = mkdtempSync(join(SERVER_ROOT, '.data', 'test-mig-'));
    try {
      const path = join(dir, 'q.db');
      let db = openDb(path);
      // 기존 운영 DB 흉내: v2 테이블 없음 · user_version 1
      db.exec('DROP TABLE item_first_attempts; PRAGMA user_version = 1;');
      const sess = (id: number, user: number, at: number) => run(db, `INSERT INTO quiz_sessions (id, user_id, client_session_id, kind, subject, exam,
        started_at, finished_at, score, total, counted, created_at) VALUES (?, ?, ?, 'set', 's', '중간고사', ?, ?, 0, 0, 1, ?)`, id, user, 'c' + id, at, at, at);
      const ans = (sid: number, user: number, item: string, seq: number, correct: number) =>
        run(db, 'INSERT INTO session_answers (session_id, user_id, item_id, seq, raw_answer, correct) VALUES (?, ?, ?, ?, ?, ?)', sid, user, item, seq, 'null', correct);
      sess(1, 1, 200); sess(2, 1, 100); sess(3, 2, 300);
      ans(1, 1, 'x#a', 0, 0); ans(2, 1, 'x#a', 0, 1);          // 사용자1: 더 이른 세션2(정답)가 첫 풀이
      ans(1, 1, 'x#old', 1, 0);                                 // 별칭 old → b
      ans(3, 2, 'x#b', 0, 1); ans(3, 2, 'x#a', 1, 0);
      run(db, "INSERT INTO item_aliases (old_id, new_id, confirmed_at) VALUES ('x#old', 'x#b', 0)");
      db.close();

      db = openDb(path);
      expect((db.prepare('PRAGMA user_version').get() as any).user_version).toBe(2);
      const rows = () => all(db, 'SELECT item_id, user_id, correct, at FROM item_first_attempts ORDER BY item_id, user_id');
      const expected = [
        { item_id: 'x#a', user_id: 1, correct: 1, at: 100 },
        { item_id: 'x#a', user_id: 2, correct: 0, at: 300 },
        { item_id: 'x#b', user_id: 1, correct: 0, at: 200 },
        { item_id: 'x#b', user_id: 2, correct: 1, at: 300 },
      ];
      expect(rows()).toEqual(expected);
      expect(all(db, 'SELECT COUNT(*) AS n FROM session_answers')).toEqual([{ n: 5 }]);   // 원 기록 그대로
      db.close();
      db = openDb(path);
      expect(rows()).toEqual(expected);
      db.close();
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
});
