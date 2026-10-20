// 4_자원할당그래프.js — quiz_launcher 플러그인: 자원 할당 그래프 연습
// 실행기가 일반 <script>로 실행한다. 실행기 공통 함수(escHtml, pr* 유틸, SCHED_COLORS, registerPractice 등)를 전역으로 쓴다.

// ════════════════════════════════════════════════════════
//  4. 자원 할당 그래프 (RAG) 연습 (강의 6장 p.9, p.22~28)
//   그래프 G = { P: [이름], R: [{ name, k(인스턴스 수) }], alloc[i][j]: 할당 개수, req[i][j]: 요청 개수(0/1) }
//   rgReduce(G, killed)   그래프 축약(탐지): 요청을 들어줄 수 있는 프로세스부터 끝내고 자원을 반납 → 남는 프로세스 = 교착
//   rgCycle(G)            사이클 존재 여부 + 사이클 위에 있는 간선
//   rgMinKill(G, dead)    교착을 풀기 위한 최소 종료 프로세스 집합 (복구)
//   rgGenerate(cfg)       무작위 그래프 (요청 간선은 가용 인스턴스가 0인 자원에만 → 실제로 막혀 있는 요청)
// ════════════════════════════════════════════════════════
const RG_REQ = '#ea580c', RG_ALLOC = '#2563eb', RG_CYC = '#dc2626';

function rgAvail(G) { return G.R.map((r, j) => r.k - G.alloc.reduce((s, row) => s + row[j], 0)); }

function rgReduce(G, killed = []) {
  const n = G.P.length, work = rgAvail(G), done = new Array(n).fill(false), steps = [];
  killed.forEach(i => { done[i] = true; G.alloc[i].forEach((a, j) => { work[j] += a; }); });
  const start = work.slice();
  let prog = true;
  while (prog) {
    prog = false;
    for (let i = 0; i < n; i++) {
      if (done[i] || !G.req[i].every((q, j) => q <= work[j])) continue;
      const before = work.slice();
      G.alloc[i].forEach((a, j) => { work[j] += a; });
      done[i] = true; prog = true;
      steps.push({ i, before, after: work.slice() });
    }
  }
  return { start, steps, dead: done.map((d, i) => (d ? -1 : i)).filter(i => i >= 0) };
}

// 노드 번호: 프로세스 i → i, 자원 j → n + j. 간선 u→v가 사이클 위에 있으려면 v에서 u로 돌아올 수 있어야 한다.
function rgEdges(G) {
  const n = G.P.length, E = [];
  G.P.forEach((_, i) => G.R.forEach((_, j) => {
    if (G.req[i][j]) E.push({ key: 'q' + i + '-' + j, u: i, v: n + j, type: 'req', i, j });
    if (G.alloc[i][j]) E.push({ key: 'a' + i + '-' + j, u: n + j, v: i, type: 'alloc', i, j });
  }));
  return E;
}
function rgCycle(G) {
  const E = rgEdges(G), N = G.P.length + G.R.length;
  const adj = Array.from({ length: N }, () => []);
  E.forEach(e => adj[e.u].push(e.v));
  const reach = s => { const seen = new Set([s]), st = [s]; while (st.length) { const x = st.pop(); adj[x].forEach(y => { if (!seen.has(y)) { seen.add(y); st.push(y); } }); } return seen; };
  const R = Array.from({ length: N }, (_, s) => reach(s));
  const on = new Set(E.filter(e => R[e.v].has(e.u)).map(e => e.key));
  return { has: on.size > 0, on };
}

function rgMinKill(G, dead) {
  if (!dead.length) return { size: 0, sets: [[]] };
  for (let size = 1; size <= dead.length; size++) {
    const sets = [];
    const pick = (start, cur) => {
      if (cur.length === size) { if (!rgReduce(G, cur).dead.length) sets.push(cur.slice()); return; }
      for (let x = start; x < dead.length; x++) { cur.push(dead[x]); pick(x + 1, cur); cur.pop(); }
    };
    pick(0, []);
    if (sets.length) return { size, sets };
  }
  return { size: dead.length, sets: [dead.slice()] };
}

function rgAnalyze(G) {
  const red = rgReduce(G), cyc = rgCycle(G);
  return { red, cyc, dead: red.dead, kill: rgMinKill(G, red.dead) };
}

