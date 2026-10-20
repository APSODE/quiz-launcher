// 2_은행가.js — quiz_launcher 플러그인: 교착상태 · 은행가 알고리즘 연습
// 실행기가 일반 <script>로 실행한다. 실행기 공통 함수(escHtml, pr* 유틸, SCHED_COLORS, registerPractice 등)를 전역으로 쓴다.

// ════════════════════════════════════════════════════════
//  2. 교착상태 · 은행가 알고리즘 연습
// ════════════════════════════════════════════════════════
const BK_RES = ['A', 'B', 'C', 'D'];

// 가능한 모든 안전 순서를 DFS로 구한다 (n ≤ 6)
function bkAnalyze(alloc, max, avail) {
  const n = alloc.length, m = avail.length;
  const need = alloc.map((row, i) => row.map((a, j) => max[i][j] - a));
  const total = avail.map((a, j) => a + alloc.reduce((s, r) => s + r[j], 0));
  const seqs = [];
  const used = Array(n).fill(false);
  (function dfs(work, order) {
    if (order.length === n) { seqs.push([...order]); return; }
    for (let i = 0; i < n; i++) {
      if (used[i]) continue;
      if (need[i].every((x, j) => x <= work[j])) {
        used[i] = true; order.push(i);
        dfs(work.map((w, j) => w + alloc[i][j]), order);
        order.pop(); used[i] = false;
      }
    }
  })(avail.slice(), []);
  return { need, total, seqs, count: seqs.length, safe: seqs.length > 0 };
}

function bkValidSeq(order, alloc, need, avail) {
  const n = alloc.length;
  if (order.length !== n || new Set(order).size !== n) return false;
  let work = avail.slice();
  for (const i of order) {
    if (!need[i].every((x, j) => x <= work[j])) return false;
    work = work.map((w, j) => w + alloc[i][j]);
  }
  return true;
}

function bkTrace(P, alloc, max, avail, an) {
  const names = P.names, lines = [];
  let work = avail.slice();
  if (an.safe) {
    an.seqs[0].forEach(i => {
      const nw = work.map((w, j) => w + alloc[i][j]);
      lines.push(`${names[i]}: Need ${prVec(an.need[i])} ≤ 가용 ${prVec(work)} → 실행 후 가용 ${prVec(nw)}`);
      work = nw;
    });
    return lines.join('\n');
  }
  const done = new Set();
  let progress = true;
  while (progress) {
    progress = false;
    for (let i = 0; i < names.length; i++) {
      if (done.has(i)) continue;
      if (an.need[i].every((x, j) => x <= work[j])) {
        const nw = work.map((w, j) => w + alloc[i][j]);
        lines.push(`${names[i]}: Need ${prVec(an.need[i])} ≤ 가용 ${prVec(work)} → 실행 후 가용 ${prVec(nw)}`);
        work = nw; done.add(i); progress = true; break;
      }
    }
  }
  const rest = names.map((nm, i) => i).filter(i => !done.has(i));
  lines.push(`가용 ${prVec(work)}로 시작할 수 있는 프로세스가 없음 → ` + rest.map(i => `${names[i]} Need ${prVec(an.need[i])}`).join(', '));
  return lines.join('\n');
}

