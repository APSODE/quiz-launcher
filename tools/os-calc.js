// 운영체제 계산 검증: 스케줄링 · 은행가 알고리즘 · 메모리 관리(페이징 · 연속 할당)의 정답을 계산한다. (문제의 정답 · 해설 숫자를 확인할 때 쓴다)
//  계산은 실행기 플러그인 엔진(플러그인/운영체제/1_스케줄링.js · 2_은행가.js · 5_메모리관리.js)으로 하고, 이 파일의 독립 구현(참조)으로 한 번 더
//  계산해 둘이 다르면 ⚠️ 로 알린다. 그래서 연습 메뉴 화면의 정답과 문제 파일의 정답이 같은 기준으로 맞춰진다.
//
//  스케줄링  node tools/os-calc.js sched <fcfs|sjf|hrn|rr|srtf|all> "A 0 7, B 3 5, C 5 2" [--tq 4]
//            프로세스 = "이름 도착 작업시간" 을 쉼표로 구분. 출력: 간트 차트, 프로세스별 종료 · 반환 · 대기 시간, 평균
//  은행가    node tools/os-calc.js banker --alloc "0 1 0; 2 0 0; 3 0 2" --max "7 5 3; 3 2 2; 9 0 2" --avail "3 3 2"
//            [--names "P0 P1 P2"] [--request "P1: 1 0 2"]
//            행 = 세미콜론, 자원 = 공백. 출력: Need, 전체 자원, 안전 여부, 가능한 안전 순서 전부.
//            --request 를 주면 Request ≤ Need · Request ≤ Available 를 확인하고, 할당한 뒤의 상태를 다시 판정한다.
//  주소 변환 node tools/os-calc.js paging page --size 1KiB --addr 2500 --table "0:5, 1:2, 2:7, 3:1"
//            테이블 = "페이지:프레임" 을 쉼표로 구분. 출력: 페이지 번호 · 변위 · 프레임 · 물리 주소 (테이블에 없으면 페이지 폴트)
//  물리 구성 node tools/os-calc.js paging phys --mem 4MiB --size 4KiB       프레임 수 · 물리 주소 · 프레임 번호 · 변위 비트
//  테이블    node tools/os-calc.js paging table --bits 32 --size 4KiB --pte 4   변위 · 페이지 번호 비트, 엔트리 수, 테이블 크기
//  단편화    node tools/os-calc.js paging frag --proc 18KiB --size 4KiB     필요한 페이지 수 · 할당 공간 · 내부 단편화
//            크기 = 4096 · 4,096 · 4KiB · 4KB · 4K · 2^12 · 1MiB · 1GiB (K/M/G 는 모두 1,024 기준)
//  연속 할당 node tools/os-calc.js fit --holes "100 500 200 300 600" --req "212 417 112 426" [--method ff|bf|wf|all]
//            빈 공간 = 주소 순. 출력: 요청마다 "212 → 500 공간 (남은 공간 288) → 빈 공간 목록", 최종 빈 공간, 결과 판정
//            (모두 할당 / 외부 단편화 = 첫 실패 때 빈 공간 합 ≥ 요청 / 합 부족). 기본은 all (최초 · 최적 · 최악 적합)
//  자체 검사 node tools/os-calc.js --self-test [횟수]   엔진과 참조 구현을 무작위 입력으로 비교 (pre-commit 훅이 운영체제 플러그인을 고친 커밋에서 실행)
//
//  동률 규칙: 먼저 도착한(준비 큐에 먼저 들어온) 프로세스 우선. RR은 신규 도착이 타임아웃된 프로세스보다 먼저 큐에 들어간다.
//            연속 할당은 크기가 같은 후보가 여럿이면 주소가 앞선 빈 공간. 각 방식은 같은 초기 상태에서 따로 시작, 반환 · 압축 없음.
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
  for (const f of ['1_스케줄링.js', '2_은행가.js', '5_메모리관리.js'])
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
    // 메모리 관리 (5_메모리관리.js): 인자 · 결과 모두 JSON 으로 복제해 주고받는다
    call(fn, ...a) {
      ctx.__x = JSON.stringify(a);
      const out = vm.runInContext(`(function () { var r = ${fn}.apply(null, JSON.parse(__x)); return r === undefined ? 'null' : JSON.stringify(r); })()`, ctx, { timeout: 2000 });
      return JSON.parse(out);
    },
    page(addr, P, table) { return this.call('mmPage', addr, P, table); },
    phys(M, P) { return this.call('mmPhys', M, P); },
    table(L, P, pte) { return this.call('mmTable', L, P, pte); },
    frag(size, P) { return this.call('mmFrag', size, P); },
    fit(holes, reqs, method) { return this.call('mmFit', holes, reqs, method); },
    fitCause(run) { return this.call('mmFitCause', run); },
    parseSize(v) { return this.call('mmParseSize', v); },
    parseCount(v) { return this.call('mmParseCount', v); },
    parseList(v) { return this.call('mmParseList', v); },
    examples() { return JSON.parse(vm.runInContext('JSON.stringify(MM_EXAMPLES)', ctx)); },
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

