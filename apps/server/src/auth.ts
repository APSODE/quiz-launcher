// 계정 · 인증 (설계 11장)
import { Hono, type Context, type MiddlewareHandler } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import type { Me } from '@quiz/core';
import type { AppContext } from './context.ts';
import { get, run, tx } from './db.ts';
import { body, fail, hashPassword, now, randomToken, sha256, str, verifyPassword } from './util.ts';
import { AttemptLimiter, clientIp } from './security.ts';

export interface UserRow { id: number; username: string; nickname: string; role: 'admin' | 'member'; status: 'active' | 'suspended'; password_hash: string; created_at: number }
export type Env = { Variables: { user: UserRow | null; app: AppContext } };

const COOKIE = 'qsid';
const DAY = 86400000;
const SESSION_MS = 30 * DAY;

export const toMe = (u: UserRow): Me => ({ id: u.id, username: u.username, nickname: u.nickname, role: u.role });

export function requireUser(c: Context<Env>): UserRow {
  const u = c.get('user');
  if (!u) fail(401, '로그인이 필요합니다.');
  return u;
}
export function requireAdmin(c: Context<Env>): UserRow {
  const u = requireUser(c);
  if (u.role !== 'admin') fail(403, '관리자만 할 수 있습니다.');
  return u;
}

