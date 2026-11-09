// 서버 진입점: node src/index.ts
import { serve } from '@hono/node-server';
import { loadConfig } from './config.ts';
import { openDb } from './db.ts';
import { AppContext } from './context.ts';
import { createApp } from './app.ts';

const config = loadConfig();
const db = openDb(config.databasePath);
const ctx = new AppContext(db, config);
await ctx.init();
const app = createApp(ctx);

const errs = ctx.content.data.errors;
console.log(`[quiz-server] 콘텐츠 ${config.contentDir}: 세트 ${ctx.content.data.sets.size}개, 문항 ${ctx.content.data.items.size}개, 읽기 오류 ${errs.length}개`);
errs.slice(0, 10).forEach((e) => console.log(`  ! ${e.path}: ${e.error}`));
if (ctx.hookWarning) console.warn('[quiz-server] 경고: ' + ctx.hookWarning);
serve({ fetch: app.fetch, port: config.port }, (i) => console.log(`[quiz-server] http://localhost:${i.port}  (PUBLIC_ORIGIN=${config.publicOrigin})`));
