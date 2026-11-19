// 5_메모리관리.js — quiz_launcher 플러그인: 메모리 관리 계산 연습 (페이징 · 내부 단편화 · 연속 메모리 할당 · 2단계 페이지 테이블 · TLB EAT · 예약 vs 점유)
// 실행기가 일반 <script>로 실행한다. 실행기 공통 함수(escHtml, prRand, registerPractice 등)를 전역으로 쓴다.
// 문항 데이터 없이 문제를 무작위로 만든다. 최상위 이름은 모두 mm / MM 접두어.
// 단위는 2의 거듭제곱 기준(1KiB = 2^10, 1MiB = 2^20, 1GiB = 2^30 바이트), 메모리는 바이트 단위 주소 지정.

// ════════════════════════════════════════════════════════
//  계산 (순수 함수 — 크기는 모두 바이트 정수. tools/os-calc.js 가 vm 에서 불러 참조 구현과 비교한다)
//   mmPage(addr, P, table)    유형 1. table = [[page, frame], ...] → { p, d, frame, phys, fault } (fault 면 frame · phys = null)
//   mmPhys(M, P)              유형 2. M, P 는 2의 거듭제곱 → { frames, pbits, obits, fbits }
//   mmTable(L, P, pte)        유형 3. L = 논리 주소 비트 수 → { obits, pbits, entries, size }
//   mmFrag(size, P)           유형 4 → { pages, alloc, frag }
//   mmFit(holes, reqs, method) 유형 5. method = 'ff' | 'bf' | 'wf', holes = 주소 순 빈 공간(KiB 정수)
//                             → { steps: [{ req, idx, size, rest, before, after, tie, sum }], final, fails, allOk }
//   mmFitCause(run)           'ok'(모두 할당) | 'ext'(첫 실패 때 빈 공간 합 ≥ 요청 → 외부 단편화) | 'short'(합도 모자람)
//   mmTwoLevel(V, P, pte, sub) 유형 6. V = 가상 주소 비트 수, sub = 하위 테이블 하나의 크기(생략 · null = P)
//                             → { off, lowEntries, low, high }  (high = V − low − off)
//   mmEat(tlb, mem, hitPct, levels, parallel) 유형 7. ns 정수, hitPct = 퍼센트(소수 첫째 자리까지)
//                             → { hit, miss, eat }  순차: miss = tlb + levels·mem + mem, 병렬: miss = levels·mem + mem
//                               eat = (h·hit + (1000 − h)·miss) / 1000, h = round(hitPct × 10) (정수 계산 후 나눔)
//   mmReserve(R, P, n)        유형 8. R = 예약 크기, n = 프레임이 할당된 페이지 수 → { vpages, used }
//   mmParseSize / mmParseCount / mmParseList / mmParseTime   입력 해석 (실패 = null)
//   MM_EXAMPLES               수업 문서 예제
// ════════════════════════════════════════════════════════
function mmLog2(x) { return Math.round(Math.log2(x)); }
function mmIsPow2(x) { return x > 0 && Number.isInteger(x) && 2 ** mmLog2(x) === x; }

function mmPage(addr, P, table) {
  const p = Math.floor(addr / P), d = addr - p * P;
  const e = table.find(r => r[0] === p);
  if (!e) return { p, d, frame: null, phys: null, fault: true };
  return { p, d, frame: e[1], phys: e[1] * P + d, fault: false };
}
function mmPhys(M, P) {
  const pbits = mmLog2(M), obits = mmLog2(P);
  return { frames: M / P, pbits, obits, fbits: pbits - obits };
}
function mmTable(L, P, pte) {
  const obits = mmLog2(P), pbits = L - obits, entries = 2 ** pbits;
  return { obits, pbits, entries, size: entries * pte };
}
function mmFrag(size, P) {
  const pages = Math.ceil(size / P), alloc = pages * P;
  return { pages, alloc, frag: alloc - size };
}
// 규칙: 방식마다 같은 초기 상태에서 독립 시작, 반환 · 압축 없음, 실패 요청은 대기로 두고 다음 요청 계속,
//       크기가 같은 후보는 주소가 앞선 공간. 남은 크기는 같은 자리에 둔다(0 이 되어도 자리에 0 으로 남긴다).
function mmFit(holes, reqs, method) {
  let cur = holes.slice();
  const steps = [], fails = [];
  reqs.forEach((req, i) => {
    const before = cur.slice(), sum = before.reduce((s, h) => s + h, 0);
    let idx = -1;
    before.forEach((h, k) => {
      if (h < req) return;
      if (idx < 0) idx = k;
      else if (method === 'bf' ? h < before[idx] : method === 'wf' ? h > before[idx] : false) idx = k;
    });
    if (idx < 0) {
      fails.push(i);
      steps.push({ req, idx: -1, size: null, rest: null, before, after: before.slice(), tie: false, sum });
      return;
    }
    const size = before[idx], rest = size - req;
    const tie = method !== 'ff' && before.filter(h => h >= req && h === size).length >= 2;
    const after = before.slice(); after[idx] = rest;
    cur = after;
    steps.push({ req, idx, size, rest, before, after: after.slice(), tie, sum });
  });
  return { steps, final: cur.slice(), fails, allOk: fails.length === 0 };
}
function mmFitCause(run) {
  if (!run.fails.length) return 'ok';
  const s = run.steps[run.fails[0]];
  return s.sum >= s.req ? 'ext' : 'short';
}
function mmFitAll(holes, reqs) { return { ff: mmFit(holes, reqs, 'ff'), bf: mmFit(holes, reqs, 'bf'), wf: mmFit(holes, reqs, 'wf') }; }
// 유형 6: 하위 테이블 크기가 따로 주어지면 반드시 그 값을 쓴다(생략 · null = 한 페이지)
function mmTwoLevel(V, P, pte, sub) {
  const s = sub == null ? P : sub, off = mmLog2(P), lowEntries = s / pte, low = mmLog2(lowEntries);
  return { off, lowEntries, low, high: V - low - off };
}
// 유형 7: 적중률은 1000분율 정수 h 로 바꿔 정수 계산 후 한 번만 나눈다(부동소수 오차 없음)
function mmEat(tlb, mem, hitPct, levels, parallel) {
  const hit = tlb + mem, miss = (parallel ? 0 : tlb) + levels * mem + mem, h = Math.round(hitPct * 10);
  return { hit, miss, eat: (h * hit + (1000 - h) * miss) / 1000 };
}
// 유형 8
function mmReserve(R, P, n) { return { vpages: R / P, used: n * P }; }

// "4096" · "4,096" · "4KiB" · "4 KB" · "4Kib" · "4K" · "2^12" · "2^12B" · "1MiB" · "1GiB" · "3바이트" · "4.5KiB" → { val(바이트), plain }
const MM_UNIT_MUL = { k: 2 ** 10, m: 2 ** 20, g: 2 ** 30 };
function mmParseSize(v) {
  const t = String(v == null ? '' : v).replace(/[\s,]/g, '').toLowerCase();
  const m = t.match(/^(?:(\d+(?:\.\d+)?)|2\^(\d+))(?:([kmg])i?(?:b|byte|bytes|바이트)?|(b|byte|bytes|바이트))?$/);
  if (!m) return null;
  const base = m[1] != null ? Number(m[1]) : 2 ** Number(m[2]);
  const mul = m[3] ? MM_UNIT_MUL[m[3]] : 1, val = base * mul;
  if (!Number.isFinite(val) || !Number.isInteger(val) || val < 0) return null;
  return { val, plain: !m[3] && !m[4] };
}
// "1024" · "1,024" · "2^10" · "10비트" · "10bit" · "5개" → 정수
function mmParseCount(v) {
  const t = String(v == null ? '' : v).replace(/[\s,]/g, '').toLowerCase();
  const m = t.match(/^(?:(\d+)|2\^(\d+))(?:비트|bits?|개)?$/);
  if (!m) return null;
  const n = m[1] != null ? Number(m[1]) : 2 ** Number(m[2]);
  return Number.isSafeInteger(n) ? n : null;
}
// "100, 288, 200" · "100 288 200" · "100 → 288 → 200" → [100, 288, 200]
function mmParseList(v) {
  const t = String(v == null ? '' : v).toLowerCase().replace(/kib|kb|k/g, ' ').replace(/→|->|>|·/g, ' ');
  const a = t.split(/[\s,]+/).filter(Boolean);
  if (!a.length || !a.every(x => /^\d+$/.test(x))) return null;
  return a.map(Number);
}
// "112" · "112.35" · "112ns" · "112 ns" · "112나노초" → 숫자 (시간 칸)
function mmParseTime(v) {
  const t = String(v == null ? '' : v).replace(/[\s,]/g, '').toLowerCase().replace(/(ns|나노초)$/, '');
  return /^\d+(\.\d+)?$/.test(t) ? Number(t) : null;
}

const MM_EXAMPLES = {
  page: { P: 1024, addr: 2500, table: [[0, 5], [1, 2], [2, 7], [3, 1]] },
  phys: [{ M: 4 * 2 ** 20, P: 4096 }, { M: 64 * 2 ** 20, P: 4096 }],
  table: { L: 32, P: 4096, pte: 4 },
  frag: { size: 18 * 1024, P: 4096 },
  fit: { holes: [100, 500, 200, 300, 600], reqs: [212, 417, 112, 426] },
  two: [{ V: 32, P: 4096, pte: 4, sub: 4096 }, { V: 32, P: 4096, pte: 4, sub: 2048 }],
  eat: { tlb: 10, mem: 100, hit: 99, levels: 2, parallel: false },
  reserve: { R: 64 * 2 ** 20, P: 4096, n: 600 },
};

