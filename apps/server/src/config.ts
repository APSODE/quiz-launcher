import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseTrustProxy, type TrustProxy } from './security.ts';

export const SERVER_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export interface Config {
  port: number;
  databasePath: string;
  contentDir: string;
  contentBranch: string;
  publicOrigin: string;
  webhookSecret: string;
  webDist: string | null;
  gitAuthorName: string;
  gitAuthorEmail: string;
  uploadMaxFileBytes: number;
  uploadMaxFiles: number;
  uploadDailyLimit: number;
  trustProxy: TrustProxy;          // TRUST_PROXY: private(기본) | none | N — security.ts clientIp
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const r = (p: string) => resolve(SERVER_ROOT, p);
  return {
    port: Number(env.PORT || 8787),
    databasePath: env.DATABASE_PATH === ':memory:' ? ':memory:' : r(env.DATABASE_PATH || '.data/dev.sqlite'),
    contentDir: r(env.CONTENT_DIR || '.data/content'),
    contentBranch: env.CONTENT_BRANCH || 'main',
    publicOrigin: (env.PUBLIC_ORIGIN || 'http://localhost:5173').replace(/\/$/, ''),
    webhookSecret: env.GITHUB_WEBHOOK_SECRET || 'dev-secret',
    webDist: env.WEB_DIST ? r(env.WEB_DIST) : null,
    gitAuthorName: env.GIT_AUTHOR_NAME || 'quiz-server',
    gitAuthorEmail: env.GIT_AUTHOR_EMAIL || 'quiz-server@localhost',
    uploadMaxFileBytes: Number(env.UPLOAD_MAX_FILE_BYTES || 1024 * 1024),
    uploadMaxFiles: Number(env.UPLOAD_MAX_FILES || 20),
    uploadDailyLimit: Number(env.UPLOAD_DAILY_LIMIT || 10),
    trustProxy: parseTrustProxy(env.TRUST_PROXY),
  };
}