// target: 'dead' 교착 / 'cycleSafe' 사이클은 있지만 교착 아님 / 'safe' 사이클도 교착도 없음 / 'any'
function rgGenerate(cfg) {
  let target = cfg.target;
  if (target === 'any') {
    const pool = cfg.multi ? ['dead', 'dead', 'cycleSafe', 'cycleSafe', 'safe'] : ['dead', 'dead', 'safe'];
    target = pool[prRand(0, pool.length - 1)];
  }
  let last = null;
  for (let attempt = 0; attempt < 5000; attempt++) {
    const n = cfg.n, m = cfg.m;
    const R = Array.from({ length: m }, (_, j) => ({ name: 'R' + (j + 1), k: cfg.multi ? prRand(1, 3) : 1 }));
    const alloc = Array.from({ length: n }, () => new Array(m).fill(0));
    const req = Array.from({ length: n }, () => new Array(m).fill(0));
    R.forEach((r, j) => { for (let u = 0; u < r.k; u++) if (Math.random() < 0.85) alloc[prRand(0, n - 1)][j]++; });
    const avail = R.map((r, j) => r.k - alloc.reduce((s, row) => s + row[j], 0));
    for (let i = 0; i < n; i++) {
      const cand = R.map((_, j) => j).filter(j => avail[j] === 0 && alloc[i][j] === 0);
      const cnt = Math.min(cand.length, prRand(0, 2));
      for (let c = 0; c < cnt; c++) req[i][cand.splice(prRand(0, cand.length - 1), 1)[0]] = 1;
    }
    const G = { P: Array.from({ length: n }, (_, i) => 'P' + (i + 1)), R, alloc, req };
    const deg = (i) => alloc[i].reduce((s, a) => s + a, 0) + req[i].reduce((s, q) => s + q, 0);
    if (G.P.some((_, i) => deg(i) === 0)) continue;
    if (R.some((_, j) => alloc.every(row => row[j] === 0) && req.every(row => row[j] === 0))) continue;
    if (req.flat().reduce((s, q) => s + q, 0) < 2) continue;
    const A = rgAnalyze(G);
    last = { G, A };
    const kind = A.dead.length ? 'dead' : A.cyc.has ? 'cycleSafe' : 'safe';
    if (kind === target) return last;
  }
  return last;
}

// ── 화면 ──
let RG = null;

function ragMount(root) {
  RG = { G: null, A: null, ans: {}, checked: false, revealed: false, step: -1 };
  root.innerHTML = `
    <div class="pr-card">
      <h3 class="pr-h">⚙️ 문제 설정</h3>
      <div class="pr-row">
        <label class="pr-f">프로세스 수
          <select id="rg-n">${[2, 3, 4, 5].map(n => `<option value="${n}" ${n === 4 ? 'selected' : ''}>${n}개</option>`).join('')}</select></label>
        <label class="pr-f">자원 종류
          <select id="rg-m">${[2, 3, 4].map(n => `<option value="${n}" ${n === 3 ? 'selected' : ''}>${n}개</option>`).join('')}</select></label>
        <label class="pr-f">출제 유형
          <select id="rg-target">
            <option value="any">무작위</option>
            <option value="dead">교착상태인 그래프</option>
            <option value="cycleSafe">사이클은 있지만 교착 아님 (다중 인스턴스)</option>
            <option value="safe">사이클 없음</option>
          </select></label>
        <label class="pr-chk"><input type="checkbox" id="rg-multi" checked> 다중 인스턴스 자원 포함</label>
        <button class="pr-btn indigo" onclick="ragNew()">🎲 새 문제</button>
      </div>
      <div class="pr-sub">프로세스 = 원, 자원 = 사각형(안의 점 = 인스턴스 수). <b style="color:${RG_REQ}">요청 간선 P → R</b> (점선), <b style="color:${RG_ALLOC}">할당 간선 R → P</b> (실선, 점 하나에서 하나씩).<br>
        자원이 모두 단일 인스턴스면 사이클 = 교착상태입니다. 다중 인스턴스가 있으면 사이클은 교착의 필요조건일 뿐입니다.</div>
    </div>
    <div id="rg-problem"></div>`;
  ragNew();
}

function ragNew() {
  const multi = document.getElementById('rg-multi').checked;
  let target = document.getElementById('rg-target').value;
  if (target === 'cycleSafe' && !multi) { document.getElementById('rg-multi').checked = true; }
  const g = rgGenerate({ n: +document.getElementById('rg-n').value, m: +document.getElementById('rg-m').value,
    multi: multi || target === 'cycleSafe', target });
  RG.G = g.G; RG.A = g.A; RG.ans = { cycle: null, dead: null, procs: new Set() };
  RG.checked = false; RG.revealed = false; RG.step = -1;
  ragRender();
}

