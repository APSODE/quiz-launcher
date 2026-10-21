// 3_블록_인라인.js — quiz_launcher 플러그인: 블록 · 인라인 · inline-block 개념 확인 (단독 동작)
// 실행기가 일반 <script>로 실행한다. 실행기 공통 함수(escHtml, prRand, registerPractice 등)를 전역으로 쓴다.

// ════════════════════════════════════════════════════════
//  웹프로그래밍 블록 · 인라인 · inline-block
//  출처: 볼트 웹_05 레이아웃을 위한 스타일 "블록·인라인과 display (s.27~34)", "inline-block 주의 (s.31~33)"
//  문제는 매번 무작위로 만든다. 유형(BI_TYPES)
//   - kind   : 태그의 기본 display가 블록인지 인라인인지 (BI_TAGS)
//   - prop   : display 값별로 width · height · margin · padding이 적용되는지 (O / X) + 적용 전후 화면
//   - render : HTML · CSS 코드를 보고 결과 화면 4개 중 고르기
//   - guess  : 결과 화면을 보고 빨간 B 요소의 display 값 고르기 (none · visibility: hidden 포함)
//   - concept: 개념 객관식 (BI_CONCEPTS)
//  미리보기의 모든 박스는 width · height를 지정해 두어 inline(크기 무시) · inline-block · block이 화면으로 구분된다.
// ════════════════════════════════════════════════════════
const BI_TYPES = [
  { id: 'kind', name: '블록 / 인라인 분류' },
  { id: 'prop', name: '속성 적용 여부' },
  { id: 'render', name: '코드 → 결과 화면' },
  { id: 'guess', name: '결과 화면 → display' },
  { id: 'concept', name: '개념 문제' },
];

// 강의 슬라이드(s.28)의 분류를 따른다
const BI_TAGS = {
  block: ['div', 'table', 'h1', 'h3', 'p', 'form', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'pre', 'blockquote'],
  inline: ['span', 'a', 'em', 'strong', 'input', 'label', 'img'],
};

const BI_PROPS = [
  { id: 'width', label: 'width: 120px', css: 'width: 120px;', inline: false },
  { id: 'height', label: 'height: 60px', css: 'height: 60px;', inline: false },
  { id: 'mtb', label: 'margin-top: 30px (상하 margin)', css: 'margin-top: 30px;', inline: false },
  { id: 'mlr', label: 'margin-left: 30px (좌우 margin)', css: 'margin-left: 30px;', inline: true },
  { id: 'plr', label: 'padding-left: 30px (좌우 padding)', css: 'padding-left: 30px;', inline: true },
];

