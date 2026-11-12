import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createHmac } from 'node:crypto';
import { rmSync, readFileSync, existsSync, mkdirSync, writeFileSync, chmodSync } from 'node:fs';
import { join } from 'node:path';
import { makeTestApp, client, login, memberClient, answersFor, ORIGIN } from './helpers.ts';
import { git } from '../src/git.ts';
import { run } from '../src/db.ts';

let t: Awaited<ReturnType<typeof makeTestApp>>;
beforeAll(async () => { t = await makeTestApp(); }, 60000);
afterAll(() => { if (t) rmSync(t.base, { recursive: true, force: true }); });

const firstSet = (subject = '운영체제') => {
  const s = [...t.ctx.content.data.sets.values()].find((x) => x.summary.subject === subject && x.items.length >= 5 && x.items.some((i) => i.type === 'short'));
  return s!;
};

describe('인증 · 초대', () => {
  it('초대 가입 → 로그인 → me', async () => {
    const c = await memberClient(t, 'alice', '앨리스');
    const me = await c.get('/auth/me');
    expect(me.status).toBe(200);
    expect(me.json).toMatchObject({ username: 'alice', nickname: '앨리스', role: 'member' });
    const c2 = client(t.app);
    expect((await c2.post('/auth/login', { username: 'alice', password: 'wrong-pass' })).status).toBe(401);
    expect((await c2.post('/auth/login', { username: 'alice', password: 'password1' })).status).toBe(200);
  });
  it('잘못된 초대 · 중복 닉네임 · 로그인 안 됨 · Origin 없음', async () => {
    const c = client(t.app);
    expect((await c.get('/invites/nope')).json).toEqual({ valid: false });
    expect((await c.post('/auth/register', { token: 'nope', username: 'bob', nickname: '밥', password: 'password1' })).status).toBe(400);
    expect((await c.get('/content/manifest')).status).toBe(401);
    const res = await t.app.request('/api/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' });
    expect(res.status).toBe(403);
    await expect(memberClient(t, 'alice2', '앨리스')).rejects.toThrow();
  });
  it('member 는 관리자 API 403', async () => {
    const c = await memberClient(t, 'mallory', '말로리');
    expect((await c.get('/admin/users')).status).toBe(403);
  });
});

describe('매니페스트', () => {
  it('과목 3개 · 2학년 2학기 · 중간고사', async () => {
    const c = await login(t.app);
    const m = (await c.get('/content/manifest')).json;
    const names = m.subjects.map((s: any) => s.subject).sort();
    expect(names).toEqual(['운영체제', '웹프로그래밍', '컴퓨터네트워크']);
    for (const s of m.subjects) expect(s).toMatchObject({ grade: 2, semester: 2, exams: ['중간고사'] });
    expect(m.plugins.length).toBe(12);
    const raw = await t.app.request('/api/content/raw?path=' + encodeURIComponent(m.plugins[0].path), { headers: { cookie: '' } });
    expect(raw.status).toBe(401);
  });
});

