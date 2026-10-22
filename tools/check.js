// 문항 검사: node tools/check.js [--stats] [--quiet] [--dup[=0.8]] [경로 일부...]
//  --stats: 다른 파일과 같은 문제 목록, 연습별 겹치는 정답 빈도 · --quiet: 요약 · 경고 목록 생략(오류만) · 경로 일부: 그 파일만 보고
//  --dup: 비슷한 문제 찾기. 경로를 주면 그 파일의 문제를 같은 과목의 모든 문제와, 안 주면 과목 전체를 서로 비교한다.
//         문장을 정규화(공백 · 문장부호 제거, 소문자)한 뒤 글자 2-gram 유사도(Dice)가 기준(기본 0.8) 이상이면 보고한다.
//         OX 참/거짓을 뒤집은 문장("선점형이다"↔"비선점형이다")도 같은 사실을 묻는 문제로 잡힌다. 결과는 경고(커밋을 막지 않음).
// 레포의 문제 세트 · 용어집(.jsx), 연습 문항 데이터(<과목>/연습/**/*.jsx), 플러그인(플러그인/**/*.js)을 검사한다.
//  - 문제 세트 · 용어집: 실행기(quiz_launcher.html)의 파서를 그대로 꺼내 써서 실행기와 똑같이 읽히는지, 필드 · 정답 형식이 맞는지 본다(spec 1~5장).
//  - 연습 문항: 플러그인을 불러온 뒤 registerPractice 의 validate(item) 로 문항 하나씩 검사한다(spec 9 · 12장).
//    validate 는 메시지 배열을 돌려준다. 'warn:' 으로 시작하면 경고, 나머지는 오류.
//    itemKey(item) 가 있으면 같은 문제 중복을, answerKey(item) 가 있으면 --stats 에서 정답 빈도를 보여 준다.
//  - 모든 코드는 node:vm 의 빈 컨텍스트에서 실행한다(require · process · 파일 접근 없음, 시간 제한). 완전한 보안 경계는 아니므로
//    출처가 의심스러운 파일은 먼저 눈으로 볼 것.
// 결과: 오류가 있으면 종료 코드 1. 경고만 있으면 0. pre-commit 훅이 커밋 전에 실행한다.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');
const SKIP = new Set(['node_modules', 'tools']);
const TIMEOUT = 2000;
const args = process.argv.slice(2);
const STATS = args.includes('--stats'), QUIET = args.includes('--quiet');
const dupArg = args.find(a => a === '--dup' || a.startsWith('--dup='));
const DUP = dupArg ? (+(dupArg.split('=')[1]) || 0.8) : 0;
const FILTER = args.filter(a => !a.startsWith('--')).map(a => a.normalize('NFC').replace(/\\/g, '/'));

const errors = [], warns = [];
const errors_ = (f, m) => errors.push(f + ' — ' + m), warns_ = (f, m) => warns.push(f + ' — ' + m);
const err = errors_, warn = warns_;

// ── 파일 모으기 (build-bundle.js 와 같은 규칙) ──
function walk(dir, rel, out) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const name = ent.name.normalize('NFC');
    if (name.startsWith('.') || SKIP.has(name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, [...rel, name], out);
    else if (rel.length && /\.(jsx|js)$/i.test(name)) out.push({ p: [...rel, name].join('/'), parts: [...rel, name], code: fs.readFileSync(full, 'utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n') });
  }
  return out;
}
const files = walk(ROOT, [], []).sort((a, b) => a.p.localeCompare(b.p, 'ko'));
const plugins = files.filter(f => f.parts[0] === '플러그인');
const pdatas = files.filter(f => f.parts[0] !== '플러그인' && f.parts.includes('연습'));
const quizzes = files.filter(f => f.parts[0] !== '플러그인' && !f.parts.includes('연습'));
const wanted = f => !FILTER.length || FILTER.some(x => f.p.includes(x));