// 슬라이드 예제 프리셋 (verify: 전체 자원 / 안전 순서 개수)
const BK_PRESETS = [
  { label: '문제 1 — 자원 1종, 프로세스 3개 (안전)', kind: 'state',
    alloc: [[1], [5], [2]], max: [[3], [9], [5]], avail: [2] },
  { label: '문제 2 — 자원 1종 (불안전)', kind: 'state',
    alloc: [[1], [5], [2]], max: [[4], [9], [7]], avail: [2] },
  { label: '문제 3-1 — P1이 자원 1개 요청 (승인)', kind: 'request',
    alloc: [[1], [5], [2]], max: [[3], [9], [5]], avail: [2], req: { p: 0, v: [1] } },
  { label: '문제 3-2 — P2가 자원 1개 요청 (거부)', kind: 'request',
    alloc: [[1], [5], [2]], max: [[3], [9], [5]], avail: [2], req: { p: 1, v: [1] } },
  { label: '문제 4 — 자원 3종, 프로세스 4개 (안전 순서 2개)', kind: 'state',
    alloc: [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1]], max: [[7, 5, 3], [3, 4, 2], [9, 0, 2], [2, 2, 2]], avail: [3, 3, 4] },
  { label: '예제 — 자원 3종, 전체 (11, 5, 4) (안전 순서 6개)', kind: 'state',
    alloc: [[0, 1, 0], [2, 0, 0], [4, 0, 1], [2, 1, 1]], max: [[7, 5, 3], [3, 2, 2], [9, 0, 4], [2, 2, 2]], avail: [3, 3, 2] },
  { label: '예제 — P3가 자원 C를 1개 추가 요청 (거부)', kind: 'request',
    alloc: [[0, 1, 0], [2, 0, 0], [4, 0, 1], [2, 1, 1]], max: [[7, 5, 3], [3, 2, 1], [9, 0, 4], [6, 3, 3]], avail: [3, 3, 2], req: { p: 2, v: [0, 0, 1] } },
  { label: '예제 — 자원 4종, 프로세스 5개 (P0 ~ P4)', kind: 'state', names: ['P0', 'P1', 'P2', 'P3', 'P4'],
    alloc: [[4, 0, 0, 1], [1, 1, 0, 0], [1, 2, 5, 4], [0, 6, 3, 3], [0, 2, 1, 2]],
    max: [[6, 0, 1, 2], [2, 8, 5, 0], [2, 3, 5, 6], [1, 6, 5, 3], [1, 6, 5, 6]], avail: [3, 2, 1, 1] },
  { label: '예제 — P1이 자원 A, B를 1개씩 추가 요청 (승인)', kind: 'request', names: ['P0', 'P1', 'P2', 'P3', 'P4'],
    alloc: [[4, 0, 0, 1], [1, 1, 0, 0], [1, 2, 5, 4], [0, 6, 3, 3], [0, 2, 1, 2]],
    max: [[6, 0, 1, 2], [2, 8, 5, 0], [2, 3, 5, 6], [1, 6, 5, 3], [1, 6, 5, 6]], avail: [3, 2, 1, 1], req: { p: 1, v: [1, 1, 0, 0] } },
];

// 요청 반영 후 상태
function bkApplyRequest(P) {
  const alloc = P.alloc.map(r => r.slice()), avail = P.avail.slice();
  P.req.v.forEach((x, j) => { alloc[P.req.p][j] += x; avail[j] -= x; });
  return { alloc, avail };
}

function bkFinalize(P) {
  P.m = P.avail.length; P.n = P.alloc.length;
  P.names = P.names || Array.from({ length: P.n }, (_, i) => 'P' + (i + 1));
  P.res = BK_RES.slice(0, P.m);
  P.base = bkAnalyze(P.alloc, P.max, P.avail);
  if (P.kind === 'request') {
    P.post = bkApplyRequest(P);
    P.postAn = bkAnalyze(P.post.alloc, P.max, P.post.avail);
    P.target = P.postAn;
    P.approve = P.postAn.safe;
  } else {
    P.target = P.base;
  }
  return P;
}

function bkRandomState(cfg, wantSafe) {
  const { n, m } = cfg;
  for (let attempt = 0; attempt < 3000; attempt++) {
    const total = Array.from({ length: m }, () => (m === 1 ? prRand(8, 12) : prRand(5, 12)));
    const avail = total.map(t => prRand(Math.min(1, t), Math.min(4, t)));
    const alloc = Array.from({ length: n }, () => Array(m).fill(0));
    for (let j = 0; j < m; j++) {
      let left = total[j] - avail[j];
      while (left > 0) { alloc[prRand(0, n - 1)][j]++; left--; }
    }
    const max = alloc.map(row => row.map((a, j) => Math.min(total[j], a + prRand(0, 5))));
    const an = bkAnalyze(alloc, max, avail);
    if (an.need.every(r => r.every(x => x === 0))) continue;
    if (wantSafe === null || an.safe === wantSafe) return { alloc, max, avail };
  }
  return null;
}

