// 묶음 파일 만들기: node tools/build-bundle.js
// 실행기 폴더의 문제 · 연습 문항(.jsx)과 플러그인(.js)을 quiz_bundle.js 하나로 묶는다.
// quiz_launcher.html 이 <script src="quiz_bundle.js"> 로 읽으므로 file:// 로 열어도(Windows · macOS, 모든 브라우저) 자동으로 불러온다.
// 경로는 NFC 로 맞춘다(macOS 에서 만들어도 Windows 와 같은 이름). 커밋할 때 pre-commit 훅이 자동으로 실행한다.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'quiz_bundle.js');
const SKIP = new Set(['node_modules', 'tools']);

function walk(dir, rel, out) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const name = ent.name.normalize('NFC');
    if (name.startsWith('.') || SKIP.has(name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, [...rel, name], out);
    else if (/\.(jsx|js)$/i.test(name) && !(rel.length === 0 && name === 'quiz_bundle.js'))
      out.push({ p: [...rel, name].join('/'), c: fs.readFileSync(full, 'utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n') });
  }
  return out;
}

const files = walk(ROOT, [], []).filter(f => f.p.includes('/'));   // 최상위의 낱개 .js 는 제외
const hash = crypto.createHash('sha1').update(JSON.stringify(files)).digest('hex').slice(0, 12);
const prev = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
if (prev.includes('"hash":"' + hash + '"')) { console.log('quiz_bundle.js 변경 없음 (' + files.length + '개 파일)'); process.exit(0); }
const d = new Date(), z = n => String(n).padStart(2, '0');
const built = `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())} ${z(d.getHours())}:${z(d.getMinutes())}`;
const body = JSON.stringify({ hash, built, root: path.basename(ROOT).normalize('NFC'), files });
fs.writeFileSync(OUT, '// 자동 생성 파일 (tools/build-bundle.js) — 직접 고치지 말 것\nwindow.QL_BUNDLE = ' + body + ';\n');
console.log('quiz_bundle.js 생성: ' + files.length + '개 파일, ' + Math.round(body.length / 1024) + 'KB, hash ' + hash);
