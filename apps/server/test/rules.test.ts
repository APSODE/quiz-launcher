import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { makeTestApp, login, memberClient, ORIGIN } from './helpers.ts';
import { git } from '../src/git.ts';

let t: Awaited<ReturnType<typeof makeTestApp>>;
beforeAll(async () => { t = await makeTestApp(); }, 60000);
afterAll(() => { if (t) rmSync(t.base, { recursive: true, force: true }); });

/** 헤더까지 보는 GET (쿠키 직접) */
async function getRaw(path: string, cookie = '') {
  const res = await t.app.request('/api' + path, { headers: { origin: ORIGIN, ...(cookie ? { cookie } : {}) } });
  return { status: res.status, headers: res.headers, text: await res.text() };
}
async function cookieOf(username: string, password: string) {
  const res = await t.app.request('/api/auth/login', { method: 'POST', headers: { origin: ORIGIN, 'content-type': 'application/json' }, body: JSON.stringify({ username, password }) });
  return /qsid=[^;]*/.exec(res.headers.get('set-cookie') ?? '')![0];
}
const q = (subject: string, exam: string) => `/rules?subject=${encodeURIComponent(subject)}&exam=${encodeURIComponent(exam)}`;

describe('출제 규칙 받기 · 저장', () => {
  it('로더가 출제규칙.json 을 읽는다', () => {
    expect(t.ctx.content.data.rules?.rev).toBeGreaterThanOrEqual(1);
    expect(t.ctx.status().loadErrors.some((e) => e.path === '출제규칙.json')).toBe(false);
  });

  it('GET /rules: 로그인 필요 · md 첨부 · 규칙 포함 · 잘못된 요청 400', async () => {
    expect((await getRaw(q('운영체제', '기말고사'))).status).toBe(401);
    await memberClient(t, 'rulesm', '규칙멤버');
    const ck = await cookieOf('rulesm', 'password1');
    const r = await getRaw(q('운영체제', '기말고사'), ck);
    expect(r.status).toBe(200);
    expect(r.headers.get('content-type')).toBe('text/markdown; charset=utf-8');
    expect(r.headers.get('content-disposition')).toContain(`filename*=UTF-8''${encodeURIComponent('출제규칙_운영체제_기말고사.md')}`);
    expect(r.text.startsWith('# 출제 규칙 — 운영체제 기말고사\n')).toBe(true);
    expect(r.text).toContain('## 내지 말 것');
    expect(r.text).toContain(t.ctx.content.data.rules!.avoid[0]);
    expect(r.text).toContain(`규칙 rev: ${t.ctx.content.data.rules!.rev}`);
    expect((await getRaw(q('운영체제', '시험'), ck)).status).toBe(400);
    expect((await getRaw(q('없는과목', '기말고사'), ck)).status).toBe(400);
  });

  it('관리자 GET · PUT /admin/rules: member 403 · 409 · rev + 1 · 커밋 · 업로드 rulesRev 경고', async () => {
    const m = await memberClient(t, 'rulesm2', '규칙멤버2');
    expect((await m.get('/admin/rules')).status).toBe(403);
    expect((await m.put('/admin/rules', { rules: { avoid: [] }, baseRev: 1 })).status).toBe(403);
    const a = await login(t.app);
    const cur = (await a.get('/admin/rules')).json;
    expect(cur.rev).toBeGreaterThanOrEqual(1);
    expect((await a.put('/admin/rules', { rules: { avoid: [''] }, baseRev: cur.rev })).status).toBe(400);
    const head = (await git(t.sandbox.content, ['rev-parse', 'HEAD'])).stdout.trim();
    expect((await a.put('/admin/rules', { rules: { avoid: ['x'] }, baseRev: cur.rev - 1 })).status).toBe(409);
    expect((await git(t.sandbox.content, ['rev-parse', 'HEAD'])).stdout.trim()).toBe(head);
    const r = await a.put('/admin/rules', { rules: { rev: 99, avoid: ['단축키 문제', '단축키 문제', '출석 규정'], note: '메모' }, baseRev: cur.rev });
    expect(r.status).toBe(200);
    expect(r.json).toMatchObject({ ok: true, rev: cur.rev + 1 });
    expect(r.json.hookOutput).toMatch(/검사 통과/);
    expect((await git(t.sandbox.content, ['log', '-1', '--format=%s'])).stdout.trim()).toBe(`규칙: 전역 출제 규칙 rev ${cur.rev + 1} (운영자)`);
    const file = JSON.parse(readFileSync(join(t.sandbox.content, '출제규칙.json'), 'utf8'));
    expect(file).toMatchObject({ rev: cur.rev + 1, avoid: ['단축키 문제', '출석 규정'], note: '메모' });
    expect(file.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect((await a.get('/admin/rules')).json.rev).toBe(cur.rev + 1);

    const fd = new FormData();
    const data = { meta: { subject: '운영체제', exam: '기말고사', kind: '일반문제', title: '규칙 테스트', rulesRev: cur.rev }, questions: [{ category: 'x', question: '규칙 rev 경고를 보는 문제다.', answer: true, explanation: 'x', source: 'x', difficulty: '기초' }] };
    fd.append('files', new File([JSON.stringify(data)], 'r.json', { type: 'application/json' }));
    const chk = await m.raw('POST', '/uploads/check', fd);
    expect(chk.status).toBe(200);
    expect(JSON.stringify(chk.json)).toContain(`옛 출제 규칙(rev ${cur.rev}) 기준 — 지금 rev ${cur.rev + 1}`);
  }, 60000);
});
