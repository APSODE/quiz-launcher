// 운영체제 계산 검증: 스케줄링 · 은행가 알고리즘의 정답을 계산한다. (문제의 정답 · 해설 숫자를 확인할 때 쓴다)
//  계산은 실행기 플러그인 엔진(플러그인/운영체제/1_스케줄링.js · 2_은행가.js)으로 하고, 이 파일의 독립 구현(참조)으로 한 번 더 계산해
//  둘이 다르면 ⚠️ 로 알린다. 그래서 연습 메뉴 화면의 정답과 문제 파일의 정답이 같은 기준으로 맞춰진다.
//
//  스케줄링  node tools/os-calc.js sched <fcfs|sjf|hrn|rr|srtf|all> "A 0 7, B 3 5, C 5 2" [--tq 4]
//            프로세스 = "이름 도착 작업시간" 을 쉼표로 구분. 출력: 간트 차트, 프로세스별 종료 · 반환 · 대기 시간, 평균
//  은행가    node tools/os-calc.js banker --alloc "0 1 0; 2 0 0; 3 0 2" --max "7 5 3; 3 2 2; 9 0 2" --avail "3 3 2"
//            [--names "P0 P1 P2"] [--request "P1: 1 0 2"]
//            행 = 세미콜론, 자원 = 공백. 출력: Need, 전체 자원, 안전 여부, 가능한 안전 순서 전부.
//            --request 를 주면 Request ≤ Need · Request ≤ Available 를 확인하고, 할당한 뒤의 상태를 다시 판정한다.
//  자체 검사 node tools/os-calc.js --self-test [횟수]   엔진과 참조 구현을 무작위 입력으로 비교 (pre-commit 훅이 운영체제 플러그인을 고친 커밋에서 실행)
//
//  동률 규칙: 먼저 도착한(준비 큐에 먼저 들어온) 프로세스 우선. RR은 신규 도착이 타임아웃된 프로세스보다 먼저 큐에 들어간다.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..');

// ── 플러그인 엔진 불러오기 (vm 샌드박스, DOM 은 아무것도 안 하는 대역) ──
function loadEngines() {
  const ctx = vm.createContext(Object.create(null));
  vm.runInContext(`
    var __noop = new Proxy(function () {}, { get: function (t, k) { return k === Symbol.toPrimitive ? function () { return ''; } : __noop; }, apply: function () { return __noop; }, construct: function () { return __noop; } });
    var document = __noop, window = this, localStorage = __noop, console = { log: function () {}, warn: function () {} };
    function registerPractice() {} function escHtml(s) { return String(s); }
    function prRand(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
    function prVec(v) { return '(' + v.join(', ') + ')'; }
    var SCHED_COLORS = [];`, ctx);
  for (const f of ['1_스케줄링.js', '2_은행가.js'])
    vm.runInContext(fs.readFileSync(path.join(ROOT, '플러그인', '운영체제', f), 'utf8'), ctx, { filename: f, timeout: 2000 });
  return {
    sched(algo, procs, tq) {
      ctx.__a = algo; ctx.__p = JSON.stringify(procs); ctx.__tq = tq;
      return JSON.parse(vm.runInContext(`(function () { var p = JSON.parse(__p), r = schedAlgo(__a).run(p, { tq: __tq }); return JSON.stringify({ slots: r.slots, tie: r.tie }); })()`, ctx, { timeout: 2000 }));
    },
    banker(alloc, max, avail) {
      ctx.__x = JSON.stringify([alloc, max, avail]);
      return JSON.parse(vm.runInContext(`(function () { var x = JSON.parse(__x); return JSON.stringify(bkAnalyze(x[0], x[1], x[2])); })()`, ctx, { timeout: 5000 }));
    },
  };
}

