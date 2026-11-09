// git 실행 + 잠금 하나(설계 3.2: webhook pull · 승인 커밋 · 수동 새로고침을 순서대로)
import { spawn } from 'node:child_process';
import { dirname, delimiter } from 'node:path';

export interface GitResult { code: number; stdout: string; stderr: string }
export interface GitIdentity { name: string; email: string }

export function git(cwd: string, args: string[], id?: GitIdentity): Promise<GitResult> {
  return new Promise((resolve) => {
    const env: NodeJS.ProcessEnv = {
      ...process.env,
      PATH: dirname(process.execPath) + delimiter + (process.env.PATH || ''), // 훅이 node 를 찾게
      GIT_TERMINAL_PROMPT: '0',
    };
    if (id) {
      env.GIT_AUTHOR_NAME = env.GIT_COMMITTER_NAME = id.name;
      env.GIT_AUTHOR_EMAIL = env.GIT_COMMITTER_EMAIL = id.email;
    }
    const p = spawn('git', ['-c', 'core.quotepath=false', ...args], { cwd, env });
    let stdout = '', stderr = '';
    p.stdout.on('data', (d) => (stdout += d));
    p.stderr.on('data', (d) => (stderr += d));
    p.on('error', (e) => resolve({ code: -1, stdout, stderr: stderr + String(e) }));
    p.on('close', (code) => resolve({ code: code ?? -1, stdout, stderr }));
  });
}

export async function hasRemote(cwd: string): Promise<boolean> {
  const r = await git(cwd, ['remote']);
  return r.code === 0 && r.stdout.split('\n').includes('origin');
}
export async function head(cwd: string): Promise<string> {
  const r = await git(cwd, ['rev-parse', 'HEAD']);
  return r.code === 0 ? r.stdout.trim() : '';
}

/** 직렬 잠금 */
export class Lock {
  private tail: Promise<unknown> = Promise.resolve();
  run<T>(fn: () => Promise<T>): Promise<T> {
    const p = this.tail.then(fn, fn);
    this.tail = p.catch(() => undefined);
    return p;
  }
}
