// 1_기능구현퀴즈.js — quiz_launcher 플러그인: HTML · CSS 기능 구현 퀴즈
// 실행기가 일반 <script>로 실행한다. 실행기 공통 함수(escHtml, pr* 유틸, SCHED_COLORS, registerPractice 등)를 전역으로 쓴다.

// ════════════════════════════════════════════════════════
//  6. 웹프로그래밍 기능 구현 퀴즈 (HTML · CSS)
//  "이 기능을 만들려면 어떤 태그 · 속성 · 값을 써야 하나?" — 빈칸을 채우면 내 결과 화면이 바로 바뀐다.
//  ※ 출제 범위: 수업자료 02~07장(JS 제외)에 나온 태그 · 속성 · 값만 사용한다. 문제를 추가할 때도 src에 출처를 적을 것.
//
//  문항 데이터 = 웹프로그래밍/연습/기능구현퀴즈/*.jsx (META.practice: 'webquiz', CATS: 분류, ITEMS: 문제 배열)
//  문제 하나 = ITEMS 배열의 객체 하나 (데이터 파일 안에서 WQ_BOX · WQ_IMG 상수를 써도 된다)
//   { cat, src, title, goal, html, css, blanks, hint, explain, hover?, widths?, choices? }
//   - html / css 안의 [[n]] 이 n번째 빈칸. 같은 번호를 여러 번 쓰면 첫 위치에만 입력칸이 생기고 나머지는 따라 바뀐다.
//   - blanks[n] = 정답 문자열 배열 (첫 번째가 대표 정답) 또는 { ans: [...], check: v => bool }
//     비교할 때 대소문자 · 공백 · 끝의 세미콜론 · 바깥 따옴표는 무시한다.
//   - choices: 빈칸 대신 고르기. [[0]] 자리에 들어갈 코드 후보 배열, ok 가 정답 (blanks 불필요)
//   - widths: 미리보기를 여러 너비로 보여 줌 (미디어 쿼리) · hover: 마우스를 올려 보라는 안내 표시
//   - 코드 속 'img/main.jpg' 는 미리보기에서 내장 그림으로 바뀐다.
// ════════════════════════════════════════════════════════
const WQ_IMG = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260"><rect width="400" height="260" fill="#bae6fd"/>' +
  '<circle cx="320" cy="60" r="34" fill="#fde047"/><path d="M0 260 L120 110 L210 220 L280 140 L400 260 Z" fill="#16a34a"/>' +
  '<path d="M0 260 L90 170 L170 260 Z" fill="#15803d"/><text x="16" y="34" font-size="22" font-family="sans-serif" fill="#0f172a">main.jpg</text></svg>');

let WQ_CATS = [];    // 분류도 데이터 파일의 CATS 에서 받는다

const WQ_BOX = 'border: 2px solid #475569; padding: 8px; margin: 4px; background: #e0e7ff;';

let WQ_TASKS = [];   // 문항은 웹프로그래밍/연습/기능구현퀴즈/*.jsx (마운트할 때 practiceItems('webquiz')로 채움)