describe('세션 · 리더보드 · SRS', () => {
  it('세트 완료 → 재채점 · counted · 중복 · 리더보드 · 카드', async () => {
    const c = await memberClient(t, 'carol', '캐럴');
    const s = firstSet();
    const answers = answersFor(s.items, 3);
    const body = { clientSessionId: 'c-1', kind: 'set', subject: s.summary.subject, exam: '중간고사', setPath: s.summary.path, startedAt: Date.now() - 1000, finishedAt: Date.now(), answers };
    const r = await c.post('/sessions', body);
    expect(r.status).toBe(200);
    const wrong = answers.filter((_, i) => i % 3 === 0).length;
    expect(r.json).toMatchObject({ counted: true, duplicate: false, total: s.items.length, score: s.items.length - wrong });
    const dup = await c.post('/sessions', body);
    expect(dup.json.duplicate).toBe(true);
    expect(dup.json.sessionId).toBe(r.json.sessionId);
    // 브라우저가 correct 를 조작해도 무시: raw 로만 채점
    const lb = (await c.get('/leaderboard')).json;
    const me = lb.find((x: any) => x.nickname === '캐럴');
    expect(me).toMatchObject({ solved: s.items.length, attempts: s.items.length, correct: s.items.length - wrong });
    // 같은 세트 다시 완료: solved 그대로, attempts 증가
    await c.post('/sessions', { ...body, clientSessionId: 'c-2', answers: answersFor(s.items) });
    const me2 = (await c.get('/leaderboard')).json.find((x: any) => x.nickname === '캐럴');
    expect(me2.solved).toBe(s.items.length);
    expect(me2.attempts).toBe(s.items.length * 2);
    expect(me2.accuracy).toBeCloseTo((s.items.length * 2 - wrong) / (s.items.length * 2));
    // 카드 생성
    const n = (t.ctx.db.prepare('SELECT COUNT(*) AS n FROM srs_cards WHERE user_id = (SELECT id FROM users WHERE username = ?)').get('carol') as any).n;
    expect(n).toBe(s.items.length);
  });
  it('미완료 세트 · partial 은 리더보드 · SRS 제외', async () => {
    const c = await memberClient(t, 'dave', '데이브');
    const s = firstSet('웹프로그래밍');
    const half = answersFor(s.items).slice(0, 2);
    const r1 = await c.post('/sessions', { clientSessionId: 'd-1', kind: 'set', subject: s.summary.subject, exam: '중간고사', setPath: s.summary.path, startedAt: 1, finishedAt: Date.now(), answers: half });
    expect(r1.json.counted).toBe(false);
    const r2 = await c.post('/sessions', { clientSessionId: 'd-2', kind: 'partial', subject: s.summary.subject, exam: '중간고사', startedAt: 1, finishedAt: Date.now(), answers: answersFor(s.items) });
    expect(r2.json.counted).toBe(false);
    expect((await c.get('/leaderboard')).json.find((x: any) => x.nickname === '데이브')).toBeUndefined();
    // 오답 분석에는 partial 포함
    const a = (await c.get(`/me/analysis?subject=${encodeURIComponent(s.summary.subject)}&exam=${encodeURIComponent('중간고사')}`)).json;
    expect(a.items.length).toBe(s.items.length);
    expect(a.sets.length).toBe(0);
  });
  it('복습: due 카드 → 배치 → 완료 시 counted', async () => {
    const c = await memberClient(t, 'erin', '에린');
    const s = firstSet('컴퓨터네트워크');
    await c.post('/sessions', { clientSessionId: 'e-1', kind: 'set', subject: s.summary.subject, exam: '중간고사', setPath: s.summary.path, startedAt: 1, finishedAt: Date.now(), answers: answersFor(s.items, 1) });
    const q = `?subject=${encodeURIComponent(s.summary.subject)}&exam=${encodeURIComponent('중간고사')}`;
    expect((await c.get('/review/summary' + q)).json.due).toBe(0);
    // 시간이 지났다고 보고 due 를 과거로
    run(t.ctx.db, "UPDATE srs_cards SET due = 1 WHERE user_id = (SELECT id FROM users WHERE username = 'erin')");
    expect((await c.get('/review/summary' + q)).json.due).toBe(s.items.length);
    // 다른 시험(기말고사)에는 없음
    expect((await c.get(`/review/summary?subject=${encodeURIComponent(s.summary.subject)}&exam=${encodeURIComponent('기말고사')}`)).json.due).toBe(0);
    const b = await c.post('/review/batches', { subject: s.summary.subject, exam: '중간고사' });
    expect(b.status).toBe(200);
    expect(b.json.items.length).toBe(s.items.length);
    const part = await c.post('/sessions', { clientSessionId: 'e-2', kind: 'review', subject: s.summary.subject, exam: '중간고사', reviewBatchId: b.json.batchId, startedAt: 1, finishedAt: Date.now(), answers: answersFor(b.json.items).slice(1) });
    expect(part.json.counted).toBe(false);
    const full = await c.post('/sessions', { clientSessionId: 'e-3', kind: 'review', subject: s.summary.subject, exam: '중간고사', reviewBatchId: b.json.batchId, startedAt: 1, finishedAt: Date.now(), answers: answersFor(b.json.items) });
    expect(full.json.counted).toBe(true);
    expect((await c.get('/review/summary' + q)).json.due).toBe(0);
    const me = (await c.get('/leaderboard')).json.find((x: any) => x.nickname === '에린');
    expect(me.attempts).toBe(s.items.length * 2);
  });
  it('과목 표시 설정 저장', async () => {
    const c = await memberClient(t, 'frank', '프랭크');
    const r = await c.put('/me/subject-prefs', { subjects: [{ subject: '웹프로그래밍', hidden: true }] });
    expect(r.json).toEqual([{ subject: '웹프로그래밍', hidden: true }]);
    expect((await c.get('/me/subject-prefs')).json).toEqual([{ subject: '웹프로그래밍', hidden: true }]);
  });
});

