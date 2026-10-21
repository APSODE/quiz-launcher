// 4_실전시험.js — quiz_launcher 플러그인: 웹프로그래밍 실전 시험지 모드
// 실행기가 일반 <script>로 실행한다. 실행기 공통 함수(escHtml, prRand, registerPractice, practiceItems 등)를 전역으로 쓴다.

// ════════════════════════════════════════════════════════
//  📝 실전 시험지 모드
//  실제 시험 형식(20문제 내외 · 객관식 "2개 고르시오" / "모두 고르시오" · 단답형 빈칸 / 개념 / 코드 완성)으로
//  시험지 한 장을 만들어 한 화면에서 풀고, 제출하면 한꺼번에 채점한다. 기록은 저장하지 않는다.
//
//  문항 데이터 = 웹프로그래밍/연습/실전시험/*.jsx (META.practice: 'webexam', CATS: 분류, ITEMS: 문항 배열)
//  문항 하나 = { cat, type, q, explain, ... }
//   - type 'pick2'   : 2개 고르시오.   choices: 보기 문자열 배열, ans: 정답 인덱스 2개
//   - type 'pickall' : 모두 고르시오. choices, ans: 정답 인덱스 배열(1개 이상)
//   - type 'blank'   : 빈칸 채우기. q 안의 [[n]] 이 n번째 빈칸
//   - type 'concept' : 간단한 개념 문제. q 아래에 입력칸 하나 (blanks 는 1개)
//   - type 'code'    : 코드 완성. code 안의 [[n]] 이 n번째 빈칸. 같은 번호를 다시 쓰면 첫 위치만 입력칸이고 나머지는 따라 바뀐다.
//                      preview: true 이면 채점 후 정답 코드와 내 코드의 결과 화면을 나란히 보여 준다.
//   - blanks[n] = 정답으로 인정할 표기 배열(첫 번째가 대표 정답). 대소문자 · 공백 · 끝의 세미콜론 · 바깥 따옴표는 무시한다.
//  채점: 객관식은 고른 보기가 정답과 정확히 같아야 맞음(부분 점수 없음), 단답형은 빈칸이 모두 맞아야 맞음.
// ════════════════════════════════════════════════════════

const EX_TYPES = [
  { id: 'pick2',   name: '객관식 · 2개 고르시오', short: '2개 고르기' },
  { id: 'pickall', name: '객관식 · 모두 고르시오', short: '모두 고르기' },
  { id: 'blank',   name: '단답형 · 빈칸 채우기',   short: '빈칸' },
  { id: 'concept', name: '단답형 · 개념',          short: '개념' },
  { id: 'code',    name: '단답형 · 코드 완성',     short: '코드 완성' },
];
const EX_MARKS = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧'];

let EX_ITEMS = [];
let EX_CATS = [];
let EX = null;