// ── 메모리 관리 참조 구현 (엔진과 따로 작성. Math.log2 · 나눗셈 대신 반으로 나누기 · 비트 반복 · 후보 직접 훑기) ──
function refLog2(x) {            // 2의 거듭제곱이면 지수, 아니면 null
  if (!Number.isInteger(x) || x < 1) return null;
  let k = 0;
  while (x > 1) { if (x % 2) return null; x /= 2; k++; }
  return k;
}
function refPow2(k) { let v = 1; for (let i = 0; i < k; i++) v *= 2; return v; }
function refPage(addr, P, table) {
  let p = 0, base = 0;
  while (base + P <= addr) { base += P; p++; }   // 페이지 단위로 한 칸씩 넘긴다
  const d = addr - base;
  let frame = null;
  for (const [pg, fr] of table) if (pg === p) { frame = fr; break; }
  if (frame === null) return { p, d, frame: null, phys: null, fault: true };
  let phys = d;
  for (let i = 0; i < frame; i++) phys += P;
  return { p, d, frame, phys, fault: false };
}
function refPhys(M, P) {
  let pbits = 0, m = M; while (m > 1) { m /= 2; pbits++; }
  let obits = 0, q = P; while (q > 1) { q /= 2; obits++; }
  const fbits = pbits - obits;
  return { frames: refPow2(fbits), pbits, obits, fbits };
}
function refTable(L, P, pte) {
  let obits = 0; for (let q = P; q > 1; q /= 2) obits++;
  const pbits = L - obits, entries = refPow2(pbits);
  let size = 0; for (let i = 0; i < pte; i++) size += entries;
  return { obits, pbits, entries, size };
}
function refFrag(size, P) {
  let pages = 0, alloc = 0;
  while (alloc < size) { alloc += P; pages++; }
  return { pages, alloc, frag: alloc - size };
}
function refFit(holes, reqs, method) {
  let cur = holes.slice();
  const steps = [], fails = [];
  reqs.forEach((req, k) => {
    const before = cur.slice();
    let sum = 0; for (const h of before) sum += h;
    const cand = [];
    for (let i = 0; i < before.length; i++) if (before[i] >= req) cand.push(i);
    let idx = -1, tie = false;
    if (cand.length) {
      if (method === 'ff') idx = cand[0];
      else {
        let want = before[cand[0]];
        for (const i of cand) if (method === 'bf' ? before[i] < want : before[i] > want) want = before[i];
        const same = cand.filter(i => before[i] === want);
        idx = same[0]; tie = same.length > 1;
      }
    }
    if (idx < 0) { fails.push(k); steps.push({ req, idx: -1, size: null, rest: null, before, after: before.slice(), tie: false, sum }); return; }
    const after = before.slice(); after[idx] = before[idx] - req;
    steps.push({ req, idx, size: before[idx], rest: after[idx], before, after, tie, sum });
    cur = after;
  });
  return { steps, final: cur, fails, allOk: fails.length === 0 };
}
function refFitCause(run) {
  if (!run.fails.length) return 'ok';
  const s = run.steps[run.fails[0]];
  return s.sum >= s.req ? 'ext' : 'short';
}
// 규약에 있는 필드만, 정해진 순서로 뽑아 비교한다 (엔진이 덧붙인 필드 · 키 순서는 무시)
const MM_KEYS = { page: ['p', 'd', 'frame', 'phys', 'fault'], phys: ['frames', 'pbits', 'obits', 'fbits'], table: ['obits', 'pbits', 'entries', 'size'], frag: ['pages', 'alloc', 'frag'] };
const pick = (o, ks) => JSON.stringify(o == null ? o : ks.map(k => o[k]));
const fitKey = r => (r == null ? 'null' : JSON.stringify([(r.steps || []).map(s => [s.req, s.idx, s.size, s.rest, s.before, s.after, s.tie, s.sum]), r.final, r.fails, r.allOk]));

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