const BI_CONCEPTS = [
  { q: '블록 요소의 특징으로 옳은 것은?', a: '혼자 한 줄을 차지하고, 너비를 지정하지 않으면 부모 너비 전체를 차지한다',
    w: ['내용 크기만큼만 차지하고 옆에 다른 요소가 올 수 있다', 'width · height를 지정할 수 없다', '항상 다른 블록과 같은 줄에 놓인다'],
    ex: '블록 = 혼자 한 줄, width: auto면 부모 가용 공간 전체. 인라인 = 내용만큼.' },
  { q: '인라인 요소의 특징으로 옳은 것은?', a: '내용만큼만 차지하고 옆에 다른 요소가 같은 줄에 올 수 있다',
    w: ['혼자 한 줄을 차지한다', 'width · height가 그대로 적용된다', '상하 margin이 주변 배치에 반영된다'],
    ex: '인라인 = 내용 크기, 같은 줄에 나란히. width/height, 상하 margin/padding은 적용되지 않는다.' },
  { q: 'display: inline-block의 설명으로 옳은 것은?', a: '인라인처럼 한 줄에 나란히 놓이면서 블록처럼 너비 · 높이를 지정할 수 있다',
    w: ['블록처럼 혼자 한 줄을 차지한다', '너비 · 높이가 무시된다', '화면에 표시되지 않는다'],
    ex: 'inline-block = 인라인 배치 + 블록의 너비·높이.' },
  { q: 'display: inline인 요소에 적용되지 않는 것은?', a: 'width와 height',
    w: ['color', '좌우 padding', 'font-size'],
    ex: 'inline에는 width/height, 상하 margin/padding이 적용되지 않는다(s.30).' },
  { q: 'display: none과 visibility: hidden의 차이로 옳은 것은?', a: 'none은 공간도 차지하지 않고, hidden은 안 보이지만 공간은 차지한다',
    w: ['둘 다 공간을 차지하지 않는다', 'none은 공간을 차지하고 hidden은 차지하지 않는다', '둘은 완전히 같다'],
    ex: 'display: none = 공간 X, visibility: hidden = 공간 O.' },
  { q: 'inline-block 요소들을 나란히 놓았을 때 사이에 작은 공백이 생기는 원인은?', a: 'HTML 태그 사이의 줄바꿈(엔터)이 공백 문자로 표시되기 때문',
    w: ['margin 기본값이 10px이기 때문', 'border 때문', 'inline-block은 원래 서로 겹치지 않게 간격을 두기 때문'],
    ex: '태그 사이 줄바꿈 = 공백 한 칸. 해결: 엔터 제거, 음수 margin, 부모 font-size: 0, float.' },
  { q: 'inline-block 사이 공백을 없애는 방법이 아닌 것은?', a: '부모에 text-align: center를 준다',
    w: ['태그 사이의 엔터를 없앤다', '음수 margin-right를 준다', '부모에 font-size: 0을 주고 자식 글자 크기를 rem으로 다시 준다'],
    ex: '공백 해결 4가지: 엔터 제거, 음수 margin, 부모 font-size 0 (+자식 rem), float.' },
  { q: '부모에 font-size: 0을 준 뒤 자식 글자 크기를 다시 줄 때 em이 아닌 rem을 쓰는 이유는?', a: 'em은 부모(0) 기준이라 0이 되기 때문',
    w: ['rem이 더 최신 단위라서', 'em은 inline-block에 쓸 수 없어서', 'rem은 공백까지 없애 주기 때문'],
    ex: 'em = 부모 기준 → 0 × n = 0. rem = 루트(html) 기준이라 영향이 없다.' },
  { q: '높이가 다른 inline-block 박스들의 위쪽이 맞지 않을 때 쓰는 선언은?', a: 'vertical-align: top',
    w: ['text-align: top', 'align-items: flex-start', 'margin-top: 0'],
    ex: 'inline-block의 vertical-align 기본값은 baseline(글자 기준선) → top으로 위쪽을 맞춘다.' },
  { q: 'inline-block 요소의 vertical-align 기본값은?', a: 'baseline',
    w: ['top', 'middle', 'bottom'],
    ex: 'baseline이라 높이가 다르면 위쪽에 공백이 생긴다.' },
  { q: '<span>에 display: block을 지정하면?', a: '블록처럼 혼자 한 줄을 차지한다',
    w: ['span은 인라인 태그라 바뀌지 않는다', '화면에서 사라진다', 'width가 무시된다'],
    ex: 'display로 요소의 레벨을 바꿀 수 있다. 태그의 기본값보다 CSS가 우선한다.' },
  { q: '메뉴 항목 li를 가로로 나란히 놓으면서 각 항목에 너비 · 높이를 주려면?', a: 'li에 display: inline-block',
    w: ['li에 display: inline', 'li에 display: block', 'ul에 display: none'],
    ex: 'inline이면 나란히 놓이지만 너비 · 높이가 무시된다. 실습(s.39~47)에서 inline-block을 썼다.' },
  { q: '블록 요소에 width: auto(기본값)일 때 너비는?', a: '부모의 가용 공간 전체',
    w: ['내용 글자 길이만큼', '항상 100px', '0'],
    ex: '블록 width: auto = 부모 가용 공간 전체, 인라인은 내용 크기(s.4).' },
  { q: '다음 중 블록 요소로만 묶인 것은?', a: 'div, p, ul, h1',
    w: ['span, a, img', 'div, span, p', 'strong, em, label'],
    ex: '블록: div, table, h1~h6, p, form, ul, ol, li, dl, pre, blockquote / 인라인: span, a, em, strong, input, label, img.' },
  { q: '다음 중 인라인 요소로만 묶인 것은?', a: 'span, a, img, label',
    w: ['div, p, li', 'span, div, a', 'ul, ol, dl'],
    ex: '인라인: span, a, em, strong, input, label, img.' },
  { q: '최근 여러 요소를 나란히 유연하게 배치할 때 inline-block · float 대신 많이 쓰는 방법은?', a: 'display: flex',
    w: ['display: none', 'position: static', 'visibility: hidden'],
    ex: '최근엔 flex로 유연하게 배치한다(s.34, 06장).' },
];

