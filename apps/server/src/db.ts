// SQLite (node:sqlite). 스키마는 설계 13장 + 프로토타입 보충 칼럼(quiz_sessions.counted · exam, analysis_resets.exam 등).
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export type DB = DatabaseSync;
type Param = string | number | bigint | null | Uint8Array;

const MIGRATIONS: string[] = [
  `
  CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT UNIQUE NOT NULL, nickname TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'member', status TEXT NOT NULL DEFAULT 'active',
    created_at INTEGER NOT NULL, invite_id INTEGER);
  CREATE TABLE auth_sessions (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, token_hash TEXT UNIQUE NOT NULL,
    created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL, last_seen_at INTEGER NOT NULL);
  CREATE TABLE invites (id INTEGER PRIMARY KEY, token_hash TEXT UNIQUE NOT NULL, created_by INTEGER NOT NULL,
    expires_at INTEGER NOT NULL, max_uses INTEGER NOT NULL, used_count INTEGER NOT NULL DEFAULT 0,
    revoked_at INTEGER, created_at INTEGER NOT NULL);
  CREATE TABLE password_resets (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, token_hash TEXT UNIQUE NOT NULL,
    expires_at INTEGER NOT NULL, used_at INTEGER, created_by INTEGER NOT NULL);

  CREATE TABLE quiz_sessions (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, client_session_id TEXT NOT NULL,
    kind TEXT NOT NULL, subject TEXT NOT NULL, exam TEXT NOT NULL, set_path TEXT, review_batch_id INTEGER,
    content_version TEXT, started_at INTEGER NOT NULL, finished_at INTEGER NOT NULL, score INTEGER NOT NULL,
    total INTEGER NOT NULL, counted INTEGER NOT NULL, created_at INTEGER NOT NULL,
    UNIQUE (user_id, client_session_id));
  CREATE TABLE session_answers (id INTEGER PRIMARY KEY, session_id INTEGER NOT NULL, user_id INTEGER NOT NULL,
    item_id TEXT NOT NULL, seq INTEGER NOT NULL, raw_answer TEXT, correct INTEGER NOT NULL, elapsed_ms INTEGER);
  CREATE INDEX session_answers_user_item ON session_answers (user_id, item_id);
  CREATE INDEX session_answers_session ON session_answers (session_id);

  CREATE TABLE srs_cards (user_id INTEGER NOT NULL, item_id TEXT NOT NULL, subject TEXT NOT NULL, due INTEGER NOT NULL,
    stability REAL NOT NULL, difficulty REAL NOT NULL, elapsed_days REAL NOT NULL, scheduled_days REAL NOT NULL,
    reps INTEGER NOT NULL, lapses INTEGER NOT NULL, state INTEGER NOT NULL, last_review INTEGER,
    learning_steps INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (user_id, item_id));
  CREATE INDEX srs_cards_due ON srs_cards (user_id, subject, due);
  CREATE TABLE review_batches (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, subject TEXT NOT NULL, exam TEXT NOT NULL,
    item_ids TEXT NOT NULL, created_at INTEGER NOT NULL, completed_at INTEGER);

  CREATE TABLE pinned_items (user_id INTEGER NOT NULL, item_id TEXT NOT NULL, subject TEXT NOT NULL, created_at INTEGER NOT NULL,
    PRIMARY KEY (user_id, item_id));
  CREATE TABLE user_subject_prefs (user_id INTEGER NOT NULL, subject TEXT NOT NULL, hidden INTEGER NOT NULL,
    updated_at INTEGER NOT NULL, PRIMARY KEY (user_id, subject));
  CREATE TABLE analysis_resets (user_id INTEGER NOT NULL, subject TEXT NOT NULL, exam TEXT NOT NULL, reset_at INTEGER NOT NULL,
    PRIMARY KEY (user_id, subject, exam));

  CREATE TABLE item_aliases (old_id TEXT PRIMARY KEY, new_id TEXT NOT NULL, confirmed_by INTEGER, confirmed_at INTEGER NOT NULL);
  CREATE TABLE alias_candidates (id INTEGER PRIMARY KEY, old_id TEXT NOT NULL, new_id TEXT NOT NULL, similarity REAL NOT NULL,
    set_path TEXT NOT NULL, old_question TEXT NOT NULL, new_question TEXT NOT NULL, created_at INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'open', UNIQUE (old_id, new_id));

  CREATE TABLE uploads (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, status TEXT NOT NULL, created_at INTEGER NOT NULL,
    decided_at INTEGER, commit_sha TEXT);
  CREATE TABLE upload_files (id INTEGER PRIMARY KEY, upload_id INTEGER NOT NULL, original_name TEXT NOT NULL,
    raw_json TEXT NOT NULL, subject TEXT, kind TEXT, title TEXT, exam TEXT, check_result TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', reject_reason TEXT, target_path TEXT);

  CREATE TABLE reports (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, item_id TEXT NOT NULL, type TEXT NOT NULL,
    body TEXT NOT NULL, snapshot TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'open', admin_note TEXT,
    created_at INTEGER NOT NULL, resolved_at INTEGER);
  CREATE TABLE comments (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, item_id TEXT NOT NULL, body TEXT NOT NULL,
    created_at INTEGER NOT NULL, updated_at INTEGER, deleted_at INTEGER);
  CREATE INDEX comments_item ON comments (item_id);
  `,
];

export function openDb(path: string): DB {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec('PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;');
  const v = (db.prepare('PRAGMA user_version').get() as { user_version: number }).user_version;
  for (let i = v; i < MIGRATIONS.length; i++) {
    db.exec('BEGIN');
    try { db.exec(MIGRATIONS[i]); db.exec(`PRAGMA user_version = ${i + 1}`); db.exec('COMMIT'); }
    catch (e) { db.exec('ROLLBACK'); throw e; }
  }
  return db;
}

const norm = (p: unknown[]): Param[] =>
  p.map((x) => (x === undefined ? null : typeof x === 'boolean' ? (x ? 1 : 0) : (x as Param)));
export function all<T>(db: DB, sql: string, ...p: unknown[]): T[] { return db.prepare(sql).all(...norm(p)) as T[]; }
export function get<T>(db: DB, sql: string, ...p: unknown[]): T | undefined { return db.prepare(sql).get(...norm(p)) as T | undefined; }
export function run(db: DB, sql: string, ...p: unknown[]): { changes: number; id: number } {
  const r = db.prepare(sql).run(...norm(p));
  return { changes: Number(r.changes), id: Number(r.lastInsertRowid) };
}
export function tx<T>(db: DB, fn: () => T): T {
  db.exec('BEGIN');
  try { const r = fn(); db.exec('COMMIT'); return r; }
  catch (e) { db.exec('ROLLBACK'); throw e; }
}