// opt.step: 축약을 몇 단계까지 보여 줄지 (-1 = 원래 그래프) · opt.reveal: 사이클 간선 · 교착 프로세스 강조
function rgSvg(G, A, opt) {
  const n = G.P.length, m = G.R.length, W = 760;
  const finished = new Set(opt.step >= 0 ? A.red.steps.slice(0, opt.step + 1).map(s => s.i) : []);
  const P = G.P.map((name, i) => ({ name, x: W * (i + 1) / (n + 1), y: 60 }));
  const R = G.R.map((r, j) => { const w = Math.max(64, 24 * r.k + 20); return { ...r, x: W * (j + 1) / (m + 1), y: 250, w, h: 46 }; });
  const dotX = (j, d) => R[j].x - (G.R[j].k - 1) * 12 + d * 24;
  const lines = [];
  const unit = (x1, y1, x2, y2) => { const L = Math.hypot(x2 - x1, y2 - y1); return [(x2 - x1) / L, (y2 - y1) / L]; };
  R.forEach((r, j) => {
    let d = 0;
    G.P.forEach((_, i) => {
      for (let u = 0; u < G.alloc[i][j]; u++, d++) {
        if (finished.has(i)) continue;
        const sx = dotX(j, d), sy = r.y - 6, [ux, uy] = unit(sx, sy, P[i].x, P[i].y);
        const cyc = opt.reveal && A.cyc.on.has('a' + i + '-' + j);
        lines.push(`<line x1="${sx}" y1="${sy}" x2="${P[i].x - ux * 31}" y2="${P[i].y - uy * 31}" stroke="${cyc ? RG_CYC : RG_ALLOC}" stroke-width="${cyc ? 3 : 2}" marker-end="url(#rg-${cyc ? 'c' : 'a'})"/>`);
      }
    });
  });
  G.P.forEach((_, i) => G.R.forEach((_, j) => {
    if (!G.req[i][j] || finished.has(i)) return;
    const ex = R[j].x + (i - (n - 1) / 2) * 10, ey = R[j].y - R[j].h / 2 - 4;
    const [ux, uy] = unit(P[i].x, P[i].y, ex, ey);
    const cyc = opt.reveal && A.cyc.on.has('q' + i + '-' + j);
    lines.push(`<line x1="${P[i].x + ux * 26}" y1="${P[i].y + uy * 26}" x2="${ex - ux * 4}" y2="${ey - uy * 4}" stroke="${cyc ? RG_CYC : RG_REQ}" stroke-width="${cyc ? 3 : 2}" stroke-dasharray="7 5" marker-end="url(#rg-${cyc ? 'c' : 'q'})"/>`);
  }));
  const deadSet = new Set(opt.reveal ? A.dead : []);
  const procs = P.map((p, i) => `<g opacity="${finished.has(i) ? 0.25 : 1}">
      <circle cx="${p.x}" cy="${p.y}" r="24" fill="${deadSet.has(i) ? '#fee2e2' : 'white'}" stroke="${deadSet.has(i) ? RG_CYC : '#4f46e5'}" stroke-width="2.5"/>
      <text x="${p.x}" y="${p.y + 5}" text-anchor="middle" font-size="14" font-weight="800" fill="#1e293b">${p.name}</text>
      ${finished.has(i) ? `<text x="${p.x}" y="${p.y - 32}" text-anchor="middle" font-size="11" font-weight="700" fill="#16a34a">완료 · 반납</text>` : ''}</g>`).join('');
  const res = R.map((r, j) => {
    let d = 0;
    const owner = [];
    G.P.forEach((_, i) => { for (let u = 0; u < G.alloc[i][j]; u++) owner.push(finished.has(i) ? -1 : i); });
    const dots = Array.from({ length: r.k }, (_, x) => {
      const held = x < owner.length && owner[x] >= 0;
      return `<circle cx="${dotX(j, x)}" cy="${r.y + 4}" r="6" fill="${held ? '#1e293b' : 'white'}" stroke="#1e293b" stroke-width="1.5"/>`;
    }).join('');
    return `<rect x="${r.x - r.w / 2}" y="${r.y - r.h / 2}" width="${r.w}" height="${r.h}" rx="6" fill="#f8fafc" stroke="#475569" stroke-width="2"/>
      ${dots}<text x="${r.x}" y="${r.y + r.h / 2 + 18}" text-anchor="middle" font-size="13" font-weight="800" fill="#475569">${r.name}</text>`;
  }).join('');
  const mk = (id, c) => `<marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${c}"/></marker>`;
  return `<svg class="st-svg" viewBox="0 0 ${W} 300"><defs>${mk('rg-a', RG_ALLOC)}${mk('rg-q', RG_REQ)}${mk('rg-c', RG_CYC)}</defs>${lines.join('')}${res}${procs}</svg>`;
}