// ── 샌드박스: 실행기 파서 + 플러그인 전역 ──
const ctx = vm.createContext(Object.create(null));   // 프로토타입 없는 객체: this.constructor 로 호스트 Function 에 닿지 못하게
const run = (code, file) => vm.runInContext(code, ctx, { timeout: TIMEOUT, filename: file || 'check' });
const html = fs.readFileSync(path.join(ROOT, 'quiz_launcher.html'), 'utf8');
const pStart = html.indexOf('function sliceBalanced('), pEnd = html.indexOf('function parseJSX(');
const pEnd2 = pEnd >= 0 ? html.indexOf('\n}\n', pEnd) : -1;
if (pStart < 0 || pEnd2 < 0) { console.error('실행기 파서(sliceBalanced ~ parseJSX)를 quiz_launcher.html 에서 찾지 못했습니다. tools/check.js 를 실행기 구조에 맞게 고치세요.'); process.exit(2); }
run(html.slice(pStart, pEnd2 + 3), 'quiz_launcher.html(파서)');
// 플러그인이 쓰는 실행기 전역의 최소 대역. DOM 은 아무것도 하지 않는 Proxy.
run(`
  var __mods = [], __loading = null;
  function registerPractice(m) { m.file = __loading; var i = __mods.findIndex(function (x) { return x.id === m.id; }); if (i >= 0) __mods[i] = m; else __mods.push(m); }
  var __noop = new Proxy(function () {}, { get: function (t, k) { return k === Symbol.toPrimitive ? function () { return ''; } : __noop; }, apply: function () { return __noop; }, construct: function () { return __noop; } });
  var document = __noop, window = this, localStorage = __noop, navigator = __noop, location = __noop;
  var console = { log: function () {}, warn: function () {}, error: function () {} };
  function setTimeout() { return 0; } function setInterval() { return 0; } function clearTimeout() {} function clearInterval() {}
  function addEventListener() {}
  function escHtml(s) { return s == null ? '' : String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function prRand(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  var currentSubject = null, currentPractice = null, SCHED_COLORS = [];
  var __pdata = {};
  function practiceItems(id) { return (__pdata[id] || []).reduce(function (a, p) { return a.concat(p.ITEMS); }, []); }
  function practiceCats(id) { var c = []; (__pdata[id] || []).forEach(function (p) { p.CATS.forEach(function (x) { if (!c.some(function (y) { return y.id === x.id; })) c.push(x); }); }); return c; }
  function practiceEmpty() { return ''; }
`, 'stub');
// 실행기의 다른 전역(pr* 유틸 등)을 플러그인이 최상위에서 바로 부르면 여기에 대역을 추가한다.

// 컨텍스트에는 문자열만 넘긴다(호스트 객체를 넘기면 그걸 통해 샌드박스 밖으로 나갈 수 있음).

