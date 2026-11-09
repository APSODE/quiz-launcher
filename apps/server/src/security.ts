// 공개(인터넷 노출) 대비: 클라이언트 IP 판정 · 시도 횟수 제한 · 보안 헤더
import type { Context, MiddlewareHandler } from 'hono';
import { isIP } from 'node:net';
import type { Config } from './config.ts';

export type TrustProxy = 'private' | 'none' | number;

export function parseTrustProxy(v: string | undefined): TrustProxy {
  const s = (v ?? '').trim().toLowerCase();
  if (s === '' || s === 'private') return 'private';
  if (s === 'none' || s === 'false' || s === '0') return 'none';
  const n = Number(s);
  if (Number.isInteger(n) && n > 0) return n;
  throw new Error(`TRUST_PROXY 값이 잘못됐습니다: ${v} (private | none | 1 이상의 정수)`);
}

/** 루프백 · 사설 · 링크 로컬 · CGNAT(100.64/10, Tailscale) · ULA 주소인가 */
export function isPrivateAddress(addr: string): boolean {
  let a = addr.trim();
  if (a.startsWith('::ffff:') && isIP(a.slice(7)) === 4) a = a.slice(7);
  const v = isIP(a);
  if (v === 4) {
    const [p, q] = a.split('.').map(Number);
    return p === 127 || p === 10 || (p === 172 && q >= 16 && q <= 31) || (p === 192 && q === 168)
      || (p === 169 && q === 254) || (p === 100 && q >= 64 && q <= 127);
  }
  if (v === 6) {
    const l = a.toLowerCase();
    return l === '::1' || l.startsWith('fc') || l.startsWith('fd') || /^fe[89ab]/.test(l);
  }
  return false;
}

function socketAddress(c: Context): string | null {
  const inc = (c.env as { incoming?: { socket?: { remoteAddress?: string } } } | undefined)?.incoming;
  return inc?.socket?.remoteAddress || null;
}

/**
 * 시도 횟수 제한에 쓰는 클라이언트 IP.
 * - none: 소켓 주소만 쓴다(X-Forwarded-For 무시).
 * - private(기본): 소켓 주소가 루프백 · 사설이면 앞단 프록시가 붙였다고 보고 X-Forwarded-For 의 **오른쪽 끝** 값을 쓴다.
 *   클라이언트가 직접 넣은 왼쪽 값은 절대 쓰지 않는다.
 * - N: 앞단 프록시가 N 개 있다고 보고 오른쪽에서 N 번째 값을 쓴다.
 *
 * 주의: 오라클 배포 경로(Tailscale Funnel → 127.0.0.1:8080 → docker 포트 매핑)에서 tailscaled 가 X-Forwarded-For 를
 * 붙이는지는 확인하지 못했다. 붙이지 않으면 private 모드의 오른쪽 끝 값도 클라이언트가 넣은 값일 수 있으므로,
 * IP 기준 제한은 보조 수단이고 실제 방어는 IP 와 무관한 아이디 기준 제한(auth.ts)이 맡는다.
 */
export function clientIp(c: Context, trust: TrustProxy): string {
  const sock = socketAddress(c);
  if (trust === 'none') return sock ?? 'unknown';
  const xff = (c.req.header('x-forwarded-for') || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (trust === 'private') {
    if (sock && isPrivateAddress(sock) && xff.length) return xff[xff.length - 1];
    return sock ?? 'unknown';
  }
  return xff.length >= trust ? xff[xff.length - trust] : (sock ?? 'unknown');
}

/** 고정 창(window) 안의 시도 횟수 제한. 메모리에만 둔다(재시작하면 초기화) */
export class AttemptLimiter {
  private hits = new Map<string, number[]>();
  private windowMs: number;
  private max: number;
  constructor(windowMs: number, max: number) {
    this.windowMs = windowMs;
    this.max = max;
  }
  private recent(key: string, t: number): number[] {
    const arr = (this.hits.get(key) || []).filter((x) => t - x < this.windowMs);
    if (arr.length) this.hits.set(key, arr); else this.hits.delete(key);
    return arr;
  }
  blocked(key: string, t = Date.now()): boolean { return this.recent(key, t).length >= this.max; }
  hit(key: string, t = Date.now()): void {
    const arr = this.recent(key, t);
    arr.push(t);
    this.hits.set(key, arr);
    if (this.hits.size > 20000) this.prune(t);   // 키를 바꿔 가며 메모리를 채우는 공격 대비
  }
  clear(key: string): void { this.hits.delete(key); }
  private prune(t: number): void {
    for (const k of [...this.hits.keys()]) this.recent(k, t);
    if (this.hits.size > 20000) {
      const drop = this.hits.size - 10000;
      let i = 0;
      for (const k of this.hits.keys()) { if (i++ >= drop) break; this.hits.delete(k); }
    }
  }
}

const CSP = [
  "default-src 'self'",
  // 기존 연습 플러그인이 인라인 onclick 과 Function 평가(연습 문항 데이터)를 쓴다
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src 'self'",            // 연습 화면의 결과 미리 보기는 srcdoc iframe
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
].join('; ');

/** 모든 응답(API · 정적 파일)에 보안 헤더 */
export function securityHeaders(config: Config): MiddlewareHandler {
  const https = config.publicOrigin.startsWith('https://');
  return async (c, next) => {
    await next();
    const h = c.res.headers;
    h.set('X-Content-Type-Options', 'nosniff');
    h.set('Referrer-Policy', 'same-origin');
    h.set('X-Frame-Options', 'DENY');
    h.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()');
    h.set('Cross-Origin-Opener-Policy', 'same-origin');
    h.set('Content-Security-Policy', CSP);
    if (https) h.set('Strict-Transport-Security', 'max-age=15552000');
    if (c.req.path.startsWith('/api/')) h.set('Cache-Control', 'no-store');
  };
}