function ragRender() {
  const G = RG.G, A = RG.A, a = RG.ans;
  const yn = (key, val, label) => `<button class="${a[key] === val ? 'active' : ''}" onclick="ragPick('${key}', ${val})">${label}</button>`;
  const avail = rgAvail(G);
  document.getElementById('rg-problem').innerHTML = `
    <div class="pr-card">
      <h3 class="pr-h">🧩 자원 할당 그래프</h3>
      ${rgSvg(G, A, { step: RG.step, reveal: RG.revealed })}
      <div class="pr-tablewrap"><table class="pr-table">
        <tr><th></th>${G.R.map(r => `<th>${r.name}</th>`).join('')}</tr>
        <tr><th>인스턴스 수</th>${G.R.map(r => `<td>${r.k}</td>`).join('')}</tr>
        <tr><th>가용</th>${avail.map(v => `<td>${v}</td>`).join('')}</tr>
      </table></div>
      <div class="pr-sub">표의 가용 개수는 그림에서 비어 있는 점(○) 개수와 같습니다.</div>
    </div>
    <div class="pr-card">
      <h3 class="pr-h">✍️ 문제</h3>
      <div class="pr-q">1. 이 그래프에 사이클이 있나요?</div>
      <div class="pr-seg" id="rg-q-cycle">${yn('cycle', true, '있다')}${yn('cycle', false, '없다')}</div>
      <div class="pr-q">2. 교착상태인가요?</div>
      <div class="pr-seg" id="rg-q-dead">${yn('dead', true, '교착상태다')}${yn('dead', false, '교착상태가 아니다')}</div>
      <div class="pr-q">3. 교착상태에 빠진 프로세스를 모두 고르세요 <small>(없으면 고르지 않습니다)</small></div>
      <div class="pr-palette" id="rg-q-procs">${G.P.map((p, i) => `<button class="pr-pal ${a.procs.has(i) ? 'sel' : ''}" style="background:#4f46e5" onclick="ragToggle(${i})">${p}</button>`).join('')}</div>
      <div class="pr-q">4. 프로세스를 종료해 교착을 풀려면 최소 몇 개를 종료해야 하나요? <small>(교착이 없으면 0)</small></div>
      <input class="pr-num" id="rg-q-kill" inputmode="numeric">
      <div id="rg-feedback"></div>
      <div class="pr-actions">
        <button class="pr-btn indigo" onclick="ragCheck()">✅ 채점하기</button>
        <button class="pr-btn ghost" onclick="ragReveal()">👀 정답 · 축약 과정 보기</button>
        <button class="pr-btn" onclick="ragNew()">다음 문제 →</button>
      </div>
      <div id="rg-answer"></div>
    </div>`;
  if (RG.killInput !== undefined) document.getElementById('rg-q-kill').value = RG.killInput;
  if (RG.checked) ragCheck(true);
  if (RG.revealed) ragRenderAnswer();
}

function ragKeepKill() { const el = document.getElementById('rg-q-kill'); RG.killInput = el ? el.value : ''; }
function ragPick(key, val) { ragKeepKill(); RG.ans[key] = val; ragRender(); }
function ragToggle(i) { ragKeepKill(); RG.ans.procs.has(i) ? RG.ans.procs.delete(i) : RG.ans.procs.add(i); ragRender(); }