const BI_STYLE = `<style>
  .bi-opts { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 10px; }
  .bi-opt { text-align: left; border: 2px solid #e2e8f0; background: #f8fafc; border-radius: 10px; padding: 6px; cursor: pointer; font-family: inherit; }
  .bi-opt.ok { border-color: #22c55e; background: #f0fdf4; } .bi-opt.ng { border-color: #ef4444; background: #fef2f2; }
  .bi-opt iframe { pointer-events: none; }
  .bi-opt .lbl { font-size: 12px; font-weight: 700; color: #6366f1; margin: 0 0 4px 4px; }
  .bi-txt { width: 100%; text-align: left; border: 2px solid #e2e8f0; background: #f8fafc; border-radius: 10px; padding: 10px 12px; cursor: pointer; font: inherit; font-size: 14px; }
  .bi-txt.ok { border-color: #22c55e; background: #f0fdf4; } .bi-txt.ng { border-color: #ef4444; background: #fef2f2; }
  .bi-list { display: flex; flex-direction: column; gap: 8px; }
</style>`;

let BI = null;

function biShuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = prRand(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function biPickOne(a) { return a[prRand(0, a.length - 1)]; }
function biDoc(css, html) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:'Malgun Gothic',sans-serif;font-size:14px;margin:8px;color:#1e293b}</style><style>${css}</style></head><body>${html}</body></html>`;
}
const BI_BOX = 'border: 2px solid #475569; background: #e0e7ff; margin: 4px;';

// 박스 3개(A, B, C). els = [{ tag, disp }] (disp가 ''면 태그 기본값). 크기는 모두 같게 지정한다
function biBoxes(els, w, h, hlB) {
  const html = els.map((e, i) => `<${e.tag} class="${'abc'[i]}">${'ABC'[i]}</${e.tag}>`).join('\n');
  const css = `.a, .b, .c { width: ${w}px; height: ${h}px; ${BI_BOX} }` + (hlB ? '\n.b { background: #fca5a5; }' : '') +
    els.map((e, i) => e.disp ? `\n.${'abc'[i]} { ${e.disp.startsWith('visibility') ? 'display: inline-block; ' + e.disp : 'display: ' + e.disp}; }` : '').join('');
  return { html, css };
}
function biEff(e) { return e.disp || (BI_TAGS.block.includes(e.tag) ? 'block' : 'inline'); }

