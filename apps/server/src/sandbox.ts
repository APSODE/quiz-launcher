// 개발 · 테스트용 콘텐츠 샌드박스: 레포 작업 트리를 복사해 bare 원격 + 작업 사본을 만든다.
// 사용자의 실제 레포는 건드리지 않는다.
import { chmodSync, cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { git } from './git.ts';

const EXCLUDE_TOP = new Set(['.git', 'node_modules', 'apps', 'packages', 'docs']);

export async function createSandbox(baseDir: string, sourceRoot: string, branch = 'main'): Promise<{ remote: string; content: string }> {
  const base = resolve(baseDir);
  const remote = join(base, 'remote.git');
  const content = join(base, 'content');
  for (const p of [remote, content]) if (existsSync(p)) rmSync(p, { recursive: true, force: true });
  mkdirSync(content, { recursive: true });
  // 최상위 항목별로 복사(대상이 원본 안(apps/server/.data)에 있어도 되도록)
  for (const name of readdirSync(sourceRoot)) {
    if (EXCLUDE_TOP.has(name)) continue;
    cpSync(join(sourceRoot, name), join(content, name), {
      recursive: true,
      filter: (src) => !relative(sourceRoot, src).split(/[\\/]/).includes('node_modules'),
    });
  }
  // 레포에 pre-commit 이 100644 로 들어 있어 그대로면 git 이 훅을 건너뛴다 → 샌드박스 사본에만 실행 권한
  const hook = join(content, 'tools/hooks/pre-commit');
  if (existsSync(hook)) chmodSync(hook, 0o755);
  const id = { name: 'sandbox', email: 'sandbox@localhost' };
  const must = async (cwd: string, args: string[]) => {
    const r = await git(cwd, args, id);
    if (r.code !== 0) throw new Error(`git ${args.join(' ')} 실패: ${r.stderr}`);
  };
  await must(base, ['init', '-q', '--bare', '-b', branch, remote]);
  await must(content, ['init', '-q', '-b', branch]);
  await must(content, ['add', '-A']);
  await must(content, ['commit', '-q', '--no-verify', '-m', '샌드박스 초기 콘텐츠']);
  await must(content, ['remote', 'add', 'origin', remote]);
  await must(content, ['push', '-q', '-u', 'origin', branch]);
  await must(content, ['config', 'core.hooksPath', 'tools/hooks']);
  return { remote, content };
}