function bkGenerate(cfg) {
  let kind = cfg.mode === 'mixed' ? (Math.random() < 0.5 ? 'state' : 'request') : cfg.mode;
  if (kind === 'state') {
    const want = cfg.bias === 'random' ? (Math.random() < 0.5) : cfg.bias === 'safe';
    const s = bkRandomState(cfg, want) || bkRandomState(cfg, null);
    return bkFinalize({ kind, ...s });
  }
  // 요청 문제: 안전한 기본 상태에서 임의 요청 생성 → 승인/거부가 고르게 나오도록 시도
  const wantApprove = Math.random() < 0.5;
  for (let attempt = 0; attempt < 400; attempt++) {
    const s = bkRandomState(cfg, true);
    if (!s) continue;
    const an = bkAnalyze(s.alloc, s.max, s.avail);
    const p = prRand(0, cfg.n - 1);
    const v = s.avail.map((a, j) => prRand(0, Math.min(an.need[p][j], a, 2)));
    if (v.every(x => x === 0)) continue;
    const P = bkFinalize({ kind: 'request', ...s, req: { p, v } });
    if (P.approve === wantApprove) return P;
  }
  const s = bkRandomState(cfg, true);
  const an = bkAnalyze(s.alloc, s.max, s.avail);
  let p = 0, v = null;
  for (let i = 0; i < cfg.n && !v; i++) {
    const c = s.avail.map((a, j) => Math.min(an.need[i][j], a, 1));
    if (c.some(x => x > 0)) { p = i; v = c; }
  }
  return bkFinalize({ kind: 'request', ...s, req: { p, v: v || s.avail.map(() => 0) } });
}

let BK = null;

function bankMount(root) {
  BK = { problem: null, userState: null, userDecision: null, userSeq: [], checked: false };
  root.innerHTML = `
    <div class="pr-card">
      <h3 class="pr-h">⚙️ 문제 설정</h3>
      <div class="pr-row">
        <label class="pr-f">문제 유형
          <select id="bk-mode">
            <option value="state">상태 판별 (Safe / Unsafe)</option>
            <option value="request">신규 자원 요청 승인 여부</option>
            <option value="mixed" selected>섞어서 출제</option></select></label>
        <label class="pr-f">프로세스 수
          <select id="bk-n">${[3, 4, 5, 6].map(n => `<option value="${n}" ${n === 4 ? 'selected' : ''}>${n}개</option>`).join('')}</select></label>
        <label class="pr-f">자원 종류 수
          <select id="bk-m">${[1, 2, 3, 4].map(n => `<option value="${n}" ${n === 3 ? 'selected' : ''}>${n}종</option>`).join('')}</select></label>
        <label class="pr-f">상태 비율 (상태 판별)
          <select id="bk-bias"><option value="random" selected>무작위</option><option value="safe">안전 위주</option><option value="unsafe">불안전 위주</option></select></label>
        <button class="pr-btn indigo" onclick="bankNew()">🎲 새 문제</button>
      </div>
      <div class="pr-row">
        <label class="pr-f">슬라이드 예제
          <select id="bk-preset">${BK_PRESETS.map((p, i) => `<option value="${i}">${escHtml(p.label)}</option>`).join('')}</select></label>
        <button class="pr-btn ghost" onclick="bankLoadPreset()">예제 불러오기</button>
      </div>
      <div class="pr-sub">안전 순서가 여러 개일 수 있으므로, 안전 순서는 하나만 입력하면 됩니다(실제로 안전한 순서인지 검증합니다).</div>
    </div>
    <div id="bk-problem"></div>`;
  bankNew();
}

function bankNew() {
  const cfg = {
    mode: document.getElementById('bk-mode').value,
    n: parseInt(document.getElementById('bk-n').value, 10),
    m: parseInt(document.getElementById('bk-m').value, 10),
    bias: document.getElementById('bk-bias').value,
  };
  bankSetProblem(bkGenerate(cfg));
}

function bankLoadPreset() {
  const src = BK_PRESETS[parseInt(document.getElementById('bk-preset').value, 10)];
  const P = JSON.parse(JSON.stringify(src));
  delete P.label;
  bankSetProblem(bkFinalize(P));
}

function bankSetProblem(P) {
  BK.problem = P;
  BK.userState = null; BK.userDecision = null; BK.userSeq = []; BK.checked = false;
  bankRender();
}

