import { mkdtempSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { loadConfig, SERVER_ROOT } from '../src/config.ts';
import { openDb } from '../src/db.ts';
import { AppContext } from '../src/context.ts';
import { createApp } from '../src/app.ts';
import { createInvite, createUser } from '../src/auth.ts';
import { createSandbox } from '../src/sandbox.ts';

export const ORIGIN = 'http://test.local';
const REPO = resolve(SERVER_ROOT, '../..');

export async function makeTestApp() {
  const base = mkdtempSync(join(SERVER_ROOT, '.data', 'test-'));
  const sb = await createSandbox(base, REPO, 'main');
  const config = loadConfig({ CONTENT_DIR: sb.content, DATABASE_PATH: ':memory:', PUBLIC_ORIGIN: ORIGIN, GITHUB_WEBHOOK_SECRET: 'sek' });
  const ctx = new AppContext(openDb(':memory:'), config);
  await ctx.init();
  const app = createApp(ctx);
  const admin = createUser(ctx, { username: 'admin', nickname: '운영자', password: 'admin1234', role: 'admin' });
  return { ctx, app, base, sandbox: sb, admin };
}

/** 쿠키를 들고 다니는 간이 클라이언트 */
export function client(app: ReturnType<typeof createApp>) {
  let cookie = '';
  const req = async (method: string, path: string, body?: unknown, extra: Record<string, string> = {}) => {
    const headers: Record<string, string> = { origin: ORIGIN, ...extra };
    if (cookie) headers.cookie = cookie;
    let payload: BodyInit | undefined;
    if (body instanceof FormData) payload = body;
    else if (body !== undefined) { headers['content-type'] = 'application/json'; payload = JSON.stringify(body); }
    const res = await app.request('/api' + path, { method, headers, body: payload });
    const sc = res.headers.get('set-cookie');
    if (sc) { const m = /qsid=([^;]*)/.exec(sc); if (m) cookie = m[1] ? `qsid=${m[1]}` : ''; }
    const text = await res.text();
    let json: any = null;
    try { json = JSON.parse(text); } catch { json = text; }
    return { status: res.status, json };
  };
  return {
    get: (p: string) => req('GET', p),
    post: (p: string, b?: unknown, h?: Record<string, string>) => req('POST', p, b ?? {}, h),
    put: (p: string, b?: unknown) => req('PUT', p, b ?? {}),
    patch: (p: string, b?: unknown) => req('PATCH', p, b ?? {}),
    del: (p: string) => req('DELETE', p),
    raw: req,
  };
}

export async function login(app: ReturnType<typeof createApp>, username = 'admin', password = 'admin1234') {
  const c = client(app);
  const r = await c.post('/auth/login', { username, password });
  if (r.status !== 200) throw new Error('login failed ' + JSON.stringify(r.json));
  return c;
}

export async function memberClient(t: Awaited<ReturnType<typeof makeTestApp>>, username: string, nickname: string) {
  const inv = createInvite(t.ctx, t.admin.id, 7, 10);
  const c = client(t.app);
  const r = await c.post('/auth/register', { token: inv.token, username, nickname, password: 'password1' });
  if (r.status !== 200) throw new Error('register failed ' + JSON.stringify(r.json));
  return c;
}

/** 세트의 모든 문항을 n번째마다 틀리게 답한 제출 본문 */
export function answersFor(items: any[], wrongEvery = 0) {
  return items.map((q: any, i: number) => {
    const wrong = wrongEvery > 0 && i % wrongEvery === 0;
    const raw = q.type === 'ox' ? (wrong ? !q.answer : q.answer) : q.type === 'choice' ? (wrong ? (q.answerIndex + 1) % q.choices.length : q.answerIndex) : wrong ? '틀린답xyz' : q.answers[0];
    return { itemId: q.itemId, raw };
  });
}