describe('신고 · 댓글', () => {
  it('신고 · 댓글 작성/수정/삭제', async () => {
    const c = await memberClient(t, 'gina', '지나');
    const s = firstSet();
    const it0 = s.items[0];
    const rep = await c.post('/reports', { itemId: it0.itemId, type: '오타', body: '띄어쓰기', setPath: s.summary.path });
    expect(rep.json).toMatchObject({ type: '오타', status: 'open', snapshot: { question: it0.question } });
    const cm = await c.post(`/items/${encodeURIComponent(it0.itemId)}/comments`, { body: '헷갈려요' });
    expect(cm.json).toMatchObject({ body: '헷갈려요', mine: true, nickname: '지나' });
    const other = await memberClient(t, 'hank', '행크');
    expect((await other.patch(`/comments/${cm.json.id}`, { body: 'x' })).status).toBe(403);
    expect((await c.patch(`/comments/${cm.json.id}`, { body: '이해함' })).json.body).toBe('이해함');
    expect((await other.get(`/items/${encodeURIComponent(it0.itemId)}/comments`)).json[0].mine).toBe(false);
    expect((await c.del(`/comments/${cm.json.id}`)).status).toBe(200);
    expect((await c.get(`/items/${encodeURIComponent(it0.itemId)}/comments`)).json).toEqual([]);
    const admin = await login(t.app);
    const list = (await admin.get('/admin/reports?status=open')).json;
    expect(list.length).toBeGreaterThan(0);
    expect((await admin.patch(`/admin/reports/${rep.json.id}`, { status: 'resolved', note: '고침' })).json.status).toBe('resolved');
  });
});

function uploadForm(files: { name: string; data: unknown }[]) {
  const fd = new FormData();
  for (const f of files) fd.append('files', new File([typeof f.data === 'string' ? f.data : JSON.stringify(f.data)], f.name, { type: 'application/json' }));
  return fd;
}
const newSubjectUpload = {
  meta: { subject: '데이터베이스', grade: 3, semester: 1, exam: '기말고사', kind: '일반문제', title: '정규화 OX 테스트', unit: '4장' },
  questions: [
    { category: '정규화', question: '제3정규형은 이행 함수 종속을 제거한 형태다.', answer: true, explanation: '3NF 는 이행 종속 제거.' },
    { category: '정규화', question: '제1정규형은 부분 함수 종속을 제거한 형태다.', answer: false, explanation: '부분 종속 제거는 2NF.' },
    { category: '정규화', question: 'A→B, B→C일 때 A→C가 성립하는 종속을 무엇이라 하는가?', answers: ['이행 함수 종속', '이행함수종속'], explanation: '이행 함수 종속.' },
  ],
  terms: [{ terms: ['제3정규형', '3NF'], group: '4장', desc: '이행 함수 종속을 제거한 정규형' }],
};