// ════════════════════════════════════════════════════════
//  표기 도우미
// ════════════════════════════════════════════════════════
function mmComma(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
function mmPick(a) { return a[prRand(0, a.length - 1)]; }
function mmShuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = prRand(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function mmMix() { return !!(MM && MM.opt && MM.opt.mix); }
function mmPow(k) { return `2<sup>${k}</sup>`; }
const MM_UNITS = [[2 ** 30, 'GiB', ['GB', 'Gib']], [2 ** 20, 'MiB', ['MB', 'Mib']], [2 ** 10, 'KiB', ['KB', 'Kib']]];
const MM_NOTE_TO = { KB: 'KiB(1,024바이트)', Kib: 'KiB(1,024바이트)', MB: 'MiB(2^20바이트)', Mib: 'MiB(2^20바이트)', GB: 'GiB(2^30바이트)', Gib: 'GiB(2^30바이트)' };
// 문제에 쓰는 크기 표기. N(배열)을 주고 "표기 섞기"가 켜져 있으면 가끔 KB · Kib 등으로 바꾸고 N 에 기록한다
function mmSz(b, N) {
  const u = MM_UNITS.find(x => b >= x[0] && b % x[0] === 0);
  if (!u) return mmComma(b) + '바이트';
  let s = u[1];
  if (N && mmMix() && Math.random() < 0.5) { s = mmPick(u[2]); if (!N.includes(s)) N.push(s); }
  return mmComma(b / u[0]) + s;
}
function mmUnitAlt(N, base) {
  if (!mmMix() || Math.random() >= 0.5) return base;
  const s = mmPick(MM_UNITS.find(u => u[1] === base)[2]);
  if (!N.includes(s)) N.push(s);
  return s;
}
// 정답 표기: 가장 큰 딱 맞는 단위 (4MiB · 20KiB · 452바이트)
function mmHuman(b) { return mmSz(b, null); }
// 2^22 = 4,194,304바이트 (거듭제곱이 아니면 10진수만)
function mmBytes(b) { return (mmIsPow2(b) ? mmPow(mmLog2(b)) + ' = ' : '') + mmComma(b) + '바이트'; }
function mmNoteHtml(N) {
  return N && N.length ? N.map(s => `<div class="mm-note">※ '${s}'는 ${MM_NOTE_TO[s]}로 해석했습니다.</div>`).join('') : '';
}
function mmSolHtml(N, final, steps, tip) {
  return `${mmNoteHtml(N)}<div class="mm-final">답: ${final}</div><ol class="mm-steps">${steps.map(s => `<li>${s}</li>`).join('')}</ol>${tip ? `<div class="pr-sub">💡 ${tip}</div>` : ''}`;
}
function mmNum(x) { return Number.isInteger(x) ? String(x) : String(Math.round(x * 1000) / 1000); }

// ════════════════════════════════════════════════════════
//  문제 만들기 (S = 문제 상태. 화면 모드와 실전 세트가 함께 쓴다)
// ════════════════════════════════════════════════════════
// 유형 1
function mmMakePage(ex) {
  const N = [];
  let P, addr, table;
  if (ex) { P = ex.P; addr = ex.addr; table = ex.table.map(r => r.slice()); }
  else {
    P = 2 ** prRand(9, 13);
    const n = prRand(4, 8), fault = Math.random() < 0.2;
    const frames = mmShuffle([...Array(Math.max(16, n * 3)).keys()]).slice(0, n + 1);
    const pi = prRand(0, fault ? n : n - 1);
    table = frames.map((f, i) => [i, f]).filter(r => fault ? r[0] !== pi : r[0] < n);
    addr = pi * P + prRand(0, P - 1);
  }
  return { P, addr, table, ans: mmPage(addr, P, table), N, Ptxt: mmSz(P, N) };
}
// 유형 2
function mmMakePhys(ex) {
  const N = [];
  let M, P;
  if (ex) { M = ex.M; P = ex.P; }
  else { P = 2 ** prRand(9, 14); M = 2 ** prRand(Math.max(20, mmLog2(P) + 4), 32); }
  return { M, P, ans: mmPhys(M, P), N, Mtxt: mmSz(M, N), Ptxt: mmSz(P, N) };
}
// 유형 3
function mmMakeTable(ex) {
  const N = [];
  let L, P, pte;
  if (ex) { L = ex.L; P = ex.P; pte = ex.pte; }
  else { L = mmPick([16, 20, 24, 32, 32, 32, 36, 40]); P = 2 ** prRand(9, Math.min(14, L - 2)); pte = mmPick([2, 4, 4, 8]); }
  return { L, P, pte, ans: mmTable(L, P, pte), N, Ptxt: mmSz(P, N) };
}
// 유형 4 (unit = 문제에 쓴 크기 단위의 바이트 수: KiB 로 주면 1024, 바이트로 주면 1)
function mmMakeFrag(ex) {
  const N = [];
  let size, P, unit;
  if (ex) { size = ex.size; P = ex.P; unit = size % 1024 === 0 ? 1024 : 1; }
  else {
    P = 2 ** prRand(9, 14);
    const k = prRand(2, 20), exact = Math.random() < 0.15;
    unit = P >= 2048 && Math.random() < 0.65 ? 1024 : 1;
    if (exact) size = k * P;
    else if (unit === 1024) { const pk = P / 1024; size = ((k - 1) * pk + prRand(1, pk - 1)) * 1024; }
    else size = (k - 1) * P + prRand(1, P - 1);
  }
  const Stxt = unit === 1024 ? mmComma(size / 1024) + mmUnitAlt(N, 'KiB') : mmComma(size) + '바이트';
  return { size, P, unit, ans: mmFrag(size, P), N, Stxt, Ptxt: mmSz(P, N) };
}
// 유형 5: 빈 공간 4~6개(50~600, 10 단위), 요청 3~5개(40~500).
//  남은 0 이 생기는 문제 · 세 방식 결과가 같은 문제는 다시 뽑는다. tieOnly = 최적 · 최악 적합 중 동률이 생기는 문제만,
//  want = 'one' 이면 정확히 한 방식만 모두 할당하는 문제만.
function mmFitCase(tieOnly, want) {
  for (let t = 0; t < 20000; t++) {
    const n = prRand(4, 6), holes = Array.from({ length: n }, () => prRand(5, 60) * 10);
    if (tieOnly) { const a = prRand(0, n - 1); let b = prRand(0, n - 2); if (b >= a) b++; holes[b] = holes[a]; }
    const reqs = Array.from({ length: prRand(3, 5) }, () => prRand(40, 500));
    const runs = mmFitAll(holes, reqs), all = [runs.ff, runs.bf, runs.wf];
    if (all.some(r => r.steps.some(s => s.rest === 0))) continue;
    const sig = r => r.final.join(',') + '|' + r.fails.join(',');
    if (sig(runs.ff) === sig(runs.bf) && sig(runs.bf) === sig(runs.wf)) continue;
    if (tieOnly && !runs.bf.steps.some(s => s.tie) && !runs.wf.steps.some(s => s.tie)) continue;
    if (want === 'one' && all.filter(r => r.allOk).length !== 1) continue;
    return { holes, reqs, runs };
  }
  const E = MM_EXAMPLES.fit;   // 거의 일어나지 않음 — 문서 예제로 대신한다
  return { holes: E.holes.slice(), reqs: E.reqs.slice(), runs: mmFitAll(E.holes, E.reqs) };
}
// 유형 6: 가상 주소 32비트 위주(가끔 36~48), 페이지 2^10~2^14, PTE 4 · 8,
//  하위 테이블 = 한 페이지(대부분) 또는 따로 준 크기(2^9~2^14 중 페이지와 다른 값). 상위 인덱스 ≥ 1
function mmMakeTwo(ex) {
  const N = [];
  let V, P, pte, sub;
  if (ex) { V = ex.V; P = ex.P; pte = ex.pte; sub = ex.sub == null ? ex.P : ex.sub; }
  else {
    for (;;) {
      V = Math.random() < 0.75 ? 32 : mmPick([36, 39, 40, 42, 44, 48]);
      P = 2 ** prRand(10, 14); pte = mmPick([4, 4, 8]);
      sub = P;
      if (Math.random() < 0.3) { let k = prRand(9, 13); if (k >= mmLog2(P)) k++; sub = 2 ** k; }
      if (sub / pte >= 2 && mmTwoLevel(V, P, pte, sub).high >= 1) break;
    }
  }
  return { V, P, pte, sub, one: sub === P, ans: mmTwoLevel(V, P, pte, sub), N, Ptxt: mmSz(P, N), Stxt: mmSz(sub, N) };
}
// 유형 7: TLB 1~20ns, 메모리 50~200ns(10 단위), 적중률 80~99.9%(반은 정수), 단계 1~3, 순차(대부분) / 병렬
function mmMakeEat(ex, par) {
  let tlb, mem, h, levels, parallel;
  if (ex) { tlb = ex.tlb; mem = ex.mem; h = Math.round(ex.hit * 10); levels = ex.levels; parallel = !!ex.parallel; }
  else {
    tlb = prRand(1, 20); mem = prRand(5, 20) * 10;
    h = Math.random() < 0.5 ? prRand(80, 99) * 10 : prRand(800, 999);
    levels = mmPick([1, 2, 2, 3]); parallel = par != null ? par : Math.random() < 0.2;
  }
  const hit = h / 10;
  return { tlb, mem, h, hit, levels, parallel, ans: mmEat(tlb, mem, hit, levels, parallel), N: [] };
}
// 유형 8: 예약 4MiB~1GiB, 페이지 4KiB 위주(가끔 2KiB · 8KiB · 16KiB · 64KiB), 할당 페이지 수 n < 가상 페이지 수
function mmMakeReserve(ex) {
  const N = [];
  let R, P, n;
  if (ex) { R = ex.R; P = ex.P; n = ex.n; }
  else {
    R = Math.random() < 0.7 ? 2 ** prRand(22, 30) : mmPick([12, 24, 48, 96, 100, 192, 256 + 128, 768]) * 2 ** 20;
    P = Math.random() < 0.7 ? 4096 : 2 ** mmPick([11, 13, 14, 16]);
    const vp = R / P, max = Math.min(vp - 1, 20000);
    n = prRand(1, max);
    if (n >= 100 && Math.random() < 0.6) n = Math.max(50, Math.floor(n / 50) * 50);
  }
  return { R, P, n, ans: mmReserve(R, P, n), N, Rtxt: mmSz(R, N), Ptxt: mmSz(P, N) };
}

// ════════════════════════════════════════════════════════
//  풀이 (문서의 답안 형식: 최종 답 한 줄 → 번호 붙인 단계, 2의 거듭제곱과 10진수, 존댓말)
// ════════════════════════════════════════════════════════
function mmPageTableHtml(table) {
  return `<div class="pr-tablewrap"><table class="pr-table mm-pt"><tr><th>페이지</th>${table.map(r => `<td>${r[0]}</td>`).join('')}</tr>
    <tr><th>프레임</th>${table.map(r => `<td>${r[1]}</td>`).join('')}</tr></table></div>`;
}
function mmExpPage(S) {
  const a = S.ans, P = S.P, k = mmLog2(P);
  const steps = [
    `페이지 크기 = ${mmHuman(P)} = ${mmBytes(P)}입니다.`,
    `페이지 번호 = ${mmComma(S.addr)} ÷ ${mmComma(P)} 의 몫 = <b>${a.p}</b>입니다.`,
    `변위 = ${mmComma(S.addr)} − ${a.p} × ${mmComma(P)} = ${mmComma(S.addr)} − ${mmComma(a.p * P)} = <b>${mmComma(a.d)}</b>입니다.`,
    a.fault ? `페이지 테이블에 페이지 ${a.p}가 없습니다 → <b>페이지 폴트</b>(유효하지 않은 주소)입니다.` : `페이지 테이블에서 페이지 ${a.p} → 프레임 <b>${a.frame}</b>입니다.`,
  ];
  if (!a.fault) steps.push(`물리 주소 = ${a.frame} × ${mmComma(P)} + ${mmComma(a.d)} = ${mmComma(a.frame * P)} + ${mmComma(a.d)} = <b>${mmComma(a.phys)}</b>입니다.`);
  return mmSolHtml(S.N, a.fault ? `페이지 폴트 (페이지 ${a.p}, 변위 ${mmComma(a.d)} — 테이블에 페이지 ${a.p}가 없습니다)` : mmComma(a.phys), steps,
    `페이지 크기가 ${mmPow(k)}이므로 논리 주소의 하위 ${k}비트가 변위, 그 위 비트가 페이지 번호입니다. 물리 주소는 페이지 번호 자리만 프레임 번호로 바꾼 값입니다.`);
}
function mmExpPhys(S) {
  const a = S.ans;
  return mmSolHtml(S.N, `프레임 ${mmComma(a.frames)}개 · 물리 주소 ${a.pbits}비트 · 프레임 번호 ${a.fbits}비트 · 변위 ${a.obits}비트`, [
    `물리 메모리 ${mmHuman(S.M)} = ${mmBytes(S.M)}, 페이지 크기 ${mmHuman(S.P)} = ${mmBytes(S.P)}입니다.`,
    `프레임 수 = ${mmPow(a.pbits)} ÷ ${mmPow(a.obits)} = ${mmPow(a.fbits)} = <b>${mmComma(a.frames)}개</b>입니다.`,
    `물리 주소 비트 수 = log<sub>2</sub>(${mmPow(a.pbits)}) = <b>${a.pbits}비트</b>입니다.`,
    `변위 비트 수 = log<sub>2</sub>(${mmPow(a.obits)}) = <b>${a.obits}비트</b>입니다.`,
    `프레임 번호 비트 수 = ${a.pbits} − ${a.obits} = <b>${a.fbits}비트</b>입니다.`,
  ], `페이지 크기 = 프레임 크기입니다. 프레임 번호 ${a.fbits}비트로 프레임 ${mmPow(a.fbits)}개를 구분합니다.`);
}
function mmExpTable(S) {
  const a = S.ans;
  return mmSolHtml(S.N, `${mmHuman(a.size)} (${mmBytes(a.size)})`, [
    `논리 주소 공간 = ${mmPow(S.L)}바이트입니다.`,
    `변위 = log<sub>2</sub>(${mmHuman(S.P)} = ${mmPow(a.obits)}) = <b>${a.obits}비트</b>, 페이지 번호 = ${S.L} − ${a.obits} = <b>${a.pbits}비트</b>입니다.`,
    `엔트리 수 = ${mmPow(S.L)} ÷ ${mmPow(a.obits)} = ${mmPow(a.pbits)} = <b>${mmComma(a.entries)}개</b>입니다.`,
    `페이지 테이블 크기 = ${mmPow(a.pbits)} × ${S.pte}바이트 = ${mmBytes(a.size)}입니다.`,
    `단위로 바꾸면 <b>${mmHuman(a.size)}</b>입니다.`,
  ], `단일 단계 페이지 테이블은 전체 논리 주소 공간의 페이지마다 엔트리를 하나씩 둡니다.`);
}
function mmExpFrag(S) {
  const a = S.ans, K = S.unit === 1024;
  const sz = K ? mmComma(S.size / 1024) + 'KiB' : mmComma(S.size) + '바이트', pz = K ? mmComma(S.P / 1024) + 'KiB' : mmComma(S.P) + '바이트';
  const ratio = S.size / S.P, both = b => K ? `${mmHuman(b)} (${mmComma(b)}바이트)` : `${mmComma(b)}바이트${b >= 1024 && b % 1024 === 0 ? ` (${mmHuman(b)})` : ''}`;
  return mmSolHtml(S.N, `페이지 ${a.pages}개, 할당 공간 ${mmHuman(a.alloc)}, 내부 단편화 ${a.frag ? mmHuman(a.frag) : '0'}`, [
    `프로세스 ${sz}, 페이지 ${pz} = ${mmBytes(S.P)}입니다. ${sz} ÷ ${pz} = ${mmNum(ratio)}입니다.`,
    `필요한 페이지 수 = ⌈${mmNum(ratio)}⌉ = <b>${a.pages}개</b>입니다${a.frag ? ' (페이지 단위로만 할당하므로 올림합니다)' : ''}.`,
    `할당 공간 = ${a.pages} × ${pz} = <b>${both(a.alloc)}</b>입니다.`,
    a.frag ? `내부 단편화 = ${both(a.alloc)} − ${sz} = <b>${both(a.frag)}</b>입니다.` : `프로세스 크기가 페이지 크기의 정확한 배수이므로 내부 단편화는 <b>0</b>입니다.`,
  ], `내부 단편화는 마지막 페이지에서만 생기며 항상 페이지 크기(${pz})보다 작습니다.`);
}

// ── 유형 5 풀이 ──
const MM_FIT_NAME = { ff: '최초 적합', bf: '최적 적합', wf: '최악 적합' };
const MM_FIT_EN = { ff: 'First Fit', bf: 'Best Fit', wf: 'Worst Fit' };
const MM_FIT_RULE = { ff: '앞에서부터 처음 들어가는 공간', bf: '들어가는 공간 중 가장 작은 공간', wf: '들어가는 공간 중 가장 큰 공간' };
const MM_CAUSE_OPTS = ['모두 할당', '할당 실패 — 빈 공간 합은 충분 (외부 단편화)', '할당 실패 — 빈 공간 합도 모자람'];
const MM_CAUSE_IDX = { ok: 0, ext: 1, short: 2 };
const MM_KNUM = ['', '한', '두', '세', '네', '다섯', '여섯'];
function mmStepLine(s) {
  return `${s.req} → ${s.idx < 0 ? '할당 실패(대기)' : `${s.size} 공간 (남은 공간 ${s.rest}) → ${s.after.join(', ')}`}`;
}
function mmStepHint(s) {
  if (s.idx < 0) return `<span class="mm-hint">${s.req} 이상인 빈 공간이 없습니다 (빈 공간 합 ${s.sum})</span>`;
  return s.tie ? `<span class="mm-hint">같은 크기 ${s.size} 공간이 여럿 → 주소가 앞선 ${s.idx + 1}번째 공간</span>` : '';
}
function mmFitMethodExp(run, m, u) {
  const cause = mmFitCause(run), f = run.fails.length ? run.steps[run.fails[0]] : null;
  const res = cause === 'ok' ? `요청을 모두 할당합니다.`
    : cause === 'ext' ? `${f.req}${u} 요청 때 빈 공간의 합이 ${f.sum}${u}로 충분하지만, 하나로 이어진 ${f.req}${u} 이상의 공간이 없어 할당하지 못합니다 → 외부 단편화입니다.`
      : `${f.req}${u} 요청 때 빈 공간의 합이 ${f.sum}${u}로 요청보다 작아 공간 자체가 모자랍니다.`;
  return `<div class="mm-mh">${MM_FIT_NAME[m]} <small>(${MM_FIT_EN[m]} — ${MM_FIT_RULE[m]})</small></div>
    <ol class="mm-steps">${run.steps.map(s => `<li>${mmStepLine(s)} ${mmStepHint(s)}</li>`).join('')}<li>최종 빈 공간: ${run.final.join(', ')}</li></ol>
    <div class="pr-sub">→ ${res}</div>`;
}
function mmJoinGwa(names) { return names.join('과 '); }   // '적합'은 받침이 있어 '과'
function mmFitAnswer(runs, methods, reqs, u) {
  const ok = methods.filter(m => runs[m].allOk), ng = methods.filter(m => !runs[m].allOk);
  const nm = m => MM_FIT_NAME[m], w = MM_KNUM[reqs.length] || reqs.length;
  const groups = [];
  ng.forEach(m => {
    const key = runs[m].fails.map(i => reqs[i] + u).join(' · ');
    const g = groups.find(x => x.key === key);
    if (g) g.ms.push(m); else groups.push({ key, ms: [m] });
  });
  const ngTxt = groups.map(g => `${mmJoinGwa(g.ms.map(nm))}은 ${g.key}를`).join(', ') + ' 할당하지 못합니다.';
  let line;
  if (!ng.length) line = (methods.length > 1 ? `${MM_KNUM[methods.length]} 방식 모두` : `${nm(methods[0])}은`) + ` ${w} 요청을 모두 할당합니다.`;
  else if (!ok.length) line = ngTxt;
  else line = `${mmJoinGwa(ok.map(nm))}만 ${w} 요청을 모두 할당하고, ${ngTxt}`;
  // 원인 (첫 실패 기준): 같은 원인 · 요청 · 합이면 묶는다
  const cg = [];
  ng.forEach(m => {
    const f = runs[m].steps[runs[m].fails[0]], c = mmFitCause(runs[m]), key = c + '|' + f.req + '|' + f.sum;
    const g = cg.find(x => x.key === key);
    if (g) g.ms.push(m); else cg.push({ key, c, f, ms: [m] });
  });
  const why = cg.map(g => {
    const who = g.ms.length > 1 ? `${mmJoinGwa(g.ms.map(nm))} 모두` : `${nm(g.ms[0])}은`;
    return g.c === 'ext'
      ? `${who} ${g.f.req}${u} 요청 때 남은 빈 공간의 합이 ${g.f.sum}${u}여서 크기는 충분합니다. 하지만 하나로 이어진 ${g.f.req}${u} 이상의 공간이 없으므로 외부 단편화가 원인입니다.`
      : `${who} ${g.f.req}${u} 요청 때 남은 빈 공간의 합이 ${g.f.sum}${u}로 요청보다 작아, 단편화와 관계없이 공간 자체가 모자랍니다.`;
  });
  return { line, why };
}
function mmExpFit(c, methods, N) {
  const A = mmFitAnswer(c.runs, methods, c.reqs, 'KiB');
  return `${mmNoteHtml(N)}<div class="mm-final">답: ${A.line}</div>${A.why.map(x => `<div class="pr-sub">${x}</div>`).join('')}
    ${methods.map(m => `<div class="mm-mexp">${mmFitMethodExp(c.runs[m], m, 'KiB')}</div>`).join('')}
    <div class="pr-sub">💡 각 방식은 같은 초기 상태에서 따로 시작합니다. 크기가 같은 후보가 여럿이면 주소가 앞선 공간을 고릅니다. 반환 · 압축은 없습니다.</div>`;
}
function mmFitGivenHtml(c, unit) {
  return `빈 공간(주소 순): <b class="mm-mono">${c.holes.join(' → ')}</b> (${unit})<br>요청 순서: <b class="mm-mono">${c.reqs.join(' → ')}</b> (${unit})`;
}

// ── 유형 6 · 7 · 8 풀이 ──
function mmTwoGiven(S) {
  return `가상 주소 <b>${S.V}비트</b>, 페이지 크기 <b>${S.Ptxt}</b>, PTE <b>${S.pte}바이트</b>, ` +
    (S.one ? '하위 페이지 테이블 하나가 <b>정확히 한 페이지</b>' : `하위 페이지 테이블 하나의 크기 <b>${S.Stxt}</b>(모두 엔트리로 채움)`);
}
// "상위 | 하위 | 변위" 비트 막대 (상위 비트부터, 칸마다 비트 범위)
function mmBitsBar(V, a) {
  const parts = [['hi', '상위 인덱스', a.high], ['lo', '하위 인덱스', a.low], ['of', '변위', a.off]];
  let top = V - 1;
  return `<div class="mm-bits">${parts.map(([c, l, b]) => { const hi = top; top -= b;
    return `<div class="${c}" style="flex-grow:${b}">${l} <b>${b}비트</b><small>${hi}${b > 1 ? '–' + (hi - b + 1) : ''}</small></div>`; }).join('')}</div>`;
}
function mmExpTwo(S) {
  const a = S.ans, lk = mmLog2(S.sub);
  const sub = S.one
    ? `하위 테이블이 정확히 한 페이지를 차지하므로 하위 테이블 크기 = 페이지 크기 = ${mmHuman(S.sub)} = ${mmPow(lk)}바이트입니다. `
    : `하위 테이블 크기가 ${mmHuman(S.sub)} = ${mmPow(lk)}바이트로 따로 주어졌으므로 그 값을 사용합니다(페이지 크기 ${mmHuman(S.P)}로 계산하지 않습니다). `;
  return mmSolHtml(S.N, `상위 ${a.high}비트 / 하위 ${a.low}비트 / 변위 ${a.off}비트`, [
    `변위 = log<sub>2</sub>(${mmHuman(S.P)} = ${mmPow(a.off)}) = <b>${a.off}비트</b>입니다.`,
    `${sub}하위 테이블 엔트리 수 = ${mmPow(lk)} ÷ ${S.pte} = ${mmPow(a.low)} = <b>${mmComma(a.lowEntries)}개</b>입니다.`,
    `하위 인덱스 = log<sub>2</sub>(${mmPow(a.low)}) = <b>${a.low}비트</b>입니다.`,
    `상위 인덱스 = ${S.V} − ${a.low} − ${a.off} = <b>${a.high}비트</b>입니다.`,
    `검산: ${a.high} + ${a.low} + ${a.off} = ${S.V}비트로 가상 주소 비트 수와 같습니다.`,
  ], '') + mmBitsBar(S.V, a) +
    `<div class="pr-sub">💡 상위 인덱스로 상위 페이지 테이블에서 하위 테이블을 찾고, 하위 인덱스로 그 하위 테이블의 PTE를 찾은 뒤, 변위로 페이지 안의 바이트를 찾습니다. 상위 테이블의 엔트리는 ${mmPow(a.high)} = ${mmComma(2 ** a.high)}개입니다.</div>`;
}
function mmEatGiven(S) {
  return `TLB 조회 <b>${S.tlb}ns</b>, 메모리 접근 <b>${S.mem}ns</b>, TLB 적중률 <b>${S.hit}%</b>, <b>${S.levels}단계</b> 페이지 테이블, ` +
    (S.parallel ? '<b>병렬</b> 접근 (TLB 조회와 메모리 접근을 동시에 시작)' : '<b>순차</b> 접근 (TLB 조회 뒤 메모리 접근)');
}
function mmExpEat(S) {
  const a = S.ans, h = S.h, hr = h / 1000, mr = (1000 - h) / 1000, x = h * a.hit / 1000, y = (1000 - h) * a.miss / 1000;
  const lv = `${S.levels} × ${S.mem}`;
  return mmSolHtml(S.N, `${a.eat}ns (적중 ${a.hit}ns · 미스 ${a.miss}ns)`, [
    `적중 시간 = TLB 조회 + 메모리 접근 = ${S.tlb} + ${S.mem} = <b>${a.hit}ns</b>입니다.`,
    S.parallel
      ? `TLB 조회와 메모리 접근이 병렬이므로, 미스 시간에는 TLB 조회 시간을 더하지 않습니다(TLB 조회가 페이지 테이블 접근과 겹칩니다). 미스 시간 = 단계 수 × 메모리 접근 + 메모리 접근 = ${lv} + ${S.mem} = <b>${a.miss}ns</b>입니다.`
      : `미스 시간 = TLB 조회 + 단계 수 × 메모리 접근 + 메모리 접근 = ${S.tlb} + ${lv} + ${S.mem} = <b>${a.miss}ns</b>입니다.`,
    `적중률 ${S.hit}% = ${hr}, 미스율 = 1 − ${hr} = ${mr}입니다. EAT = ${hr} × ${a.hit} + ${mr} × ${a.miss} = ${x} + ${y} = <b>${a.eat}ns</b>입니다.`,
  ], `TLB 미스면 페이지 테이블 ${S.levels}단계를 메모리에서 한 번씩 읽은 뒤(${lv}ns) 실제 데이터를 한 번 더 읽습니다. 페이지 폴트는 없다고 가정합니다.`);
}
function mmReserveGiven(S) {
  return `예약한 가상 주소 공간 <b>${S.Rtxt}</b>, 페이지 크기 <b>${S.Ptxt}</b>, 실제로 프레임이 할당된 서로 다른 페이지 <b>${mmComma(S.n)}개</b>`;
}
function mmExpReserve(S) {
  const a = S.ans, pk = mmLog2(S.P), u = MM_UNITS.find(x => S.P % x[0] === 0) || [1, '바이트'];
  const rTxt = mmIsPow2(S.R) ? `${mmPow(mmLog2(S.R))}` : `${mmHuman(S.R)}(${mmComma(S.R)}바이트)`;
  const vTxt = mmIsPow2(a.vpages) ? `${mmPow(mmLog2(a.vpages))} = ` : '';
  const inU = `${mmComma(a.used / u[0])}${u[1]}`, hum = mmHuman(a.used), mib = a.used / 2 ** 20;
  const mibTxt = Number.isInteger(mib) ? '' : ` (약 ${mib.toFixed(2)}MiB)`;
  return mmSolHtml(S.N, `가상 페이지 ${mmComma(a.vpages)}개, 실제 점유 ${hum}`, [
    `가상 페이지 수 = 예약 크기 ÷ 페이지 크기 = ${rTxt} ÷ ${mmPow(pk)} = ${vTxt}<b>${mmComma(a.vpages)}개</b>입니다.`,
    `실제 점유 용량 = 할당된 페이지 수 × 페이지 크기 = ${mmComma(S.n)} × ${mmHuman(S.P)} = ${inU}${hum !== inU ? ` = ${hum}` : ''} = <b>${mmBytes(a.used)}</b>${mibTxt}입니다.`,
  ], '') + `<div class="pr-sub">💡 가상 주소 공간을 예약해도 물리 메모리는 실제로 프레임이 할당된 페이지만큼만 점유합니다.</div>`;
}

// ════════════════════════════════════════════════════════
//  단일 문항 생성기 (실전 세트)
//   문항 = { cat, kind: 'text' | 'choice', q, ans(정답 표시), check(v) | opts + ansIdx, exp }
// ════════════════════════════════════════════════════════
function mmTI(cat, q, ans, check, exp) { return { cat, kind: 'text', q, ans, check, exp }; }
function mmCI(cat, q, opts, ansIdx, exp) { return { cat, kind: 'choice', q, opts, ansIdx, ans: opts[ansIdx], exp }; }
function mmCountCheck(n) { return v => mmParseCount(v) === n; }
// 크기 칸: 단위를 붙이면 그대로, 숫자만 쓰면 바이트 (unit > 1 이면 문제에 쓰인 단위로 본 값도 인정)
function mmSizeCheck(b, unit) { return v => { const r = mmParseSize(v); return !!r && (r.val === b || (r.plain && unit > 1 && r.val * unit === b)); }; }
function mmPhysCheck(a) {
  return v => {
    const t = String(v == null ? '' : v).replace(/\s+/g, '').toLowerCase();
    if (a.fault) return /폴트|fault|없음|무효|유효하지/.test(t);
    return mmParseCount(t) === a.phys;
  };
}
function mmTimeCheck(x, tol) { return v => { const t = mmParseTime(v); return t !== null && Math.abs(t - x) <= (tol || 0) + 1e-9; }; }
function mmPageQ(S) { return `페이지 크기 <b>${S.Ptxt}</b>, 논리 주소 <b>${mmComma(S.addr)}</b>. 페이지 테이블:${mmPageTableHtml(S.table)}`; }
const MM_GEN = {
  page() {
    const S = mmMakePage(), a = S.ans;
    return mmTI('주소 변환', `${mmPageQ(S)}물리 주소는? (테이블에 없으면 "페이지 폴트")`, a.fault ? '페이지 폴트' : String(a.phys), mmPhysCheck(a), mmExpPage(S));
  },
  pagep() {
    const S = mmMakePage(), a = S.ans, d = Math.random() < 0.5;
    return mmTI('주소 변환', `페이지 크기 <b>${S.Ptxt}</b>일 때 논리 주소 <b>${mmComma(S.addr)}</b>의 ${d ? '변위' : '페이지 번호'}는?`,
      String(d ? a.d : a.p), mmCountCheck(d ? a.d : a.p), mmExpPage(S));
  },
  phys() {
    const S = mmMakePhys(), a = S.ans;
    const [lab, x, u] = mmPick([['프레임 수', a.frames, '개'], ['물리 주소 비트 수', a.pbits, '비트'], ['프레임 번호 비트 수', a.fbits, '비트'], ['변위 비트 수', a.obits, '비트']]);
    return mmTI('물리 메모리', `물리 메모리 <b>${S.Mtxt}</b>, 페이지 크기 <b>${S.Ptxt}</b>일 때 ${lab}는?`, mmComma(x) + u, mmCountCheck(x), mmExpPhys(S));
  },
  table() {
    const S = mmMakeTable(), a = S.ans;
    const k = mmPick(['size', 'size', 'entries', 'pbits']);
    const q = `논리 주소 <b>${S.L}비트</b>, 페이지 크기 <b>${S.Ptxt}</b>, PTE <b>${S.pte}바이트</b>인 단일 단계 페이지 테이블의 `;
    if (k === 'size') return mmTI('페이지 테이블', q + '크기는? (단위를 붙여도 됩니다)', mmHuman(a.size), mmSizeCheck(a.size, 1), mmExpTable(S));
    if (k === 'entries') return mmTI('페이지 테이블', q + '엔트리 수는?', mmComma(a.entries) + '개', mmCountCheck(a.entries), mmExpTable(S));
    return mmTI('페이지 테이블', q + '페이지 번호 비트 수는?', a.pbits + '비트', mmCountCheck(a.pbits), mmExpTable(S));
  },
  frag() {
    const S = mmMakeFrag(), a = S.ans;
    const k = mmPick(['frag', 'frag', 'pages', 'alloc']), q = `프로세스 크기 <b>${S.Stxt}</b>, 페이지 크기 <b>${S.Ptxt}</b>일 때 `;
    if (k === 'pages') return mmTI('내부 단편화', q + '필요한 페이지 수는?', a.pages + '개', mmCountCheck(a.pages), mmExpFrag(S));
    if (k === 'alloc') return mmTI('내부 단편화', q + '할당되는 공간은?', mmHuman(a.alloc), mmSizeCheck(a.alloc, S.unit), mmExpFrag(S));
    return mmTI('내부 단편화', q + '내부 단편화 크기는?', a.frag ? mmHuman(a.frag) : '0', mmSizeCheck(a.frag, S.unit), mmExpFrag(S));
  },
  fitfinal() {
    const c = mmFitCase(false), N = [], u = mmUnitAlt(N, 'KiB'), m = mmPick(['ff', 'bf', 'wf']), r = c.runs[m];
    return mmTI('연속 할당', `${mmFitGivenHtml(c, u)}<br><b>${MM_FIT_NAME[m]}</b>로 모든 요청을 처리한 뒤의 빈 공간 목록을 주소 순으로 쓰세요 (예: 100, 288, 200).`,
      r.final.join(', '), v => { const l = mmParseList(v); return !!l && l.join(',') === r.final.join(','); }, mmNoteHtml(N) + mmFitMethodExp(r, m, 'KiB'));
  },
  fitcause() {
    const c = mmFitCase(false), N = [], u = mmUnitAlt(N, 'KiB'), m = mmPick(['ff', 'bf', 'wf']), r = c.runs[m];
    return mmCI('연속 할당', `${mmFitGivenHtml(c, u)}<br><b>${MM_FIT_NAME[m]}</b>의 결과는? (실패가 있으면 첫 실패 기준)`, MM_CAUSE_OPTS, MM_CAUSE_IDX[mmFitCause(r)],
      mmNoteHtml(N) + mmFitMethodExp(r, m, 'KiB'));
  },
  fitwho() {
    const c = mmFitCase(false, 'one'), N = [], u = mmUnitAlt(N, 'KiB'), ms = ['ff', 'bf', 'wf'];
    return mmCI('연속 할당', `${mmFitGivenHtml(c, u)}<br>최초 · 최적 · 최악 적합 중 모든 요청을 할당하는 방식은?`, ms.map(m => MM_FIT_NAME[m]),
      ms.findIndex(m => c.runs[m].allOk), mmExpFit(c, ms, N));
  },
  two() {
    const S = mmMakeTwo(), a = S.ans;
    const [lab, x, u] = mmPick([['상위 인덱스 비트 수', a.high, '비트'], ['상위 인덱스 비트 수', a.high, '비트'], ['하위 인덱스 비트 수', a.low, '비트'], ['하위 테이블 엔트리 수', a.lowEntries, '개']]);
    return mmTI('2단계 페이지 테이블', `${mmTwoGiven(S)}인 2단계 페이지 테이블에서 ${lab}는?`, mmComma(x) + u, mmCountCheck(x), mmExpTwo(S));
  },
  eat() {
    const S = mmMakeEat(), a = S.ans, k = mmPick(['eat', 'eat', 'miss']);
    if (k === 'miss') return mmTI('TLB EAT', `${mmEatGiven(S)}일 때 TLB 미스 시간은? (ns)`, a.miss + 'ns', mmTimeCheck(a.miss), mmExpEat(S));
    return mmTI('TLB EAT', `${mmEatGiven(S)}일 때 유효 접근 시간(EAT)은? (ns, 소수 가능)`, a.eat + 'ns', mmTimeCheck(a.eat, 0.005), mmExpEat(S));
  },
  eatpar() {
    const S = mmMakeEat(null, true), a = S.ans;
    return mmTI('TLB EAT', `${mmEatGiven(S)}일 때, 병렬이면 TLB 미스 시간은? (ns)`, a.miss + 'ns', mmTimeCheck(a.miss), mmExpEat(S));
  },
  reserve() {
    const S = mmMakeReserve(), a = S.ans, q = `${mmReserveGiven(S)}일 때 `;
    if (Math.random() < 0.5) return mmTI('예약 vs 점유', q + '예약 구간의 가상 페이지 수는?', mmComma(a.vpages) + '개', mmCountCheck(a.vpages), mmExpReserve(S));
    return mmTI('예약 vs 점유', q + '실제로 점유하는 물리 메모리(데이터 프레임) 용량은? (단위를 붙여도 됩니다)', mmHuman(a.used), mmSizeCheck(a.used, 1024), mmExpReserve(S));
  },
};
const MM_EXAM_KINDS = ['page', 'page', 'pagep', 'phys', 'phys', 'table', 'table', 'frag', 'frag', 'fitfinal', 'fitcause', 'fitwho',
  'two', 'two', 'eat', 'eat', 'eatpar', 'reserve', 'reserve'];

// ════════════════════════════════════════════════════════
//  화면
// ════════════════════════════════════════════════════════
let MM = null;
const MM_VIEWS = [['page', '🔁 주소 변환'], ['phys', '🧱 물리 메모리 구성'], ['table', '📋 페이지 테이블 크기'], ['frag', '🧩 내부 단편화'],
  ['fit', '📦 연속 할당'], ['two', '🪜 2단계 페이지 테이블'], ['eat', '⏱ TLB 유효 접근 시간'], ['reserve', '🗂 예약 vs 점유'], ['exam', '🎓 실전 세트']];
const MM_METHODS = [['ff', '최초 적합'], ['bf', '최적 적합'], ['wf', '최악 적합'], ['all', '셋 다']];
const MM_CSS = `
  .pr-num.mm-in { width: 150px; text-align: left; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 13.5px; }
  .pr-num.mm-in.wide { width: 100%; min-width: 180px; }
  .mm-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 10px; }
  .mm-grid .pr-num.mm-in { width: 100%; }
  .mm-given { font-size: 16px; margin: 0 0 14px; line-height: 1.8; }
  .mm-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
  .mm-pt th { text-align: left; white-space: nowrap; } .mm-pt td { min-width: 34px; }
  .mm-final { font-weight: 800; margin: 2px 0 6px; line-height: 1.6; }
  .mm-steps { margin: 4px 0 6px; padding-left: 22px; line-height: 1.8; font-size: 13.5px; }
  .mm-note { font-size: 12.5px; color: #92400e; margin-bottom: 4px; }
  .mm-hint { font-size: 12px; color: #64748b; margin-left: 4px; }
  .mm-mh { font-weight: 800; color: #4338ca; margin-top: 10px; }
  .mm-mh small { font-weight: 500; color: #64748b; }
  .mm-meth { border-top: 1px solid #e2e8f0; padding: 12px 0 4px; }
  .mm-meth:first-of-type { border-top: none; padding-top: 0; }
  .mm-cur { font-size: 14px; margin: 8px 0 6px; }
  .mm-bar { display: flex; gap: 4px; align-items: stretch; margin: 4px 0 8px; }
  .mm-hole { flex: 1 1 0; min-width: 40px; padding: 10px 2px 6px; border: 2px solid #c7d2fe; background: #eef2ff; border-radius: 8px; cursor: pointer;
    font-family: inherit; font-weight: 800; color: #1e293b; font-size: 13px; line-height: 1.3; }
  .mm-hole small { display: block; font-weight: 500; color: #64748b; font-size: 11px; }
  .mm-hole:hover:not(:disabled) { border-color: #6366f1; background: #e0e7ff; }
  .mm-hole:disabled { cursor: default; opacity: .45; }
  .mm-hole.zero { flex: 0 0 auto; min-width: 26px; }
  .mm-log { margin: 4px 0; padding-left: 22px; font-size: 13.5px; line-height: 1.8; }
  .mm-log .ng { color: #b91c1c; } .mm-log .ok { color: #15803d; }
  .mm-q { border-top: 1px solid #e2e8f0; padding: 14px 0 6px; font-size: 14px; line-height: 1.75; }
  .mm-q:first-of-type { border-top: none; padding-top: 0; }
  .mm-qn { font-weight: 800; color: #4338ca; margin-right: 6px; }
  .mm-mark { font-weight: 800; margin-left: 6px; }
  .mm-exp { background: #f8fafc; border-radius: 10px; padding: 8px 12px; margin-top: 8px; font-size: 13px; line-height: 1.7; }
  .mm-lbl { display: block; font-size: 12px; font-weight: 700; color: #475569; margin: 12px 0 4px; }
  .mm-tt td { text-align: left; } .mm-tt td.c { text-align: center; }
  .mm-tt { width: 100%; max-width: 720px; }
  .mm-tt th:nth-child(-n+2) { white-space: nowrap; width: 1%; }
  .mm-tt th:nth-child(3) { width: 32%; }
  .mm-tt .pr-num.mm-in, .mm-tt .pr-num.mm-in.wide { width: 100%; min-width: 0; }
  @media (max-width: 560px) { .mm-tt th, .mm-tt td { padding: 6px 5px; } .mm-tt .pr-num.mm-in { padding-left: 6px; padding-right: 6px; font-size: 12.5px; } }
  .mm-ok { color: #15803d; font-weight: 800; } .mm-ng { color: #b91c1c; font-weight: 800; }
  .mm-bits { display: flex; max-width: 560px; margin: 8px 0 6px; border-radius: 8px; overflow: hidden; font-size: 12.5px; font-weight: 800; color: #fff; }
  .mm-bits > div { flex: 1 1 0; min-width: 64px; padding: 7px 4px 5px; text-align: center; line-height: 1.3; word-break: keep-all; }
  .mm-bits b, .pr-answer .mm-bits b { white-space: nowrap; color: inherit; font-weight: inherit; }
  .mm-bits > div + div { border-left: 2px solid #fff; }
  .mm-bits small { display: block; font-weight: 500; font-size: 11px; opacity: .85; }
  .mm-bits .hi { background: #6366f1; } .mm-bits .lo { background: #0ea5e9; } .mm-bits .of { background: #64748b; }
`;

function mmLoadOpt() {
  const opt = { mix: false, method: 'all', solve: 'click', tie: false };
  try {
    const o = JSON.parse(localStorage.getItem('mmOpt') || 'null');
    if (o && typeof o === 'object') {
      opt.mix = o.mix === true; opt.tie = o.tie === true;
      if (MM_METHODS.some(x => x[0] === o.method)) opt.method = o.method;
      if (o.solve === 'click' || o.solve === 'type') opt.solve = o.solve;
    }
  } catch (e) { /* 저장소 없음 */ }
  return opt;
}
function mmMount(root) {
  MM = { view: 'page', opt: mmLoadOpt(), st: null, exPhys: 0, exTwo: 0 };
  root.innerHTML = `<style>${MM_CSS}</style>
    <div class="pr-card">
      <h3 class="pr-h">⚙️ 모드</h3>
      <div class="pr-seg" id="mm-views"></div>
      <div class="pr-row" style="margin:12px 0 0;align-items:center">
        <label class="pr-chk"><input type="checkbox" ${MM.opt.mix ? 'checked' : ''} onchange="mmSetOpt('mix', this.checked)"> 표기 섞기(KB · Kib)</label>
      </div>
      <div class="pr-sub" style="margin-top:8px">단위는 2의 거듭제곱 기준입니다(1KiB = 2<sup>10</sup> = 1,024바이트, 1MiB = 2<sup>20</sup>바이트).
        크기 칸은 <code>4KiB</code> · <code>4096</code> · <code>2^12</code> 모두 됩니다(숫자만 쓰면 바이트). 입력칸에서 Enter = 채점.
        표기 섞기를 켜면 문제에 KB · Kib 같은 표기가 섞이며, 모두 KiB(바이트 기준)로 해석합니다.</div>
    </div>
    <div id="mm-main"></div>`;
  mmSetView('page');
}
function mmSaveOpt() { try { localStorage.setItem('mmOpt', JSON.stringify(MM.opt)); } catch (e) { /* 무시 */ } }
function mmSetOpt(k, v) {
  MM.opt[k] = v;
  mmSaveOpt();
  if (MM.view === 'fit' && (k === 'method' || k === 'solve')) { mmFitReset(MM.st); mmRender(); return; }
  mmNext();
}
function mmSetView(v) {
  MM.view = v;
  document.getElementById('mm-views').innerHTML = MM_VIEWS.map(([id, nm]) => `<button class="${v === id ? 'active' : ''}" onclick="mmSetView('${id}')">${nm}</button>`).join('');
  mmNext();
}
function mmMain() { return document.getElementById('mm-main'); }
function mmMode() { return MM_MODES[MM.view]; }
function mmNext() { mmMode().make(); mmRender(); }
function mmExample() { mmMode().make(true); mmRender(); }
function mmRender() { mmMode().render(); }
function mmCheck() { mmMode().check(); mmRender(); }
function mmReveal() { mmMode().reveal(); mmRender(); }
function mmKey(e) {
  if (e.key !== 'Enter' || e.isComposing) return;
  e.preventDefault();
  const fitType = MM.view === 'fit' && MM.opt.solve === 'type';
  if (MM.view !== 'exam' && !fitType) { mmCheck(); return; }
  // 실전 세트 · 연속 할당 직접 입력: Enter = 다음 입력칸으로 (채점은 버튼으로)
  const ins = [...mmMain().querySelectorAll('input.mm-in')], k = ins.indexOf(e.target);
  if (k >= 0 && k + 1 < ins.length) ins[k + 1].focus();
}

// 입력칸 (값은 MM.st.vals[key], 채점 표시는 MM.st.marks[key])
function mmInput(key, cls, ph) {
  const S = MM.st, mk = S.marks && key in S.marks ? (S.marks[key] ? ' ok' : ' ng') : '';
  return `<input class="pr-num mm-in${cls ? ' ' + cls : ''}${mk}" value="${escHtml(S.vals[key] || '')}" placeholder="${ph || ''}" spellcheck="false" autocomplete="off"
    oninput="MM.st.vals['${key}'] = this.value" onkeydown="mmKey(event)">`;
}
function mmActions(checkLabel, noExample) {
  return `<div class="pr-actions">
    <button class="pr-btn indigo" onclick="mmCheck()">✅ ${checkLabel || '채점하기'}</button>
    <button class="pr-btn ghost" onclick="mmReveal()">👀 정답 보기</button>
    <button class="pr-btn" onclick="mmNext()">다음 문제 →</button>
    ${noExample ? '' : '<button class="pr-btn ghost" onclick="mmExample()">📄 문서 예제</button>'}</div>`;
}
function mmSummary(ok, all) {
  return `<div class="pr-result ${ok === all ? 'good' : 'bad'}"><b>${ok === all ? '🎉 모두 정답입니다!' : '채점 결과'}</b> ${ok} / ${all} 정답${ok === all ? '' : ' · 빨간 칸을 다시 확인하세요.'}</div>`;
}
// 칸 목록 [key, label, 정답 표시, check, placeholder] 를 쓰는 모드 공통
function mmFormCheck(F) { const S = MM.st; S.marks = {}; F.forEach(([k, , , c]) => { S.marks[k] = !!c(S.vals[k]); }); }
function mmFormReveal(F) { const S = MM.st; S.revealed = true; S.marks = null; F.forEach(([k, , a]) => { S.vals[k] = a; }); }
function mmFormSummary(F, extra) {
  const S = MM.st;
  if (!S.marks) return '';
  const e = extra || [0, 0];
  return mmSummary(F.filter(f => S.marks[f[0]]).length + e[0], F.length + e[1]);
}
function mmFormView(title, given, F, exp, middle) {
  const S = MM.st;
  mmMain().innerHTML = `<div class="pr-card">
    <h3 class="pr-h">${title}</h3>
    <div class="mm-given">${given}</div>
    ${middle || ''}
    <div class="mm-grid">${F.map(([k, l, , , ph]) => `<label class="pr-f">${l}${mmInput(k, '', ph)}</label>`).join('')}</div>
    ${mmFormSummary(F, S.extraMark)}
    ${S.marks || S.revealed ? `<div class="pr-answer"><b>풀이</b>${exp}</div>` : ''}
    ${mmActions()}</div>`;
}

// ── 1. 주소 변환 ──
function mmPageFields(S) {
  const a = S.ans, F = [
    ['p', '페이지 번호', String(a.p), mmCountCheck(a.p)],
    ['d', '변위', String(a.d), mmCountCheck(a.d)],
  ];
  if (!a.fault) F.push(['f', '프레임 번호', String(a.frame), mmCountCheck(a.frame)], ['pa', '물리 주소', String(a.phys), mmCountCheck(a.phys)]);
  return F;
}
function mmPageFault(on) { MM.st.faultPick = !!on; mmRender(); }
function mmRenderPage() {
  const S = MM.st, F = mmPageFields(S);
  const shownF = S.faultPick ? F.filter(f => f[0] === 'p' || f[0] === 'd') : F.concat(S.ans.fault ? [['f', '프레임 번호'], ['pa', '물리 주소']] : []);
  S.extraMark = S.marks ? [S.marks.fault ? 1 : 0, 1] : null;
  const fm = S.marks ? (S.marks.fault ? ' mm-ok' : ' mm-ng') : '';
  const fault = `<label class="pr-chk${fm}" style="margin:0 0 10px"><input type="checkbox" ${S.faultPick ? 'checked' : ''} onchange="mmPageFault(this.checked)"> 페이지 폴트 (테이블에 없는 페이지)${S.marks ? (S.marks.fault ? ' ✅' : ' ❌') : ''}</label>`;
  mmMain().innerHTML = `<div class="pr-card">
    <h3 class="pr-h">🔁 논리 주소 → 물리 주소 변환</h3>
    <div class="mm-given">${mmPageQ(S)}</div>
    ${fault}
    <div class="mm-grid">${shownF.map(([k, l]) => `<label class="pr-f">${l}${mmInput(k)}</label>`).join('')}</div>
    ${mmFormSummary(F, S.extraMark)}
    ${S.marks || S.revealed ? `<div class="pr-answer"><b>풀이</b>${mmExpPage(S)}</div>` : ''}
    ${mmActions()}</div>`;
}

// ── 2. 물리 메모리 구성 ──
function mmPhysFields(S) {
  const a = S.ans;
  return [
    ['frames', '프레임 수', mmComma(a.frames), mmCountCheck(a.frames), '예: 1024 · 2^10'],
    ['pbits', '물리 주소 비트 수', String(a.pbits), mmCountCheck(a.pbits)],
    ['fbits', '프레임 번호 비트 수', String(a.fbits), mmCountCheck(a.fbits)],
    ['obits', '변위 비트 수', String(a.obits), mmCountCheck(a.obits)],
  ];
}
function mmRenderPhys() {
  const S = MM.st;
  mmFormView('🧱 물리 메모리 구성', `물리 메모리 <b>${S.Mtxt}</b>, 페이지 크기 <b>${S.Ptxt}</b>`, mmPhysFields(S), mmExpPhys(S));
}

// ── 3. 페이지 테이블 크기 ──
function mmTableFields(S) {
  const a = S.ans;
  return [
    ['obits', '변위 비트 수', String(a.obits), mmCountCheck(a.obits)],
    ['pbits', '페이지 번호 비트 수', String(a.pbits), mmCountCheck(a.pbits)],
    ['entries', '엔트리 수', mmComma(a.entries), mmCountCheck(a.entries), '예: 2^20'],
    ['size', '페이지 테이블 크기', mmHuman(a.size), mmSizeCheck(a.size, 1), '예: 4MiB · 2^22'],
  ];
}
function mmRenderTable() {
  const S = MM.st;
  mmFormView('📋 단일 단계 페이지 테이블 크기', `논리 주소 <b>${S.L}비트</b>, 페이지 크기 <b>${S.Ptxt}</b>, PTE <b>${S.pte}바이트</b><br><span style="font-size:14px">전체 논리 주소 공간에 대한 엔트리를 둔다고 가정합니다.</span>`,
    mmTableFields(S), mmExpTable(S));
}

// ── 4. 내부 단편화 ──
function mmFragFields(S) {
  const a = S.ans;
  return [
    ['pages', '필요한 페이지 수', String(a.pages), mmCountCheck(a.pages)],
    ['alloc', '할당 공간', mmHuman(a.alloc), mmSizeCheck(a.alloc, S.unit), '예: 20KiB'],
    ['frag', '내부 단편화', a.frag ? mmHuman(a.frag) : '0', mmSizeCheck(a.frag, S.unit), '예: 2KiB'],
  ];
}
function mmRenderFrag() {
  const S = MM.st;
  mmFormView('🧩 필요한 페이지 수와 내부 단편화', `프로세스 크기 <b>${S.Stxt}</b>, 페이지 크기 <b>${S.Ptxt}</b><br><span style="font-size:14px">모든 페이지를 물리 메모리에 적재할 때를 계산합니다.${S.unit > 1 ? ' 크기 칸에 숫자만 쓰면 바이트 또는 KiB 둘 다 인정합니다.' : ''}</span>`,
    mmFragFields(S), mmExpFrag(S));
}

// ── 5. 연속 메모리 할당 ──
function mmMethods() { return MM.opt.method === 'all' ? ['ff', 'bf', 'wf'] : [MM.opt.method]; }
function mmMakeFitState(ex) {
  const E = MM_EXAMPLES.fit;
  const c = ex ? { holes: E.holes.slice(), reqs: E.reqs.slice(), runs: mmFitAll(E.holes, E.reqs) } : mmFitCase(MM.opt.tie);
  const N = [];
  const S = { holes: c.holes, reqs: c.reqs, runs: c.runs, N, unit: mmUnitAlt(N, 'KiB') };
  mmFitReset(S);
  return S;
}
function mmFitReset(S) {
  S.methods = mmMethods();
  S.cl = {}; S.tp = {};
  S.methods.forEach(m => { S.cl[m] = { picks: [], cause: null }; S.tp[m] = null; });
  S.vals = {}; S.marks = null; S.graded = false; S.revealed = false;
}
function mmFitDone(S, m) { const c = S.cl[m]; return c.picks.length === S.runs[m].steps.length && c.cause !== null; }
function mmFitActive(S) { return S.methods.find(m => !mmFitDone(S, m)) || null; }
function mmFitPick(m, idx) {
  const S = MM.st;
  if (!S || MM.view !== 'fit' || mmFitActive(S) !== m) return;
  const c = S.cl[m], st = S.runs[m].steps[c.picks.length];
  if (!st) return;
  if (idx >= 0 && !(st.before[idx] > 0)) return;
  c.picks.push(idx);
  mmRender();
}
function mmFitPickCause(m, i) {
  const S = MM.st;
  if (!S || MM.view !== 'fit') return;
  if (MM.opt.solve === 'type') { if (!S.graded && !S.revealed) { S.tp[m] = i; mmRender(); } return; }
  const c = S.cl[m];
  if (mmFitActive(S) !== m || c.picks.length !== S.runs[m].steps.length || c.cause !== null) return;
  c.cause = i;
  mmRender();
}
function mmCauseChoices(m, pick, done, onclickFn) {
  const ans = MM_CAUSE_IDX[mmFitCause(MM.st.runs[m])];
  return `<div class="wq-choices" style="margin-top:6px">${MM_CAUSE_OPTS.map((o, i) => `<button class="wq-choice${pick === i ? ' sel' : ''}${done ? (i === ans ? ' ok' : i === pick ? ' ng' : '') : ''}" ${done ? 'disabled' : ''} onclick="${onclickFn}('${m}', ${i})"><pre>${i + 1}. ${o}</pre></button>`).join('')}</div>`;
}
// 클릭 모드: 방식마다 차례로, 요청마다 빈 공간 하나를 누른다
function mmFitClickHtml(S) {
  const act = mmFitActive(S);
  return S.methods.map(m => {
    const run = S.runs[m], c = S.cl[m], k = c.picks.length, n = run.steps.length;
    const log = c.picks.map((p, i) => {
      const s = run.steps[i], ok = p === s.idx;
      const mine = p < 0 ? '할당 실패' : `${s.before[p]} 공간(${p + 1}번째)`;
      return `<li class="${ok ? 'ok' : 'ng'}">${ok ? '✅' : '❌'} ${mmStepLine(s)} ${ok ? mmStepHint(s) : `<span class="mm-hint">— 고른 것: ${mine}</span>`}</li>`;
    }).join('');
    let body = '';
    if (m === act && k < n) {
      const s = run.steps[k];
      body = `<div class="mm-cur">요청 <b>${s.req}</b>${S.unit} — 어느 빈 공간에 넣을까요? <small class="pr-sub">(${MM_FIT_RULE[m]})</small></div>
        <div class="mm-bar">${s.before.map((h, i) => `<button class="mm-hole${h ? '' : ' zero'}" style="flex-grow:${Math.max(h, 1)}" ${h ? '' : 'disabled'} onclick="mmFitPick('${m}', ${i})">${h}<small>${i + 1}</small></button>`).join('')}</div>
        <button class="pr-btn ghost" onclick="mmFitPick('${m}', -1)">🚫 할당 실패 (대기)</button>
        <div class="pr-sub" style="margin-top:4px">숫자 키 1~${s.before.length} = 빈 공간 선택 · X = 할당 실패</div>`;
    } else if (m === act) {
      body = `<span class="mm-lbl">결과는? (실패가 있으면 첫 실패 기준)</span>${mmCauseChoices(m, c.cause, false, 'mmFitPickCause')}`;
    } else if (mmFitDone(S, m)) {
      const okC = c.cause === MM_CAUSE_IDX[mmFitCause(run)];
      body = `<div class="pr-sub">결과 판정: ${okC ? '<span class="mm-ok">✅</span>' : '<span class="mm-ng">❌</span>'} ${MM_CAUSE_OPTS[c.cause]}${okC ? '' : ` → 정답: <b>${MM_CAUSE_OPTS[MM_CAUSE_IDX[mmFitCause(run)]]}</b>`} · 최종 빈 공간: <b class="mm-mono">${run.final.join(', ')}</b></div>`;
    } else body = '<div class="pr-sub">앞 방식을 마치면 시작합니다.</div>';
    return `<div class="mm-meth"><div class="mm-mh">${MM_FIT_NAME[m]} <small>(${MM_FIT_EN[m]} — ${MM_FIT_RULE[m]})</small></div>
      ${log ? `<ol class="mm-log">${log}</ol>` : ''}${body}</div>`;
  }).join('');
}
// 직접 입력 모드: 방식별 표, 요청마다 "고른 공간 크기(또는 실패)" + "요청 후 빈 공간 목록"
function mmFitChoiceOk(v, s) {
  const t = String(v == null ? '' : v).replace(/\s+/g, '').toLowerCase();
  if (!t) return false;
  const fail = /^(실패|할당실패|할당실패\(대기\)|대기|x|×|-|fail|없음)$/.test(t);
  if (s.idx < 0) return fail;
  return !fail && mmParseCount(t.replace(/(kib|kb|k)?(공간)?$/, '')) === s.size;
}
function mmFitListOk(v, s) { const l = mmParseList(v); return !!l && l.join(',') === s.after.join(','); }
function mmFitTypeMarks(S) {
  const mk = {};
  S.methods.forEach(m => S.runs[m].steps.forEach((s, i) => {
    mk[`${m}_${i}_c`] = mmFitChoiceOk(S.vals[`${m}_${i}_c`], s);
    mk[`${m}_${i}_l`] = mmFitListOk(S.vals[`${m}_${i}_l`], s);
  }));
  return mk;
}
function mmFitTypeHtml(S) {
  const g = S.graded, shown = g || S.revealed;
  S.marks = g ? mmFitTypeMarks(S) : null;
  return S.methods.map(m => {
    const run = S.runs[m];
    const rows = run.steps.map((s, i) => `<tr><td class="c">${i + 1}</td><td class="c"><b>${s.req}</b></td><td>${mmInput(`${m}_${i}_c`, '', '크기·실패')}</td><td>${mmInput(`${m}_${i}_l`, 'wide', '예: 100, 288, 200')}</td></tr>`).join('');
    const okC = S.tp[m] === MM_CAUSE_IDX[mmFitCause(run)];
    return `<div class="mm-meth"><div class="mm-mh">${MM_FIT_NAME[m]} <small>(${MM_FIT_EN[m]} — ${MM_FIT_RULE[m]})</small></div>
      <div class="pr-tablewrap"><table class="pr-table mm-tt"><tr><th>#</th><th>요청</th><th>고른 공간 크기</th><th>요청 후 빈 공간 목록 (주소 순)</th></tr>${rows}</table></div>
      <span class="mm-lbl">결과는? (실패가 있으면 첫 실패 기준)${g ? (okC ? ' <span class="mm-ok">✅</span>' : ' <span class="mm-ng">❌</span>') : ''}</span>${mmCauseChoices(m, S.tp[m], shown, 'mmFitPickCause')}</div>`;
  }).join('') + `<div class="pr-sub">할당 실패면 "실패"를 쓰고, 목록은 바뀌지 않은 그대로 씁니다. 남은 공간은 같은 자리에 둡니다. 입력칸에서 Enter = 다음 칸.</div>`;
}
function mmFitScore(S) {
  if (MM.opt.solve === 'type') {
    const mk = mmFitTypeMarks(S), keys = Object.keys(mk);
    const causeOk = S.methods.filter(m => S.tp[m] === MM_CAUSE_IDX[mmFitCause(S.runs[m])]).length;
    return [keys.filter(k => mk[k]).length + causeOk, keys.length + S.methods.length];
  }
  let ok = 0, all = 0;
  S.methods.forEach(m => {
    const run = S.runs[m], c = S.cl[m];
    c.picks.forEach((p, i) => { all++; if (p === run.steps[i].idx) ok++; });
    all++; if (c.cause === MM_CAUSE_IDX[mmFitCause(run)]) ok++;
  });
  return [ok, all];
}
function mmFitFinished(S) { return MM.opt.solve === 'type' ? (S.graded || S.revealed) : !mmFitActive(S); }
function mmRenderFit() {
  const S = MM.st, o = MM.opt, fin = mmFitFinished(S);
  const body = o.solve === 'click' ? mmFitClickHtml(S) : mmFitTypeHtml(S);
  let result = '';
  if (fin) {
    const [ok, all] = mmFitScore(S);
    result = (S.revealed ? '' : mmSummary(ok, all).replace(' · 빨간 칸을 다시 확인하세요.', '')) +
      `<div class="pr-answer"><b>풀이</b>${mmExpFit(S, S.methods, S.N)}</div>`;
  }
  const typeBtn = o.solve === 'type' && !fin;
  mmMain().innerHTML = `<div class="pr-card">
    <h3 class="pr-h">📦 연속 메모리 할당</h3>
    <div class="pr-row" style="align-items:center;margin-bottom:6px"><span class="pr-sub">방식</span>
      <div class="pr-seg">${MM_METHODS.map(([id, nm]) => `<button class="${o.method === id ? 'active' : ''}" onclick="mmSetOpt('method', '${id}')">${nm}</button>`).join('')}</div></div>
    <div class="pr-row" style="align-items:center;margin-bottom:6px"><span class="pr-sub">풀이</span>
      <div class="pr-seg"><button class="${o.solve === 'click' ? 'active' : ''}" onclick="mmSetOpt('solve', 'click')">🖱 클릭</button><button class="${o.solve === 'type' ? 'active' : ''}" onclick="mmSetOpt('solve', 'type')">⌨️ 직접 입력</button></div>
      <label class="pr-chk"><input type="checkbox" ${o.tie ? 'checked' : ''} onchange="mmSetOpt('tie', this.checked)"> 동률 문제만</label></div>
    <div class="mm-given">${mmFitGivenHtml(S, S.unit)}</div>
    ${body}
    ${result}
    <div class="pr-actions">
      ${typeBtn ? '<button class="pr-btn indigo" onclick="mmCheck()">✅ 채점하기</button>' : ''}
      ${fin ? '' : '<button class="pr-btn ghost" onclick="mmReveal()">👀 정답 보기</button>'}
      <button class="pr-btn" onclick="mmNext()">다음 문제 →</button>
      <button class="pr-btn ghost" onclick="mmExample()">📄 문서 예제</button></div></div>`;
}
function mmFitReveal() {
  const S = MM.st;
  S.methods.forEach(m => {
    const run = S.runs[m], ans = MM_CAUSE_IDX[mmFitCause(run)];
    if (MM.opt.solve === 'type') {
      run.steps.forEach((s, i) => { S.vals[`${m}_${i}_c`] = s.idx < 0 ? '실패' : String(s.size); S.vals[`${m}_${i}_l`] = s.after.join(', '); });
      S.tp[m] = ans;
    } else {
      const c = S.cl[m];
      for (let i = c.picks.length; i < run.steps.length; i++) c.picks.push(run.steps[i].idx);
      if (c.cause === null) c.cause = ans;
    }
  });
  S.revealed = true; S.graded = false; S.marks = null;
}

// ── 6. 2단계 페이지 테이블 ──
function mmTwoFields(S) {
  const a = S.ans;
  return [
    ['high', '상위 인덱스 비트 수', String(a.high), mmCountCheck(a.high)],
    ['low', '하위 인덱스 비트 수', String(a.low), mmCountCheck(a.low)],
    ['off', '변위 비트 수', String(a.off), mmCountCheck(a.off)],
    ['ent', '하위 테이블 엔트리 수', mmComma(a.lowEntries), mmCountCheck(a.lowEntries), '예: 1024 · 2^10'],
  ];
}
function mmRenderTwo() {
  const S = MM.st;
  mmFormView('🪜 2단계 페이지 테이블: 가상 주소 비트 분할', `${mmTwoGiven(S)}<br><span style="font-size:14px">가상 주소를 상위 비트부터 상위 인덱스 / 하위 인덱스 / 페이지 내부 변위로 나누세요.</span>`,
    mmTwoFields(S), mmExpTwo(S));
}

// ── 7. TLB 유효 접근 시간 ──
function mmEatFields(S) {
  const a = S.ans;
  return [
    ['hit', '적중 시간 (ns)', String(a.hit), mmTimeCheck(a.hit)],
    ['miss', '미스 시간 (ns)', String(a.miss), mmTimeCheck(a.miss)],
    ['eat', 'EAT (ns)', String(a.eat), mmTimeCheck(a.eat, 0.005), '소수 가능 · 예: 112.35'],
  ];
}
function mmRenderEat() {
  const S = MM.st;
  mmFormView('⏱ TLB 유효 메모리 접근 시간(EAT)', `${mmEatGiven(S)}<br><span style="font-size:14px">참조하는 페이지는 모두 메모리에 있고(페이지 폴트 없음), TLB 미스면 각 단계의 페이지 테이블을 메모리에서 한 번씩 읽습니다. ns는 붙여도 되고, EAT는 ±0.005까지 인정합니다.</span>`,
    mmEatFields(S), mmExpEat(S));
}

// ── 8. 예약 vs 점유 ──
function mmReserveFields(S) {
  const a = S.ans;
  return [
    ['vp', '가상 페이지 수', mmComma(a.vpages), mmCountCheck(a.vpages), '예: 16384 · 2^14'],
    ['used', '실제 점유 용량', mmHuman(a.used), mmSizeCheck(a.used, 1024), '예: 2400KiB'],
  ];
}
function mmRenderReserve() {
  const S = MM.st;
  mmFormView('🗂 가상 주소 공간 예약량 vs 실제 물리 메모리 점유량', `${mmReserveGiven(S)}<br><span style="font-size:14px">페이지 테이블 자체가 차지하는 메모리와 공유 페이지는 고려하지 않습니다. 용량 칸에 숫자만 쓰면 바이트 또는 KiB 둘 다 인정합니다.</span>`,
    mmReserveFields(S), mmExpReserve(S));
}

// ── 9. 실전 세트 (한 화면에 풀고 한꺼번에 채점) ──
function mmNewExam(cnt) {
  cnt = cnt || (MM.st && MM.st.cnt) || 10;
  const kinds = [];
  while (kinds.length < cnt) kinds.push(...mmShuffle(MM_EXAM_KINDS));
  MM.st = { cnt, items: kinds.slice(0, cnt).map(k => MM_GEN[k]()), vals: {}, picks: {}, marks: null, graded: false };
}
function mmExamOk(S, i) { const it = S.items[i]; return it.kind === 'choice' ? S.picks[i] === it.ansIdx : !!it.check(S.vals['e' + i]); }
function mmExamPick(i, k) { const S = MM.st; if (S.graded) return; S.picks[i] = k; mmRender(); }
function mmRenderExam() {
  const S = MM.st, g = S.graded;
  S.marks = g ? Object.fromEntries(S.items.map((it, i) => ['e' + i, mmExamOk(S, i)])) : null;
  const score = g ? S.items.filter((it, i) => mmExamOk(S, i)).length : 0;
  const qs = S.items.map((it, i) => {
    const ok = g && mmExamOk(S, i);
    const body = it.kind === 'choice'
      ? `<div class="wq-choices" style="margin-top:6px">${it.opts.map((o, k) => `<button class="wq-choice${S.picks[i] === k ? ' sel' : ''}${g ? (k === it.ansIdx ? ' ok' : S.picks[i] === k ? ' ng' : '') : ''}" ${g ? 'disabled' : ''} onclick="mmExamPick(${i}, ${k})"><pre>${k + 1}. ${escHtml(o)}</pre></button>`).join('')}</div>`
      : `<div style="margin-top:6px">${mmInput('e' + i, /fitfinal|목록/.test(it.q) ? 'wide' : '', '답')}</div>`;
    return `<div class="mm-q"><span class="mm-qn">${i + 1}.</span><small class="pr-chip">${escHtml(it.cat)}</small>${g ? `<span class="mm-mark" style="color:${ok ? '#15803d' : '#b91c1c'}">${ok ? '⭕' : '❌'}</span>` : ''}
      <div>${it.q}</div>${body}
      ${g ? `<div class="mm-exp">${ok ? '' : `정답: <b class="mm-mono">${escHtml(it.ans)}</b><br>`}${it.exp}</div>` : ''}</div>`;
  }).join('');
  mmMain().innerHTML = `<div class="pr-card">
    <h3 class="pr-h">🎓 실전 세트</h3>
    <div class="pr-row" style="align-items:center;margin-bottom:0"><span class="pr-sub">문제 수</span>
      <div class="pr-seg">${[10, 15, 20].map(c => `<button class="${S.cnt === c ? 'active' : ''}" onclick="mmNewExam(${c}); mmRender()">${c}문제</button>`).join('')}</div></div>
    ${g ? `<div class="pr-result ${score === S.cnt ? 'good' : 'bad'}" style="font-size:15px"><b>${score} / ${S.cnt}</b> (${Math.round(score / S.cnt * 100)}점)</div>` : ''}
  </div>
  <div class="pr-card">${qs}
    ${g ? '' : '<div class="pr-actions"><button class="pr-btn indigo" onclick="mmCheck()">✅ 한꺼번에 채점</button></div>'}
    ${g ? `<div class="pr-result ${score === S.cnt ? 'good' : 'bad'}"><b>${score} / ${S.cnt}</b> 정답</div>` : ''}
    <div class="pr-actions"><button class="pr-btn" onclick="mmNext(); window.scrollTo(0, 0)">🔁 새 시험지</button></div></div>`;
}

function mmForm(st) { return Object.assign(st, { vals: {}, marks: null, revealed: false }); }
const MM_MODES = {
  page: {
    make(ex) { MM.st = mmForm(mmMakePage(ex ? MM_EXAMPLES.page : null)); MM.st.faultPick = false; },
    render: mmRenderPage,
    check() { const S = MM.st; mmFormCheck(mmPageFields(S)); S.marks.fault = S.faultPick === S.ans.fault; },
    reveal() { const S = MM.st; mmFormReveal(mmPageFields(S)); S.faultPick = S.ans.fault; },
  },
  phys: {
    make(ex) { MM.st = mmForm(mmMakePhys(ex ? MM_EXAMPLES.phys[MM.exPhys++ % 2] : null)); },
    render: mmRenderPhys, check() { mmFormCheck(mmPhysFields(MM.st)); }, reveal() { mmFormReveal(mmPhysFields(MM.st)); },
  },
  table: {
    make(ex) { MM.st = mmForm(mmMakeTable(ex ? MM_EXAMPLES.table : null)); },
    render: mmRenderTable, check() { mmFormCheck(mmTableFields(MM.st)); }, reveal() { mmFormReveal(mmTableFields(MM.st)); },
  },
  frag: {
    make(ex) { MM.st = mmForm(mmMakeFrag(ex ? MM_EXAMPLES.frag : null)); },
    render: mmRenderFrag, check() { mmFormCheck(mmFragFields(MM.st)); }, reveal() { mmFormReveal(mmFragFields(MM.st)); },
  },
  fit: {
    make(ex) { MM.st = mmMakeFitState(!!ex); },
    render: mmRenderFit,
    check() { const S = MM.st; if (MM.opt.solve === 'type' && !S.revealed) S.graded = true; },
    reveal: mmFitReveal,
  },
  two: {
    make(ex) { MM.st = mmForm(mmMakeTwo(ex ? MM_EXAMPLES.two[MM.exTwo++ % 2] : null)); },
    render: mmRenderTwo, check() { mmFormCheck(mmTwoFields(MM.st)); }, reveal() { mmFormReveal(mmTwoFields(MM.st)); },
  },
  eat: {
    make(ex) { MM.st = mmForm(mmMakeEat(ex ? MM_EXAMPLES.eat : null)); },
    render: mmRenderEat, check() { mmFormCheck(mmEatFields(MM.st)); }, reveal() { mmFormReveal(mmEatFields(MM.st)); },
  },
  reserve: {
    make(ex) { MM.st = mmForm(mmMakeReserve(ex ? MM_EXAMPLES.reserve : null)); },
    render: mmRenderReserve, check() { mmFormCheck(mmReserveFields(MM.st)); }, reveal() { mmFormReveal(mmReserveFields(MM.st)); },
  },
  exam: { make() { mmNewExam(); }, render: mmRenderExam, check() { MM.st.graded = true; }, reveal() {} },
};

registerPractice({
  id: 'memory', subject: '운영체제', exams: ['기말고사'], icon: '🧮', title: '메모리 관리 계산 연습',
  desc: '페이징 주소 변환(페이지 폴트 포함), 물리 메모리 구성, 페이지 테이블 크기, 내부 단편화, 최초 · 최적 · 최악 적합 연속 할당, 2단계 페이지 테이블 비트 분할, TLB 유효 접근 시간(EAT), 가상 주소 예약량 vs 실제 점유량을 무작위 문제로 풀고 단계별 풀이를 확인하세요',
  mount: mmMount,
  onKey(act, e) {
    if (!MM || MM.view !== 'fit' || MM.opt.solve !== 'click') return;
    const S = MM.st, m = mmFitActive(S);
    if (!m) return;
    const c = S.cl[m], st = S.runs[m].steps[c.picks.length];
    if (st) {
      if (act === 'x') { e.preventDefault(); mmFitPick(m, -1); }
      else if (act[0] === 'c') { const i = +act.slice(1) - 1; if (i < st.before.length && st.before[i] > 0) { e.preventDefault(); mmFitPick(m, i); } }
    } else if (act[0] === 'c') {
      const i = +act.slice(1) - 1;
      if (i < MM_CAUSE_OPTS.length) { e.preventDefault(); mmFitPickCause(m, i); }
    }
  },
  onEnter(e) {
    if (!MM) return;
    const S = MM.st, v = MM.view;
    if (['page', 'phys', 'table', 'frag', 'two', 'eat', 'reserve'].includes(v) && (S.marks || S.revealed)) { e.preventDefault(); mmNext(); }
    else if (v === 'fit' && mmFitFinished(S)) { e.preventDefault(); mmNext(); }
  },
});
