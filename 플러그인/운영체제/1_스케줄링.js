// 1_스케줄링.js — quiz_launcher 플러그인: 스케줄링 연습 (FCFS · SJF · HRN · RR · SRTF)
// 실행기가 일반 <script>로 실행한다. 실행기 공통 함수(escHtml, pr* 유틸, SCHED_COLORS, registerPractice 등)를 전역으로 쓴다.

// ════════════════════════════════════════════════════════
//  1. 스케줄링 연습
// ════════════════════════════════════════════════════════
const SCHED_TIE_RULE = '동률이면 먼저 도착한 프로세스(준비 큐에 먼저 들어온 프로세스)가 우선합니다.';

// 난이도 통계: 각 run 함수가 함께 돌려준다 (schedScore 참고)
//  decisions: 준비 큐에 후보가 2개 이상인 상태에서 고른 횟수
//  traps:     도착 순서와 다른 선택 · 선점 · 동시 도착/타임아웃 같은 '함정' 횟수
//  close:     후보끼리 값이 1 차이 이내라 헷갈리기 쉬운 비교 횟수
function schedStat() { return { decisions: 0, traps: 0, close: 0 }; }
function schedFifoFirst(ready) { return ready.reduce((m, r) => (r.arrive < m.arrive ? r : m), ready[0]); }

// 비선점 알고리즘 공통 실행기: cmp(a, b, t) < 0 이면 a 우선
//  opt.trap(ready, p, t) → 추가 함정 수 · opt.close(1순위, 2순위, t) → 근소한 차이 여부
function schedMakeNonPre(cmp, label, opt = {}) {
  return function (procs) {
    const slots = [], log = [], st = schedStat();
    let t = 0, tie = false;
    const done = new Set();
    while (done.size < procs.length) {
      const ready = procs.filter(p => !done.has(p.name) && p.arrive <= t);
      if (!ready.length) { slots.push('idle'); t++; continue; }
      ready.sort((a, b) => cmp(a, b, t) || a.arrive - b.arrive);
      if (ready.length > 1 && cmp(ready[0], ready[1], t) === 0) tie = true;
      const p = ready[0];
      if (ready.length > 1) {
        st.decisions++;
        if (p !== schedFifoFirst(ready)) st.traps++;
        if (opt.trap) st.traps += opt.trap(ready, p, t);
        if (opt.close && opt.close(ready[0], ready[1], t)) st.close++;
        log.push('t=' + t + ' 준비 큐 [' + ready.map(r => label(r, t)).join(', ') + '] → ' + p.name + ' 선택');
      }
      for (let k = 0; k < p.burst; k++) slots.push(p.name);
      t += p.burst; done.add(p.name);
    }
    return { slots, tie, log, stats: st };
  };
}

function schedRunRR(procs, opt) {
  const q = Math.max(1, (opt && opt.tq) | 0);
  const rem = {}; procs.forEach(p => rem[p.name] = p.burst);
  const pending = [...procs].sort((a, b) => a.arrive - b.arrive);
  const queue = [], slots = [], st = schedStat();
  let t = 0, finished = 0;
  const admit = () => { let k = 0; while (pending.length && pending[0].arrive <= t) { queue.push(pending.shift()); k++; } return k; };
  admit();
  while (finished < procs.length) {
    if (!queue.length) { slots.push('idle'); t++; admit(); continue; }
    const p = queue.shift();
    const run = Math.min(q, rem[p.name]);
    for (let k = 0; k < run; k++) { slots.push(p.name); t++; }
    rem[p.name] -= run;
    const sameT = pending.filter(x => x.arrive === t).length;
    admit();                                   // 신규 프로세스가 타임아웃된 프로세스보다 먼저 큐에 들어간다
    if (rem[p.name] > 0) {
      if (queue.length) st.decisions++;
      st.traps += sameT;                       // 타임아웃과 동시에 도착 → 큐 순서 함정
      if (rem[p.name] === 1) st.close++;       // 1만 남기고 밀려나는 경우
      queue.push(p);
    } else {
      finished++;
      if (p.burst > q && run === q) st.close++; // 퀀텀을 딱 맞춰 끝나는 경우
    }
  }
  return { slots, tie: false, log: [], stats: st };
}