// ── 1. 플러그인 ──
for (const f of plugins) {
  ctx.__f = f.p;
  try { run('__loading = __f;'); run(f.code, f.p); }
  catch (e) { err(f.p, '플러그인 실행 오류: ' + e.message); }
  if (!/\bregisterPractice\s*\(/.test(f.code)) err(f.p, 'registerPractice 호출이 없습니다');
}
run('__loading = null;');
const mods = run('__mods');
const modOf = id => mods.find(m => m.id === id);

// ── 2. 연습 문항 데이터 ──
const byPractice = {};
for (const f of pdatas) {
  let r;
  try {
    r = run(`(function () { ${f.code}\n;var r = { META: typeof META === 'undefined' ? null : META, ITEMS: typeof ITEMS === 'undefined' ? null : ITEMS, CATS: typeof CATS === 'undefined' ? [] : CATS };
      if (r.META && r.META.practice && Array.isArray(r.ITEMS)) (__pdata[r.META.practice] = __pdata[r.META.practice] || []).push({ ITEMS: r.ITEMS, CATS: Array.isArray(r.CATS) ? r.CATS : [] });
      return r; })()`, f.p);
  } catch (e) { err(f.p, '평가 오류: ' + e.message); continue; }
  if (!r.META || !r.META.practice) { err(f.p, "META.practice 가 없습니다 (연습/ 아래 파일은 const META = { practice: '<연습 id>' } 필수)"); continue; }
  if (!Array.isArray(r.ITEMS)) { err(f.p, 'ITEMS 배열이 없습니다'); continue; }
  if (!Array.isArray(r.CATS)) { err(f.p, 'CATS 가 배열이 아닙니다'); r.CATS = []; }
  (byPractice[r.META.practice] = byPractice[r.META.practice] || []).push({ f, ...r });
}

const pStats = [];
for (const [id, list] of Object.entries(byPractice)) {
  const m = modOf(id);
  if (!m) { list.forEach(x => err(x.f.p, `META.practice '${id}' 를 등록한 플러그인이 없습니다`)); continue; }
  const cats = new Set(list.flatMap(x => x.CATS.map(c => c.id)));
  const keys = new Map(), answers = new Map();
  let n = 0;
  for (const x of list) {
    const show = wanted(x.f);   // 경로를 지정하면 그 파일만 보고하되, 중복 비교는 전체와 한다
    const err = show ? errors_ : () => {}, warn = show ? warns_ : () => {};
    x.ITEMS.forEach((it, i) => {
      const at = `${x.f.p}:${i + 1}`;
      if (show) n++;
      if (!it || typeof it !== 'object') { err(at, '문항이 객체가 아닙니다'); return; }
      if (it.cat == null) err(at, 'cat 이 없습니다');
      else if (cats.size && !cats.has(it.cat)) warn(at, `cat '${it.cat}' 이 CATS 에 없습니다`);
      if (typeof m.validate === 'function') {
        let msgs;
        ctx.__it = it; ctx.__id = id;
        try { msgs = run('(function (m) { return m.validate(__it) || []; })(__mods.find(function (x) { return x.id === __id; }))') || []; }
        catch (e) { msgs = ['validate 실행 오류: ' + e.message]; }
        for (const s of msgs) (String(s).startsWith('warn:') ? warn : err)(at, String(s).replace(/^warn:\s*/, ''));
      }
      // 문항 함수는 호스트에서 직접 부르지 않고 컨텍스트 안에서 부른다(시간 제한 · caller 로 호스트 접근 차단)
      ctx.__it = it; ctx.__id = id;
      const call = fn => run(`(function (m) { return typeof m.${fn} === 'function' ? String(m.${fn}(__it) == null ? '' : m.${fn}(__it)) : null; })(__mods.find(function (x) { return x.id === __id; }))`);
      if (typeof m.itemKey === 'function') {
        const k = String(call('itemKey') || '').replace(/\s+/g, ' ').trim();
        if (k) { if (keys.has(k)) warn(at, `같은 문제가 ${keys.get(k)} 에 있습니다`); else keys.set(k, at); }
      }
      if (show && typeof m.answerKey === 'function') { const a = call('answerKey'); answers.set(a, (answers.get(a) || 0) + 1); }
    });
  }
  if (typeof m.validate !== 'function') warn('플러그인 ' + id, 'validate 가 없어 문항 형식은 검사하지 않았습니다');
  if (n) pStats.push({ id, title: m.title, files: list.length, n, answers });
}

// ── 3. 문제 세트 · 용어집 ──
const qStats = {};
const qKeys = new Map(), crossDup = [], allQ = [];
for (const f of quizzes) {
  const show = wanted(f);   // 경로를 지정하면 그 파일만 보고하되, 중복 비교에는 전체를 쓴다
  const err = show ? errors_ : () => {}, warn = show ? warns_ : () => {};
  const subj = f.parts[0];
  // 실행기는 평가에 실패한 배열을 조용히 건너뛰므로 여기서 따로 잡는다
  ctx.__code = f.code;
  const bad = run(`(function () { var out = [], re = /(?:^|\\n)[ \\t]*(?:export\\s+)?(?:const|let|var)\\s+([A-Za-z_$][\\w$]*)\\s*=\\s*\\[/g, m;
    while ((m = re.exec(__code))) { var raw = sliceBalanced(__code, m.index + m[0].length - 1, '[', ']'); if (!raw || !Array.isArray(evalLiteral(raw))) out.push(m[1]); }
    return out; })()`);
  bad.forEach(name => err(f.p, `배열 ${name} 을(를) 읽지 못했습니다 (괄호 · 따옴표 · 쉼표, 또는 금지 문법: 변수 참조 · 함수 호출 · \${} · ...)`));
  if (/^\s*(import|export\s+default)\b/m.test(f.code)) err(f.p, 'import / export default 는 쓸 수 없습니다 (spec 1장)');
  let r;
  ctx.__fn = f.p; ctx.__subj = subj;
  try { r = run('parseJSX(__fn, __code, { group: __subj })', f.p); }
  catch (e) { err(f.p, e.message); continue; }
  const s = show ? (qStats[subj] = qStats[subj] || { files: 0, ox: 0, choice: 0, short: 0, terms: 0, cross: 0 }) : { files: 0, ox: 0, choice: 0, short: 0, terms: 0, cross: 0 };
  s.files++; s.terms += r.terms.length;
  r.questions.forEach((q, i) => {
    const at = `${f.p}:${i + 1}`;
    const t = q.answer === true || q.answer === false ? 'ox' : (Array.isArray(q.choices) && q.choices.length ? 'choice' : 'short');
    s[t]++;
    if (typeof q.question !== 'string' || !q.question.trim()) err(at, 'question 이 비어 있습니다');
    if (!q.explanation) warn(at, 'explanation 이 없습니다');
    if (t === 'choice') {
      if (q.answerIndex < 0 || q.answerIndex >= q.choices.length) err(at, `answer(${JSON.stringify(q.answer)}) 가 보기 범위를 벗어났거나 보기 문구와 일치하지 않습니다`);
      if (q.choices.length < 2) err(at, '보기가 2개 미만입니다');
      if (q.choices.some(c => typeof c !== 'string' || !c.trim())) err(at, '빈 보기 또는 문자열이 아닌 보기가 있습니다');
      const norm = q.choices.map(c => String(c).trim().toLowerCase());
      if (new Set(norm).size !== norm.length) err(at, '같은 보기가 두 번 있습니다');
      if (q.choices.some(c => /^\s*([①-⑩]|\d+[.)]|[a-eA-E][.)]|[가-마][.)])\s/.test(c))) warn(at, '보기 앞에 번호를 직접 붙였습니다 (실행기가 붙임)');
    }
    if (t === 'short') {
      if (q.answer === 'true' || q.answer === 'false') err(at, 'answer 가 문자열 "true"/"false" 입니다. OX면 따옴표 없이 true/false (spec 4장)');
      if (!q.answers.length || q.answers.some(a => typeof a !== 'string' || !a.trim())) err(at, '단답형 answers 가 비었거나 빈 문자열이 있습니다');
    }
    // 같은 파일 안 중복 = 경고, 다른 파일과 중복(일반문제 ↔ 모의고사 재사용 등) = --stats 에서만
    allQ.push({ subj, file: f.p, at, show, text: String(q.question) });
    const k = subj + '|' + String(q.question).replace(/\s+/g, ' ').trim();
    const prev = qKeys.get(k);
    if (!prev) qKeys.set(k, at);
    else if (prev.startsWith(f.p + ':')) warn(at, `같은 파일 ${prev.slice(f.p.length + 1)}번과 같은 문제입니다`);
    else if (show) { s.cross++; if (STATS) crossDup.push(`${at} = ${prev}`); }
  });
  r.terms.forEach((t, i) => {
    const at = `${f.p}:용어 ${i + 1}`;
    if (!t.terms.length || t.terms.some(x => typeof x !== 'string' || !x.trim())) err(at, 'terms 가 비었거나 빈 문자열이 있습니다');
    else if (t.terms.some(x => x.replace(/[\s.,\-_]/g, '').length < 2)) warn(at, '한 글자 표기는 검색 오탐을 부릅니다 (spec 5장)');
    if (!t.desc) warn(at, 'desc 가 없습니다 (단어 암기 테스트에서 빠짐)');
  });
  if (r.questions.length) {
    const ox = r.questions.filter(q => typeof q.answer === 'boolean');
    if (ox.length >= 10) { const tr = ox.filter(q => q.answer).length / ox.length; if (tr < 0.3 || tr > 0.7) warn(f.p, `OX 정답이 한쪽으로 치우쳤습니다 (O ${Math.round(tr * 100)}%)`); }
  }
}