// ── 채점 (순수 함수) ──
function exNorm(v) {
  return String(v == null ? '' : v).trim().toLowerCase().replace(/\s+/g, '').replace(/;+$/, '').replace(/'/g, '"').replace(/^"(.+)"$/, '$1');
}
function exBlankRight(b, v) { const n = exNorm(v); return n !== '' && b.some(a => exNorm(a) === n); }
function exIsChoice(it) { return it.type === 'pick2' || it.type === 'pickall'; }
function exGrade(it, ans) {
  if (exIsChoice(it)) {
    const sel = [...(ans || [])].sort((a, b) => a - b), right = [...it.ans].sort((a, b) => a - b);
    return sel.length === right.length && sel.every((x, i) => x === right[i]);
  }
  return it.blanks.every((b, i) => exBlankRight(b, (ans || [])[i]));
}
function exFill(src, vals) { return String(src).replace(/\[\[(\d+)\]\]/g, (_, i) => (vals[+i] == null ? '' : vals[+i])); }

// 시험지 고르기: 유형별 비율(2개 · 모두 · 빈칸 · 개념 · 코드 = 2 : 2 : 2 : 2 : 2)을 맞추고 모자라면 남은 문항에서 채운다.
function exPick(items, n) {
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = prRand(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const byType = {};
  EX_TYPES.forEach(t => { byType[t.id] = shuffle(items.filter(it => it.type === t.id)); });
  const take = Math.min(n, items.length), picked = [];
  const base = Math.floor(take / EX_TYPES.length);
  let extra = take - base * EX_TYPES.length;
  const order = shuffle(EX_TYPES.map(t => t.id));
  order.forEach(id => {
    let k = base + (extra > 0 ? 1 : 0);
    if (extra > 0) extra--;
    while (k-- > 0 && byType[id].length) picked.push(byType[id].shift());
  });
  const rest = shuffle(EX_TYPES.flatMap(t => byType[t.id]));
  while (picked.length < take && rest.length) picked.push(rest.shift());
  // 시험지 순서: 객관식 먼저, 단답형 나중 (유형 순서 = EX_TYPES)
  const rank = id => EX_TYPES.findIndex(t => t.id === id);
  return picked.map((it, i) => [it, i]).sort((a, b) => rank(a[0].type) - rank(b[0].type) || a[1] - b[1]).map(x => x[0]);
}

// ── 화면 ──
function exStyle() {
  if (document.getElementById('ex-style')) return;
  const s = document.createElement('style');
  s.id = 'ex-style';
  s.textContent = `
  .ex-q { border-top: 1px solid #e2e8f0; padding: 14px 2px 12px; }
  .ex-q:first-child { border-top: 0; }
  .ex-qh { font-size: 14px; line-height: 1.75; font-weight: 600; color: #0f172a; }
  .ex-no { display: inline-block; min-width: 26px; font-weight: 800; color: #4338ca; }
  .ex-tag { display: inline-block; font-size: 11px; font-weight: 700; color: #64748b; background: #f1f5f9; border-radius: 6px; padding: 1px 6px; margin-left: 6px; vertical-align: 1px; }
  .ex-ch { display: flex; gap: 8px; align-items: flex-start; padding: 6px 10px; margin: 4px 0 0 26px; border: 1px solid #e2e8f0; border-radius: 10px; cursor: pointer; font-size: 13.5px; line-height: 1.6; background: white; }
  .ex-ch:hover { background: #f8fafc; }
  .ex-ch.sel { border-color: #6366f1; background: #eef2ff; }
  .ex-ch.ok { border-color: #16a34a; background: #f0fdf4; }
  .ex-ch.ng { border-color: #dc2626; background: #fef2f2; }
  .ex-ch.miss { border-color: #16a34a; border-style: dashed; }
  .ex-ch input { margin-top: 4px; }
  .ex-ch code, .ex-qh code { font-family: ui-monospace, Consolas, monospace; }
  .ex-in { font: 600 13.5px ui-monospace, Consolas, monospace; padding: 2px 6px; border: 1px solid #94a3b8; border-radius: 6px; background: #fffbeb; color: #0f172a; min-width: 3em; }
  .wq-code .ex-in { background: #1e293b; color: #fde68a; border-color: #475569; }
  .ex-in.ok { border-color: #16a34a; background: #dcfce7; }
  .ex-in.ng { border-color: #dc2626; background: #fee2e2; }
  .wq-code .ex-in.ok { background: #14532d; color: #bbf7d0; }
  .wq-code .ex-in.ng { background: #7f1d1d; color: #fecaca; }
  .ex-mirror { color: #fde68a; text-decoration: underline dotted; }
  .ex-body { margin: 6px 0 0 26px; }
  .ex-res { margin: 8px 0 0 26px; font-size: 13px; line-height: 1.7; border-radius: 10px; padding: 8px 12px; }
  .ex-res.ok { background: #f0fdf4; border: 1px solid #bbf7d0; }
  .ex-res.ng { background: #fef2f2; border: 1px solid #fecaca; }
  .ex-prev { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 6px; }
  .ex-prev > div { flex: 1 1 220px; min-width: 0; }
  .ex-prev .wq-frame { height: 150px; }
  .ex-score { font-size: 28px; font-weight: 800; color: #4338ca; }
  .ex-grid { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px; }
  .ex-grid a { display: inline-block; width: 30px; text-align: center; font-size: 12px; font-weight: 700; border-radius: 6px; padding: 3px 0; text-decoration: none; }
  .ex-grid a.ok { background: #dcfce7; color: #166534; } .ex-grid a.ng { background: #fee2e2; color: #991b1b; }
  .ex-grid a.todo { background: #f1f5f9; color: #475569; } .ex-grid a.done { background: #e0e7ff; color: #3730a3; }`;
  document.head.appendChild(s);
}

function exMount(root) {
  exStyle();
  EX_ITEMS = practiceItems('webexam');
  EX_CATS = practiceCats('webexam', EX_ITEMS);
  if (!EX_ITEMS.length) { root.innerHTML = practiceEmpty('webexam'); return; }
  if (EX && EX.timer) clearInterval(EX.timer);
  EX = { cats: new Set(EX_CATS.map(c => c.id)), n: 20, paper: [], ans: [], graded: false, start: 0, end: 0, timer: null };
  root.innerHTML = `
    <div class="pr-card">
      <h3 class="pr-h">⚙️ 시험지 설정</h3>
      <div class="pr-seg" id="ex-cats"></div>
      <div class="pr-row" style="margin-top:10px;margin-bottom:0;flex-wrap:wrap;gap:6px">
        <span class="pr-sub" style="margin:0">문항 수</span>
        <span class="pr-seg" id="ex-ns"></span>
        <button class="pr-btn indigo" onclick="exNew()">📝 새 시험지 만들기</button>
      </div>
      <div class="pr-sub" style="margin-top:6px">객관식(2개 고르시오 · 모두 고르시오)과 단답형(빈칸 · 개념 · 코드 완성)을 고르게 섞어 시험지를 만듭니다. 객관식이 앞, 단답형이 뒤에 나옵니다.<br>
        다 풀고 <b>제출하고 채점</b>을 누르면 한꺼번에 채점합니다. 객관식은 정답을 정확히 골라야 맞고(부분 점수 없음), 단답형은 대소문자 · 공백 · 끝의 세미콜론을 무시합니다.</div>
    </div>
    <div id="ex-main"></div>`;
  exRenderSettings();
  exNew();
}

function exPool() { return EX_ITEMS.filter(it => EX.cats.has(it.cat)); }

function exRenderSettings() {
  document.getElementById('ex-cats').innerHTML = EX_CATS.map(c => {
    const k = EX_ITEMS.filter(it => it.cat === c.id).length;
    return `<button class="${EX.cats.has(c.id) ? 'active' : ''}" onclick="exToggleCat('${escHtml(c.id)}')">${escHtml(c.name)} <small style="font-weight:500">${k}</small></button>`;
  }).join('');
  const total = exPool().length;
  document.getElementById('ex-ns').innerHTML = [10, 15, 20, 25, 30].map(k =>
    `<button class="${EX.n === k ? 'active' : ''}" onclick="EX.n = ${k}; exRenderSettings()"${k > total ? ' disabled' : ''}>${k}</button>`).join('')
    + `<button class="${EX.n === 0 ? 'active' : ''}" onclick="EX.n = 0; exRenderSettings()">전체 ${total}</button>`;
}
function exToggleCat(id) {
  if (EX.cats.has(id)) { if (EX.cats.size > 1) EX.cats.delete(id); } else EX.cats.add(id);
  const total = exPool().length;
  if (EX.n > total) EX.n = 0;
  exRenderSettings();
}

function exNew(items) {
  const pool = exPool();
  EX.paper = items || exPick(pool, EX.n || pool.length);
  exStart();
}
function exRetryWrong() {
  const wrong = EX.paper.filter((it, i) => !exGrade(it, EX.ans[i]));
  if (wrong.length) exNew(wrong);
}
function exRetrySame() { exStart(); }
function exStart() {
  EX.ans = EX.paper.map(it => (exIsChoice(it) ? [] : it.blanks.map(() => '')));
  EX.graded = false; EX.start = Date.now(); EX.end = 0;
  if (EX.timer) clearInterval(EX.timer);
  EX.timer = setInterval(exTick, 1000);
  exRender();
  window.scrollTo(0, 0);
}
function exTime(ms) { const s = Math.floor(ms / 1000); return `${Math.floor(s / 60)}분 ${String(s % 60).padStart(2, '0')}초`; }
function exTick() {
  const el = document.getElementById('ex-time');
  if (!el) { clearInterval(EX.timer); EX.timer = null; return; }
  el.textContent = exTime((EX.end || Date.now()) - EX.start);
  exRenderGrid();
}

// 문제 · 보기 글: `코드`는 <code>로
function exText(s) { return escHtml(s).replace(/`([^`]+)`/g, '<code>$1</code>'); }

// [[n]] → 입력칸 (첫 등장) / 따라 바뀌는 글자 (다시 나올 때)
function exSlots(src, qi, inCode, seen) {
  const it = EX.paper[qi], vals = EX.ans[qi];
  return String(src).split(/(\[\[\d+\]\])/).map(part => {
    const m = part.match(/^\[\[(\d+)\]\]$/);
    if (!m) return escHtml(part);
    const i = +m[1];
    if (seen.has(i)) return `<span class="ex-mirror" data-q="${qi}" data-i="${i}">${escHtml(vals[i]) || '＿'}</span>`;
    seen.add(i);
    const w = inCode ? 10 : 12;   // 정답 길이가 드러나지 않게 고정 폭
    const cls = EX.graded ? (exBlankRight(it.blanks[i], vals[i]) ? ' ok' : ' ng') : '';
    return `<input class="ex-in${cls}" size="${w}" value="${escHtml(vals[i])}" data-q="${qi}" data-i="${i}" oninput="exInput(${qi}, ${i}, this.value)" onkeydown="exNextInput(event)" autocomplete="off" spellcheck="false"${EX.graded ? ' readonly' : ''}${inCode ? '' : ' style="margin:0 2px"'}>`;
  }).join('');
}

function exQuestionHtml(it, qi) {
  const type = EX_TYPES.find(t => t.id === it.type), cat = EX_CATS.find(c => c.id === it.cat);
  const right = EX.graded ? exGrade(it, EX.ans[qi]) : null;
  const seen = new Set();
  let head, body = '';
  if (it.type === 'blank') head = exSlots(it.q, qi, false, seen);
  else head = exText(it.q);
  if (exIsChoice(it)) {
    const sel = EX.ans[qi];
    body = it.choices.map((c, k) => {
      let cls = sel.includes(k) ? ' sel' : '';
      if (EX.graded) cls = it.ans.includes(k) ? (sel.includes(k) ? ' ok' : ' miss') : (sel.includes(k) ? ' ng' : '');
      return `<label class="ex-ch${cls}"><input type="checkbox" ${sel.includes(k) ? 'checked' : ''} ${EX.graded ? 'disabled' : ''} onchange="exToggle(${qi}, ${k}, this.checked)"><span>${EX_MARKS[k]} ${exText(c)}</span></label>`;
    }).join('');
  } else if (it.type === 'concept') {
    body = `<div class="ex-body">답: ${exSlots('[[0]]', qi, false, seen)}</div>`;
  } else if (it.type === 'code') {
    body = `<div class="ex-body"><pre class="wq-code" style="margin:0">${exSlots(it.code, qi, true, seen)}</pre></div>`;
  }
  let res = '';
  if (EX.graded) {
    let ansTxt;
    if (exIsChoice(it)) ansTxt = it.ans.map(k => EX_MARKS[k]).join(' ');
    else ansTxt = it.blanks.map((b, i) => `${it.blanks.length > 1 ? `(${i + 1}) ` : ''}<code>${escHtml(b[0])}</code>${b.length > 1 ? ` <small>(${b.slice(1).map(escHtml).join(', ')}도 정답)</small>` : ''}`).join(' · ');
    const prev = it.type === 'code' && it.preview
      ? `<div class="ex-prev"><div><b class="wq-lbl">🎯 정답 코드 결과</b><iframe class="wq-frame" sandbox="" id="ex-pa${qi}"></iframe></div><div><b class="wq-lbl">🧪 내 코드 결과</b><iframe class="wq-frame" sandbox="" id="ex-pm${qi}"></iframe></div></div>` : '';
    res = `<div class="ex-res ${right ? 'ok' : 'ng'}">${right ? '✅ 정답' : '❌ 오답'} · 정답: ${ansTxt}<br>💡 ${exText(it.explain || '')}${prev}</div>`;
  }
  return `<div class="ex-q" id="ex-q${qi}">
    <div class="ex-qh"><span class="ex-no">${qi + 1}.</span>${head}<span class="ex-tag">${type ? type.short : it.type}</span>${cat && EX.cats.size > 1 ? `<span class="ex-tag">${escHtml(cat.name)}</span>` : ''}</div>
    ${body}${res}</div>`;
}

function exAnswered(qi) {
  const a = EX.ans[qi];
  return exIsChoice(EX.paper[qi]) ? a.length > 0 : a.every(v => String(v).trim() !== '');
}
function exRenderGrid() {
  const g = document.getElementById('ex-grid');
  if (!g) return;
  g.innerHTML = EX.paper.map((it, i) => {
    const cls = EX.graded ? (exGrade(it, EX.ans[i]) ? 'ok' : 'ng') : (exAnswered(i) ? 'done' : 'todo');
    return `<a class="${cls}" href="javascript:void 0" onclick="document.getElementById('ex-q${i}').scrollIntoView({behavior:'smooth', block:'center'})">${i + 1}</a>`;
  }).join('');
  const st = document.getElementById('ex-progress');
  if (st && !EX.graded) st.textContent = `푼 문제 ${EX.paper.filter((_, i) => exAnswered(i)).length} / ${EX.paper.length}`;
}

function exRender() {
  const n = EX.paper.length;
  const cnt = {};
  EX.paper.forEach(it => { cnt[it.type] = (cnt[it.type] || 0) + 1; });
  const mix = EX_TYPES.filter(t => cnt[t.id]).map(t => `${t.short} ${cnt[t.id]}`).join(' · ');
  let summary = '';
  if (EX.graded) {
    const ok = EX.paper.filter((it, i) => exGrade(it, EX.ans[i])).length;
    const byType = EX_TYPES.filter(t => cnt[t.id]).map(t => {
      const idx = EX.paper.map((it, i) => i).filter(i => EX.paper[i].type === t.id);
      return `${t.short} ${idx.filter(i => exGrade(EX.paper[i], EX.ans[i])).length}/${idx.length}`;
    }).join(' · ');
    summary = `<div class="pr-card">
      <h3 class="pr-h">📊 채점 결과</h3>
      <div><span class="ex-score">${Math.round(ok / n * 100)}점</span> <span class="pr-sub">${ok} / ${n}문제 · 걸린 시간 ${exTime(EX.end - EX.start)}</span></div>
      <div class="pr-sub" style="margin-top:4px">${byType}</div>
      <div class="pr-actions">
        ${ok < n ? `<button class="pr-btn indigo" onclick="exRetryWrong()">🔁 틀린 ${n - ok}문제만 다시 풀기</button>` : ''}
        <button class="pr-btn ghost" onclick="exRetrySame()">↺ 같은 시험지 다시 풀기</button>
        <button class="pr-btn" onclick="exNew()">📝 새 시험지</button>
      </div></div>`;
  }
  document.getElementById('ex-main').innerHTML = `${summary}
    <div class="pr-card">
      <h3 class="pr-h">📝 웹프로그래밍 실전 시험지 <span class="pr-chip">${n}문제</span><span class="pr-chip" style="background:#f1f5f9;color:#475569">${mix}</span></h3>
      <div class="pr-sub">⏱️ <span id="ex-time">${exTime((EX.end || Date.now()) - EX.start)}</span> · <span id="ex-progress"></span></div>
      <div class="ex-grid" id="ex-grid"></div>
      <div style="margin-top:8px">${EX.paper.map((it, i) => exQuestionHtml(it, i)).join('')}</div>
      <div class="pr-actions">
        ${EX.graded ? '<button class="pr-btn" onclick="exNew()">📝 새 시험지</button>'
          : '<button class="pr-btn indigo" onclick="exSubmit()">✅ 제출하고 채점</button><button class="pr-btn ghost" onclick="exNew()">🔄 시험지 바꾸기</button>'}
      </div>
    </div>`;
  exRenderGrid();
  if (EX.graded) EX.paper.forEach((it, i) => {
    if (it.type !== 'code' || !it.preview) return;
    const doc = c => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:'Malgun Gothic',sans-serif;font-size:14px;margin:10px;color:#1e293b}</style></head><body>${c}</body></html>`;
    const a = document.getElementById('ex-pa' + i), m = document.getElementById('ex-pm' + i);
    if (a) a.srcdoc = doc(exFill(it.code, it.blanks.map(b => b[0])));
    if (m) m.srcdoc = doc(exFill(it.code, EX.ans[i]));
  });
}