function schedRunSRTF(procs) {
  const rem = {}; procs.forEach(p => rem[p.name] = p.burst);
  const slots = [], st = schedStat();
  let t = 0, tie = false, left = procs.length, prev = null;
  while (left > 0) {
    const ready = procs.filter(p => rem[p.name] > 0 && p.arrive <= t);
    if (!ready.length) { slots.push('idle'); t++; prev = null; continue; }
    ready.sort((a, b) => rem[a.name] - rem[b.name] || a.arrive - b.arrive);
    if (ready.length > 1 && rem[ready[0].name] === rem[ready[1].name]) tie = true;
    const p = ready[0];
    const running = prev && rem[prev.name] > 0 ? prev : null;
    if (running) {
      procs.filter(x => x.arrive === t).forEach(x => {   // 실행 중에 새 프로세스 도착 → 남은 시간 비교
        st.decisions++;
        if (Math.abs(x.burst - rem[running.name]) <= 1) st.close++;
      });
      if (p !== running) st.traps++;                     // 선점 발생
    } else if (ready.length > 1) {                       // CPU가 비어서 고르는 경우
      st.decisions++;
      if (p !== schedFifoFirst(ready)) st.traps++;
      if (rem[ready[1].name] - rem[p.name] <= 1) st.close++;
    }
    slots.push(p.name); rem[p.name]--; t++;
    if (rem[p.name] === 0) left--;
    prev = p;
  }
  return { slots, tie, log: [], stats: st };
}

const schedHrnRatio = (p, t) => ((t - p.arrive) + p.burst) / p.burst;

// 알고리즘 레지스트리: 객체 하나만 추가하면 설정 화면에 버튼이 생긴다.
//  run(procs, opt) → { slots: ['A','A','idle',...], tie: 동률 발생 여부, log: [해설 문자열], stats: schedStat() }
//  stars: 난이도 ★2 ~ ★5 가 되는 최소 점수 (schedScore 기준, 알고리즘마다 점수 분포가 달라 따로 둔다)
const SCHED_ALGOS = [
  { id: 'fcfs', name: 'FCFS', kind: '비선점', params: [], stars: [6, 8, 10, 13],
    desc: '도착한 순서대로 CPU를 배정합니다. 한 번 실행되면 끝날 때까지 CPU를 놓지 않습니다.',
    run: schedMakeNonPre((a, b) => a.arrive - b.arrive, p => p.name + '(도착 ' + p.arrive + ')') },
  { id: 'sjf', name: 'SJF', kind: '비선점', params: [], stars: [6, 10, 14, 20],
    desc: 'CPU가 비면 준비 큐에서 작업시간이 가장 짧은 프로세스를 선택합니다. 한 번 실행되면 끝날 때까지 유지됩니다.',
    run: schedMakeNonPre((a, b) => a.burst - b.burst, p => p.name + '(작업 ' + p.burst + ')',
      { close: (a, b) => b.burst - a.burst <= 1 }) },
  { id: 'hrn', name: 'HRN', kind: '비선점', params: [], stars: [6, 10, 14, 21],
    desc: 'CPU가 비면 우선순위 = (대기시간 + 작업시간) / 작업시간 이 가장 큰 프로세스를 선택합니다. 한 번 실행되면 끝날 때까지 유지됩니다.',
    run: schedMakeNonPre(
      (a, b, t) => ((t - b.arrive) + b.burst) * a.burst - ((t - a.arrive) + a.burst) * b.burst,
      (p, t) => p.name + '(' + schedHrnRatio(p, t).toFixed(2) + ')',
      { // SJF로 풀었을 때와 답이 달라지면 함정 1개 추가
        trap: (ready, p) => (p !== ready.reduce((m, r) => (r.burst < m.burst ? r : m), ready[0]) ? 1 : 0),
        close: (a, b, t) => schedHrnRatio(a, t) - schedHrnRatio(b, t) < 0.25 }) },
  { id: 'rr', name: 'RR', kind: '선점', params: ['tq'], stars: [10, 17, 25, 40],
    desc: '타임 퀀텀만큼 실행한 뒤 준비 큐 맨 뒤로 돌아갑니다. 신규 프로세스가 타임아웃된 프로세스보다 먼저 준비 큐에 들어갑니다.',
    run: schedRunRR },
  { id: 'srtf', name: 'SRTF', kind: '선점', params: [], stars: [10, 15, 21, 29],
    desc: '매 순간 남은 시간이 가장 짧은 프로세스를 실행합니다. 신규 프로세스가 도착하면 남은 시간을 다시 비교합니다.',
    run: schedRunSRTF },
];

