// GitHub push webhook (설계 3.2)
import { Hono } from 'hono';
import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Env } from './auth.ts';
import { now } from './util.ts';

export function verifySignature(secret: string, raw: string, header: string | undefined): boolean {
  if (!header || !header.startsWith('sha256=')) return false;
  const want = Buffer.from('sha256=' + createHmac('sha256', secret).update(raw, 'utf8').digest('hex'));
  const got = Buffer.from(header);
  return want.length === got.length && timingSafeEqual(want, got);
}

export function webhookRoutes(): Hono<Env> {
  const r = new Hono<Env>();
  r.post('/webhooks/github', async (c) => {
    const app = c.get('app');
    const raw = await c.req.text();
    if (!verifySignature(app.config.webhookSecret, raw, c.req.header('x-hub-signature-256'))) return c.json({ error: '서명이 맞지 않습니다.' }, 401);
    const event = c.req.header('x-github-event') || '';
    const delivery = c.req.header('x-github-delivery') || '';
    if (event === 'ping') return c.json({ ok: true, pong: true });
    if (event !== 'push') return c.json({ ok: true, ignored: 'event' });
    let payload: { ref?: string; after?: string };
    try { payload = JSON.parse(raw); } catch { return c.json({ error: '본문이 JSON 이 아닙니다.' }, 400); }
    if (payload.ref !== `refs/heads/${app.config.contentBranch}`) return c.json({ ok: true, ignored: 'branch' });
    if (delivery && app.deliveries.includes(delivery)) return c.json({ ok: true, ignored: 'duplicate' });
    if (delivery) { app.deliveries.push(delivery); if (app.deliveries.length > 100) app.deliveries.shift(); }
    if (payload.after && payload.after === app.headSha) {
      app.lastWebhook = { at: now(), delivery, result: '이미 반영됨(HEAD 같음)' };
      return c.json({ ok: true, skipped: 'head' });
    }
    app.lastWebhook = { at: now(), delivery, result: '처리 중' };
    void app.lock.run(async () => {
      if (payload.after && payload.after === app.headSha) { app.lastWebhook = { at: now(), delivery, result: '이미 반영됨(HEAD 같음)' }; return; }
      const res = await app.pullAndReload();
      app.lastWebhook = { at: now(), delivery, result: res.ok ? `반영됨 ${app.headSha.slice(0, 7)}` : 'pull 실패: ' + res.output.slice(0, 500) };
    }).catch((e) => { app.lastWebhook = { at: now(), delivery, result: '오류: ' + String(e) }; });
    return c.json({ ok: true, accepted: true }, 202);
  });
  return r;
}