function ragCheck(silent) {
  const A = RG.A, a = RG.ans;
  const kill = prInt('rg-q-kill');
  const res = [
    ['rg-q-cycle', a.cycle === A.cyc.has],
    ['rg-q-dead', a.dead === (A.dead.length > 0)],
    ['rg-q-procs', [...a.procs].sort().join() === A.dead.slice().sort().join()],
    ['rg-q-kill', kill === A.kill.size],
  ];
  res.forEach(([id, ok]) => {
    const el = document.getElementById(id);
    el.style.outline = `2px solid ${ok ? '#22c55e' : '#ef4444'}`; el.style.outlineOffset = '3px'; el.style.borderRadius = '10px';
  });
  const okN = res.filter(r => r[1]).length;
  RG.checked = true;
  document.getElementById('rg-feedback').innerHTML = `<div class="pr-result ${okN === 4 ? 'good' : 'bad'}">
    <b>${okN === 4 ? '🎉 모두 정답입니다!' : '채점 결과'}</b> ${okN} / 4 정답${okN === 4 ? '' : ' · 초록 = 정답, 빨강 = 오답'}</div>`;
}

function ragReveal() { ragKeepKill(); RG.revealed = true; RG.step = -1; ragRender(); }
function ragStep(d) {
  ragKeepKill();
  RG.step = Math.max(-1, Math.min(RG.A.red.steps.length - 1, RG.step + d));
  ragRender();
}

function ragRenderAnswer() {
  const G = RG.G, A = RG.A, red = A.red;
  const vec = v => '(' + v.join(', ') + ')';
  const names = is => is.map(i => G.P[i]).join(', ');
  const multi = G.R.some(r => r.k > 1);
  let why;
  if (A.dead.length) why = `축약이 끝나도 ${names(A.dead)}가 남습니다. 서로가 가진 자원을 기다리며 아무도 진행할 수 없으므로 <b>교착상태</b>입니다.`;
  else if (A.cyc.has) why = `사이클(빨간 간선)이 있지만 ${multi ? '다중 인스턴스 자원이 있어서 ' : ''}사이클 밖의 프로세스가 끝나며 자원을 반납하면 모든 요청을 들어줄 수 있습니다. <b>사이클 ≠ 교착상태</b>인 경우입니다.`;
  else why = '사이클이 없으므로 순환 대기 조건이 성립하지 않아 교착상태가 아닙니다.';
  const log = [`가용 시작 ${vec(red.start)}`].concat(red.steps.map(s =>
    `${G.P[s.i]}: 요청 ${vec(G.req[s.i])} ≤ 가용 ${vec(s.before)} → 실행 완료, 할당 ${vec(G.alloc[s.i])} 반납 → 가용 ${vec(s.after)}`));
  if (A.dead.length) log.push(`남은 프로세스 ${names(A.dead)}: 요청을 들어줄 수 없음 → 교착상태`);
  const killText = A.dead.length
    ? `최소 ${A.kill.size}개 종료. 가능한 조합: ${A.kill.sets.map(s => '{' + names(s) + '}').join(', ')}`
    : '교착상태가 아니므로 0';
  const total = red.steps.length;
  document.getElementById('rg-answer').innerHTML = `<div class="pr-answer">
    <b>정답</b><br>
    1. 사이클 ${A.cyc.has ? '있음 (그림의 빨간 간선)' : '없음'}<br>
    2. ${A.dead.length ? '교착상태' : '교착상태 아님'}<br>
    3. ${A.dead.length ? names(A.dead) : '없음'}<br>
    4. ${killText}<br><br>
    <b>해설</b><br>${why}
    <div style="margin-top:8px"><b>그래프 축약 (탐지)</b>
      <div class="pr-actions" style="margin-top:6px">
        <button class="pr-btn ghost" onclick="ragStep(-1)" ${RG.step < 0 ? 'disabled' : ''}>◀ 이전</button>
        <span class="pr-sub" style="align-self:center">${RG.step < 0 ? '원래 그래프' : `${RG.step + 1} / ${total}단계: ${G.P[red.steps[RG.step].i]} 완료`}</span>
        <button class="pr-btn ghost" onclick="ragStep(1)" ${RG.step >= total - 1 ? 'disabled' : ''}>다음 ▶</button>
      </div>
      <div class="pr-log">${log.map(escHtml).join('\n')}</div></div>
    <div class="pr-sub" style="margin-top:6px">복구 시 종료 대상은 최소한의 프로세스 · 우선순위가 낮은 · 자원을 적게 점유한 · 실행 시간이 짧은 프로세스부터 고릅니다.</div>
  </div>`;
}

registerPractice({
  id: 'rag', subject: '운영체제', icon: '🧩', title: '자원 할당 그래프 연습',
  desc: '무작위 자원 할당 그래프에서 사이클 · 교착상태 · 교착 프로세스 · 최소 종료 수를 판단하고, 그래프 축약 과정을 단계별로 확인하세요',
  mount: ragMount,
});