// ── 메모리 관리 명령 ──
const comma = n => Number(n).toLocaleString('en-US');
function unitStr(b) {            // 1,024 기준 단위로 딱 떨어지면 "4MiB", 아니면 null
  for (const [u, nm] of [[2 ** 30, 'GiB'], [2 ** 20, 'MiB'], [2 ** 10, 'KiB']]) if (b >= u && b % u === 0) return (b / u) + nm;
  return null;
}
function fmtB(b) {               // "4,194,304바이트 (2^22) = 4MiB"
  const k = refLog2(b), u = unitStr(b);
  return `${comma(b)}바이트${k !== null ? ` (2^${k})` : ''}${u ? ` = ${u}` : ''}`;
}
function parseSizeArg(v, what) {
  const m = String(v == null ? '' : v).trim().replace(/,/g, '').match(/^(?:2\^(\d+)|(\d+(?:\.\d+)?))\s*(b|bytes?|바이트|k|kb|kib|m|mb|mib|g|gb|gib)?$/i);
  const mul = { k: 2 ** 10, m: 2 ** 20, g: 2 ** 30 };
  const val = m ? (m[1] !== undefined ? 2 ** +m[1] : +m[2]) * (m[3] ? mul[m[3][0].toLowerCase()] || 1 : 1) : NaN;
  if (!Number.isInteger(val) || val < 1) throw new Error(`${what} "${v}": 크기 형식 (예: 4096 · 4KiB · 2^12 · 1MiB)`);
  return val;
}
function parseIntArg(v, what) {
  const x = String(v == null ? '' : v).trim().replace(/,/g, '');
  if (!/^\d+$/.test(x)) throw new Error(`${what} "${v}": 0 이상의 정수`);
  return +x;
}
const parseNums = s => String(s || '').split(/[\s,→>\-]+/).filter(Boolean).map(Number);
function mmCheck(label, eng, ref, keys) {
  if (pick(eng, keys) === pick(ref, keys)) return 0;
  console.log(`  ⚠️ ${label} 참조 구현과 다름\n    엔진 ${JSON.stringify(eng)}\n    참조 ${JSON.stringify(ref)}`);
  return 1;
}