// 난이도 프리셋: 고르면 아래 세부 설정 값이 채워진다. 세부 값을 직접 바꾸면 '사용자 지정'이 된다.
const SCHED_LEVELS = [
  { id: 1, name: '쉬움',      n: 3, bMin: 2, bMax: 6,  gap: 3, tq: 3 },
  { id: 2, name: '보통',      n: 4, bMin: 2, bMax: 9,  gap: 5, tq: 4 },
  { id: 3, name: '어려움',    n: 5, bMin: 1, bMax: 10, gap: 4, tq: 3 },
  { id: 4, name: '매우 어려움', n: 6, bMin: 1, bMax: 12, gap: 3, tq: 3 },
  { id: 5, name: '극한',      n: 8, bMin: 1, bMax: 12, gap: 3, tq: 2 },
];

// 난이도 점수 = 실행 구간 수 + 선택 횟수 + 2×함정 + 근소한 비교 + 2×유휴 구간
function schedScore(res) {
  let segs = 0, idle = 0;
  res.slots.forEach((s, i) => { if (s !== res.slots[i - 1]) { if (s === 'idle') idle++; else segs++; } });
  const st = res.stats || schedStat();
  return segs + st.decisions + 2 * st.traps + st.close + 2 * idle;
}
function schedStars(algo, score) { return 1 + algo.stars.filter(s => score >= s).length; }
function schedStarText(k) { return '★'.repeat(k) + '☆'.repeat(5 - k); }

function schedAlgo(id) { return SCHED_ALGOS.find(a => a.id === id) || SCHED_ALGOS[0]; }

function schedInfo(procs, slots) {
  const per = {};
  procs.forEach(p => {
    const fin = slots.lastIndexOf(p.name) + 1;
    per[p.name] = { fin, tat: fin - p.arrive, wt: fin - p.arrive - p.burst };
  });
  const n = procs.length;
  return {
    per,
    avgTat: procs.reduce((s, p) => s + per[p.name].tat, 0) / n,
    avgWt: procs.reduce((s, p) => s + per[p.name].wt, 0) / n,
  };
}

function schedSegments(slots) {
  const segs = [];
  slots.forEach((s, i) => {
    const last = segs[segs.length - 1];
    if (last && last.name === s) last.end = i + 1; else segs.push({ name: s, start: i, end: i + 1 });
  });
  return segs.filter(s => s.name !== 'idle').map(s => s.name + '(' + s.start + '~' + s.end + ')').join(' → ');
}

