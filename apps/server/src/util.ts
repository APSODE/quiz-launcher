import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { HTTPException } from 'hono/http-exception';

export const now = () => Date.now();
export const randomToken = () => randomBytes(32).toString('base64url');
export const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

// 설계는 argon2id. 프로토타입은 네이티브 모듈 없이 node:crypto scrypt.
export function hashPassword(pw: string): string {
  const salt = randomBytes(16);
  const h = scryptSync(pw, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt$16384$8$1$${salt.toString('base64')}$${h.toString('base64')}`;
}
export function verifyPassword(pw: string, stored: string): boolean {
  const [alg, N, r, p, salt, hash] = stored.split('$');
  if (alg !== 'scrypt') return false;
  const want = Buffer.from(hash, 'base64');
  const got = scryptSync(pw, Buffer.from(salt, 'base64'), want.length, { N: +N, r: +r, p: +p });
  return timingSafeEqual(want, got);
}

export type FailStatus = 400 | 401 | 403 | 404 | 409 | 413 | 429 | 500;
/** API 오류: { error } 본문으로 응답된다(app.ts onError) */
export function fail(status: FailStatus, message: string): never {
  throw new HTTPException(status, { message });
}
export function str(v: unknown, name: string, opt: { min?: number; max?: number; optional?: boolean } = {}): string {
  if (v == null || v === '') { if (opt.optional) return ''; fail(400, `${name} 가 필요합니다.`); }
  if (typeof v !== 'string') fail(400, `${name} 는 문자열이어야 합니다.`);
  const s = v.trim();
  if (opt.min != null && s.length < opt.min) fail(400, `${name} 는 ${opt.min}자 이상이어야 합니다.`);
  if (opt.max != null && s.length > opt.max) fail(400, `${name} 는 ${opt.max}자 이하여야 합니다.`);
  return s;
}
export function int(v: unknown, name: string): number {
  const n = typeof v === 'string' && v.trim() !== '' ? Number(v) : v;
  if (typeof n !== 'number' || !Number.isInteger(n)) fail(400, `${name} 는 정수여야 합니다.`);
  return n;
}
export async function body(c: { req: { json: () => Promise<unknown> } }): Promise<Record<string, unknown>> {
  try {
    const b = await c.req.json();
    if (!b || typeof b !== 'object' || Array.isArray(b)) fail(400, '요청 본문은 JSON 객체여야 합니다.');
    return b as Record<string, unknown>;
  } catch (e) {
    if (e instanceof HTTPException) throw e;
    fail(400, '요청 본문이 올바른 JSON 이 아닙니다.');
  }
}