// ── 문제 만들기 ──
function biMakeKind() {
  const kind = Math.random() < 0.55 ? 'block' : 'inline', tag = biPickOne(BI_TAGS[kind]);
  return { type: 'kind', ask: `<${tag}> 태그의 기본 display는?`, code: '',
    opts: ['블록(block)', '인라인(inline)'], ans: kind === 'block' ? 0 : 1,
    explain: `<${tag}>는 ${kind === 'block' ? '블록 요소: 혼자 한 줄, 너비 100%' : '인라인 요소: 내용만큼, 옆에 다른 요소 가능'}. ` +
      '블록: div, table, h1~h6, p, form, ul, ol, li, dl, pre, blockquote / 인라인: span, a, em, strong, input, label, img (s.28)' };
}
function biMakeProp() {
  const disp = biPickOne(['block', 'inline', 'inline-block', 'inline']), p = biPickOne(BI_PROPS);
  const ok = disp === 'inline' ? p.inline : true;
  const base = `.x { display: ${disp}; ${BI_BOX} background: #fca5a5; }`;
  const html = '앞 글자 <span class="x">B</span> 뒤 글자<br>둘째 줄 글자';
  return { type: 'prop', ask: `display: ${disp}인 요소에 ${p.label}를 주면 화면(배치)에 반영되는가?`,
    code: `.x {\n  display: ${disp};\n  ${p.css}\n}`, opts: ['반영된다 (O)', '반영되지 않는다 (X)'], ans: ok ? 0 : 1,
    demo: [['적용 전', biDoc(base, html)], ['적용 후', biDoc(base + `\n.x { ${p.css} }`, html)]],
    explain: disp === 'inline'
      ? 'inline에는 width · height, 상하 margin · padding이 적용되지 않고(s.30), 좌우 margin · padding은 적용된다.' +
        (p.id === 'plr' || p.id === 'mlr' ? '' : ' 너비 · 높이가 필요하면 inline-block으로 바꾼다.')
      : `${disp}는 width · height, 상하 · 좌우 margin · padding이 모두 적용된다.` };
}
function biRandEls(allowDefault) {
  return [0, 1, 2].map(() => {
    if (allowDefault && Math.random() < 0.3) return { tag: biPickOne(['div', 'span', 'p', 'strong', 'a']), disp: '' };
    return { tag: biPickOne(['div', 'span']), disp: biPickOne(['block', 'inline', 'inline-block']) };
  });
}
function biMakeRender() {
  const w = biPickOne([60, 70, 80, 90]), h = biPickOne([30, 36, 44]);
  const els = biRandEls(true), key = e => e.map(biEff).join('|');
  const variants = [els], seen = new Set([key(els)]);
  for (let t = 0; variants.length < 4 && t < 200; t++) {
    const v = els.map(e => ({ ...e })); const i = prRand(0, 2);
    v[i] = { tag: v[i].tag, disp: biPickOne(['block', 'inline', 'inline-block']) };
    if (Math.random() < 0.5) { const j = prRand(0, 2); v[j] = { tag: v[j].tag, disp: biPickOne(['block', 'inline', 'inline-block']) }; }
    if (!seen.has(key(v))) { seen.add(key(v)); variants.push(v); }
  }
  const order = biShuffle(variants.map((_, i) => i));
  const src = biBoxes(els, w, h);
  return { type: 'render', ask: '아래 코드의 결과 화면은?', code: 'HTML\n' + src.html + '\n\nCSS\n' + src.css,
    frames: order.map(i => { const b = biBoxes(variants[i], w, h); return biDoc(b.css, b.html); }), ans: order.indexOf(0),
    explain: els.map((e, i) => `${'ABC'[i]} <${e.tag}> = ${biEff(e)}${e.disp ? '' : ' (태그 기본값)'}`).join(' · ') +
      '. block은 혼자 한 줄, inline은 같은 줄 + 너비 · 높이 무시, inline-block은 같은 줄 + 너비 · 높이 적용.' };
}
const BI_GUESS = ['block', 'inline', 'inline-block', 'none', 'visibility: hidden'];
function biMakeGuess() {
  const w = biPickOne([60, 70, 80]), h = biPickOne([30, 40]);
  const side = biPickOne(['inline-block', 'inline']), tag = biPickOne(['div', 'span']);
  const ans = biPickOne(side === 'inline' ? BI_GUESS.filter(d => d !== 'inline') : BI_GUESS);
  const els = [{ tag: 'span', disp: side }, { tag, disp: ans }, { tag: 'span', disp: side }];
  const opts = biShuffle(BI_GUESS.filter(d => d !== ans && !(side === 'inline' && d === 'inline'))).slice(0, 3).concat([ans]);
  biShuffle(opts);
  const b = biBoxes(els, w, h, true);
  return { type: 'guess', ask: `빨간 B 요소(<${tag}>)에 준 값은? (A · C는 ${side}, 세 박스 모두 width ${w}px · height ${h}px)`,
    frames: [biDoc(b.css, b.html)], opts: opts.map(d => d.startsWith('visibility') ? d : 'display: ' + d), ans: opts.indexOf(ans),
    code: 'HTML\n' + b.html + '\n\nCSS\n' + b.css,
    explain: { block: 'block → B가 혼자 한 줄을 차지해 A · C와 줄이 나뉜다.', inline: 'inline → 같은 줄에 있지만 width · height가 무시되어 글자 크기만큼 작다.',
      'inline-block': 'inline-block → 같은 줄에 있고 지정한 width · height가 적용된다.', none: 'display: none → B가 공간까지 사라져 A와 C가 붙는다.',
      'visibility: hidden': 'visibility: hidden → B는 안 보이지만 자리는 비어 있는 채로 남는다(display: none과 비교).' }[ans] };
}
function biMakeConcept() {
  const c = biPickOne(BI_CONCEPTS), opts = biShuffle([c.a, ...c.w]);
  return { type: 'concept', ask: c.q, opts, ans: opts.indexOf(c.a), explain: c.ex };
}
const BI_MAKERS = { kind: biMakeKind, prop: biMakeProp, render: biMakeRender, guess: biMakeGuess, concept: biMakeConcept };