function cmdPaging(args) {
  const sub = (args[0] || '').toLowerCase(), E = loadEngines();
  if (sub === 'page') {
    const P = parseSizeArg(opt(args, '--size'), '--size'), addr = parseIntArg(opt(args, '--addr'), '--addr');
    const table = [...String(opt(args, '--table') || '').matchAll(/(\d+)\s*[:,]\s*(\d+)/g)].map(m => [+m[1], +m[2]]);
    if (!table.length) throw new Error('--table "0:5, 1:2, 2:7" 형식 (페이지:프레임)');
    const r = E.page(addr, P, table), ref = refPage(addr, P, table);
    console.log(`페이지 크기 ${fmtB(P)} · 논리 주소 ${addr}`);
    console.log('페이지 테이블: ' + table.map(([p, f]) => `(${p},${f})`).join(', '));
    console.log(`  1. 페이지 번호 = ${addr} ÷ ${P} 의 몫 = ${r.p}`);
    console.log(`  2. 변위 = ${addr} − ${r.p} × ${P} = ${addr} − ${r.p * P} = ${r.d}`);
    if (r.fault) console.log(`  3. 페이지 ${r.p} 는 테이블에 없음 → 페이지 폴트(유효하지 않은 주소)\n답: 페이지 폴트`);
    else console.log(`  3. 페이지 ${r.p} → 프레임 ${r.frame}\n  4. 물리 주소 = ${r.frame} × ${P} + ${r.d} = ${r.phys}\n답: ${r.phys}`);
    return mmCheck('주소 변환', r, ref, MM_KEYS.page);
  }
  if (sub === 'phys') {
    const M = parseSizeArg(opt(args, '--mem'), '--mem'), P = parseSizeArg(opt(args, '--size'), '--size');
    if (refLog2(M) === null || refLog2(P) === null || P > M) throw new Error('--mem · --size 는 2의 거듭제곱, 페이지 ≤ 메모리');
    const r = E.phys(M, P), ref = refPhys(M, P);
    console.log(`물리 메모리 ${fmtB(M)} · 페이지 크기 ${fmtB(P)}`);
    console.log(`  1. 프레임 수 = 2^${r.pbits} ÷ 2^${r.obits} = 2^${r.fbits} = ${comma(r.frames)}개`);
    console.log(`  2. 물리 주소 = log2(2^${r.pbits}) = ${r.pbits}비트`);
    console.log(`  3. 변위 = log2(2^${r.obits}) = ${r.obits}비트`);
    console.log(`  4. 프레임 번호 = ${r.pbits} − ${r.obits} = ${r.fbits}비트`);
    console.log(`답: 프레임 ${comma(r.frames)}개, 물리 주소 ${r.pbits}비트, 프레임 번호 ${r.fbits}비트, 변위 ${r.obits}비트`);
    return mmCheck('물리 메모리 구성', r, ref, MM_KEYS.phys);
  }
  if (sub === 'table') {
    const L = parseIntArg(opt(args, '--bits'), '--bits'), P = parseSizeArg(opt(args, '--size'), '--size'), pte = parseSizeArg(opt(args, '--pte'), '--pte');
    const ob = refLog2(P);
    if (ob === null || !(L > ob && L <= 64)) throw new Error('--size 는 2의 거듭제곱, --bits 는 변위 비트보다 큰 정수');
    const r = E.table(L, P, pte), ref = refTable(L, P, pte), pk = refLog2(pte);
    console.log(`논리 주소 ${L}비트 · 페이지 크기 ${fmtB(P)} · PTE ${comma(pte)}바이트`);
    console.log(`  1. 논리 주소 공간 = 2^${L} 바이트`);
    console.log(`  2. 변위 = ${r.obits}비트, 페이지 번호 = ${L} − ${r.obits} = ${r.pbits}비트`);
    console.log(`  3. 엔트리 수 = 2^${L} ÷ 2^${r.obits} = 2^${r.pbits} = ${comma(r.entries)}개`);
    console.log(`  4. 페이지 테이블 크기 = 2^${r.pbits} × ${pte}${pk !== null ? ` = 2^${r.pbits + pk}` : ''} 바이트 = ${comma(r.size)}바이트${unitStr(r.size) ? ` = ${unitStr(r.size)}` : ''}`);
    console.log(`답: ${unitStr(r.size) || comma(r.size) + '바이트'}`);
    return mmCheck('페이지 테이블 크기', r, ref, MM_KEYS.table);
  }
  if (sub === 'frag') {
    const S = parseSizeArg(opt(args, '--proc'), '--proc'), P = parseSizeArg(opt(args, '--size'), '--size');
    const r = E.frag(S, P), ref = refFrag(S, P), u = b => unitStr(b) ? ` = ${unitStr(b)}` : '';
    console.log(`프로세스 크기 ${fmtB(S)} · 페이지 크기 ${fmtB(P)}`);
    console.log(`  1. ${comma(S)} ÷ ${comma(P)} = ${num(S / P)}`);
    console.log(`  2. 필요한 페이지 수 = ⌈${num(S / P)}⌉ = ${r.pages}개`);
    console.log(`  3. 할당 공간 = ${r.pages} × ${comma(P)} = ${comma(r.alloc)}바이트${u(r.alloc)}`);
    console.log(`  4. 내부 단편화 = ${comma(r.alloc)} − ${comma(S)} = ${comma(r.frag)}바이트${u(r.frag)}`);
    console.log(`답: 페이지 ${r.pages}개, 할당 공간 ${unitStr(r.alloc) || comma(r.alloc) + '바이트'}, 내부 단편화 ${r.frag ? unitStr(r.frag) || comma(r.frag) + '바이트' : '0'}`);
    return mmCheck('내부 단편화', r, ref, MM_KEYS.frag);
  }
  throw new Error('paging <page|phys|table|frag> (사용법은 인자 없이 실행)');
}