// 동률/유휴 조건 + 최소 난이도(minStars)를 만족할 때까지 다시 뽑는다.
// 끝까지 못 찾으면: 동률/유휴 조건을 지킨 후보 중 가장 어려운 것 → 그것도 없으면 마지막 후보.
function schedGenerate(cfg) {
  const algo = schedAlgo(cfg.algoId);
  const minScore = cfg.minStars > 1 ? algo.stars[cfg.minStars - 2] : -Infinity;
  let last = null, best = null;
  for (let attempt = 0; attempt < 4000; attempt++) {
    let t = 0;
    const procs = [];
    for (let i = 0; i < cfg.n; i++) {
      if (i > 0) t += prRand(1, cfg.gap);
      procs.push({ name: String.fromCharCode(65 + i), arrive: t, burst: prRand(cfg.bMin, cfg.bMax) });
    }
    const res = algo.run(procs, { tq: cfg.tq });
    const score = schedScore(res);
    last = { procs, res, score };
    if (cfg.noIdle && res.slots.includes('idle')) continue;
    if (cfg.noTie && res.tie) continue;
    if (score >= minScore) return { procs, res, score, relaxed: false, belowMin: false };
    if (!best || score > best.score) best = last;
  }
  if (best) return { ...best, relaxed: false, belowMin: true };
  return { ...last, relaxed: true, belowMin: last.score < minScore };
}

let SC = null;
const SCHED_SAVE_KEY = 'quizLauncher.sched';

function schedLoadSaved() {
  try { return JSON.parse(localStorage.getItem(SCHED_SAVE_KEY)) || {}; } catch (e) { return {}; }
}
function schedSave() {
  try {
    localStorage.setItem(SCHED_SAVE_KEY, JSON.stringify({
      algoId: SC.algoId, level: SC.level, floor: document.getElementById('sc-floor').value,
      n: document.getElementById('sc-n').value, bMin: document.getElementById('sc-bmin').value,
      bMax: document.getElementById('sc-bmax').value, gap: document.getElementById('sc-gap').value,
      tq: document.getElementById('sc-tq').value,
    }));
  } catch (e) { /* 저장 불가 환경이면 무시 */ }
}

