// 한 번 쓰는 이전 스크립트(설계 3.4): 문제 세트 · 용어집 파일 META 에 exam 을 넣는다. 이미 있으면 건너뛴다.
// 사용: node tools/add-exam.mjs [중간고사|기말고사]
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
const EXAM = process.argv[2] || '중간고사';
const ROOT = join(import.meta.dirname, '..');
const KINDS = ['일반문제', '모의고사', '기출', '단어집'];
const walk = (d, o = []) => { for (const n of readdirSync(d)) { if (n.startsWith('.') || ['node_modules', 'packages', 'apps', '플러그인'].includes(n)) continue; const p = join(d, n); statSync(p).isDirectory() ? walk(p, o) : /\.jsx?$/.test(n) && o.push(p); } return o; };
let changed = 0, skipped = 0;
for (const p of walk(ROOT)) {
  const rel = relative(ROOT, p).normalize('NFC');
  if (!KINDS.includes(rel.split('/')[1])) continue;
  let code = readFileSync(p, 'utf8');
  const m = /(^|\n)([ \t]*(?:export\s+)?(?:const|let|var)\s+META\s*=\s*\{)/.exec(code);
  if (m) {
    const at = m.index + m[0].length;
    const head = code.slice(at, at + 400);
    if (/\bexam\s*:/.test(head.slice(0, head.indexOf('}') + 1 || 400))) { skipped++; continue; }
    code = code.slice(0, at) + ` exam: "${EXAM}",` + code.slice(at);
  } else {
    code = `const META = { exam: "${EXAM}" };\n` + code;
  }
  writeFileSync(p, code); changed++;
}
console.log(`exam: "${EXAM}" 추가 ${changed}개, 이미 있음 ${skipped}개`);