const FIT_NAMES = { ff: '최초 적합 (First Fit)', bf: '최적 적합 (Best Fit)', wf: '최악 적합 (Worst Fit)' };
const fitLine = s => (s.idx < 0 ? `${s.req} → 할당 실패(대기)` : `${s.req} → ${s.size} 공간 (남은 공간 ${s.rest}) → ${s.after.join(', ')}`);
function cmdFit(args) {
  const holes = parseNums(opt(args, '--holes')), reqs = parseNums(opt(args, '--req')), method = (opt(args, '--method') || 'all').toLowerCase();
  if (!holes.length || !reqs.length || holes.concat(reqs).some(x => !Number.isInteger(x) || x < 0)) throw new Error('--holes "100 500 200" --req "212 417" (0 이상의 정수, 공백 · 쉼표 · → 로 구분)');
  const list = method === 'all' ? ['ff', 'bf', 'wf'] : [method];
  if (!list.every(m => FIT_NAMES[m])) throw new Error('--method ff | bf | wf | all');
  const E = loadEngines();
  let bad = 0;
  const ok = [];
  console.log(`빈 공간(주소 순): ${holes.join(' → ')}\n요청 순서: ${reqs.join(' → ')}`);
  list.forEach(m => {
    const r = E.fit(holes, reqs, m), ref = refFit(holes, reqs, m), cause = E.fitCause(r), refCause = refFitCause(ref);
    console.log(`\n■ ${FIT_NAMES[m]}`);
    r.steps.forEach((s, i) => console.log(`  ${i + 1}. ${fitLine(s)}${s.idx < 0 ? `   (빈 공간 합 ${s.sum})` : ''}${s.tie ? '   ※ 같은 크기 후보 여럿 → 주소가 앞선 공간' : ''}`));
    console.log(`  ${r.steps.length + 1}. 최종 빈 공간: ${r.final.join(', ')}`);
    const f = r.fails.length ? r.steps[r.fails[0]] : null;
    console.log('  결과: ' + (cause === 'ok' ? '모두 할당' : cause === 'ext'
      ? `외부 단편화 — ${f.req} 할당 실패 때 빈 공간 합 ${f.sum} ≥ ${f.req} 이지만 이어진 ${f.req} 이상의 공간이 없음`
      : cause === 'short' ? `합 부족 — ${f.req} 할당 실패 때 빈 공간 합 ${f.sum} < ${f.req}` : `알 수 없음(${JSON.stringify(cause)})`));
    if (cause === 'ok') ok.push(m);
    if (fitKey(r) !== fitKey(ref)) { bad++; console.log('  ⚠️ 참조 구현과 다름:'); ref.steps.forEach((s, i) => console.log(`    ${i + 1}. ${fitLine(s)}${s.tie ? ' (동률)' : ''}`)); console.log(`    최종 ${ref.final.join(', ')} · 실패 ${JSON.stringify(ref.fails)}`); }
    if (cause !== refCause) { bad++; console.log(`  ⚠️ 결과 판정이 참조 구현과 다름: 엔진 ${cause} · 참조 ${refCause}`); }
  });
  if (list.length > 1) console.log(`\n모든 요청을 할당한 방식: ${ok.length ? ok.map(m => FIT_NAMES[m]).join(' · ') : '없음'}`);
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
    // 메모리 관리: 다섯 유형을 엔진 = 참조로 비교
    const mmBad = (what, inp, e, r) => { if (bad++ < 5) console.log(`⚠️ ${what} ${JSON.stringify(inp)}\n  엔진 ${JSON.stringify(e)}\n  참조 ${JSON.stringify(r)}`); };
    {
      const P = 2 ** R(9, 14), n = R(4, 8), pages = [...Array(n + 3).keys()].sort(() => Math.random() - 0.5).slice(0, n).sort((a, b) => a - b);
      const frames = [...Array(32).keys()].sort(() => Math.random() - 0.5);
      const table = pages.map((p, i) => [p, frames[i]]), addr = R(0, (n + 3) * P - 1);
      const e = E.page(addr, P, table), r = refPage(addr, P, table);
      if (pick(e, MM_KEYS.page) !== pick(r, MM_KEYS.page)) mmBad('page', { addr, P, table }, e, r);
    }
    {
      const P = 2 ** R(9, 14), M = 2 ** R(16, 32), e = E.phys(M, P), r = refPhys(M, P);
      if (pick(e, MM_KEYS.phys) !== pick(r, MM_KEYS.phys)) mmBad('phys', { M, P }, e, r);
    }
    {
      const L = R(16, 32), P = 2 ** R(9, 14), pte = [2, 4, 8][R(0, 2)], e = E.table(L, P, pte), r = refTable(L, P, pte);
      if (pick(e, MM_KEYS.table) !== pick(r, MM_KEYS.table)) mmBad('table', { L, P, pte }, e, r);
    }
    {
      const P = 2 ** R(9, 14), size = R(0, 4) ? R(1, 40 * P) : R(1, 40) * P, e = E.frag(size, P), r = refFrag(size, P);
      if (pick(e, MM_KEYS.frag) !== pick(r, MM_KEYS.frag)) mmBad('frag', { size, P }, e, r);
    }
    {
      const holes = [...Array(R(4, 6))].map(() => R(5, 60) * 10), reqs = [...Array(R(3, 5))].map(() => R(4, 50) * 10);
      if (R(0, 1)) holes[R(0, holes.length - 1)] = holes[R(0, holes.length - 1)];          // 같은 크기 빈 공간 → 동률 규칙
      if (!R(0, 3)) reqs[R(0, reqs.length - 1)] = holes[R(0, holes.length - 1)] - R(0, 1) * 10;  // 가끔 딱 맞거나 거의 맞게
      for (const m of ['ff', 'bf', 'wf']) {
        const e = E.fit(holes, reqs, m), r = refFit(holes, reqs, m);
        if (fitKey(e) !== fitKey(r)) mmBad('fit ' + m, { holes, reqs }, e, r);
        else if (E.fitCause(e) !== refFitCause(r)) mmBad('fitCause ' + m, { holes, reqs }, E.fitCause(e), refFitCause(r));
      }
    }
  }
  // 메모리 관리: 문서 예제(MM_EXAMPLES) 기대값 · 입력 해석 고정 검사
  let fixed = 0;
  const expect = (what, got, want) => { fixed++; if (JSON.stringify(got) !== JSON.stringify(want)) { if (bad++ < 20) console.log(`⚠️ ${what}\n  기대 ${JSON.stringify(want)}\n  실제 ${JSON.stringify(got)}`); } };
  const X = E.examples();
  expect('MM_EXAMPLES', X, { page: { P: 1024, addr: 2500, table: [[0, 5], [1, 2], [2, 7], [3, 1]] }, phys: [{ M: 4 * 2 ** 20, P: 4096 }, { M: 64 * 2 ** 20, P: 4096 }], table: { L: 32, P: 4096, pte: 4 }, frag: { size: 18 * 1024, P: 4096 }, fit: { holes: [100, 500, 200, 300, 600], reqs: [212, 417, 112, 426] } });
  expect('문서 유형 1', JSON.parse(pick(E.page(2500, 1024, [[0, 5], [1, 2], [2, 7], [3, 1]]), MM_KEYS.page)), [2, 452, 7, 7620, false]);
  expect('유형 1 페이지 폴트', JSON.parse(pick(E.page(4100, 1024, [[0, 5], [1, 2], [2, 7], [3, 1]]), MM_KEYS.page)), [4, 4, null, null, true]);
  expect('문서 유형 2 A', JSON.parse(pick(E.phys(4 * 2 ** 20, 4096), MM_KEYS.phys)), [1024, 22, 12, 10]);
  expect('문서 유형 2 B', JSON.parse(pick(E.phys(64 * 2 ** 20, 4096), MM_KEYS.phys)), [16384, 26, 12, 14]);
  expect('문서 유형 3', JSON.parse(pick(E.table(32, 4096, 4), MM_KEYS.table)), [12, 20, 2 ** 20, 4 * 2 ** 20]);
  expect('문서 유형 4', JSON.parse(pick(E.frag(18 * 1024, 4096), MM_KEYS.frag)), [5, 20 * 1024, 2 * 1024]);
  expect('유형 4 정확한 배수', JSON.parse(pick(E.frag(16 * 1024, 4096), MM_KEYS.frag)), [4, 16 * 1024, 0]);
  const DOC_FIT = {
    ff: ['212 → 500 공간 (남은 공간 288) → 100, 288, 200, 300, 600', '417 → 600 공간 (남은 공간 183) → 100, 288, 200, 300, 183', '112 → 288 공간 (남은 공간 176) → 100, 176, 200, 300, 183', '426 → 할당 실패(대기)', '100, 176, 200, 300, 183', 'ext', 959],
    bf: ['212 → 300 공간 (남은 공간 88) → 100, 500, 200, 88, 600', '417 → 500 공간 (남은 공간 83) → 100, 83, 200, 88, 600', '112 → 200 공간 (남은 공간 88) → 100, 83, 88, 88, 600', '426 → 600 공간 (남은 공간 174) → 100, 83, 88, 88, 174', '100, 83, 88, 88, 174', 'ok', null],
    wf: ['212 → 600 공간 (남은 공간 388) → 100, 500, 200, 300, 388', '417 → 500 공간 (남은 공간 83) → 100, 83, 200, 300, 388', '112 → 388 공간 (남은 공간 276) → 100, 83, 200, 300, 276', '426 → 할당 실패(대기)', '100, 83, 200, 300, 276', 'ext', 959],
  };
  for (const m of ['ff', 'bf', 'wf']) {
    const r = E.fit([100, 500, 200, 300, 600], [212, 417, 112, 426], m);
    expect('문서 유형 5 ' + m, [...r.steps.map(fitLine), r.final.join(', '), E.fitCause(r), r.fails.length ? r.steps[r.fails[0]].sum : null], DOC_FIT[m]);
  }
  const sz = v => { const r = E.parseSize(v); return r && [r.val, r.plain]; };
  [['4096', [4096, true]], ['4,096', [4096, true]], ['4KiB', [4096, false]], ['4 KB', [4096, false]], ['4Kib', [4096, false]], ['4k', [4096, false]],
   ['2^12B', [4096, false]], ['1MiB', [2 ** 20, false]], ['1mb', [2 ** 20, false]], ['1GiB', [2 ** 30, false]], ['3바이트', [3, false]], ['3B', [3, false]],
   ['4.5KiB', [4608, false]], ['0.3B', null], ['abc', null], ['', null]].forEach(([v, w]) => expect(`mmParseSize(${JSON.stringify(v)})`, sz(v), w));
  expect('mmParseSize("2^12").val', (E.parseSize('2^12') || {}).val, 4096);
  [['1024', 1024], ['1,024', 1024], ['2^10', 1024], ['10비트', 10], ['10bit', 10], ['5개', 5], ['x', null]].forEach(([v, w]) => expect(`mmParseCount(${JSON.stringify(v)})`, E.parseCount(v), w));
  ['100, 288, 200', '100 288 200', '100 → 288 → 200'].forEach(v => expect(`mmParseList(${JSON.stringify(v)})`, E.parseList(v), [100, 288, 200]));
  console.log(bad ? `자체 검사 실패: ${bad}건 다름 (${N}회)` : `자체 검사 통과: 스케줄링 ${N * ALGOS.length}회 · 은행가 ${N}회 · 주소 변환 · 물리 메모리 · 페이지 테이블 · 내부 단편화 각 ${N}회 · 연속 할당 ${N * 3}회 엔진 = 참조, 문서 예제 · 입력 해석 고정 검사 ${fixed}건 통과`);
  return bad ? 1 : 0;
}

try {
  const [cmd, ...rest] = process.argv.slice(2);
  const code = cmd === 'sched' ? cmdSched(rest) : cmd === 'banker' ? cmdBanker(rest) : cmd === 'paging' ? cmdPaging(rest) : cmd === 'fit' ? cmdFit(rest) : cmd === '--self-test' ? cmdSelfTest(rest) : null;
  if (code === null) { console.log(fs.readFileSync(__filename, 'utf8').split('\n').slice(0, 23).map(l => l.replace(/^\/\/ ?/, '')).join('\n')); process.exit(2); }
  process.exit(code);
} catch (e) { console.error('오류: ' + e.message); process.exit(2); }