// ── 채점 · 미리보기 (순수 함수) ──
function wqNorm(v) {
  return String(v).trim().toLowerCase().replace(/\s+/g, '').replace(/;+$/, '').replace(/'/g, '"').replace(/^"(.*)"$/, '$1');
}
function wqBlank(b) { return Array.isArray(b) ? { ans: b } : b; }
function wqIsRight(b, v) {
  b = wqBlank(b);
  const n = wqNorm(v);
  return n !== '' && (b.ans.some(a => wqNorm(a) === n) || (b.check ? b.check(n) : false));
}
function wqFill(src, vals) { return (src || '').replace(/\[\[(\d+)\]\]/g, (_, i) => (vals[+i] === undefined ? '' : vals[+i])); }
function wqDoc(task, vals) {
  const css = wqFill(task.css, vals).split('img/main.jpg').join(WQ_IMG);
  const html = wqFill(task.html, vals).split('img/main.jpg').join(WQ_IMG);
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:'Malgun Gothic',sans-serif;font-size:14px;margin:10px;color:#1e293b}</style><style>${css}</style></head><body>${html}</body></html>`;
}
function wqAnswerVals(task) {
  if (task.choices) return [task.choices.find(c => c.ok).code];
  return task.blanks.map(b => wqBlank(b).ans[0]);
}

// ── 화면 ──
let WQ = null;

function wqMount(root) {
  WQ_TASKS = practiceItems('webquiz');
  WQ_CATS = practiceCats('webquiz', WQ_TASKS);
  if (!WQ_TASKS.length) { root.innerHTML = practiceEmpty('webquiz'); return; }
  WQ = { cats: new Set(WQ_CATS.map(c => c.id)), shuffle: false, list: [], idx: 0, vals: [], pick: -1, checked: false, revealed: false, hint: false, solved: new Set(), tried: new Set() };
  root.innerHTML = `
    <div class="pr-card">
      <h3 class="pr-h">⚙️ 출제 범위</h3>
      <div class="pr-seg" id="wq-cats"></div>
      <div class="pr-row" style="margin-top:10px;margin-bottom:0">
        <label class="pr-chk"><input type="checkbox" id="wq-shuffle" onchange="WQ.shuffle = this.checked; wqBuild()"> 무작위 순서</label>
        <span class="pr-sub" id="wq-stat"></span>
      </div>
      <div class="pr-sub" style="margin-top:6px">요구사항을 읽고 빈칸에 태그 · 속성 · 값을 채우세요. 입력하는 대로 <b>내 결과</b>가 바로 바뀝니다. 대소문자 · 공백 · 끝의 세미콜론은 채점에서 무시합니다.<br>
        모든 문제는 수업자료(02~07장, JS 제외)에 나온 태그 · 속성 · 값만 사용합니다. 문제마다 출처 슬라이드가 표시됩니다.</div>
    </div>
    <div id="wq-main"></div>`;
  wqRenderCats();
  wqBuild();
}

function wqRenderCats() {
  document.getElementById('wq-cats').innerHTML = WQ_CATS.map(c => {
    const n = WQ_TASKS.filter(t => t.cat === c.id).length;
    return `<button class="${WQ.cats.has(c.id) ? 'active' : ''}" onclick="wqToggleCat('${c.id}')">${c.name} <small style="font-weight:500">${n}</small></button>`;
  }).join('');
}
function wqToggleCat(id) {
  if (WQ.cats.has(id)) { if (WQ.cats.size > 1) WQ.cats.delete(id); } else WQ.cats.add(id);
  wqRenderCats(); wqBuild();
}

function wqBuild() {
  const list = WQ_TASKS.map((t, i) => i).filter(i => WQ.cats.has(WQ_TASKS[i].cat));
  if (WQ.shuffle) for (let i = list.length - 1; i > 0; i--) { const j = prRand(0, i); [list[i], list[j]] = [list[j], list[i]]; }
  WQ.list = list; WQ.idx = 0;
  wqLoad();
}

function wqLoad() {
  const t = wqTask();
  WQ.vals = t.choices ? [''] : t.blanks.map(() => '');
  WQ.pick = -1; WQ.checked = false; WQ.revealed = false; WQ.hint = false;
  wqRender();
}
function wqTask() { return WQ_TASKS[WQ.list[WQ.idx]]; }
function wqGo(d) { WQ.idx = (WQ.idx + d + WQ.list.length) % WQ.list.length; wqLoad(); window.scrollTo(0, 0); }

function wqEsc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

// 코드 표시: [[n]] 첫 등장 = 입력칸, 이후 등장 = 따라 바뀌는 글자
function wqCodeHtml(src, task, seen) {
  return src.split(/(\[\[\d+\]\])/).map(part => {
    const m = part.match(/^\[\[(\d+)\]\]$/);
    if (!m) return wqEsc(part);
    const i = +m[1];
    if (task.choices) return `<span class="wq-slot">${WQ.pick >= 0 ? wqEsc(task.choices[WQ.pick].code) : '❓ 아래에서 고르세요'}</span>`;
    const width = Math.max(4, ...wqBlank(task.blanks[i]).ans.map(a => a.length)) + 1;
    if (seen.has(i)) return `<span class="wq-mirror" data-i="${i}">${wqEsc(WQ.vals[i]) || '＿'}</span>`;
    seen.add(i);
    return `<input class="wq-blank" id="wq-b${i}" data-i="${i}" size="${width}" value="${wqEsc(WQ.vals[i])}" oninput="wqInput(${i}, this.value)" autocomplete="off" spellcheck="false">`;
  }).join('');
}

function wqFrame(id, w) {
  return `<iframe class="wq-frame" id="${id}" sandbox="" style="${w ? `width:${w}px;` : ''}"></iframe>`;
}

function wqRender() {
  const t = wqTask(), cat = WQ_CATS.find(c => c.id === t.cat), seen = new Set();
  const ws = t.widths || [null];
  const frames = pre => ws.map((w, k) => `<div>${w ? `<div class="pr-sub">너비 ${w}px</div>` : ''}${wqFrame(pre + k, w)}</div>`).join('');
  const done = WQ.solved.size;
  document.getElementById('wq-stat').textContent = `맞힌 문제 ${done} · 시도한 문제 ${WQ.tried.size} / 전체 ${WQ_TASKS.length}`;
  document.getElementById('wq-main').innerHTML = `
    <div class="pr-card">
      <h3 class="pr-h">${WQ.solved.has(WQ.list[WQ.idx]) ? '✅' : '📌'} ${WQ.idx + 1} / ${WQ.list.length} · ${wqEsc(t.title)}
        <span class="pr-chip">${cat.name}</span><span class="pr-chip" style="background:#f1f5f9;color:#475569">출처 ${wqEsc(t.src)}</span></h3>
      <div style="font-size:14px;line-height:1.7;margin-bottom:10px">${wqEsc(t.goal)}${t.hover ? '<br><small style="color:#4f46e5">🖱️ 미리보기에 마우스를 올려 확인하세요.</small>' : ''}</div>
      <div class="wq-previews">
        <div><b class="wq-lbl">🎯 목표 결과</b><div class="wq-frames">${frames('wq-target')}</div></div>
        <div><b class="wq-lbl">🧪 내 결과</b><div class="wq-frames">${frames('wq-mine')}</div></div>
      </div>
      ${t.html ? `<b class="wq-lbl">HTML</b><pre class="wq-code">${wqCodeHtml(t.html, t, seen)}</pre>` : ''}
      ${t.css ? `<b class="wq-lbl">CSS</b><pre class="wq-code">${wqCodeHtml(t.css, t, seen)}</pre>` : ''}
      ${t.choices ? `<b class="wq-lbl">❓ 자리에 들어갈 코드</b><div class="wq-choices">${t.choices.map((c, k) =>
        `<button class="wq-choice${WQ.pick === k ? ' sel' : ''}${WQ.checked || WQ.revealed ? (c.ok ? ' ok' : WQ.pick === k ? ' ng' : '') : ''}" onclick="wqPick(${k})"><pre>${wqEsc(c.code)}</pre></button>`).join('')}</div>` : ''}
      ${WQ.hint ? `<div class="st-msg info">💡 ${wqEsc(t.hint)}</div>` : ''}
      <div id="wq-feedback"></div>
      <div class="pr-actions">
        <button class="pr-btn indigo" onclick="wqCheck()">✅ 채점하기</button>
        <button class="pr-btn ghost" onclick="WQ.hint = true; wqRender()">💡 힌트</button>
        <button class="pr-btn ghost" onclick="wqReveal()">👀 정답 보기</button>
        <button class="pr-btn ghost" onclick="wqGo(-1)">← 이전</button>
        <button class="pr-btn" onclick="wqGo(1)">다음 문제 →</button>
      </div>
      <div id="wq-answer"></div>
    </div>`;
  const tv = wqAnswerVals(t);
  ws.forEach((_, k) => { document.getElementById('wq-target' + k).srcdoc = wqDoc(t, tv); });
  wqUpdateMine();
  if (WQ.checked) wqCheck(true);
  if (WQ.revealed) wqShowAnswer();
}

function wqMineVals() {
  const t = wqTask();
  return t.choices ? [WQ.pick >= 0 ? t.choices[WQ.pick].code : ''] : WQ.vals;
}
function wqUpdateMine() {
  const t = wqTask(), doc = wqDoc(t, wqMineVals());
  (t.widths || [null]).forEach((_, k) => { document.getElementById('wq-mine' + k).srcdoc = doc; });
}

function wqInput(i, v) {
  WQ.vals[i] = v;
  document.querySelectorAll(`.wq-mirror[data-i="${i}"]`).forEach(el => { el.textContent = v || '＿'; });
  const el = document.getElementById('wq-b' + i);
  if (el) el.classList.remove('ok', 'ng');
  wqUpdateMine();
}

function wqPick(k) { if (WQ.revealed) return; WQ.pick = k; WQ.checked = false; wqRender(); }

function wqCheck(silent) {
  const t = wqTask(), key = WQ.list[WQ.idx];
  let ok, detail;
  if (t.choices) {
    if (WQ.pick < 0) { document.getElementById('wq-feedback').innerHTML = '<div class="pr-result bad">먼저 코드를 하나 고르세요.</div>'; return; }
    ok = !!t.choices[WQ.pick].ok; detail = '';
  } else {
    const res = t.blanks.map((b, i) => wqIsRight(b, WQ.vals[i]));
    res.forEach((r, i) => { const el = document.getElementById('wq-b' + i); if (el) { el.classList.remove('ok', 'ng'); el.classList.add(r ? 'ok' : 'ng'); } });
    ok = res.every(Boolean); detail = ` 빈칸 ${res.filter(Boolean).length} / ${res.length}`;
  }
  if (!silent) { WQ.tried.add(key); if (ok && !WQ.revealed) WQ.solved.add(key); }
  WQ.checked = true;
  if (!silent && t.choices) return wqRender();
  document.getElementById('wq-feedback').innerHTML = `<div class="pr-result ${ok ? 'good' : 'bad'}"><b>${ok ? '🎉 정답입니다!' : '아직 아니에요'}</b>${detail}
    ${ok ? `<br>${wqEsc(t.explain)}` : '<br>목표 결과와 내 결과를 비교해 보세요. 막히면 💡 힌트를 보세요.'}</div>`;
  document.getElementById('wq-stat').textContent = `맞힌 문제 ${WQ.solved.size} · 시도한 문제 ${WQ.tried.size} / 전체 ${WQ_TASKS.length}`;
}

function wqReveal() {
  const t = wqTask();
  WQ.revealed = true; WQ.tried.add(WQ.list[WQ.idx]);
  if (t.choices) WQ.pick = t.choices.findIndex(c => c.ok);
  else WQ.vals = wqAnswerVals(t).slice();
  WQ.checked = false;
  wqRender();
}

function wqShowAnswer() {
  const t = wqTask();
  const alts = t.choices ? '' : t.blanks.map((b, i) => {
    const B = wqBlank(b);
    return `빈칸 ${i + 1}: <code>${wqEsc(B.ans[0])}</code>${B.ans.length > 1 ? ` <small>(${B.ans.slice(1).map(wqEsc).join(', ')} 도 정답)</small>` : ''}`;
  }).join('<br>');
  document.getElementById('wq-answer').innerHTML = `<div class="pr-answer"><b>정답</b><br>${alts || '초록색 테두리 코드'}<br><br><b>해설</b><br>${wqEsc(t.explain)}
    <div class="pr-sub" style="margin-top:6px">출처: ${wqEsc(t.src)}</div></div>`;
}

// ── 문항 검사 (tools/check.js 가 부른다. 'warn:' = 경고, 나머지 = 오류) ──
function wqValidate(t) {
  const e = [];
  ['src', 'title', 'goal', 'explain'].forEach(k => { if (!t[k]) e.push(k + ' 이 없습니다'); });
  if (!t.html && !t.css) e.push('html / css 가 모두 없습니다');
  const used = new Set([...((t.html || '') + (t.css || '')).matchAll(/\[\[(\d+)\]\]/g)].map(m => +m[1]));
  if (t.choices) {
    if (!Array.isArray(t.choices) || t.choices.length < 2) e.push('choices 가 2개 미만입니다');
    else {
      if (t.choices.filter(c => c.ok).length !== 1) e.push('choices 중 ok 가 정확히 1개여야 합니다');
      const codes = t.choices.map(c => wqNorm(c.code));
      if (new Set(codes).size !== codes.length) e.push('같은 코드의 보기가 있습니다');
    }
    if (used.size !== 1 || !used.has(0)) e.push('choices 문항은 [[0]] 자리 하나만 써야 합니다');
  } else {
    if (!Array.isArray(t.blanks) || !t.blanks.length) return e.concat('blanks 가 없습니다');
    const n = t.blanks.length;
    if (used.size !== n || [...used].some(i => i >= n)) e.push(`빈칸 번호 [[${[...used].sort().join(',')}]] 와 blanks ${n}개가 맞지 않습니다`);
    t.blanks.forEach((b, i) => {
      const B = wqBlank(b);
      if (!B || !Array.isArray(B.ans) || !B.ans.length) { e.push(`blanks[${i}] 정답이 없습니다`); return; }
      B.ans.forEach(a => { if (!wqIsRight(b, a)) e.push(`blanks[${i}] 의 정답 "${a}" 가 정답으로 채점되지 않습니다`); });
      if (wqIsRight(b, '__틀린답__')) e.push(`blanks[${i}] 가 아무 답이나 정답으로 채점합니다`);
    });
  }
  if (!t.hint) e.push('warn: hint 가 없습니다');
  return e;
}

registerPractice({
  validate: wqValidate, itemKey: t => t.goal, answerKey: t => wqAnswerVals(t).join(' | '),
  id: 'webquiz', subject: '웹프로그래밍', icon: '🛠️', title: 'HTML · CSS 기능 구현 퀴즈',
  desc: '"이 기능을 만들려면?" 빈칸에 태그 · 속성 · 값을 채우면 결과 화면이 실시간으로 바뀝니다. 목표 화면과 비교하며 풀어 보세요 (수업자료 02~07장 범위)',
  mount: wqMount,
});