// ── 참조 구현 (엔진과 따로 작성. 1틱 단위 시뮬레이션) ──
function refSched(algo, procs, tq) {
  const arr = {}, bur = {}, rem = {}, fin = {};
  procs.forEach(p => { arr[p.name] = p.arrive; bur[p.name] = p.burst; rem[p.name] = p.burst; });
  const order = procs.map(p => p.name), seen = new Set(), q = [], slots = [];
  let t = 0, cur = null, slice = 0;
  const arrive = () => order.filter(n => !seen.has(n) && arr[n] <= t).sort((a, b) => arr[a] - arr[b]).forEach(n => { seen.add(n); q.push(n); });
  const take = key => { let best = 0; q.forEach((n, i) => { if (key(n, q[best]) < 0) best = i; }); return q.splice(best, 1)[0]; };
  arrive();
  while (Object.keys(fin).length < procs.length) {
    if (cur === null) {
      if (!q.length) { slots.push('idle'); t++; arrive(); continue; }
      if (algo === 'fcfs' || algo === 'rr') cur = q.shift();
      else if (algo === 'sjf') cur = take((a, b) => bur[a] - bur[b] || arr[a] - arr[b]);
      else if (algo === 'srtf') cur = take((a, b) => rem[a] - rem[b] || arr[a] - arr[b]);
      else if (algo === 'hrn') cur = take((a, b) => ((t - arr[b]) + bur[b]) * bur[a] - ((t - arr[a]) + bur[a]) * bur[b] || arr[a] - arr[b]);
      slice = 0;
    }
    slots.push(cur); rem[cur]--; t++; slice++;
    arrive();
    if (rem[cur] === 0) { fin[cur] = t; cur = null; }
    else if (algo === 'rr' && slice === tq) { q.push(cur); cur = null; }
    else if (algo === 'srtf' && q.length) {
      const c = q.reduce((m, n) => (rem[n] < rem[m] || (rem[n] === rem[m] && arr[n] < arr[m]) ? n : m), q[0]);
      if (rem[c] < rem[cur]) { q.push(cur); cur = null; }
    }
  }
  return slots;
}
function refBanker(alloc, max, avail) {
  const n = alloc.length, need = alloc.map((r, i) => r.map((a, j) => max[i][j] - a)), seqs = [];
  const all = []; (function p(left, order) { if (!left.length) { all.push(order); return; } left.forEach(i => p(left.filter(x => x !== i), [...order, i])); })([...Array(n).keys()], []);
  all.forEach(o => {
    let w = avail.slice();
    for (const i of o) { if (!need[i].every((x, j) => x <= w[j])) return; w = w.map((v, j) => v + alloc[i][j]); }
    seqs.push(o);
  });
  return seqs;
}

// ── 출력 도우미 ──
const ALGOS = ['fcfs', 'sjf', 'hrn', 'rr', 'srtf'];
function info(procs, slots) {
  const per = procs.map(p => { const fin = slots.lastIndexOf(p.name) + 1; return { name: p.name, arrive: p.arrive, burst: p.burst, fin, tat: fin - p.arrive, wt: fin - p.arrive - p.burst }; });
  const avg = k => per.reduce((s, x) => s + x[k], 0) / per.length;
  return { per, avgTat: avg('tat'), avgWt: avg('wt') };
}
function gantt(slots) {
  const segs = [];
  slots.forEach((s, i) => { const l = segs[segs.length - 1]; if (l && l.n === s) l.e = i + 1; else segs.push({ n: s, s: i, e: i + 1 }); });
  return segs.map(x => `${x.n === 'idle' ? '(유휴)' : x.n} ${x.s}~${x.e}`).join(' | ');
}
const num = x => (Number.isInteger(x) ? String(x) : x.toFixed(2).replace(/0+$/, ''));
function parseProcs(s) {
  return s.split(',').map(x => x.trim()).filter(Boolean).map(x => {
    const [name, a, b] = x.split(/\s+/);
    if (!name || isNaN(+a) || isNaN(+b) || +b < 1) throw new Error(`프로세스 "${x}" 형식: 이름 도착 작업시간 (예: A 0 7)`);
    return { name, arrive: +a, burst: +b };
  });
}
const parseMat = s => s.split(';').map(r => r.trim()).filter(Boolean).map(r => r.split(/[\s,]+/).map(Number));
function opt(args, k) { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; }