function bkInputs(prefix, count, label) {
  return `<span class="pr-vec">${Array.from({ length: count }, (_, j) =>
    `<span class="lbl">${BK.problem.res[j]}</span><input class="pr-num" id="${prefix}-${j}" inputmode="numeric" style="width:54px">`).join('')}</span>`;
}

function bankRender() {
  const P = BK.problem;
  const isReq = P.kind === 'request';
  const head = ['Process', ...P.res.map(r => 'Allocated ' + r), ...P.res.map(r => 'Maximum ' + r)];
  const reqText = isReq
    ? `<b>${P.names[P.req.p]}</b>가 자원 ` + P.res.map((r, j) => P.req.v[j] > 0 ? `${r}를 ${P.req.v[j]}개` : null).filter(Boolean).join(', ') + ' 추가로 요청했습니다.'
    : '';
  document.getElementById('bk-problem').innerHTML = `
    <div class="pr-card">
      <h3 class="pr-h">📋 시스템 자원 상태 <span class="pr-chip">프로세스 ${P.n}개</span><span class="pr-chip">자원 ${P.m}종</span></h3>
      <div class="pr-tablewrap"><table class="pr-table">
        <tr><th rowspan="2">Process</th><th colspan="${P.m}">Allocated</th><th colspan="${P.m}">Maximum</th></tr>
        <tr>${P.res.map(r => `<th>${r}</th>`).join('')}${P.res.map(r => `<th>${r}</th>`).join('')}</tr>
        ${P.names.map((nm, i) => `<tr><td class="pname">${nm}</td>${P.alloc[i].map(x => `<td>${x}</td>`).join('')}${P.max[i].map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}
        <tr><td class="pname">Available</td>${P.avail.map(x => `<td>${x}</td>`).join('')}<td colspan="${P.m}">-</td></tr>
      </table></div>
      ${isReq ? `<div class="pr-result bad" style="background:#fffbeb;border-color:#fde68a">🔔 ${reqText}<br>요청이 Need와 Available 이내이므로 일단 할당했다고 가정하고 안전성을 판단하세요.</div>` : ''}
    </div>
    <div class="pr-card">
      <h3 class="pr-h">✍️ 답안 입력</h3>
      ${isReq ? `
        <div class="pr-q">1. 요청을 할당했다고 가정할 때 Available은? <small>(할당 후)</small></div>
        ${bkInputs('bk-av', P.m)}
        <div class="pr-q">2. 할당 후 전체 자원의 개수는? <small>(A${P.m > 1 ? ' ~ ' + P.res[P.m - 1] : ''})</small></div>
        ${bkInputs('bk-tot', P.m)}` : `
        <div class="pr-q">1. 전체 자원의 개수는?</div>
        ${bkInputs('bk-tot', P.m)}
        <div class="pr-q">2. Need(Expected) 표를 채우세요. <small>(Need = Maximum − Allocated)</small></div>
        <div class="pr-tablewrap"><table class="pr-table"><tr><th>Process</th>${P.res.map(r => `<th>${r}</th>`).join('')}</tr>
          ${P.names.map((nm, i) => `<tr><td class="pname">${nm}</td>${P.res.map((r, j) => `<td><input class="pr-num" id="bk-need-${i}-${j}" inputmode="numeric" style="width:54px"></td>`).join('')}</tr>`).join('')}
        </table></div>`}
      <div class="pr-q">${isReq ? '3' : '3'}. ${isReq ? '할당 후 시스템 상태는?' : '시스템 상태는?'}</div>
      <div class="pr-grp" id="bk-state-grp"><div class="pr-seg" id="bk-state-seg"></div></div>
      <div class="pr-q">4. 전체 가능한 순서의 개수는? <small>(n!)</small></div>
      <input class="pr-num" id="bk-fact" inputmode="numeric" style="width:80px">
      <div class="pr-q">5. 안전 순서(Safe Sequence)의 개수는?${isReq ? ' <small>(할당 후)</small>' : ''}</div>
      <input class="pr-num" id="bk-cnt" inputmode="numeric" style="width:80px">
      <div class="pr-q">6. 안전 순서 한 가지를 입력하세요. <small>(불안전이면 비워 둡니다)</small></div>
      <div class="pr-palette" id="bk-palette"></div>
      <div class="pr-seq" id="bk-seq"></div>
      ${isReq ? `
      <div class="pr-q">7. 이 자원 요청을 승인해야 합니까?</div>
      <div class="pr-grp" id="bk-dec-grp"><div class="pr-seg" id="bk-dec-seg"></div></div>` : ''}
      <div id="bk-feedback"></div>
      <div class="pr-actions">
        <button class="pr-btn indigo" onclick="bankCheck()">✅ 채점하기</button>
        <button class="pr-btn ghost" onclick="bankReveal()">👀 정답 보기</button>
        <button class="pr-btn" onclick="bankNew()">다음 문제 →</button>
      </div>
      <div id="bk-answer"></div>
    </div>`;
  bankRenderToggles();
  bankRenderSeq();
}

function bankRenderToggles() {
  const st = document.getElementById('bk-state-seg');
  st.innerHTML = [['safe', 'Safe (안전)'], ['unsafe', 'Unsafe (불안전)']].map(([k, t]) =>
    `<button class="${BK.userState === k ? 'active' : ''}" onclick="bankSetState('${k}')">${t}</button>`).join('');
  const dec = document.getElementById('bk-dec-seg');
  if (dec) dec.innerHTML = [['accept', '승인 (Accept)'], ['reject', '거부 (Reject)']].map(([k, t]) =>
    `<button class="${BK.userDecision === k ? 'active' : ''}" onclick="bankSetDecision('${k}')">${t}</button>`).join('');
}
function bankSetState(k) { BK.userState = k; bankRenderToggles(); }
function bankSetDecision(k) { BK.userDecision = k; bankRenderToggles(); }

function bankRenderSeq() {
  const P = BK.problem;
  document.getElementById('bk-palette').innerHTML =
    P.names.map((nm, i) => { const used = BK.userSeq.includes(i);
      return `<button class="pr-pal sel" style="background:${SCHED_COLORS[i % 6]};${used ? 'opacity:.25;' : ''}" ${used ? 'disabled' : ''} onclick="bankSeqAdd(${i})">${nm}</button>`; }).join('') +
    `<button class="pr-btn ghost" style="padding:6px 12px;font-size:12px" onclick="bankSeqUndo()">← 마지막 취소</button>
     <button class="pr-btn ghost" style="padding:6px 12px;font-size:12px" onclick="bankSeqClear()">비우기</button>`;
  const seqEl = document.getElementById('bk-seq');
  seqEl.className = 'pr-seq';
  seqEl.textContent = BK.userSeq.length ? BK.userSeq.map(i => P.names[i]).join(' → ') : '(비어 있음)';
}
function bankSeqAdd(i) { if (!BK.userSeq.includes(i)) BK.userSeq.push(i); bankRenderSeq(); }
function bankSeqUndo() { BK.userSeq.pop(); bankRenderSeq(); }
function bankSeqClear() { BK.userSeq = []; bankRenderSeq(); }

function bankCheck() {
  const P = BK.problem, root = document.getElementById('bk-problem');
  prClearMarks(root);
  let tot = 0, ok = 0;
  const grade = (id, good) => { tot++; if (good) ok++; prMark(id, good); };

  const totalExp = P.kind === 'request' ? P.base.total : P.base.total;   // 요청 전/후 전체 자원은 동일
  for (let j = 0; j < P.m; j++) grade('bk-tot-' + j, prInt('bk-tot-' + j) === totalExp[j]);
  if (P.kind === 'request') {
    for (let j = 0; j < P.m; j++) grade('bk-av-' + j, prInt('bk-av-' + j) === P.post.avail[j]);
  } else {
    for (let i = 0; i < P.n; i++) for (let j = 0; j < P.m; j++) grade(`bk-need-${i}-${j}`, prInt(`bk-need-${i}-${j}`) === P.base.need[i][j]);
  }
  const T = P.target;
  const stOK = BK.userState === (T.safe ? 'safe' : 'unsafe');
  tot++; if (stOK) ok++;
  document.getElementById('bk-state-grp').classList.remove('ok', 'ng');
  document.getElementById('bk-state-grp').classList.add(stOK ? 'ok' : 'ng');
  grade('bk-fact', prInt('bk-fact') === prFact(P.n));
  grade('bk-cnt', prInt('bk-cnt') === T.count);

  const tAlloc = P.kind === 'request' ? P.post.alloc : P.alloc;
  const tAvail = P.kind === 'request' ? P.post.avail : P.avail;
  const seqOK = T.safe ? bkValidSeq(BK.userSeq, tAlloc, T.need, tAvail) : BK.userSeq.length === 0;
  tot++; if (seqOK) ok++;
  document.getElementById('bk-seq').classList.add(seqOK ? 'ok' : 'ng');

  if (P.kind === 'request') {
    const dOK = BK.userDecision === (P.approve ? 'accept' : 'reject');
    tot++; if (dOK) ok++;
    document.getElementById('bk-dec-grp').classList.remove('ok', 'ng');
    document.getElementById('bk-dec-grp').classList.add(dOK ? 'ok' : 'ng');
  }
  BK.checked = true;
  const all = ok === tot;
  document.getElementById('bk-feedback').innerHTML = `
    <div class="pr-result ${all ? 'good' : 'bad'}"><b>${all ? '🎉 모두 정답입니다!' : '채점 결과'}</b><br>${ok} / ${tot} 항목 정답
    ${all ? '' : '<br>초록은 정답, 빨강은 오답입니다. 수정하거나 정답을 확인하세요.'}</div>`;
}

function bankReveal() {
  const P = BK.problem, T = P.target;
  const tAlloc = P.kind === 'request' ? P.post.alloc : P.alloc;
  const tAvail = P.kind === 'request' ? P.post.avail : P.avail;
  const needRows = P.names.map((nm, i) => `<tr><td class="pname">${nm}</td>${T.need[i].map(x => `<td>${x}</td>`).join('')}</tr>`).join('');
  const seqText = T.safe
    ? T.seqs.slice(0, 12).map(s => s.map(i => P.names[i]).join(' → ')).join('\n') + (T.count > 12 ? `\n… 외 ${T.count - 12}개` : '')
    : '안전 순서 없음';
  let html = `<div class="pr-answer">`;
  if (P.kind === 'request') {
    html += `<b>요청 처리</b>: ${P.names[P.req.p]} 요청 ${prVec(P.req.v)} — Need ${prVec(P.base.need[P.req.p])} 이내, Available ${prVec(P.avail)} 이내 → 할당 가정<br>
      <b>할당 후 Available</b>: ${prVec(P.post.avail)} · <b>${P.names[P.req.p]} Allocated</b>: ${prVec(P.post.alloc[P.req.p])}<br>`;
  }
  html += `<b>전체 자원</b>: ${prVec(P.base.total)} · <b>시스템 상태</b>: ${T.safe ? 'Safe (안전)' : 'Unsafe (불안전)'}
    · <b>전체 순서</b>: ${prFact(P.n)}개 · <b>안전 순서</b>: ${T.count}개
    ${P.kind === 'request' ? ` · <b>승인 여부</b>: ${P.approve ? '승인 (Accept)' : '거부 (Reject)'}` : ''}
    <div class="pr-tablewrap"><table class="pr-table"><tr><th>Need${P.kind === 'request' ? ' (할당 후)' : ''}</th>${P.res.map(r => `<th>${r}</th>`).join('')}</tr>${needRows}</table></div>
    <b>안전 순서 목록</b><div class="pr-log">${escHtml(seqText)}</div>
    <div style="margin-top:8px"><b>${T.safe ? '풀이 과정' : '교착 상태 판단 과정'}</b></div>
    <div class="pr-log">가용 시작: ${prVec(tAvail)}\n${escHtml(bkTrace(P, tAlloc, P.max, tAvail, T))}</div>
  </div>`;
  document.getElementById('bk-answer').innerHTML = html;
}

registerPractice({
  id: 'bank', subject: '운영체제', icon: '🏦', title: '교착상태 · 은행가 알고리즘 연습',
  desc: '무작위 자원 상태에서 Need 계산, 안전 상태 판별, 안전 순서, 신규 요청 승인 여부를 풀어 보세요',
  mount: bankMount,
});
