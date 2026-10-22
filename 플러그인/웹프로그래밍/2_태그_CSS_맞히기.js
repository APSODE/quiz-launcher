// 2_태그_CSS_맞히기.js — quiz_launcher 플러그인: HTML 태그 맞히기 · CSS 맞히기 (1_기능구현퀴즈.js 의 wqEsc · WQ_BOX · WQ_IMG 사용 — 함께 둘 것)
// 실행기가 일반 <script>로 실행한다. 실행기 공통 함수(escHtml, pr* 유틸, SCHED_COLORS, registerPractice 등)를 전역으로 쓴다.

// ════════════════════════════════════════════════════════
//  7. 웹프로그래밍 태그 맞히기 · CSS 맞히기
//  결과 화면을 보고 어떤 HTML 태그(속성) / CSS 선언(선택자)인지 맞힌다. 객관식 · 주관식.
//  - 문항 데이터 = 웹프로그래밍/연습/{태그맞히기,CSS맞히기}/*.jsx (META.practice: 'htmltag' | 'csspick', CATS, ITEMS)
//    데이터 파일 안에서 TQ_HCSS · TQ_BOXES · WQ_BOX · WQ_IMG 상수를 써도 된다
//  - 문제 하나 = ITEMS 배열의 객체 하나
//    { cat, src, ask, html, css?, ans: [대표 정답, 허용 표기...], wrong: [오답 보기 3개 이상], explain }
//  - html / css 안의 [[0]] 자리에 답이 들어간다(여러 번 써도 됨).
//    HTML 문제는 정답을 넣은 결과 하나, CSS 문제는 [[0]]을 비운 "기본"과 정답을 넣은 "적용 후"를 나란히 보여 준다.
//  - 객관식 보기 = 대표 정답 + wrong 중 3개(무작위). 답한 뒤에는 보기마다 결과 화면을 보여 준다.
//  - 출제 범위: 수업자료 02~07장(JS 제외). src 에 출처(볼트 노트)를 적는다.
// ════════════════════════════════════════════════════════
const TQ_HCSS = 'table { border-collapse: collapse; } td, th { border: 1px solid #64748b; padding: 4px 10px; }';
const TQ_BOXES = '.box { ' + WQ_BOX + ' }';