function schedMount(root) {
  const sv = schedLoadSaved();
  const L0 = SCHED_LEVELS.find(l => l.id === sv.level) || SCHED_LEVELS[1];
  const v = (k, d) => (sv[k] !== undefined && sv.level === 'custom' ? sv[k] : d);
  SC = { algoId: schedAlgo(sv.algoId).id, level: sv.level === 'custom' ? 'custom' : L0.id,
    problem: null, gantt: [], L: 0, sel: '', painting: false, mark: [], checked: false, revealed: false };
  root.innerHTML = `
    <div class="pr-card">
      <h3 class="pr-h">⚙️ 문제 설정</h3>
      <div class="pr-f" style="margin-bottom:12px">알고리즘<div class="pr-seg" id="sc-algos"></div></div>
      <div class="pr-f" style="margin-bottom:12px">난이도<div class="pr-seg" id="sc-levels"></div></div>
      <div class="pr-row">
        <label class="pr-f">최소 난이도
          <select id="sc-floor" onchange="schedSave()">
            <option value="level">선택한 난이도 이상</option>
            <option value="0">제한 없음</option>
            ${[2, 3, 4, 5].map(k => `<option value="${k}">${schedStarText(k)} 이상</option>`).join('')}
          </select></label>
        <label class="pr-f">프로세스 수
          <select id="sc-n" onchange="schedCustom()">${[3, 4, 5, 6, 7, 8].map(n => `<option value="${n}" ${n == v('n', L0.n) ? 'selected' : ''}>${n}개</option>`).join('')}</select></label>
        <label class="pr-f">작업시간 범위
          <span><input type="number" id="sc-bmin" value="${v('bMin', L0.bMin)}" min="1" max="12" oninput="schedCustom()"> ~ <input type="number" id="sc-bmax" value="${v('bMax', L0.bMax)}" min="1" max="12" oninput="schedCustom()"></span></label>
        <label class="pr-f">도착 간격 최대
          <input type="number" id="sc-gap" value="${v('gap', L0.gap)}" min="1" max="10" oninput="schedCustom()"></label>
        <label class="pr-f" id="sc-tq-wrap">타임 퀀텀
          <select id="sc-tq" onchange="schedCustom()">${[1, 2, 3, 4, 5].map(n => `<option value="${n}" ${n == v('tq', L0.tq) ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
      </div>
      <div class="pr-row">
        <label class="pr-chk"><input type="checkbox" id="sc-notie" checked> 동률 없는 문제만 출제</label>
        <label class="pr-chk"><input type="checkbox" id="sc-noidle" checked> CPU 유휴 시간 없는 문제만 출제</label>
        <button class="pr-btn indigo" onclick="schedNew()">🎲 새 문제</button>
      </div>
      <div class="pr-sub">작업시간과 도착시간 단위는 msec입니다. 프로세스 이름은 도착 순서대로 A, B, C … 입니다.<br>
        난이도(★)는 실제로 만들어진 간트차트를 보고 매깁니다: 실행 구간 수 · 준비 큐에서 고르는 횟수 · 함정(도착 순서와 다른 선택, 선점, 타임아웃과 동시 도착) · 근소한 비교 · 유휴 구간.
        '최소 난이도'보다 쉬운 문제는 버리고 다시 뽑습니다.</div>
    </div>
    <div id="sc-problem"></div>`;
  const fl = document.getElementById('sc-floor');
  if (sv.floor !== undefined && [...fl.options].some(o => o.value === sv.floor)) fl.value = sv.floor;
  schedRenderAlgoButtons();
  schedRenderLevelButtons();
  schedNew();
}

function schedRenderAlgoButtons() {
  document.getElementById('sc-algos').innerHTML = SCHED_ALGOS.map(a =>
    `<button class="${a.id === SC.algoId ? 'active' : ''}" onclick="schedPickAlgo('${a.id}')">${a.name}</button>`).join('');
  const algo = schedAlgo(SC.algoId);
  document.getElementById('sc-tq-wrap').style.display = algo.params.includes('tq') ? 'flex' : 'none';
}

function schedRenderLevelButtons() {
  document.getElementById('sc-levels').innerHTML = SCHED_LEVELS.map(l =>
    `<button class="${l.id === SC.level ? 'active' : ''}" onclick="schedPickLevel(${l.id})">${schedStarText(l.id)} ${l.name}</button>`).join('') +
    `<button class="${SC.level === 'custom' ? 'active' : ''}" onclick="schedCustom()">사용자 지정</button>`;
}

function schedPickAlgo(id) { SC.algoId = id; schedRenderAlgoButtons(); schedSave(); schedNew(); }

function schedPickLevel(id) {
  const L = SCHED_LEVELS.find(l => l.id === id);
  SC.level = id;
  document.getElementById('sc-n').value = L.n;
  document.getElementById('sc-bmin').value = L.bMin;
  document.getElementById('sc-bmax').value = L.bMax;
  document.getElementById('sc-gap').value = L.gap;
  document.getElementById('sc-tq').value = L.tq;
  schedRenderLevelButtons(); schedSave(); schedNew();
}

// 세부 값을 직접 바꾸면 프리셋 → 사용자 지정
function schedCustom() { SC.level = 'custom'; schedRenderLevelButtons(); schedSave(); }

// 최소 난이도(별 개수). '선택한 난이도 이상'은 사용자 지정일 때 제한 없음으로 본다.
function schedMinStars() {
  const f = document.getElementById('sc-floor').value;
  if (f === 'level') return SC.level === 'custom' ? 1 : SC.level;
  return Math.max(1, parseInt(f, 10) || 1);
}

function schedConfig() {
  const clamp = (v, lo, hi, d) => (v === null ? d : Math.min(hi, Math.max(lo, v)));
  let bMin = clamp(prInt('sc-bmin'), 1, 12, 2), bMax = clamp(prInt('sc-bmax'), 1, 12, 9);
  if (bMin > bMax) [bMin, bMax] = [bMax, bMin];
  return {
    algoId: SC.algoId,
    n: parseInt(document.getElementById('sc-n').value, 10),
    bMin, bMax,
    gap: clamp(prInt('sc-gap'), 1, 10, 5),
    tq: parseInt(document.getElementById('sc-tq').value, 10),
    noTie: document.getElementById('sc-notie').checked,
    noIdle: document.getElementById('sc-noidle').checked,
    minStars: schedMinStars(),
  };
}

function schedNew() {
  const cfg = schedConfig();
  const g = schedGenerate(cfg);
  const info = schedInfo(g.procs, g.res.slots);
  SC.problem = { cfg, procs: g.procs, ans: { slots: g.res.slots, log: g.res.log, info, stats: g.res.stats },
    score: g.score, stars: schedStars(schedAlgo(cfg.algoId), g.score), relaxed: g.relaxed, belowMin: g.belowMin };
  SC.L = g.res.slots.length + 2;
  SC.gantt = Array(SC.L).fill('');
  SC.sel = g.procs[0].name;
  SC.mark = []; SC.checked = false; SC.revealed = false;
  schedRender();
}

function schedRender() {
  const P = SC.problem, algo = schedAlgo(P.cfg.algoId);
  const tqText = algo.params.includes('tq') ? ' · 타임 퀀텀 = ' + P.cfg.tq : '';
  const tieText = algo.kind === '비선점' || algo.id === 'srtf' ? '<br>' + SCHED_TIE_RULE : '';
  const color = n => SCHED_COLORS[n.charCodeAt(0) - 65];
  document.getElementById('sc-problem').innerHTML = `
    <div class="pr-card">
      <h3 class="pr-h">📋 ${algo.name} 스케줄링 <span class="pr-chip">${algo.kind}</span>${tqText ? `<span class="pr-chip">${tqText.replace(' · ', '')}</span>` : ''}<span class="pr-chip" title="난이도 점수 ${P.score}">난이도 ${schedStarText(P.stars)}</span></h3>
      <div class="pr-sub" style="margin-bottom:8px">${escHtml(algo.desc)}${tieText}${P.relaxed ? '<br><b style="color:#b45309">※ 조건에 맞는 문제를 찾지 못해 동률/유휴 조건을 완화했습니다. 위 동률 규칙을 적용하세요.</b>' : ''}${P.belowMin ? `<br><b style="color:#b45309">※ 현재 설정(프로세스 수·작업시간·도착 간격)으로는 최소 난이도 ${schedStarText(P.cfg.minStars)}를 만들기 어려워 가장 어려운 후보를 냈습니다. 프로세스 수를 늘리거나 도착 간격을 줄여 보세요.</b>` : ''}</div>
      <div class="pr-tablewrap"><table class="pr-table">
        <tr><th>프로세스</th>${P.procs.map(p => `<td class="pname" style="color:${color(p.name)}">${p.name}</td>`).join('')}</tr>
        <tr><th>도착시간</th>${P.procs.map(p => `<td>${p.arrive}</td>`).join('')}</tr>
        <tr><th>작업시간</th>${P.procs.map(p => `<td>${p.burst}</td>`).join('')}</tr>
      </table></div>
    </div>
    <div class="pr-card">
      <h3 class="pr-h">📊 간트차트 <small style="font-weight:500;color:#64748b">프로세스를 고른 뒤 칸을 클릭(드래그)하세요. 빈 시간은 비워 둡니다.</small></h3>
      <div class="pr-palette" id="sc-palette"></div>
      <div class="pr-gantt-scroll"><div class="pr-gantt" id="sc-gantt"></div></div>
    </div>
    <div class="pr-card">
      <h3 class="pr-h">🧮 결과 표 <small style="font-weight:500;color:#64748b">반환시간 = 종료시간 − 도착시간 · 대기시간 = 반환시간 − 작업시간 · 평균은 소수점 둘째 자리까지</small></h3>
      <div class="pr-tablewrap"><table class="pr-table" id="sc-result-table">
        <tr><th>프로세스</th><th>종료시간</th><th>반환시간</th><th>대기시간</th></tr>
        ${P.procs.map(p => `<tr><td class="pname" style="color:${color(p.name)}">${p.name}</td>
          <td><input class="pr-num" id="sc-fin-${p.name}" inputmode="numeric"></td>
          <td><input class="pr-num" id="sc-tat-${p.name}" inputmode="numeric"></td>
          <td><input class="pr-num" id="sc-wt-${p.name}" inputmode="numeric"></td></tr>`).join('')}
        <tr><td class="pname">평균</td><td>-</td>
          <td><input class="pr-num" id="sc-avgtat" inputmode="decimal"></td>
          <td><input class="pr-num" id="sc-avgwt" inputmode="decimal"></td></tr>
      </table></div>
      <div id="sc-feedback"></div>
      <div class="pr-actions">
        <button class="pr-btn indigo" onclick="schedCheck()">✅ 채점하기</button>
        <button class="pr-btn ghost" onclick="schedReveal()">👀 정답 보기</button>
        <button class="pr-btn" onclick="schedNew()">다음 문제 →</button>
      </div>
      <div id="sc-answer"></div>
    </div>`;
  schedRenderPalette();
  schedRenderGantt();
}

function schedRenderPalette() {
  const P = SC.problem;
  document.getElementById('sc-palette').innerHTML =
    P.procs.map(p => `<button class="pr-pal ${SC.sel === p.name ? 'sel' : ''}" style="background:${SCHED_COLORS[p.name.charCodeAt(0) - 65]}" onclick="schedSelect('${p.name}')">${p.name}</button>`).join('') +
    `<button class="pr-pal erase ${SC.sel === '' ? 'sel' : ''}" onclick="schedSelect('')">지우기</button>
     <button class="pr-btn ghost" style="padding:6px 12px;font-size:12px" onclick="schedClearAll()">전체 비우기</button>`;
}

function schedSelect(name) { SC.sel = name; schedRenderPalette(); }
function schedClearAll() { SC.gantt = Array(SC.L).fill(''); SC.mark = []; schedRenderGantt(); }

function schedRenderGantt() {
  const el = document.getElementById('sc-gantt');
  el.innerHTML = Array.from({ length: SC.L }, (_, i) => {
    const v = SC.gantt[i];
    const cls = SC.mark[i] === undefined ? '' : (SC.mark[i] ? ' ok' : ' ng');
    const bg = v ? `style="background:${SCHED_COLORS[v.charCodeAt(0) - 65]}"` : '';
    return `<div class="pr-slot-wrap"><div class="pr-slot${cls}" ${bg}
      onmousedown="schedPaint(${i},event)" onmouseenter="schedPaintMove(${i},event)">${v}</div><div class="pr-tick">${i}</div></div>`;
  }).join('');
}

function schedPaint(i, e) {
  e.preventDefault();
  SC.painting = true;
  SC.gantt[i] = SC.sel; SC.mark[i] = undefined;
  schedRenderGantt();
}
function schedPaintMove(i, e) {
  if (!SC.painting || e.buttons !== 1) return;
  if (SC.gantt[i] === SC.sel) return;
  SC.gantt[i] = SC.sel; SC.mark[i] = undefined;
  schedRenderGantt();
}

function schedCheck() {
  const P = SC.problem, A = P.ans;
  const root = document.getElementById('sc-problem');
  root.querySelectorAll('.pr-num').forEach(e => e.classList.remove('ok', 'ng'));

  // 간트차트
  let gTot = 0, gOK = 0;
  SC.mark = [];
  for (let i = 0; i < SC.L; i++) {
    const s = A.slots[i];
    const exp = (s === undefined || s === 'idle') ? '' : s;
    const user = SC.gantt[i] || '';
    if (exp === '' && user === '') continue;
    gTot++;
    const ok = user === exp;
    SC.mark[i] = ok;
    if (ok) gOK++;
  }
  // 표
  let tTot = 0, tOK = 0;
  P.procs.forEach(p => {
    const e = A.info.per[p.name];
    [['fin', e.fin], ['tat', e.tat], ['wt', e.wt]].forEach(([k, exp]) => {
      const v = prInt('sc-' + k + '-' + p.name);
      const ok = v === exp;
      tTot++; if (ok) tOK++;
      prMark('sc-' + k + '-' + p.name, ok);
    });
  });
  [['avgtat', A.info.avgTat], ['avgwt', A.info.avgWt]].forEach(([id, exp]) => {
    const v = prNum('sc-' + id);
    const ok = v !== null && Math.abs(v - exp) <= 0.01;
    tTot++; if (ok) tOK++;
    prMark('sc-' + id, ok);
  });
  SC.checked = true;
  schedRenderGantt();
  const all = gOK === gTot && tOK === tTot;
  document.getElementById('sc-feedback').innerHTML = `
    <div class="pr-result ${all ? 'good' : 'bad'}">
      <b>${all ? '🎉 모두 정답입니다!' : '채점 결과'}</b><br>
      간트차트 ${gOK} / ${gTot}칸 정답 · 결과 표 ${tOK} / ${tTot}칸 정답
      ${all ? '' : '<br>초록 테두리는 정답, 빨간 칸은 오답입니다. 다시 수정하거나 정답을 확인하세요.'}
    </div>`;
}

function schedReveal() {
  const P = SC.problem, A = P.ans;
  const segs = schedSegments(A.slots);
  const rows = P.procs.map(p => {
    const e = A.info.per[p.name];
    return `<tr><td class="pname">${p.name}</td><td>${e.fin}</td><td>${e.tat}</td><td>${e.wt}</td></tr>`;
  }).join('');
  const ganttRO = `<div class="pr-gantt-scroll"><div class="pr-gantt">${A.slots.map((s, i) =>
    `<div class="pr-slot-wrap"><div class="pr-slot ro" ${s === 'idle' ? '' : `style="background:${SCHED_COLORS[s.charCodeAt(0) - 65]}"`}>${s === 'idle' ? '' : s}</div><div class="pr-tick">${i}</div></div>`).join('')}</div></div>`;
  document.getElementById('sc-answer').innerHTML = `
    <div class="pr-answer">
      <b>정답 간트차트</b>${ganttRO}
      <div style="margin-top:6px"><b>실행 순서</b>: ${segs}</div>
      <div style="margin-top:4px"><b>난이도</b>: ${schedStarText(P.stars)} (점수 ${P.score} · 고르기 ${A.stats.decisions}회 · 함정 ${A.stats.traps}개 · 근소한 비교 ${A.stats.close}회)</div>
      ${A.log.length ? `<div style="margin-top:8px"><b>선택 과정</b><div class="pr-log">${A.log.map(escHtml).join('\n')}</div></div>` : ''}
      <div class="pr-tablewrap"><table class="pr-table" style="margin-top:8px">
        <tr><th>프로세스</th><th>종료시간</th><th>반환시간</th><th>대기시간</th></tr>${rows}
        <tr><td class="pname">평균</td><td>-</td><td>${A.info.avgTat.toFixed(2)}</td><td>${A.info.avgWt.toFixed(2)}</td></tr>
      </table></div>
    </div>`;
  SC.revealed = true;
}

registerPractice({
  id: 'sched', subject: '운영체제', icon: '🗓️', title: '스케줄링 연습',
  desc: '무작위 프로세스로 FCFS · SJF · HRN · RR · SRTF 간트차트와 결과 표를 직접 채워 보세요 (난이도 ★1~★5 · 최소 난이도 설정)',
  mount: schedMount,
});

document.addEventListener('mouseup', () => { if (typeof SC !== 'undefined' && SC) SC.painting = false; });
