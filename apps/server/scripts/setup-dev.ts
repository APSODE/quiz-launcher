// pnpm --filter @quiz/server setup:dev
// .data/remote.git + .data/content 샌드박스, .data/dev.sqlite, 관리자 admin/admin1234, 초대 링크 하나.
import { existsSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { SERVER_ROOT, loadConfig } from '../src/config.ts';
import { createSandbox } from '../src/sandbox.ts';
import { openDb } from '../src/db.ts';
import { AppContext } from '../src/context.ts';
import { createInvite, createUser } from '../src/auth.ts';

const repoRoot = resolve(SERVER_ROOT, '../..');
const dataDir = join(SERVER_ROOT, '.data');
const config = loadConfig({ ...process.env, CONTENT_DIR: process.env.CONTENT_DIR || '.data/content', DATABASE_PATH: process.env.DATABASE_PATH || '.data/dev.sqlite' });
if (!config.contentDir.startsWith(dataDir) || !config.databasePath.startsWith(dataDir)) {
  console.error('setup:dev 는 apps/server/.data 아래만 만듭니다. CONTENT_DIR · DATABASE_PATH 를 비우고 실행하세요.');
  process.exit(1);
}
console.log('콘텐츠 샌드박스 만드는 중 …');
const { remote, content } = await createSandbox(dataDir, repoRoot, config.contentBranch);
for (const f of [config.databasePath, config.databasePath + '-wal', config.databasePath + '-shm']) if (existsSync(f)) rmSync(f);
const db = openDb(config.databasePath);
const ctx = new AppContext(db, config);
const admin = createUser(ctx, { username: 'admin', nickname: '운영자', password: 'admin1234', role: 'admin' });
const inv = createInvite(ctx, admin.id, 30, 50);
console.log(`
원격(bare): ${remote}
작업 사본:  ${content}
DB:         ${config.databasePath}
세트 ${ctx.content.data.sets.size}개 · 문항 ${ctx.content.data.items.size}개 · 읽기 오류 ${ctx.content.data.errors.length}개
관리자:     admin / admin1234
초대 링크:  ${inv.url}
`);