function exToggle(qi, k, on) {
  if (EX.graded) return;
  const a = EX.ans[qi];
  if (on && !a.includes(k)) a.push(k);
  if (!on) a.splice(a.indexOf(k), 1);
  const box = document.getElementById('ex-q' + qi);
  if (box) box.querySelectorAll('.ex-ch').forEach((el, j) => el.classList.toggle('sel', a.includes(j)));
  exRenderGrid();
}
function exInput(qi, i, v) {
  if (EX.graded) return;
  EX.ans[qi][i] = v;
  document.querySelectorAll(`.ex-mirror[data-q="${qi}"][data-i="${i}"]`).forEach(el => { el.textContent = v || '＿'; });
  exRenderGrid();
}
function exSubmit() {
  const left = EX.paper.filter((_, i) => !exAnswered(i)).length;
  if (left && !confirm(`아직 안 푼 문제가 ${left}개 있습니다. 제출할까요?`)) return;
  EX.graded = true; EX.end = Date.now();
  if (EX.timer) { clearInterval(EX.timer); EX.timer = null; }
  exRender();
  window.scrollTo(0, 0);
}
// 입력칸에서 Enter = 다음 입력칸으로 (실행기의 Enter 훅은 입력칸에서 불리지 않으므로 입력칸에 직접 단다)
function exNextInput(e) {
  if (e.key !== 'Enter' || e.isComposing) return;
  e.preventDefault();
  const t = e.target, all = [...document.querySelectorAll('#ex-main .ex-in:not([readonly])')];
  const k = all.indexOf(t);
  if (k >= 0 && k + 1 < all.length) { all[k + 1].focus(); all[k + 1].select(); }
}

registerPractice({
  id: 'webexam', subject: '웹프로그래밍', icon: '🎓', title: '실전 시험지 모드',
  desc: '20문제 내외 시험지를 한 화면에서 풀고 한꺼번에 채점해요. 객관식(2개 고르시오 · 모두 고르시오) + 단답형(빈칸 · 개념 · 코드 완성), 02~07장 범위',
  mount: exMount,
});
