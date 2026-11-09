// 앱 전역 상태: DB · 설정 · 콘텐츠 · git 잠금 · 별칭 맵
import type { ContentStatus } from '@quiz/core';
import type { Config } from './config.ts';
import { all, run, type DB } from './db.ts';
import { ContentStore } from './content.ts';
import { git, hasRemote, head, Lock } from './git.ts';
import { now } from './util.ts';
import { accessSync, constants } from 'node:fs';
import { isAbsolute, join } from 'node:path';

export class AppContext {
  db: DB;
  config: Config;
  content: ContentStore;
  lock = new Lock();
  aliases = new Map<string, string>();
  lastWebhook: ContentStatus['lastWebhook'] = null;
  pullWarning: ContentStatus['pullWarning'] = null;
  deliveries: string[] = [];
  headSha = '';

  constructor(db: DB, config: Config) {
    this.db = db;
    this.config = config;
    this.content = new ContentStore(config.contentDir);
    this.loadAliases();
  }

  hookWarning: string | null = null;

  async init(): Promise<void> {
    this.headSha = await head(this.config.contentDir);
    // 승인 커밋이 pre-commit 훅(검사 · 번들)을 거치는지 확인
    const hp = (await git(this.config.contentDir, ['config', 'core.hooksPath'])).stdout.trim();
    const hook = hp ? join(isAbsolute(hp) ? hp : join(this.config.contentDir, hp), 'pre-commit') : join(this.config.contentDir, '.git/hooks/pre-commit');
    let ok = false;
    try { accessSync(hook, constants.X_OK); ok = true; } catch { /* 없음 · 실행 권한 없음 */ }
    this.hookWarning = ok ? null : `pre-commit 훅이 실행되지 않습니다(${hook} 없음 또는 실행 권한 없음). 'git config core.hooksPath tools/hooks' 와 'chmod +x tools/hooks/pre-commit' 을 확인하세요.`;
  }

  loadAliases(): void {
    this.aliases = new Map(all<{ old_id: string; new_id: string }>(this.db, 'SELECT old_id, new_id FROM item_aliases').map((r) => [r.old_id, r.new_id]));
  }
  /** 별칭을 따라간 최종 ID */
  resolve(id: string): string {
    let cur = id;
    for (let i = 0; i < 20 && this.aliases.has(cur); i++) cur = this.aliases.get(cur)!;
    return cur;
  }
  /** id 로 해소되는 모든 ID (자기 포함) */
  sourcesOf(id: string): string[] {
    const target = this.resolve(id);
    const out = [target];
    for (const k of this.aliases.keys()) if (this.resolve(k) === target) out.push(k);
    return out;
  }
  nicknames(): Map<string, string> {
    return new Map(all<{ username: string; nickname: string }>(this.db, 'SELECT username, nickname FROM users').map((r) => [r.username, r.nickname]));
  }

  /** 잠금 안에서 부를 것. 콘텐츠 다시 읽기 + 별칭 후보 저장 */
  reloadNow(): void {
    const cands = this.content.reload();
    const t = now();
    for (const c of cands) {
      if (this.aliases.has(c.oldId)) continue;
      run(this.db, `INSERT OR IGNORE INTO alias_candidates (old_id, new_id, similarity, set_path, old_question, new_question, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)`, c.oldId, c.newId, c.similarity, c.setPath, c.oldQuestion, c.newQuestion, t);
    }
  }

  /** 잠금 안에서 부를 것. 원격이 있으면 pull --ff-only 후 다시 읽기. 실패하면 이전 콘텐츠 유지 + 경고 */
  async pullAndReload(): Promise<{ ok: boolean; output: string }> {
    const dir = this.config.contentDir;
    if (await hasRemote(dir)) {
      const r = await git(dir, ['pull', '--ff-only', 'origin', this.config.contentBranch]);
      if (r.code !== 0) {
        this.pullWarning = { at: now(), output: (r.stdout + r.stderr).trim() };
        return { ok: false, output: this.pullWarning.output };
      }
    }
    this.pullWarning = null;
    this.reloadNow();
    this.headSha = await head(dir);
    return { ok: true, output: '' };
  }

  status(): ContentStatus {
    return {
      head: this.headSha, contentVersion: this.content.data.contentVersion,
      lastWebhook: this.lastWebhook, pullWarning: this.pullWarning,
      loadErrors: [...(this.hookWarning ? [{ path: 'tools/hooks/pre-commit', error: this.hookWarning }] : []), ...this.content.data.errors],
    };
  }
}
