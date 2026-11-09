// Hono 앱 조립
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { serveStatic } from '@hono/node-server/serve-static';
import { existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { AppContext } from './context.ts';
import { authRoutes, sessionMiddleware, type Env } from './auth.ts';
import { recordRoutes } from './records.ts';
import { uploadRoutes } from './uploads.ts';
import { socialRoutes } from './social.ts';
import { webhookRoutes } from './webhook.ts';
import { bodyLimit } from 'hono/body-limit';
import { securityHeaders } from './security.ts';
import { createLimiters } from './auth.ts';

export function createApp(app: AppContext): Hono<Env> {
  const root = new Hono<Env>();
  root.use('*', async (c, next) => { c.set('app', app); await next(); });
  root.use('*', securityHeaders(app.config));

  // 요청 본문 크기 상한: 본문을 다 읽기 전에(Content-Length · 스트림 누적) 413 으로 끊는다 — 1GB 서버 메모리 보호
  const KB = 1024;
  const limits = {
    upload: app.config.uploadMaxFiles * app.config.uploadMaxFileBytes + 256 * KB,
    webhook: 10 * 1024 * KB,
    sessions: 2 * 1024 * KB,
    other: 256 * KB,
  };
  const tooLarge = bodyLimit({ maxSize: limits.other, onError: (c) => c.json({ error: '요청 본문이 너무 큽니다.' }, 413) });
  const mk = (n: number) => bodyLimit({ maxSize: n, onError: (c) => c.json({ error: '요청 본문이 너무 큽니다.' }, 413) });
  const upLimit = mk(limits.upload), hookLimit = mk(limits.webhook), sessLimit = mk(limits.sessions);

  const api = new Hono<Env>();
  // 변경 요청은 Origin 이 PUBLIC_ORIGIN 과 같아야 한다(webhook 제외)
  api.use('*', async (c, next) => {
    const m = c.req.method;
    if (m !== 'GET' && m !== 'HEAD' && m !== 'OPTIONS' && !c.req.path.startsWith('/api/webhooks/')) {
      if (c.req.header('origin') !== app.config.publicOrigin) return c.json({ error: '허용되지 않은 출처의 요청입니다.' }, 403);
    }
    await next();
  });
  api.use('*', (c, next) => {
    const m = c.req.method;
    if (m === 'GET' || m === 'HEAD' || m === 'OPTIONS') return next();
    const p = c.req.path;
    if (p === '/api/uploads' || p === '/api/uploads/check') return upLimit(c, next);
    if (p.startsWith('/api/webhooks/')) return hookLimit(c, next);
    if (p === '/api/sessions') return sessLimit(c, next);
    return tooLarge(c, next);
  });
  api.use('*', sessionMiddleware);
  api.route('/', webhookRoutes());
  api.route('/', authRoutes(createLimiters()));
  api.route('/', recordRoutes());
  api.route('/', uploadRoutes());
  api.route('/', socialRoutes());
  api.notFound((c) => c.json({ error: '없는 API 입니다.' }, 404));
  root.route('/api', api);

  root.onError((err, c) => {
    if (err instanceof HTTPException) return c.json({ error: err.message }, err.status);
    console.error(err);
    return c.json({ error: '서버 오류가 발생했습니다.' }, 500);   // 내부 메시지 · 경로는 응답에 넣지 않는다(로그에만)
  });

  if (app.config.webDist && existsSync(app.config.webDist)) {
    const dist = app.config.webDist;
    const index = join(dist, 'index.html');
    root.use('/*', serveStatic({ root: relative(process.cwd(), dist) || '.' }));
    root.get('*', (c) => (existsSync(index) ? c.html(readFileSync(index, 'utf8')) : c.notFound()));
  }
  return root;
}