// ── 명령 ──
function cmdSched(args) {
  const algo = (args[0] || '').toLowerCase(), procs = parseProcs(args[1] || ''), tq = +(opt(args, '--tq') || 0);
  const list = algo === 'all' ? ALGOS : [algo];
  if (!list.every(a => ALGOS.includes(a))) throw new Error('알고리즘: ' + ALGOS.join(' | ') + ' | all');
  if (list.includes('rr') && !(tq > 0)) { if (algo === 'all') list.splice(list.indexOf('rr'), 1); else throw new Error('RR은 --tq <타임 퀀텀> 이 필요합니다'); }
  const E = loadEngines();
  let bad = 0;
  console.log('프로세스: ' + procs.map(p => `${p.name}(도착 ${p.arrive}, 작업 ${p.burst})`).join(' · '));
  list.forEach(a => {
    const r = E.sched(a, procs, tq), ref = refSched(a, procs, tq), I = info(procs, r.slots);
    console.log(`\n■ ${a.toUpperCase()}${a === 'rr' ? ` (퀀텀 ${tq})` : ''}${r.tie ? '  ※ 동률 발생 — 먼저 도착한 프로세스 우선으로 계산' : ''}`);
    console.log('  간트: ' + gantt(r.slots));
    console.log('  프로세스  종료  반환  대기');
    I.per.forEach(x => console.log(`  ${x.name.padEnd(8)}${String(x.fin).padStart(4)}${String(x.tat).padStart(6)}${String(x.wt).padStart(6)}`));
    console.log(`  평균 반환 ${num(I.avgTat)} · 평균 대기 ${num(I.avgWt)}`);
    if (ref.join() !== r.slots.join()) { bad++; console.log('  ⚠️ 참조 구현과 다름: ' + gantt(ref)); }
  });
  return bad ? 1 : 0;
}

function cmdBanker(args) {
  let alloc = parseMat(opt(args, '--alloc') || ''), max = parseMat(opt(args, '--max') || ''), avail = (opt(args, '--avail') || '').trim().split(/[\s,]+/).map(Number);
  const n = alloc.length, m = avail.length;
  if (!n || max.length !== n || alloc.some(r => r.length !== m) || max.some(r => r.length !== m) || avail.some(isNaN))
    throw new Error('--alloc · --max 는 같은 행 수, 모든 행의 자원 수 = --avail 의 자원 수');
  const names = (opt(args, '--names') || '').trim().split(/\s+/).filter(Boolean);
  const nm = i => names[i] || 'P' + i;
  const E = loadEngines();
  const vec = v => '(' + v.join(' ') + ')';
  let bad = 0;
  const report = (title, alloc, avail) => {
    const an = E.banker(alloc, max, avail), ref = refBanker(alloc, max, avail);
    console.log(`\n■ ${title}`);
    console.log('  프로세스  Alloc  Max  Need');
    alloc.forEach((r, i) => console.log(`  ${nm(i).padEnd(8)}${vec(r)} ${vec(max[i])} ${vec(an.need[i])}${an.need[i].some(x => x < 0) ? '  ⚠️ Need 음수 (Max < Alloc)' : ''}`));
    console.log(`  Available ${vec(avail)} · 전체 자원 ${vec(an.total)}`);
    console.log(an.safe ? `  안전 상태 · 안전 순서 ${an.count}가지` : '  불안전 상태 (안전 순서 없음)');
    an.seqs.slice(0, 30).forEach(s => console.log('    ' + s.map(nm).join(' → ')));
    if (an.count > 30) console.log(`    … 외 ${an.count - 30}가지`);
    const key = s => s.map(x => x.join()).sort().join('|');
    if (key(ref) !== key(an.seqs)) { bad++; console.log(`  ⚠️ 참조 구현과 다름: ${ref.length}가지`); }
    return an;
  };
  const an = report('현재 상태', alloc, avail);
  const req = opt(args, '--request');
  if (req) {
    const [who, v] = req.split(':');
    const i = names.length ? names.indexOf(who.trim()) : +who.trim().replace(/^P/i, '');
    const r = (v || '').trim().split(/[\s,]+/).map(Number);
    if (!(i >= 0 && i < n) || r.length !== m) throw new Error('--request "P1: 1 0 2" 형식 (프로세스 이름: 자원 수)');
    console.log(`\n■ 요청 ${nm(i)} ${vec(r)}`);
    const okNeed = r.every((x, j) => x <= an.need[i][j]), okAvail = r.every((x, j) => x <= avail[j]);
    console.log(`  Request ≤ Need ${vec(an.need[i])}: ${okNeed ? '예' : '아니오 → 오류(최대 요구 초과)'}`);
    console.log(`  Request ≤ Available ${vec(avail)}: ${okAvail ? '예' : '아니오 → 대기'}`);
    if (okNeed && okAvail) {
      const a2 = alloc.map((row, k) => (k === i ? row.map((x, j) => x + r[j]) : row.slice()));
      const av2 = avail.map((x, j) => x - r[j]);
      const after = report('할당 가정 후 상태', a2, av2);
      console.log(after.safe ? '  → 안전하므로 요청 승인' : '  → 불안전하므로 요청 거절(대기)');
    }
  }
  return bad ? 1 : 0;
}