// ── 비슷한 문제 (--dup) ──
const dupLines = [];
if (DUP) {
  const gram = t => { const n = t.toLowerCase().replace(/[\s.,!?·:;"'`()\[\]{}<>~\-_/]+/g, ''), g = new Set(); for (let i = 0; i < n.length - 1; i++) g.add(n.slice(i, i + 2)); if (n.length === 1) g.add(n); return g; };
  // 짧은 문장은 전체와 끝부분(실제 질문)이 모두 비슷해야 중복. 숫자 · 긴 지문 예외는 아래.
  allQ.forEach(q => { q.g = gram(q.text); q.nums = (q.text.match(/\d+/g) || []).join(','); q.tg = gram(q.text.slice(-40)); });
  const dice = (A, B) => { let c = 0; for (const x of A) if (B.has(x)) c++; return A.size + B.size ? 2 * c / (A.size + B.size) : 0; };
  const bySubj = {};
  allQ.forEach(q => (bySubj[q.subj] = bySubj[q.subj] || []).push(q));
  const all = !FILTER.length;
  for (const list of Object.values(bySubj)) {
    list.forEach((a, i) => {
      if (!a.show || !a.g.size) return;
      const hits = [];
      list.forEach((b, j) => {
        if (i === j || (all && j < i) || (!all && b.show && j < i)) return;   // 같은 쌍은 한 번만
        let d;
        if (a.nums && b.nums && a.nums !== b.nums) return;            // 숫자만 바꾼 계산 문제 = 다른 문제
        if (a.text.length > 60 && b.text.length > 60) {
          // 긴 지문(같은 표 · 그림)에 다른 질문: 공통 앞 · 뒤를 떼고 남은 가운데(예: 알고리즘 이름, 빈칸 번호)가 다르면 다른 문제
          let p = 0; while (p < a.text.length && a.text[p] === b.text[p]) p++;
          let e = 0; while (e < a.text.length - p && e < b.text.length - p && a.text[a.text.length - 1 - e] === b.text[b.text.length - 1 - e]) e++;
          const ma = a.text.slice(p, a.text.length - e), mb = b.text.slice(p, b.text.length - e);
          if ((ma || mb) && dice(gram(ma + '  '), gram(mb + '  ')) < 0.8) return;
          d = dice(a.g, b.g);
          if (d < Math.max(DUP, 0.9)) return;   // 긴 지문은 공통 부분이 많아 기준을 올린다
        } else d = Math.min(dice(a.g, b.g), dice(a.tg, b.tg));
        if (d >= DUP) hits.push([d, b]);
      });
      hits.sort((x, y) => y[0] - x[0]).slice(0, 3).forEach(([d, b]) =>
        dupLines.push(`${a.at} ≈ ${b.at} (${Math.round(d * 100)}%)\n      ${a.text.replace(/\s+/g, ' ').slice(0, 80)}\n      ${b.text.replace(/\s+/g, ' ').slice(0, 80)}`));
    });
  }
}

// ── 출력 ──
if (!QUIET) {
  console.log('■ 문제 세트 · 용어집');
  for (const [k, s] of Object.entries(qStats)) console.log(`  ${k}: 파일 ${s.files} · OX ${s.ox} · 객관식 ${s.choice} · 단답형 ${s.short}${s.terms ? ' · 용어 ' + s.terms : ''}${s.cross ? ` · 다른 파일과 같은 문제 ${s.cross}${STATS ? '' : ' (--stats 로 목록)'}` : ''}`);
  if (STATS && crossDup.length) { console.log('  다른 파일과 같은 문제:'); crossDup.forEach(x => console.log('    ' + x)); }
  console.log('■ 연습 문항');
  for (const p of pStats) {
    console.log(`  ${p.id} (${p.title}): 파일 ${p.files} · 문항 ${p.n}${p.answers.size ? ' · 서로 다른 정답 ' + p.answers.size : ''}`);
    if (STATS && p.answers.size) {
      const rep = [...p.answers].filter(([, c]) => c > 1).sort((a, b) => b[1] - a[1]);
      if (rep.length) console.log('    겹치는 정답: ' + rep.map(([a, c]) => `${a}×${c}`).join(', '));
    }
  }
  console.log(`■ 플러그인 ${plugins.length}개 · 등록된 연습 ${mods.length}개`);
}
if (DUP) { console.log(`\n🔁 비슷한 문제 ${dupLines.length} (유사도 ${Math.round(DUP * 100)}% 이상)`); dupLines.forEach(x => console.log('  ' + x)); }
if (warns.length && !QUIET) { console.log(`\n⚠️ 경고 ${warns.length}`); warns.forEach(w => console.log('  ' + w)); }
if (errors.length) { console.log(`\n❌ 오류 ${errors.length}`); errors.forEach(e => console.log('  ' + e)); }
console.log(errors.length ? `\n검사 실패: 오류 ${errors.length} · 경고 ${warns.length}` : `\n검사 통과${warns.length ? ` (경고 ${warns.length})` : ''}`);
process.exit(errors.length ? 1 : 0);
