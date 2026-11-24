import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { rmSync } from 'node:fs';
import { makeTestApp, login, memberClient, answersFor } from './helpers.ts';
import { all, countActiveVoters, get, openDb, run, ACTIVE_MS } from '../src/db.ts';
import { git } from '../src/git.ts';

let t: Awaited<ReturnType<typeof makeTestApp>>;
type C = Awaited<ReturnType<typeof login>>;
let admin: C, up1: C, v1: C, v2: C, v3: C;
beforeAll(async () => {
  t = await makeTestApp();
  admin = await login(t.app);                   // 로그인 = 활동
  up1 = await memberClient(t, 'vote_up', '올린이');
  v1 = await memberClient(t, 'vote_a', '투표에이');
  v2 = await memberClient(t, 'vote_b', '투표비');
  v3 = await memberClient(t, 'vote_c', '투표씨');
}, 60000);
afterAll(() => { if (t) rmSync(t.base, { recursive: true, force: true }); });

function form(name: string, data: unknown) {
  const fd = new FormData();
  fd.append('files', new File([JSON.stringify(data)], name, { type: 'application/json' }));
  return fd;
}
let seq = 0;
/** 운영체제 중간고사 세트(문장이 매번 달라 중복 검사에 안 걸림) */
const setData = (title: string) => {
  const k = ++seq;
  return {
    meta: { subject: '운영체제', exam: '중간고사', kind: '일반문제', title },
    questions: [
      { category: '투표', question: `투표 검수 테스트 ${k}번 세트의 첫 번째 고유 OX 문장입니다.`, answer: true, explanation: 'x' },
      { category: '투표', question: `투표 검수 테스트 ${k}번 세트의 두 번째 고유 OX 문장은 거짓입니다.`, answer: false, explanation: 'y' },
    ],
  };
};
async function upload(c: C, title: string) {
  const r = await c.raw('POST', '/uploads', form('v.json', setData(title)));
  expect(r.status).toBe(200);
  return { id: r.json.upload.id as number, fid: r.json.upload.files[0].id as number, view: r.json.upload };
}
const vote = (c: C, u: { id: number; fid: number }, b: unknown) => c.put(`/uploads/${u.id}/files/${u.fid}/vote`, b);

describe('투표권자 스냅샷', () => {
  it('최근 14일 세션 · 풀이 · 투표 활동자, 올린 사람 · 정지 계정 제외', () => {
    const db = openDb(':memory:');
    const T = 100 * 86400000, old = T - ACTIVE_MS - 1000, recent = T - 1000;
    for (let id = 1; id <= 7; id++) run(db, "INSERT INTO users (id, username, nickname, password_hash, role, status, created_at) VALUES (?, ?, ?, 'x', 'member', ?, 0)", id, 'u' + id, 'n' + id, id === 6 ? 'suspended' : 'active');
    const sess = (u: number, created: number, seen: number) => run(db, 'INSERT INTO auth_sessions (user_id, token_hash, created_at, expires_at, last_seen_at) VALUES (?, ?, ?, ?, ?)', u, 'h' + u + created, created, T * 2, seen);
    sess(1, recent, recent);                    // 1: 올린 사람(제외)
    sess(2, old, recent);                       // 2: 최근 접속
    sess(3, old, old);                          // 3: 오래전 접속만 → 제외
    run(db, `INSERT INTO quiz_sessions (user_id, client_session_id, kind, subject, exam, started_at, finished_at, score, total, counted, created_at)
      VALUES (4, 'c', 'set', 's', '중간고사', ?, ?, 0, 0, 1, ?)`, recent, recent, recent);   // 4: 세션 행은 없고(로그아웃) 풀이만
    run(db, 'INSERT INTO upload_votes (file_id, user_id, approve, created_at, updated_at) VALUES (1, 5, 1, ?, ?)', recent, recent);   // 5: 투표
    sess(6, recent, recent);                    // 6: 정지 계정 → 제외
    sess(7, T + 5000, T + 5000);                // 7: 업로드 뒤 활동 → 제외
    expect(countActiveVoters(db, 1, T)).toBe(3);
    expect(countActiveVoters(db, 2, T)).toBe(3);   // 1 이 들어가고 2 가 빠짐
  });

  it('제출하면 업로드 행에 스냅샷이 남는다(관리자 포함, 올린 사람 제외)', async () => {
    const u = await upload(up1, '스냅샷');
    expect(u.view.files[0].vote).toMatchObject({ voters: 4, approve: 0, reject: 0, needsAdmin: false });
    expect(get<{ voter_count: number }>(t.ctx.db, 'SELECT voter_count FROM uploads WHERE id = ?', u.id)!.voter_count).toBe(4);
    await up1.del(`/uploads/${u.id}`);
  });
});