function cmdSelfTest(args) {
  const N = +(args[0] || 300), E = loadEngines();
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  let bad = 0;
  for (let k = 0; k < N; k++) {
    const n = R(2, 6), procs = [...Array(n)].map((_, i) => ({ name: String.fromCharCode(65 + i), arrive: R(0, 10), burst: R(1, 9) }));
    procs.sort((a, b) => a.arrive - b.arrive);
    const tq = R(1, 5);
    for (const a of ALGOS) {
      const e = E.sched(a, procs, tq).slots, r = refSched(a, procs, tq);
      if (e.join() !== r.join()) { if (bad++ < 5) console.log(`⚠️ ${a} tq=${tq} ${JSON.stringify(procs)}\n  엔진 ${gantt(e)}\n  참조 ${gantt(r)}`); }
    }
    const pn = R(2, 5), m = R(1, 4);
    const max = [...Array(pn)].map(() => [...Array(m)].map(() => R(0, 7)));
    const alloc = max.map(row => row.map(x => R(0, x)));
    const avail = [...Array(m)].map(() => R(0, 4));
    const key = s => s.map(x => x.join()).sort().join('|');
    if (key(E.banker(alloc, max, avail).seqs) !== key(refBanker(alloc, max, avail))) { if (bad++ < 5) console.log('⚠️ banker ' + JSON.stringify({ alloc, max, avail })); }
  }
  console.log(bad ? `자체 검사 실패: ${bad}건 다름 (${N}회)` : `자체 검사 통과: 스케줄링 ${N * ALGOS.length}회 · 은행가 ${N}회 엔진 = 참조`);
  return bad ? 1 : 0;
}

try {
  const [cmd, ...rest] = process.argv.slice(2);
  const code = cmd === 'sched' ? cmdSched(rest) : cmd === 'banker' ? cmdBanker(rest) : cmd === '--self-test' ? cmdSelfTest(rest) : null;
  if (code === null) { console.log(fs.readFileSync(__filename, 'utf8').split('\n').slice(0, 14).map(l => l.replace(/^\/\/ ?/, '')).join('\n')); process.exit(2); }
  process.exit(code);
} catch (e) { console.error('오류: ' + e.message); process.exit(2); }