// ── 화면 ──
function biMount(root) {
  BI = { types: new Set(BI_TYPES.map(t => t.id)), q: null, pick: -1, n: 0, right: 0, streak: 0, last: '' };
  root.innerHTML = BI_STYLE + `
    <div class="pr-card">
      <h3 class="pr-h">⚙️ 문제 유형</h3>
      <div class="pr-seg" id="bi-types"></div>
      <div class="pr-sub" style="margin-top:8px">블록 · 인라인 · inline-block(웹_05 s.27~34)을 확인하는 문제가 무작위로 나옵니다. 미리보기의 박스는 모두 width · height를 지정해 두었습니다.
        보기는 숫자 키(단축키 설정)로 고르고, 다음 문제는 Enter입니다. <span id="bi-stat"></span></div>
    </div>
    <div id="bi-main"></div>`;
  biRenderTypes();
  biNext();
}
function biRenderTypes() {
  document.getElementById('bi-types').innerHTML = BI_TYPES.map(t => `<button class="${BI.types.has(t.id) ? 'active' : ''}" onclick="biToggle('${t.id}')">${t.name}</button>`).join('');
}
function biToggle(id) {
  if (BI.types.has(id)) { if (BI.types.size > 1) BI.types.delete(id); } else BI.types.add(id);
  biRenderTypes(); biNext();
}
function biNext() {
  const ids = [...BI.types];
  let type = biPickOne(ids);
  if (ids.length > 1 && type === BI.last) type = biPickOne(ids);   // 같은 유형 연속을 조금 줄인다
  BI.last = type; BI.q = BI_MAKERS[type](); BI.pick = -1;
  biRender();
  window.scrollTo(0, 0);
}
function biFrame(doc, k, h) { return `<iframe class="wq-frame" id="bi-f${k}" sandbox="" style="height:${h || 170}px"></iframe>`; }
function biRender() {
  const q = BI.q, done = BI.pick >= 0, type = BI_TYPES.find(t => t.id === q.type);
  const cls = k => done ? (k === q.ans ? ' ok' : k === BI.pick ? ' ng' : '') : '';
  document.getElementById('bi-stat').textContent = BI.n ? ` · 맞힘 ${BI.right} / ${BI.n}${BI.streak > 1 ? ` · 연속 ${BI.streak}` : ''}` : '';
  const frameDocs = [];
  let body = '';
  if (q.type === 'render') {
    body = `<pre class="wq-code">${escHtml(q.code)}</pre><div class="bi-opts">${q.frames.map((d, k) => { frameDocs.push(d);
      return `<button class="bi-opt${cls(k)}" onclick="biPick(${k})" ${done ? 'disabled' : ''}><div class="lbl">${k + 1}</div>${biFrame(d, k, 185)}</button>`; }).join('')}</div>`;
  } else {
    if (q.frames) { frameDocs.push(q.frames[0]); body += `<b class="wq-lbl">🎯 결과 화면</b>${biFrame(q.frames[0], 0)}`; }
    if (q.code && q.type !== 'guess') body += `<pre class="wq-code">${escHtml(q.code)}</pre>`;
    body += `<div class="bi-list" style="margin-top:8px">${q.opts.map((o, k) => `<button class="bi-txt${cls(k)}" onclick="biPick(${k})" ${done ? 'disabled' : ''}><span class="tq-key">${k + 1}</span>${escHtml(o)}</button>`).join('')}</div>`;
  }
  let fb = '';
  if (done) {
    const ok = BI.pick === q.ans;
    fb = `<div class="pr-result ${ok ? 'good' : 'bad'}"><b>${ok ? '🎉 정답!' : '❌ 오답'}</b><br>${escHtml(q.explain)}</div>`;
    if (q.type === 'guess') fb += `<b class="wq-lbl">코드</b><pre class="wq-code">${escHtml(q.code)}</pre>`;
    if (q.demo) fb += `<div class="wq-previews" style="margin-top:8px">${q.demo.map(([l, d], k) => { frameDocs.push(d);
      return `<div><b class="wq-lbl">${l}</b>${biFrame(d, frameDocs.length - 1, 110)}</div>`; }).join('')}</div>`;
  }
  document.getElementById('bi-main').innerHTML = `
    <div class="pr-card">
      <h3 class="pr-h">${done ? (BI.pick === q.ans ? '✅' : '❌') : '❓'} ${escHtml(q.ask)} <span class="pr-chip">${type.name}</span></h3>
      ${body}${fb}
      <div class="pr-actions"><button class="pr-btn${done ? '' : ' ghost'}" onclick="biNext()">${done ? '다음 문제 →' : '건너뛰기 →'}</button></div>
    </div>`;
  frameDocs.forEach((d, k) => { const f = document.getElementById('bi-f' + k); if (f) f.srcdoc = d; });
}
function biPick(k) {
  const q = BI.q;
  if (!q || BI.pick >= 0) return;
  const n = q.type === 'render' ? q.frames.length : q.opts.length;
  if (k < 0 || k >= n) return;
  BI.pick = k; BI.n++;
  if (k === q.ans) { BI.right++; BI.streak++; } else BI.streak = 0;
  biRender();
}

registerPractice({
  id: 'blockinline', subject: '웹프로그래밍', icon: '🧱', title: '블록 · 인라인 · inline-block',
  desc: '태그 분류, display 값별 width · height · margin 적용 여부, 코드 → 결과 화면, 결과 화면 → display 값, 개념 문제를 무작위로 풀어 보세요 (05장 s.27~34)',
  mount: biMount,
  onKey(act, e) { if (BI && act[0] === 'c') { e.preventDefault(); biPick(+act.slice(1) - 1); } },
  onEnter(e) { if (BI && BI.pick >= 0) { e.preventDefault(); biNext(); } },
});