describe('투표 · 결정', () => {
  it('올린 사람은 투표 불가 · 과반(4명 중 3) 승인 → 사용자 투표로 커밋', async () => {
    const u = await upload(up1, '과반 승인');
    expect((await vote(up1, u, { approve: true })).status).toBe(403);
    // 검수 목록 · 미리보기는 모든 로그인 사용자
    const list = (await v1.get('/uploads/review')).json;
    expect(list.find((x: any) => x.id === u.fid)).toMatchObject({ mine: false, myVote: null, uploader: { nickname: '올린이' } });
    expect((await up1.get('/uploads/review')).json.find((x: any) => x.id === u.fid).mine).toBe(true);
    const pv = await v1.get(`/uploads/${u.id}/files/${u.fid}/preview`);
    expect(pv.status).toBe(200);
    expect(pv.json.items).toHaveLength(2);

    expect((await vote(v1, u, { approve: true })).json).toMatchObject({ decided: null, vote: { approve: 1 } });
    expect((await vote(v2, u, { approve: false })).status).toBe(400);   // 반려는 사유 종류 필수
    expect((await vote(v2, u, { approve: false, reasonType: '정답 오류', reason: '두 번째 답이 이상' })).json).toMatchObject({ decided: null, vote: { approve: 1, reject: 1 } });
    const row = (await v3.get('/uploads/review')).json.find((x: any) => x.id === u.fid);
    expect(row.reasons).toEqual([{ type: '정답 오류', body: '두 번째 답이 이상' }]);
    expect(row.avoid.global).toEqual(t.ctx.content.data.rules?.avoid ?? []);   // 검수 체크리스트 = 출제규칙.json avoid
    expect((await vote(v2, u, { approve: true })).json).toMatchObject({ decided: null, vote: { approve: 2, reject: 0 } });   // 바꿀 수 있음
    const r = await vote(v3, u, { approve: true });
    expect(r.json).toMatchObject({ decided: 'approved', vote: { approve: 3, decidedBy: '사용자 투표' } });
    expect(r.json.commitSha).toBeTruthy();
    const msg = (await git(t.sandbox.content, ['log', '-1', '--format=%s'])).stdout;
    expect(msg).toContain('사용자 투표 승인');
    const mine = (await up1.get('/uploads/mine')).json.find((x: any) => x.id === u.id);
    expect(mine).toMatchObject({ status: 'done', commitSha: r.json.commitSha });
    expect(mine.files[0]).toMatchObject({ status: 'approved', vote: { decidedBy: '사용자 투표' } });
    expect((await v1.get('/content/manifest')).json.sets.some((s: any) => s.path === mine.files[0].targetPath)).toBe(true);
    expect((await vote(v1, u, { approve: false, reasonType: '기타' })).status).toBe(409);   // 결정 뒤에는 못 바꿈
    expect((await v1.get(`/uploads/${u.id}/files/${u.fid}/preview`)).status).toBe(404);   // 검수 끝난 세트는 미리보기 안 됨
  }, 60000);

  it('관리자가 올린 세트: 투표 대상 · 관리자 본인은 투표 불가 · 투표로 승인', async () => {
    const u = await upload(admin, '관리자 업로드');
    expect(u.view.files[0].vote.voters).toBe(4);
    expect((await vote(admin, u, { approve: true })).status).toBe(403);
    for (const c of [v1, v2, v3]) await vote(c, u, { approve: true });
    expect((await admin.get(`/admin/uploads/${u.id}`)).json.files[0]).toMatchObject({ status: 'approved', vote: { decidedBy: '사용자 투표' } });
  }, 60000);

  it('관리자는 조건 무시하고 언제든 승인 · 반려(자기 제출 포함)', async () => {
    const own = await upload(admin, '관리자 직접 승인');
    await vote(v1, own, { approve: false, reasonType: '기타' });   // 투표 중이어도
    const d = await admin.post(`/admin/uploads/${own.id}/decide`, { files: [{ id: own.fid, approve: true }] });
    expect(d.json.ok).toBe(true);
    expect((await admin.get(`/admin/uploads/${own.id}`)).json.files[0]).toMatchObject({ status: 'approved', vote: { decidedBy: '운영자' } });
    const other = await upload(up1, '관리자 직접 반려');
    await vote(v1, other, { approve: true });
    expect((await admin.post(`/admin/uploads/${other.id}/decide`, { files: [{ id: other.fid, approve: false, reason: '범위 밖' }] })).status).toBe(200);
    expect((await up1.get('/uploads/mine')).json.find((x: any) => x.id === other.id).files[0]).toMatchObject({ status: 'rejected', rejectReason: '범위 밖', vote: { decidedBy: '운영자' } });
  }, 60000);

  it('과반 반려 → 반려(사유 요약) · 관리자가 되살려 승인', async () => {
    const u = await upload(up1, '과반 반려');
    await vote(v1, u, { approve: false, reasonType: '범위 밖', reason: '시험 범위 아님' });
    await vote(v2, u, { approve: false, reasonType: '범위 밖' });
    const r = await vote(v3, u, { approve: false, reasonType: '중복' });
    expect(r.json.decided).toBe('rejected');
    let f = (await up1.get('/uploads/mine')).json.find((x: any) => x.id === u.id).files[0];
    expect(f.status).toBe('rejected');
    expect(f.rejectReason).toMatch(/^사용자 투표 반려 \(3\/4\): 범위 밖 2 · 중복 1 — 시험 범위 아님/);
    expect((await v1.post(`/admin/uploads/${u.id}/files/${u.fid}/revive`)).status).toBe(403);
    expect((await admin.post(`/admin/uploads/${u.id}/files/${u.fid}/revive`)).status).toBe(200);
    f = (await admin.get(`/admin/uploads/${u.id}`)).json;
    expect(f).toMatchObject({ status: 'pending', files: [{ status: 'pending', vote: { approve: 0, reject: 0 } }] });
    const d = await admin.post(`/admin/uploads/${u.id}/decide`, { files: [{ id: u.fid, approve: true }] });
    expect(d.json.ok).toBe(true);
    expect((await admin.get(`/admin/uploads/${u.id}`)).json.files[0]).toMatchObject({ status: 'approved', vote: { decidedBy: '운영자' } });
  }, 60000);

  it('7일 지나도 미결 · 스냅샷 0 → 판단 필요 목록. 스냅샷 0 은 투표로 결정하지 않음', async () => {
    const late = await upload(up1, '기한 지남');
    const zero = await upload(up1, '활동자 없음');
    const fresh = await upload(up1, '새 제출');
    run(t.ctx.db, 'UPDATE uploads SET created_at = ? WHERE id = ?', Date.now() - 8 * 86400000, late.id);
    run(t.ctx.db, 'UPDATE uploads SET voter_count = 0 WHERE id = ?', zero.id);
    expect((await v1.get('/admin/uploads/attention')).status).toBe(403);
    const ids = (await admin.get('/admin/uploads/attention')).json.map((x: any) => x.id);
    expect(ids).toContain(late.fid);
    expect(ids).toContain(zero.fid);
    expect(ids).not.toContain(fresh.fid);
    for (const c of [v1, v2, v3]) expect((await vote(c, zero, { approve: true })).json.decided).toBe(null);
    expect((await admin.get(`/admin/uploads/${zero.id}`)).json.files[0]).toMatchObject({ status: 'pending', vote: { approve: 3, needsAdmin: true } });   // 일반 사용자 제출은 투표 과반 말고는 공개 안 됨
    expect((await admin.post(`/admin/uploads/${zero.id}/decide`, { files: [{ id: zero.fid, approve: true }] })).json.ok).toBe(true);
    expect((await admin.get(`/admin/uploads/${zero.id}`)).json.files[0]).toMatchObject({ status: 'approved', vote: { decidedBy: '운영자' } });
    // 기한이 지나도 투표는 계속 받는다
    await vote(v1, late, { approve: true }); await vote(v2, late, { approve: true });
    expect((await vote(v3, late, { approve: true })).json.decided).toBe('approved');
    await up1.del(`/uploads/${fresh.id}`);
  }, 60000);
});