export function createUser(app: AppContext, o: { username: string; nickname: string; password: string; role?: 'admin' | 'member'; inviteId?: number }): UserRow {
  const id = run(app.db, 'INSERT INTO users (username, nickname, password_hash, role, status, created_at, invite_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    o.username, o.nickname, hashPassword(o.password), o.role ?? 'member', 'active', now(), o.inviteId ?? null).id;
  return get<UserRow>(app.db, 'SELECT * FROM users WHERE id = ?', id)!;
}

export function createInvite(app: AppContext, createdBy: number, expiresInDays: number, maxUses: number): { id: number; token: string; url: string; expiresAt: number } {
  const token = randomToken();
  const expiresAt = now() + expiresInDays * DAY;
  const id = run(app.db, 'INSERT INTO invites (token_hash, created_by, expires_at, max_uses, created_at) VALUES (?, ?, ?, ?, ?)',
    sha256(token), createdBy, expiresAt, maxUses, now()).id;
  return { id, token, url: `${app.config.publicOrigin}/join/${token}`, expiresAt };
}

function startSession(c: Context<Env>, app: AppContext, userId: number): void {
  const token = randomToken();
  const t = now();
  run(app.db, 'INSERT INTO auth_sessions (user_id, token_hash, created_at, expires_at, last_seen_at) VALUES (?, ?, ?, ?, ?)',
    userId, sha256(token), t, t + SESSION_MS, t);
  setCookie(c, COOKIE, token, {
    httpOnly: true, sameSite: 'Lax', path: '/', maxAge: SESSION_MS / 1000,
    secure: app.config.publicOrigin.startsWith('https://'),
  });
}

/** 쿠키 → user. 쓸 때마다 만료 연장(하루에 한 번만 갱신) */
export const sessionMiddleware: MiddlewareHandler<Env> = async (c, next) => {
  const app = c.get('app');
  c.set('user', null);
  const token = getCookie(c, COOKIE);
  if (token) {
    const s = get<{ id: number; user_id: number; expires_at: number; last_seen_at: number }>(app.db,
      'SELECT id, user_id, expires_at, last_seen_at FROM auth_sessions WHERE token_hash = ?', sha256(token));
    const t = now();
    if (s && s.expires_at > t) {
      const u = get<UserRow>(app.db, 'SELECT * FROM users WHERE id = ?', s.user_id);
      if (u && u.status === 'active') {
        c.set('user', u);
        if (t - s.last_seen_at > DAY) run(app.db, 'UPDATE auth_sessions SET last_seen_at = ?, expires_at = ? WHERE id = ?', t, t + SESSION_MS, s.id);
      }
    } else if (s) run(app.db, 'DELETE FROM auth_sessions WHERE id = ?', s.id);
  }
  await next();
};

// 시도 횟수 제한 (공개 대비). 앱(createApp)마다 따로 둔다
const TEN_MIN = 10 * 60000;
export interface Limiters { ipUser: AttemptLimiter; user: AttemptLimiter; ip: AttemptLimiter; token: AttemptLimiter }
export function createLimiters(): Limiters {
  return {
    ipUser: new AttemptLimiter(TEN_MIN, 5),     // (IP, 아이디) 실패 5회
    user: new AttemptLimiter(TEN_MIN, 10),      // 아이디 실패 10회 — IP 를 바꿔도 막힌다
    ip: new AttemptLimiter(TEN_MIN, 30),        // IP 실패 30회 (여러 아이디 돌려 보기)
    token: new AttemptLimiter(TEN_MIN, 20),     // IP 별 초대 가입 · 비밀번호 재설정 시도 20회
  };
}
const TOO_MANY = '시도가 너무 많습니다. 10분 뒤에 다시 시도하세요.';

const USERNAME_RE = /^[a-z0-9_]{3,20}$/;
function checkNickname(app: AppContext, nickname: string, exceptId?: number): void {
  const n = get<{ id: number }>(app.db, 'SELECT id FROM users WHERE nickname = ?', nickname);
  if (n && n.id !== exceptId) fail(409, '이미 쓰는 닉네임입니다.');
}
function inviteRow(app: AppContext, token: string) {
  const r = get<{ id: number; expires_at: number; max_uses: number; used_count: number; revoked_at: number | null }>(app.db,
    'SELECT * FROM invites WHERE token_hash = ?', sha256(token));
  return r && !r.revoked_at && r.expires_at > now() && r.used_count < r.max_uses ? r : null;
}

export function authRoutes(lim: Limiters = createLimiters()): Hono<Env> {
  const r = new Hono<Env>();
  const tokenGuard = (c: Context<Env>) => {
    const ip = clientIp(c, c.get('app').config.trustProxy);
    if (lim.token.blocked(ip)) fail(429, TOO_MANY);
    lim.token.hit(ip);
  };

  r.post('/auth/login', async (c) => {
    const app = c.get('app');
    const b = await body(c);
    const username = str(b.username, 'username').toLowerCase();
    const password = typeof b.password === 'string' ? b.password : '';
    const ip = clientIp(c, app.config.trustProxy);
    const ipUser = ip + '|' + username;
    if (lim.ipUser.blocked(ipUser) || lim.user.blocked(username) || lim.ip.blocked(ip)) fail(429, TOO_MANY);
    const u = get<UserRow>(app.db, 'SELECT * FROM users WHERE username = ?', username);
    if (!u || !verifyPassword(password, u.password_hash)) {
      lim.ipUser.hit(ipUser); lim.user.hit(username); lim.ip.hit(ip);
      fail(401, '아이디 또는 비밀번호가 틀렸습니다.');
    }
    if (u.status !== 'active') fail(403, '정지된 계정입니다.');
    lim.ipUser.clear(ipUser); lim.user.clear(username);
    startSession(c, app, u.id);
    return c.json(toMe(u));
  });

  r.post('/auth/logout', (c) => {
    const app = c.get('app');
    const token = getCookie(c, COOKIE);
    if (token) run(app.db, 'DELETE FROM auth_sessions WHERE token_hash = ?', sha256(token));
    deleteCookie(c, COOKIE, { path: '/' });
    return c.json({ ok: true });
  });

  r.get('/auth/me', (c) => c.json(toMe(requireUser(c))));

  r.get('/invites/:token', (c) => { tokenGuard(c); return c.json({ valid: !!inviteRow(c.get('app'), c.req.param('token')) }); });

  r.post('/auth/register', async (c) => {
    tokenGuard(c);
    const app = c.get('app');
    const b = await body(c);
    const token = str(b.token, 'token');
    const username = str(b.username, '아이디').toLowerCase();
    const nickname = str(b.nickname, '닉네임', { min: 2, max: 16 });
    const password = typeof b.password === 'string' ? b.password : '';
    if (!USERNAME_RE.test(username)) fail(400, '아이디는 영문 소문자 · 숫자 · _ 3~20자입니다.');
    if (password.length < 8) fail(400, '비밀번호는 8자 이상이어야 합니다.');
    const user = tx(app.db, () => {
      const inv = inviteRow(app, token);
      if (!inv) fail(400, '초대 링크가 만료됐거나 잘못됐습니다.');
      if (get(app.db, 'SELECT 1 FROM users WHERE username = ?', username)) fail(409, '이미 쓰는 아이디입니다.');
      checkNickname(app, nickname);
      run(app.db, 'UPDATE invites SET used_count = used_count + 1 WHERE id = ?', inv.id);
      return createUser(app, { username, nickname, password, inviteId: inv.id });
    });
    startSession(c, app, user.id);
    return c.json(toMe(user));
  });

  r.post('/auth/reset', async (c) => {
    tokenGuard(c);
    const app = c.get('app');
    const b = await body(c);
    const token = str(b.token, 'token');
    const password = typeof b.password === 'string' ? b.password : '';
    if (password.length < 8) fail(400, '비밀번호는 8자 이상이어야 합니다.');
    const row = get<{ id: number; user_id: number; expires_at: number; used_at: number | null }>(app.db,
      'SELECT * FROM password_resets WHERE token_hash = ?', sha256(token));
    if (!row || row.used_at || row.expires_at < now()) fail(400, '재설정 링크가 만료됐거나 잘못됐습니다.');
    tx(app.db, () => {
      run(app.db, 'UPDATE users SET password_hash = ? WHERE id = ?', hashPassword(password), row.user_id);
      run(app.db, 'UPDATE password_resets SET used_at = ? WHERE id = ?', now(), row.id);
      run(app.db, 'DELETE FROM auth_sessions WHERE user_id = ?', row.user_id);
    });
    return c.json({ ok: true });
  });

  r.patch('/me', async (c) => {
    const app = c.get('app');
    const u = requireUser(c);
    const b = await body(c);
    if (b.nickname != null) {
      const nickname = str(b.nickname, '닉네임', { min: 2, max: 16 });
      checkNickname(app, nickname, u.id);
      run(app.db, 'UPDATE users SET nickname = ? WHERE id = ?', nickname, u.id);
    }
    if (b.password != null) {
      if (typeof b.password !== 'string' || b.password.length < 8) fail(400, '비밀번호는 8자 이상이어야 합니다.');
      if (typeof b.currentPassword !== 'string' || !verifyPassword(b.currentPassword, u.password_hash)) fail(400, '현재 비밀번호가 틀렸습니다.');
      run(app.db, 'UPDATE users SET password_hash = ? WHERE id = ?', hashPassword(b.password), u.id);
    }
    return c.json(toMe(get<UserRow>(app.db, 'SELECT * FROM users WHERE id = ?', u.id)!));
  });

  return r;
}

export function createResetLink(app: AppContext, userId: number, by: number): string {
  const token = randomToken();
  run(app.db, 'INSERT INTO password_resets (user_id, token_hash, expires_at, created_by) VALUES (?, ?, ?, ?)', userId, sha256(token), now() + DAY, by);
  return `${app.config.publicOrigin}/reset/${token}`;
}