const TQ_KINDS = {
  // items · cats 는 mount 할 때 연습 문항 데이터에서 채운다
  htmltag: { items: [], cats: [], unit: '태그', ph: '예: mark, colspan, checkbox',
    norm: v => String(v).trim().toLowerCase().replace(/[\s<>\/'"]/g, '') },
  csspick: { items: [], cats: [], unit: 'CSS', ph: '예: justify-content: center',
    norm: v => String(v).trim().toLowerCase().replace(/\s+/g, '').replace(/;+$/, '').replace(/'/g, '"') },
};

let TQ = null;

function tqDoc(it, v) {
  const fill = s => (s || '').split('[[0]]').join(v).split('img/main.jpg').join(WQ_IMG);
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:'Malgun Gothic',sans-serif;font-size:14px;margin:10px;color:#1e293b}</style><style>${fill(it.css)}</style></head><body>${fill(it.html)}</body></html>`;
}
function tqIsRight(it, v) {
  const K = TQ_KINDS[TQ.kind], n = K.norm(v);
  return n !== '' && it.ans.some(a => K.norm(a) === n);
}

function tqMount(kind) {
  return root => {
    const K = TQ_KINDS[kind];
    K.items = practiceItems(kind);
    K.cats = practiceCats(kind, K.items);
    if (!K.items.length) { TQ = null; root.innerHTML = practiceEmpty(kind); return; }
    TQ = { kind, cats: new Set(TQ_KINDS[kind].cats.map(c => c.id)), mode: 'choice', shuffle: true, list: [], idx: 0,
      opts: [], pick: -1, input: '', done: false, ok: false, n: 0, right: 0, wrongs: new Set() };
    root.innerHTML = `
      <div class="pr-card">
        <h3 class="pr-h">⚙️ 출제 범위</h3>
        <div class="pr-seg" id="tq-cats"></div>
        <div class="pr-row" style="margin-top:10px;margin-bottom:0">
          <div class="pr-seg" id="tq-mode"></div>
          <label class="pr-chk"><input type="checkbox" checked onchange="TQ.shuffle = this.checked; tqBuild()"> 무작위 순서</label>
          <span class="pr-sub" id="tq-stat"></span>
        </div>
        <div class="pr-sub" style="margin-top:6px">${kind === 'htmltag'
          ? '결과 화면을 보고 그 부분을 만든 <b>태그</b>(또는 속성 · type 값)를 맞히세요. 주관식은 꺾쇠 없이 태그 이름만 써도 됩니다.'
          : '<b>기본</b>과 <b>적용 후</b> 화면을 비교해 어떤 <b>CSS 선언</b>(속성: 값) 또는 <b>선택자</b>를 썼는지 맞히세요. 대소문자 · 공백 · 끝의 세미콜론은 채점에서 무시합니다.'}
          답한 뒤에는 보기마다 결과 화면을 보여 줍니다. 객관식은 숫자 키(단축키 설정), 다음 문제는 Enter.</div>
      </div>
      <div id="tq-main"></div>`;
    tqRenderTop();
    tqBuild();
  };
}
function tqRenderTop() {
  const K = TQ_KINDS[TQ.kind];
  document.getElementById('tq-cats').innerHTML = K.cats.map(c => `<button class="${TQ.cats.has(c.id) ? 'active' : ''}" onclick="tqToggleCat('${c.id}')">${c.name} <small style="font-weight:500">${K.items.filter(t => t.cat === c.id).length}</small></button>`).join('');
  document.getElementById('tq-mode').innerHTML = [['choice', '객관식'], ['type', '주관식']].map(([m, l]) => `<button class="${TQ.mode === m ? 'active' : ''}" onclick="TQ.mode = '${m}'; tqRenderTop(); tqLoad()">${l}</button>`).join('');
}
function tqToggleCat(id) {
  if (TQ.cats.has(id)) { if (TQ.cats.size > 1) TQ.cats.delete(id); } else TQ.cats.add(id);
  tqRenderTop(); tqBuild();
}
function tqBuild(only) {
  const items = TQ_KINDS[TQ.kind].items;
  const list = only ? [...only] : items.map((t, i) => i).filter(i => TQ.cats.has(items[i].cat));
  if (TQ.shuffle) for (let i = list.length - 1; i > 0; i--) { const j = prRand(0, i); [list[i], list[j]] = [list[j], list[i]]; }
  TQ.list = list; TQ.idx = 0; TQ.n = 0; TQ.right = 0; TQ.wrongs = new Set();
  tqLoad();
}
function tqItem() { return TQ_KINDS[TQ.kind].items[TQ.list[TQ.idx]]; }
function tqLoad() {
  const it = tqItem();
  const wrong = it.wrong.slice();
  for (let i = wrong.length - 1; i > 0; i--) { const j = prRand(0, i); [wrong[i], wrong[j]] = [wrong[j], wrong[i]]; }
  TQ.opts = [it.ans[0], ...wrong.slice(0, 3)];
  for (let i = TQ.opts.length - 1; i > 0; i--) { const j = prRand(0, i); [TQ.opts[i], TQ.opts[j]] = [TQ.opts[j], TQ.opts[i]]; }
  TQ.pick = -1; TQ.input = ''; TQ.done = false; TQ.ok = false;
  tqRender();
  const inp = document.getElementById('tq-input'); if (inp) inp.focus();
}

// 태그 문제(<[[0]]> 자리)면 보기를 <태그>로, 속성 · type 값 문제면 그대로 보여 준다
function tqLabel(it, o) { return TQ.kind === 'htmltag' && /<\/?\[\[0\]\]/.test(it.html) ? '<' + o + '>' : o; }
function tqCode(src, v) {
  return src.split('[[0]]').map(wqEsc).join(`<span class="tq-hl">${wqEsc(v)}</span>`);
}
function tqRender() {
  const it = tqItem(), K = TQ_KINDS[TQ.kind], css = TQ.kind === 'csspick', ans = it.ans[0];
  const cat = K.cats.find(c => c.id === it.cat);
  document.getElementById('tq-stat').textContent = `${TQ.idx + 1} / ${TQ.list.length} · 맞힘 ${TQ.right} / 푼 문제 ${TQ.n}`;
  const optBtn = (o, k) => {
    const cls = TQ.done ? (o === ans ? ' ok' : k === TQ.pick ? ' ng' : '') : '';
    return `<button class="wq-choice${cls}" onclick="tqPick(${k})" ${TQ.done ? 'disabled' : ''}><pre><span class="tq-key">${k + 1}</span>${wqEsc(tqLabel(it, o))}</pre></button>`;
  };
  const end = TQ.idx === TQ.list.length - 1;
  document.getElementById('tq-main').innerHTML = `
    <div class="pr-card">
      <h3 class="pr-h">${TQ.done ? (TQ.ok ? '✅' : '❌') : '❓'} ${TQ.idx + 1} / ${TQ.list.length}
        <span class="pr-chip">${cat.name}</span><span class="pr-chip" style="background:#f1f5f9;color:#475569">출처 ${wqEsc(it.src)}</span></h3>
      <div style="font-size:15px;font-weight:700;line-height:1.6;margin-bottom:10px">${wqEsc(it.ask)}</div>
      <div class="wq-previews">
        ${css ? `<div><b class="wq-lbl">기본</b><iframe class="wq-frame" id="tq-base" sandbox=""></iframe></div>` : ''}
        <div><b class="wq-lbl">${css ? '🎯 적용 후' : '🎯 결과 화면'}</b><iframe class="wq-frame" id="tq-target" sandbox=""></iframe></div>
      </div>
      ${TQ.done ? '' : TQ.mode === 'choice'
        ? `<div class="tq-opts">${TQ.opts.map(optBtn).join('')}</div>`
        : `<div class="pr-row"><input class="tq-input" id="tq-input" placeholder="${wqEsc(K.ph)}" value="${wqEsc(TQ.input)}" autocomplete="off" spellcheck="false"
              oninput="TQ.input = this.value" onkeydown="if (event.key === 'Enter' && !event.isComposing) { event.preventDefault(); tqSubmit(); }">
            <button class="pr-btn indigo" onclick="tqSubmit()">채점</button>
            <button class="pr-btn ghost" onclick="tqSubmit(true)">모르겠음</button></div>`}
      <div id="tq-feedback"></div>
      <div class="pr-actions">
        <button class="pr-btn ghost" onclick="tqGo(-1)" ${TQ.idx ? '' : 'disabled'}>← 이전</button>
        <button class="pr-btn" onclick="tqGo(1)">${end ? '처음부터 다시' : '다음 문제 →'}</button>
        ${TQ.wrongs.size ? `<button class="pr-btn ghost" onclick="tqBuild(TQ.wrongs)">틀린 ${TQ.wrongs.size}문제 다시 풀기</button>` : ''}
      </div>
    </div>`;
  if (css) document.getElementById('tq-base').srcdoc = tqDoc(it, '');
  document.getElementById('tq-target').srcdoc = tqDoc(it, ans);
  if (TQ.done) tqShowResult();
}
function tqShowResult() {
  const it = tqItem(), css = TQ.kind === 'csspick', ans = it.ans[0];
  const mine = TQ.mode === 'choice' ? (TQ.pick >= 0 ? TQ.opts[TQ.pick] : '') : TQ.input;
  const opts = TQ.mode === 'choice' ? TQ.opts : [ans, ...it.wrong.slice(0, 3)];
  const code = [it.html ? `<b class="wq-lbl">HTML</b><pre class="wq-code">${tqCode(it.html, ans)}</pre>` : '',
    it.css && css ? `<b class="wq-lbl">CSS</b><pre class="wq-code">${tqCode(it.css, ans)}</pre>` : ''].join('');
  const fb = document.getElementById('tq-feedback');
  fb.innerHTML = `<div class="pr-result ${TQ.ok ? 'good' : 'bad'}"><b>${TQ.ok ? '🎉 정답!' : '❌ 오답'}</b>${!TQ.ok && mine.trim() ? ` — 내 답: <code>${wqEsc(mine)}</code>` : ''}
      <br>정답: <code>${wqEsc(ans)}</code>${it.ans.length > 1 ? ` <small>(${it.ans.slice(1).map(wqEsc).join(', ')} 도 정답)</small>` : ''}<br>${wqEsc(it.explain)}</div>
    ${code}
    <b class="wq-lbl">보기별 결과 화면</b>
    <div class="tq-mini">${opts.map((o, k) => `<div><div class="lbl">${o === ans ? '✅' : '❌'} ${wqEsc(tqLabel(it, o))}</div><iframe class="wq-frame" id="tq-opt${k}" sandbox=""></iframe></div>`).join('')}</div>`;
  opts.forEach((o, k) => { document.getElementById('tq-opt' + k).srcdoc = tqDoc(it, o); });
}
function tqFinish(ok) {
  TQ.done = true; TQ.ok = ok; TQ.n++;
  if (ok) { TQ.right++; TQ.wrongs.delete(TQ.list[TQ.idx]); } else TQ.wrongs.add(TQ.list[TQ.idx]);
  tqRender();
}
function tqPick(k) {
  if (TQ.done || k >= TQ.opts.length) return;
  TQ.pick = k;
  tqFinish(TQ.opts[k] === tqItem().ans[0]);
}
function tqSubmit(giveUp) {
  if (TQ.done) return;
  const inp = document.getElementById('tq-input'); if (inp) TQ.input = inp.value;
  if (!giveUp && !TQ.input.trim()) { document.getElementById('tq-feedback').innerHTML = '<div class="pr-result bad">답을 입력하세요.</div>'; return; }
  tqFinish(!giveUp && tqIsRight(tqItem(), TQ.input));
}
function tqGo(d) {
  if (d > 0 && TQ.idx === TQ.list.length - 1) { tqBuild(); window.scrollTo(0, 0); return; }
  TQ.idx = Math.max(0, Math.min(TQ.list.length - 1, TQ.idx + d)); tqLoad(); window.scrollTo(0, 0);
}

// 단축키 훅 (실행기가 연습 화면에서 호출): 객관식 보기 번호 키 · Enter(답한 뒤 다음 문제)
const TQ_KEYS = {
  onKey(act, e) {
    if (!TQ || currentPractice.id !== TQ.kind || TQ.mode !== 'choice' || TQ.done || act[0] !== 'c') return;
    const i = +act.slice(1) - 1;
    if (i < TQ.opts.length) { e.preventDefault(); tqPick(i); }
  },
  onEnter(e) {
    if (!TQ || currentPractice.id !== TQ.kind || !TQ.done) return;
    e.preventDefault(); tqGo(1);
  },
};
// ── 문항 검사 (tools/check.js 가 부른다. 'warn:' = 경고, 나머지 = 오류) ──
function tqValidator(kind) {
  const K = TQ_KINDS[kind];
  return it => {
    const e = [];
    ['src', 'ask', 'html', 'explain'].forEach(k => { if (!it[k]) e.push(k + ' 이 없습니다'); });
    if (!/\[\[0\]\]/.test((it.html || '') + (it.css || ''))) e.push('html / css 에 [[0]] 자리가 없습니다');
    if (!Array.isArray(it.ans) || !it.ans.length || it.ans.some(a => !K.norm(a))) e.push('ans 가 비었거나 빈 정답이 있습니다');
    if (!Array.isArray(it.wrong) || it.wrong.length < 3) e.push('wrong 은 3개 이상이어야 합니다 (객관식 보기)');
    else {
      const ans = new Set((it.ans || []).map(K.norm)), w = it.wrong.map(K.norm);
      w.forEach((x, i) => { if (ans.has(x)) e.push(`wrong "${it.wrong[i]}" 가 정답과 같게 채점됩니다`); });
      if (new Set(w).size !== w.length) e.push('warn: wrong 에 같은 보기가 있습니다');
    }
    return e;
  };
}
TQ_KEYS.itemKey = it => it.ask;

registerPractice({
  validate: tqValidator('htmltag'), answerKey: it => TQ_KINDS.htmltag.norm(it.ans[0]),
  id: 'htmltag', subject: '웹프로그래밍', icon: '🏷️', title: 'HTML 태그 맞히기',
  desc: '결과 화면을 보고 어떤 태그 · 속성 · input type으로 만들었는지 맞혀 보세요. 객관식 · 주관식, 답한 뒤 보기별 결과 화면 비교 (02~03장)',
  mount: tqMount('htmltag'), ...TQ_KEYS,
});
registerPractice({
  validate: tqValidator('csspick'), answerKey: it => TQ_KINDS.csspick.norm(it.ans[0]),
  id: 'csspick', subject: '웹프로그래밍', icon: '🎨', title: 'CSS 맞히기',
  desc: '기본 화면과 적용 후 화면을 비교해 어떤 CSS 선언(속성: 값)이나 선택자를 썼는지 맞혀 보세요. 객관식 · 주관식 (04~07장)',
  mount: tqMount('csspick'), ...TQ_KEYS,
});