describe('검수 중 세트 풀이는 통계 · 기록에 안 들어감', () => {
  it('미리보기 문항 ID(upload:)로 보낸 답은 버린다', async () => {
    const u = await upload(up1, '통계 제외');
    const pv = (await v1.get(`/uploads/${u.id}/files/${u.fid}/preview`)).json;
    expect(pv.items.every((q: any) => q.itemId.startsWith('upload:') && q.stats === undefined)).toBe(true);
    const before = all(t.ctx.db, 'SELECT * FROM item_first_attempts').length;
    const r = await v1.post('/sessions', {
      clientSessionId: 'vote-pv', kind: 'partial', subject: '운영체제', exam: '중간고사',
      startedAt: Date.now() - 1000, finishedAt: Date.now(), answers: answersFor(pv.items),
    });
    expect(r.json).toMatchObject({ total: 0, counted: false, results: [] });
    expect(all(t.ctx.db, 'SELECT * FROM item_first_attempts').length).toBe(before);
    expect(all(t.ctx.db, "SELECT * FROM session_answers WHERE item_id LIKE 'upload:%'")).toHaveLength(0);
    expect((await v1.get('/leaderboard')).json.find((x: any) => x.nickname === '투표에이')).toBeUndefined();
    await up1.del(`/uploads/${u.id}`);
  });
});