describe('업로드 → 승인 → 커밋 · push', () => {
  it('검사 오류 파일은 제출 안 됨', async () => {
    const c = await memberClient(t, 'ivan', '이반');
    const bad = { meta: { subject: '운영체제', exam: '중간고사', kind: '일반문제', title: 'x' }, questions: [{ question: 'q', answer: 'true', explanation: 'e', foo: 1 }] };
    const r = await c.raw('POST', '/uploads', uploadForm([{ name: 'bad.json', data: bad }, { name: 'broken.json', data: '{oops' }]));
    expect(r.status).toBe(400);
    expect(r.json.results.every((x: any) => !x.ok)).toBe(true);
    const chk = await c.raw('POST', '/uploads/check', uploadForm([{ name: 'good.json', data: newSubjectUpload }]));
    expect(chk.json[0]).toMatchObject({ ok: true, newSubject: { grade: 3, semester: 1 } });
  });

  it('승인 → 새 과목 · 파일 커밋(훅 실행) · push · 매니페스트 반영 · 올린 사람 표시', async () => {
    const c = await memberClient(t, 'judy', '주디');
    const up = await c.raw('POST', '/uploads', uploadForm([{ name: 'db.json', data: newSubjectUpload }]));
    expect(up.status).toBe(200);
    const uploadId = up.json.upload.id, fileId = up.json.upload.files[0].id;
    const admin = await login(t.app);
    const pv = await admin.get(`/admin/uploads/${uploadId}/files/${fileId}/preview`);
    expect(pv.json.items.length).toBe(3);
    const d = await admin.post(`/admin/uploads/${uploadId}/decide`, { files: [{ id: fileId, approve: true }] });
    expect(d.json.ok).toBe(true);
    expect(d.json.hookOutput).toMatch(/검사 통과/); // pre-commit 훅(tools/check.js)이 돌았다
    const dir = t.sandbox.content;
    const target = '데이터베이스/일반문제/데이터베이스_정규화_OX_테스트.jsx';
    expect(existsSync(join(dir, target))).toBe(true);
    const code = readFileSync(join(dir, target), 'utf8');
    expect(code).toContain('uploader":"judy"');
    expect(code).toMatch(/"id":"u/);
    expect(readFileSync(join(dir, '과목목록.json'), 'utf8')).toContain('"subject": "데이터베이스", "grade": 3, "semester": 1');
    const remoteHead = (await git(t.sandbox.remote, ['rev-parse', 'main'])).stdout.trim();
    expect(remoteHead).toBe(d.json.commitSha);
    const files = (await git(dir, ['show', '--name-only', '--format=', 'HEAD'])).stdout;
    expect(files).toContain(target);
    expect(files).not.toContain('quiz_bundle.js');
    const m = (await c.get('/content/manifest')).json;
    expect(m.subjects.find((s: any) => s.subject === '데이터베이스')).toMatchObject({ grade: 3, semester: 1, exams: ['기말고사'] });
    expect(m.sets.find((s: any) => s.path === target).uploader).toEqual({ username: 'judy', nickname: '주디' });
    const mine = (await c.get('/uploads/mine')).json;
    expect(mine[0]).toMatchObject({ status: 'done', commitSha: d.json.commitSha });
    expect(mine[0].files[0]).toMatchObject({ status: 'approved', targetPath: target });
  }, 60000);

  it('훅 실패 시 되돌림 · 대기 유지', async () => {
    const dir = t.sandbox.content;
    const hooks = join(t.base, 'failhooks');
    mkdirSync(hooks, { recursive: true });
    writeFileSync(join(hooks, 'pre-commit'), '#!/bin/sh\necho "일부러 실패" >&2\nexit 1\n');
    chmodSync(join(hooks, 'pre-commit'), 0o755);
    await git(dir, ['config', 'core.hooksPath', hooks]);
    try {
      const c = await memberClient(t, 'kate', '케이트');
      const data = { ...newSubjectUpload, meta: { ...newSubjectUpload.meta, subject: '운영체제', grade: undefined, semester: undefined, exam: '중간고사', title: '훅 실패 테스트' },
        questions: [{ category: '테스트', question: '훅 실패 테스트용 고유 문장 하나입니다.', answer: true, explanation: 'x' }], terms: [] };
      const up = await c.raw('POST', '/uploads', uploadForm([{ name: 'f.json', data }]));
      expect(up.status).toBe(200);
      const before = (await git(dir, ['rev-parse', 'HEAD'])).stdout.trim();
      const admin = await login(t.app);
      const d = await admin.post(`/admin/uploads/${up.json.upload.id}/decide`, { files: [{ id: up.json.upload.files[0].id, approve: true }] });
      expect(d.json.ok).toBe(false);
      expect(d.json.hookOutput).toContain('일부러 실패');
      expect((await git(dir, ['rev-parse', 'HEAD'])).stdout.trim()).toBe(before);
      expect((await git(dir, ['status', '--porcelain'])).stdout.trim()).toBe('');
      expect(existsSync(join(dir, '운영체제/일반문제/운영체제_훅_실패_테스트.jsx'))).toBe(false);
      const v = (await admin.get(`/admin/uploads/${up.json.upload.id}`)).json;
      expect(v.status).toBe('pending');
      expect(v.files[0].status).toBe('pending');
    } finally {
      await git(dir, ['config', 'core.hooksPath', 'tools/hooks']);
    }
  }, 60000);
});

describe('webhook', () => {
  const sign = (body: string, secret = 'sek') => 'sha256=' + createHmac('sha256', secret).update(body).digest('hex');
  const send = (body: string, sig: string, event = 'push', delivery = 'd-' + Math.random()) =>
    t.app.request('/api/webhooks/github', { method: 'POST', headers: { 'content-type': 'application/json', 'x-github-event': event, 'x-github-delivery': delivery, 'x-hub-signature-256': sig }, body });

  it('서명 틀림 401 · ping 200 · 다른 브랜치 무시', async () => {
    const b = JSON.stringify({ ref: 'refs/heads/main', after: 'abc' });
    expect((await send(b, sign(b, 'wrong'))).status).toBe(401);
    expect((await send('{}', sign('{}'), 'ping')).status).toBe(200);
    const other = JSON.stringify({ ref: 'refs/heads/dev', after: 'abc' });
    expect((await (await send(other, sign(other))).json()).ignored).toBe('branch');
  });

  it('원격에 새 커밋 push → 202 → pull · 새로고침 + 별칭 후보', async () => {
    // 다른 사람이 원격에 커밋한 상황: 별도 clone 에서 문항 문구를 고쳐 push
    const other = join(t.base, 'other');
    await git(t.base, ['clone', '-q', t.sandbox.remote, other]);
    const s = firstSet();
    const rel = s.summary.path;
    const code = readFileSync(join(other, rel), 'utf8');
    const q0 = s.items.find((i) => code.includes(i.question))!;
    writeFileSync(join(other, rel), code.replace(q0.question, q0.question + ' (수정)'));
    await git(other, ['commit', '-q', '--no-verify', '-am', '문구 수정'], { name: 'o', email: 'o@x' });
    await git(other, ['push', '-q', 'origin', 'HEAD:main']);
    const after = (await git(other, ['rev-parse', 'HEAD'])).stdout.trim();
    const b = JSON.stringify({ ref: 'refs/heads/main', after });
    const res = await send(b, sign(b), 'push', 'deliv-1');
    expect(res.status).toBe(202);
    for (let i = 0; i < 50 && t.ctx.headSha !== after; i++) await new Promise((r) => setTimeout(r, 100));
    expect(t.ctx.headSha).toBe(after);
    expect(t.ctx.lastWebhook?.result).toMatch(/반영됨/);
    // 같은 delivery 다시 → 무시
    expect((await (await send(b, sign(b), 'push', 'deliv-1')).json()).ignored).toBe('duplicate');
    // HEAD 같으면 건너뜀
    expect((await (await send(b, sign(b), 'push', 'deliv-2')).json()).skipped).toBe('head');
    // 별칭 후보 → 확정 → 옛 ID 의 카드가 새 ID 로
    const admin = await login(t.app);
    const cands = (await admin.get('/admin/aliases')).json;
    const cand = cands.find((x: any) => x.oldId === q0.itemId);
    expect(cand).toBeTruthy();
    expect((await admin.post(`/admin/aliases/${cand.id}`, { confirm: true })).status).toBe(200);
    expect(t.ctx.resolve(q0.itemId)).toBe(cand.newId);
    const carolCard = t.ctx.db.prepare("SELECT item_id FROM srs_cards WHERE user_id = (SELECT id FROM users WHERE username='carol') AND item_id = ?").get(cand.newId);
    expect(carolCard).toBeTruthy();
  }, 60000);
});

describe('관리자', () => {
  it('초대 · 계정 정지 · 재설정 링크', async () => {
    const admin = await login(t.app);
    const inv = (await admin.post('/admin/invites', { expiresInDays: 3, maxUses: 1 })).json;
    expect(inv.url).toMatch(new RegExp('^' + ORIGIN + '/join/'));
    const token = inv.url.split('/').pop();
    const c = client(t.app);
    expect((await c.post('/auth/register', { token, username: 'liam', nickname: '리엄', password: 'password1' })).status).toBe(200);
    expect((await client(t.app).post('/auth/register', { token, username: 'liam2', nickname: '리엄2', password: 'password1' })).status).toBe(400);
    const users = (await admin.get('/admin/users')).json;
    const liam = users.find((u: any) => u.username === 'liam');
    expect((await admin.patch(`/admin/users/${liam.id}`, { status: 'suspended' })).status).toBe(200);
    expect((await c.get('/auth/me')).status).toBe(401);
    const link = (await admin.post(`/admin/users/${liam.id}/reset-link`)).json.url;
    await admin.patch(`/admin/users/${liam.id}`, { status: 'active' });
    expect((await client(t.app).post('/auth/reset', { token: link.split('/').pop(), password: 'newpassword' })).status).toBe(200);
    expect((await client(t.app).post('/auth/login', { username: 'liam', password: 'newpassword' })).status).toBe(200);
    const st = (await admin.get('/admin/content/status')).json;
    expect(st.head).toMatch(/^[0-9a-f]{40}$/);
    expect(st.loadErrors.some((e: any) => e.path === 'tools/hooks/pre-commit')).toBe(false);
  });
});
