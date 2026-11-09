// 골든 테스트: 레포의 모든 문제 파일을 기존 실행기 파서(quiz_launcher.html 에서 꺼냄)와 core 파서로 읽어 비교한다.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import vm from 'node:vm';
import { parseJSX } from '../src/index.ts';

const ROOT = join(import.meta.dirname, '../../..');
const html = readFileSync(join(ROOT, 'quiz_launcher.html'), 'utf8');
const s = html.indexOf('function sliceBalanced('), e0 = html.indexOf('function parseJSX('), e = html.indexOf('\n}\n', e0);
const ctx = vm.createContext({});
vm.runInContext(html.slice(s, e + 3) + '\nthis.parseJSX = parseJSX;', ctx);
const legacy = (ctx as { parseJSX: (f: string, c: string, o?: object) => Record<string, unknown> }).parseJSX;

const KINDS = ['일반문제', '모의고사', '기출', '단어집'];
function walk(dir: string, out: string[] = []) {
  for (const n of readdirSync(dir)) {
    if (n.startsWith('.') || n === 'node_modules' || n === 'packages' || n === 'apps') continue;
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, out); else if (/\.jsx?$/.test(n)) out.push(p);
  }
  return out;
}
const files = walk(ROOT).map((p) => relative(ROOT, p).normalize('NFC')).filter((r) => KINDS.includes(r.split('/')[1]));

describe('core 파서 = 기존 파서', () => {
  it('파일이 있다', () => expect(files.length).toBeGreaterThan(100));
  for (const f of files) {
    it(f, () => {
      const code = readFileSync(join(ROOT, f), 'utf8');
      const group = f.split('/')[0];
      let a: unknown, b: unknown;
      try { a = JSON.parse(JSON.stringify(legacy(f, code, { group }))); } catch (x) { a = 'ERR ' + (x as Error).message; }
      try {
        const r = parseJSX(f, code, { group }) as unknown as Record<string, unknown>;
        const { exam, uploader, ...rest } = r;
        rest.category = ''; rest.source = '';
        rest.questions = (rest.questions as Record<string, unknown>[]).map(({ type, ...q }) => q);
        b = JSON.parse(JSON.stringify(rest));
      } catch (x) { b = 'ERR ' + (x as Error).message; }
      expect(b).toEqual(a);
    });
  }
});
