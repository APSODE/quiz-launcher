// 공개 대비 보안: 시도 제한 · X-Forwarded-For · 보안 헤더 · 본문 크기 · 경로 조작
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { rmSync } from 'node:fs';
import { makeTestApp, client, login, ORIGIN } from './helpers.ts';
import { clientIp, isPrivateAddress, parseTrustProxy } from '../src/security.ts';
import { loadConfig } from '../src/config.ts';
import { openDb } from '../src/db.ts';
import { AppContext } from '../src/context.ts';
import { createApp } from '../src/app.ts';
import { createUser } from '../src/auth.ts';

let t: Awaited<ReturnType<typeof makeTestApp>>;
beforeAll(async () => { t = await makeTestApp(); }, 60000);
afterAll(() => { rmSync(t.base, { recursive: true, force: true }); });

const sock = (remoteAddress: string) => ({ incoming: { socket: { remoteAddress } } });
async function loginAs(app: ReturnType<typeof createApp>, username: string, password: string, xff?: string, from = '172.17.0.1') {
  const headers: Record<string, string> = { origin: ORIGIN, 'content-type': 'application/json' };
  if (xff) headers['x-forwarded-for'] = xff;
  const res = await app.request('/api/auth/login', { method: 'POST', headers, body: JSON.stringify({ username, password }) }, sock(from));
  return res.status;
}

describe('클라이언트 IP 판정', () => {
  const fake = (xff: string | undefined, addr: string | null) => ({
    req: { header: (n: string) => (n === 'x-forwarded-for' ? xff : undefined) },
    env: addr ? sock(addr) : undefined,
  }) as never;
  it('TRUST_PROXY 파싱', () => {
    expect(parseTrustProxy(undefined)).toBe('private');
    expect(parseTrustProxy('none')).toBe('none');
    expect(parseTrustProxy('2')).toBe(2);
    expect(() => parseTrustProxy('yes')).toThrow();
  });
  it('사설 대역 판정', () => {
    for (const a of ['127.0.0.1', '10.1.2.3', '172.17.0.1', '192.168.0.5', '100.82.127.35', '::1', 'fd7a::1', '::ffff:172.18.0.1']) expect(isPrivateAddress(a)).toBe(true);
    for (const a of ['8.8.8.8', '172.32.0.1', '100.128.0.1', '2001:db8::1']) expect(isPrivateAddress(a)).toBe(false);
  });
  it('private: 사설 소켓이면 XFF 의 오른쪽 끝, 왼쪽(클라이언트가 넣은 값)은 쓰지 않음', () => {
    expect(clientIp(fake('6.6.6.6, 203.0.113.5', '172.17.0.1'), 'private')).toBe('203.0.113.5');
    expect(clientIp(fake('6.6.6.6', '8.8.8.8'), 'private')).toBe('8.8.8.8');   // 공인 소켓이면 XFF 무시
    expect(clientIp(fake(undefined, '172.17.0.1'), 'private')).toBe('172.17.0.1');
  });
  it('none: XFF 무시 / N: 오른쪽에서 N 번째', () => {
    expect(clientIp(fake('6.6.6.6, 203.0.113.5', '172.17.0.1'), 'none')).toBe('172.17.0.1');
    expect(clientIp(fake('6.6.6.6, 203.0.113.5, 10.0.0.2', '172.17.0.1'), 2)).toBe('203.0.113.5');
  });
});

describe('로그인 시도 제한', () => {
  it('XFF 왼쪽 값을 바꿔도 (IP, 아이디) 제한은 우회되지 않는다', async () => {
    createUser(t.ctx, { username: 'victim1', nickname: '피해자1', password: 'rightpass1' });
    for (let i = 0; i < 5; i++) expect(await loginAs(t.app, 'victim1', 'wrong', `9.9.9.${i}, 203.0.113.7`)).toBe(401);
    expect(await loginAs(t.app, 'victim1', 'wrong', '9.9.9.99, 203.0.113.7')).toBe(429);
    expect(await loginAs(t.app, 'victim1', 'rightpass1', '9.9.9.100, 203.0.113.7')).toBe(429);   // 잠긴 동안은 맞는 비밀번호도 거절
  });
  it('XFF 전체를 바꿔 IP 를 위조해도 아이디 기준 제한(10회)에 걸린다', async () => {
    createUser(t.ctx, { username: 'victim2', nickname: '피해자2', password: 'rightpass2' });
    for (let i = 0; i < 10; i++) expect(await loginAs(t.app, 'victim2', 'wrong', `198.51.100.${i}`)).toBe(401);
    expect(await loginAs(t.app, 'victim2', 'rightpass2', '198.51.100.200')).toBe(429);
    expect(await loginAs(t.app, 'admin', 'admin1234', '198.51.100.201')).toBe(200);           // 다른 계정은 영향 없음
  });
  it('한 IP 가 여러 아이디를 돌려 봐도 IP 기준 제한(30회)에 걸린다', async () => {
    for (let i = 0; i < 30; i++) expect(await loginAs(t.app, `nouser${i}`, 'wrong', undefined, '8.8.4.4')).toBe(401);
    expect(await loginAs(t.app, 'admin', 'admin1234', undefined, '8.8.4.4')).toBe(429);
    expect(await loginAs(t.app, 'admin', 'admin1234', undefined, '8.8.8.8')).toBe(200);
  });
  it('초대 링크 확인 · 가입 · 재설정은 IP 당 10분 20회', async () => {
    let last = 0;
    for (let i = 0; i < 21; i++) last = (await t.app.request('/api/invites/nope' + i, {}, sock('1.2.3.4'))).status;
    expect(last).toBe(429);
    const r = await t.app.request('/api/auth/reset', { method: 'POST', headers: { origin: ORIGIN, 'content-type': 'application/json' }, body: JSON.stringify({ token: 'x', password: 'abcdefgh' }) }, sock('1.2.3.4'));
    expect(r.status).toBe(429);
    expect((await t.app.request('/api/invites/nope', {}, sock('1.2.3.5'))).status).toBe(200);
  });
});

describe('보안 헤더', () => {
  it('API 응답에 기본 헤더, http 에서는 HSTS 없음', async () => {
    const res = await t.app.request('/api/auth/me');
    expect(res.headers.get('x-content-type-options')).toBe('nosniff');
    expect(res.headers.get('x-frame-options')).toBe('DENY');
    expect(res.headers.get('referrer-policy')).toBe('same-origin');
    expect(res.headers.get('permissions-policy')).toContain('camera=()');
    expect(res.headers.get('content-security-policy')).toContain("frame-ancestors 'none'");
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect(res.headers.get('strict-transport-security')).toBeNull();
  });
  it('https 공개 주소면 HSTS', async () => {
    const config = loadConfig({ CONTENT_DIR: t.sandbox.content, DATABASE_PATH: ':memory:', PUBLIC_ORIGIN: 'https://quiz.example', GITHUB_WEBHOOK_SECRET: 's' });
    const ctx = new AppContext(openDb(':memory:'), config);
    await ctx.init();
    const res = await createApp(ctx).request('/api/auth/me');
    expect(res.headers.get('strict-transport-security')).toBe('max-age=15552000');
    expect(res.headers.get('x-content-type-options')).toBe('nosniff');
  }, 30000);
});

describe('요청 본문 · 경로', () => {
  it('업로드 상한을 넘는 본문은 읽기 전에 413', async () => {
    const c = await login(t.app);
    const max = t.ctx.config.uploadMaxFiles * t.ctx.config.uploadMaxFileBytes;
    const big = 'x'.repeat(max + 512 * 1024);
    const fd = new FormData();
    fd.append('files', new Blob([big], { type: 'application/json' }), 'big.json');
    const r = await c.raw('POST', '/uploads/check', fd);
    expect(r.status).toBe(413);
  }, 30000);
  it('일반 API 의 큰 JSON 본문은 413', async () => {
    const r = await client(t.app).post('/auth/login', { username: 'admin', password: 'p'.repeat(300 * 1024) });
    expect(r.status).toBe(413);
  });
  it('content/raw 경로 조작은 404', async () => {
    const c = await login(t.app);
    for (const p of ['../package.json', '플러그인/../package.json', '/etc/passwd', '플러그인/운영체제/../../tools/check.js']) {
      const r = await c.get('/content/raw?path=' + encodeURIComponent(p));
      expect(r.status).toBe(404);
    }
  });
});
