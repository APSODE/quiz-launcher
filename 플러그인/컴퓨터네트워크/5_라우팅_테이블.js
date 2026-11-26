// 5_라우팅_테이블.js — quiz_launcher 플러그인: 라우팅 테이블 · 라우팅 프로토콜 연습 (9 · 10장)
// 실행기가 일반 <script>로 실행한다. 실행기 공통 함수(escHtml, prRand, registerPractice)를 전역으로 쓴다.
// 문항 데이터 없이 문제를 무작위로 만든다. 최상위 이름은 모두 rt / RT 접두어.
// 강의 기준: 테이블 = Network · Mask · (Cost) · Next Hop(직접 연결 C) · Interface [9장 p.6, 10장 p.11],
//   ip route 명령 [9장 p.30, 33], 관리 거리 표 [9장 p.25], RIP 홉 수 · 갱신 규칙 [10장 p.9~19],
//   OSPF 비용 10^8/bps (버림, 1 미만은 1) [9장 p.37, 10장 p.49], Dijkstra [10장 p.28~48].

// ════════════════════════════════════════════════════════
//  주소 (0 ~ 2^32-1 정수)
// ════════════════════════════════════════════════════════
function rtIp(a, b, c, d) { return ((a * 256 + b) * 256 + c) * 256 + d; }
function rtMask(n) { return n <= 0 ? 0 : (0xFFFFFFFF << (32 - n)) >>> 0; }
function rtNet(ip, n) { return (ip & rtMask(n)) >>> 0; }
function rtStr(x) { return [x >>> 24, (x >>> 16) & 255, (x >>> 8) & 255, x & 255].join('.'); }
function rtCidr(ip, n) { return rtStr(ip) + '/' + n; }
function rtIn(ip, net, n) { return rtNet(ip, n) === net; }
function rtParseIp(s) {
  const m = String(s == null ? '' : s).replace(/\s+/g, '').match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return null;
  const o = m.slice(1).map(Number);
  if (o.some(v => v > 255)) return null;
  return rtIp(o[0], o[1], o[2], o[3]);
}
function rtMaskPrefix(m) {
  const inv = (~m) >>> 0;
  if (((inv + 1) & inv) !== 0) return null;
  return 32 - Math.round(Math.log2(inv + 1));
}
// "255.255.255.0" · "/24" · "24" → prefix (실패 = null)
function rtParseMask(s) {
  const t = String(s == null ? '' : s).replace(/\s+/g, '');
  const m = t.match(/^\/?(\d{1,2})$/);
  if (m) return +m[1] <= 32 ? +m[1] : null;
  const ip = rtParseIp(t);
  return ip == null ? null : rtMaskPrefix(ip);
}
function rtParseNum(s) { const t = String(s == null ? '' : s).replace(/[\s,]/g, ''); return /^\d+$/.test(t) ? Number(t) : null; }
// 직접 연결 표기: C · - · 직접 · 직접 연결 · connected
function rtIsC(s) { return /^(c|-|직접(연결)?|connected|directly ?connected|\(직접연결\))$/i.test(String(s == null ? '' : s).replace(/\s+/g, '')); }
function rtIsNone(s) { return /^(-|x|없음|none|∞)$/i.test(String(s == null ? '' : s).trim()); }
// "R3" · "r3" · "3" → 2 (0부터), 실패 = null
function rtParseR(s) { const m = String(s == null ? '' : s).trim().match(/^r?\s*(\d+)$/i); return m ? +m[1] - 1 : null; }
function rtSame(a, b) { return String(a == null ? '' : a).trim().toLowerCase() === String(b).toLowerCase(); }
// ip route <목적지> <마스크> <next hop IP | 출구 인터페이스> — "Router(config)#" 같은 앞부분은 무시
function rtCmdOk(v, ip, n, nh, ifc) {
  const t = String(v == null ? '' : v).replace(/^.*#/, '').trim().split(/\s+/);
  if (t.length !== 5 || t[0].toLowerCase() !== 'ip' || t[1].toLowerCase() !== 'route') return false;
  if (rtParseIp(t[2]) !== ip || rtParseIp(t[3]) !== rtMask(n)) return false;
  return (nh != null && rtParseIp(t[4]) === nh) || (ifc != null && rtSame(t[4], ifc));
}
function rtCmd(ip, n, hop) { return `ip route ${rtStr(ip)} ${rtStr(rtMask(n))} ${hop}`; }

function rtPick(a) { return a[prRand(0, a.length - 1)]; }
function rtShuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = prRand(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function rtLv() { return RT ? RT.opt.lv : 'easy'; }

// ════════════════════════════════════════════════════════
//  관리 거리 · OSPF 비용
// ════════════════════════════════════════════════════════
const RT_AD = [['Connected (직접 연결)', 0], ['Static (정적 경로)', 1], ['External BGP (eBGP)', 20], ['Internal EIGRP', 90], ['IGRP', 100],
  ['OSPF', 110], ['IS-IS', 115], ['RIP', 120], ['External EIGRP', 170], ['Internal BGP (iBGP)', 200]];
const RT_AD_UNKNOWN = ['알려지지 않은 경로 (Unknown)', 255];
function rtAdTable(hi) {
  return `<div class="rt-adlist">${RT_AD.concat([RT_AD_UNKNOWN]).map(([p, ad]) => `<span class="pr-chip${hi && hi.includes(p) ? ' rt-hi' : ''}">${escHtml(p)} <b>${ad}</b></span>`).join('')}</div>`;
}
function rtMetric(p) {
  if (/RIP/.test(p)) return prRand(1, 6) + ' 홉';
  if (/OSPF/.test(p)) return '비용 ' + prRand(2, 200);
  if (/EIGRP/.test(p)) return String(prRand(28, 300) * 10240);
  if (/IGRP/.test(p)) return String(prRand(1100, 9000));
  if (/IS-IS/.test(p)) return String(prRand(1, 6) * 10);
  if (/BGP/.test(p)) return '- (정책 기반)';
  return '0';
}

const RT_BW_BASE = [['Fast Ethernet', 1e8, '100Mbps'], ['Ethernet', 1e7, '10Mbps'], ['E1', 2048000, '2.048Mbps'], ['T1', 1544000, '1.544Mbps'],
  ['128Kbps', 128000, ''], ['64Kbps', 64000, ''], ['56Kbps', 56000, '']];
const RT_BW_MID = [['Gigabit Ethernet', 1e9, '1Gbps'], ['10Gbps', 1e10, ''], ['T3', 44736000, '44.736Mbps'], ['512Kbps', 512000, ''], ['256Kbps', 256000, '']];
function rtBwList() {
  const lv = rtLv(), L = RT_BW_BASE.slice();
  if (lv !== 'easy') L.push(...RT_BW_MID);
  if (lv === 'hard') {
    const k = rtPick([384, 768, 1024, 192]), m = rtPick([3, 6, 8, 20, 45]);
    L.push([k + 'Kbps', k * 1000, ''], [m + 'Mbps', m * 1e6, '']);
  }
  return L.map(([nm, bps, d]) => ({ nm, bps, d }));
}
function rtBwName(b) { return b.d ? `${b.nm} (${b.d})` : b.nm; }
function rtCost(bps) { return Math.max(1, Math.floor(1e8 / bps)); }
function rtCostWhy(b) {
  const raw = 1e8 / b.bps, c = rtCost(b.bps);
  const r = Number.isInteger(raw) ? String(raw) : raw.toFixed(raw < 1 ? 3 : 2).replace(/0+$/, '');
  return `${escHtml(rtBwName(b))}: 10<sup>8</sup> / ${b.bps.toLocaleString()} = ${r}${raw < 1 ? ' → 1 미만이므로 <b>1</b>' : Number.isInteger(raw) ? ` → <b>${c}</b>` : ` → 소수점 버림 <b>${c}</b>`}`;
}

// ════════════════════════════════════════════════════════
//  토폴로지 (라우터 트리: 경로가 하나뿐이라 정적 경로 답이 하나로 정해진다)
//   topo = { R: [{ name, x, y, ifs: [{ name, net, ip }] }], nets: [{ ip, n, kind, routers }], edges: [[a, b, net]], link[a][b] = net }
// ════════════════════════════════════════════════════════
const RT_SHAPES = {
  c3: { pos: [[0, 0], [1, 0], [2, 0]], edges: [[0, 1], [1, 2]] },
  c4: { pos: [[0, 0], [1, 0], [2, 0], [3, 0]], edges: [[0, 1], [1, 2], [2, 3]] },
  t4: { pos: [[0, 0], [1, 0], [2, 0], [1, 1]], edges: [[0, 1], [1, 2], [1, 3]] },
  c5: { pos: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]], edges: [[0, 1], [1, 2], [2, 3], [3, 4]] },
  y5: { pos: [[0, 0], [1, 0], [2, 0], [3, 0], [1, 1]], edges: [[0, 1], [1, 2], [2, 3], [1, 4]] },
  h5: { pos: [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1]], edges: [[0, 1], [1, 2], [0, 3], [2, 4]] },
};
function rtTopo(key) {
  const sh = RT_SHAPES[key], lv = rtLv(), used = new Set();
  const uniq = (ns, f) => { for (;;) { const v = f(); if (!used.has(ns + v)) { used.add(ns + v); return v; } } };
  const R = sh.pos.map((p, i) => ({ name: 'R' + (i + 1), x: p[0], y: p[1], ifs: [] }));
  const nets = [], link = R.map(() => []), edges = [];
  R.forEach((r, i) => {
    let ip, n = 24;
    if (lv === 'easy') ip = rtIp(192, 168, uniq('c', () => prRand(1, 99)), 0);
    else if (lv === 'mid') ip = Math.random() < 0.5 ? rtIp(192, 168, uniq('c', () => prRand(1, 250)), 0) : rtIp(172, uniq('b', () => prRand(16, 31)), prRand(0, 255), 0);
    else { n = rtPick([24, 25, 26, 27]); ip = rtIp(192, 168, uniq('c', () => prRand(1, 250)), prRand(0, 2 ** (n - 24) - 1) * 2 ** (32 - n)); }
    nets.push({ ip, n, kind: 'lan', routers: [i] });
    r.ifs.push({ name: 'm0', net: nets.length - 1, ip: ip + 1 });
  });
  sh.edges.forEach(([a, b]) => {
    const ip = lv === 'hard' ? rtIp(10, prRand(0, 9), uniq('l', () => prRand(0, 255)), prRand(0, 63) * 4) : rtIp(10, 0, uniq('l', () => prRand(0, 99)), 0);
    nets.push({ ip, n: 30, kind: 'link', routers: [a, b] });
    const k = nets.length - 1;
    R[a].ifs.push({ name: 'm' + R[a].ifs.length, net: k, ip: ip + 1 });
    R[b].ifs.push({ name: 'm' + R[b].ifs.length, net: k, ip: ip + 2 });
    link[a][b] = link[b][a] = k;
    edges.push([a, b, k]);
  });
  return { key, R, nets, link, edges };
}
function rtShapeFor(kind) {
  const lv = rtLv();
  return rtPick(kind === 'rip' ? { easy: ['c3', 'c4'], mid: ['c4', 't4'], hard: ['c5', 'y5', 'h5'] }[lv] : { easy: ['c3'], mid: ['c4', 't4'], hard: ['y5', 'h5', 'c5'] }[lv]);
}
function rtIf(topo, r, k) { return topo.R[r].ifs.find(f => f.net === k); }
function rtAdj(topo, r) { return topo.edges.filter(e => e[0] === r || e[1] === r).map(e => (e[0] === r ? e[1] : e[0])); }
function rtBfs(topo, s) {
  const n = topo.R.length, dist = Array(n).fill(Infinity), par = Array(n).fill(-1), q = [s];
  dist[s] = 0;
  while (q.length) { const u = q.shift(); rtAdj(topo, u).forEach(v => { if (dist[v] === Infinity) { dist[v] = dist[u] + 1; par[v] = u; q.push(v); } }); }
  return { dist, par };
}
// 라우터 t 에서 네트워크 k 로 가는 경로 → { c, ifc, nh, nhR, cost, path }
function rtRoute(topo, t, k) {
  const net = topo.nets[k];
  if (net.routers.includes(t)) return { c: true, ifc: rtIf(topo, t, k).name, cost: 0, path: [t] };
  const B = rtBfs(topo, t), o = net.routers.reduce((a, b) => (B.dist[b] < B.dist[a] ? b : a));
  const path = [o];
  while (path[0] !== t) path.unshift(B.par[path[0]]);
  const f = path[1], lk = topo.link[t][f];
  return { c: false, nh: rtIf(topo, f, lk).ip, nhR: f, ifc: rtIf(topo, t, lk).name, cost: B.dist[o], path };
}
function rtNetName(topo, k) {
  const N = topo.nets[k];
  return N.kind === 'lan' ? `${topo.R[N.routers[0]].name} LAN` : `${topo.R[N.routers[0]].name}–${topo.R[N.routers[1]].name} 링크`;
}

// 토폴로지 그림 (hi = 강조할 라우터)
function rtTopoSvg(topo, hi) {
  const X = x => 95 + x * 200, Y = y => 92 + y * 175;
  const mx = Math.max(...topo.R.map(r => r.x)), my = Math.max(...topo.R.map(r => r.y));
  const W = X(mx) + 95, H = my ? Y(1) + 95 : 148;
  const oct = ip => '.' + (ip & 255);
  let s = '';
  topo.edges.forEach(([a, b, k]) => {
    const A = topo.R[a], B = topo.R[b], N = topo.nets[k];
    const ax = X(A.x), ay = Y(A.y), bx = X(B.x), by = Y(B.y);
    s += `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" class="rt-ln"/>`;
    if (ay === by) {
      const [L, Rr] = ax < bx ? [A, B] : [B, A], lx = Math.min(ax, bx), rx = Math.max(ax, bx);
      s += `<text x="${(lx + rx) / 2}" y="${ay - 9}" text-anchor="middle" class="rt-net">${rtCidr(N.ip, N.n)}</text>`;
      s += `<text x="${lx + 28}" y="${ay + 19}" class="rt-if">${rtIf(topo, topo.R.indexOf(L), k).name} ${oct(rtIf(topo, topo.R.indexOf(L), k).ip)}</text>`;
      s += `<text x="${rx - 28}" y="${ay + 19}" text-anchor="end" class="rt-if">${rtIf(topo, topo.R.indexOf(Rr), k).name} ${oct(rtIf(topo, topo.R.indexOf(Rr), k).ip)}</text>`;
    } else {
      const [T, Bt] = ay < by ? [a, b] : [b, a], ty = Math.min(ay, by), byy = Math.max(ay, by);
      s += `<text x="${ax + 10}" y="${(ty + byy) / 2 + 4}" class="rt-net">${rtCidr(N.ip, N.n)}</text>`;
      s += `<text x="${ax - 8}" y="${ty + 42}" text-anchor="end" class="rt-if">${rtIf(topo, T, k).name} ${oct(rtIf(topo, T, k).ip)}</text>`;
      s += `<text x="${ax - 8}" y="${byy - 32}" text-anchor="end" class="rt-if">${rtIf(topo, Bt, k).name} ${oct(rtIf(topo, Bt, k).ip)}</text>`;
    }
  });
  topo.R.forEach((r, i) => {
    const cx = X(r.x), cy = Y(r.y), N = topo.nets[r.ifs[0].net], up = r.y === 0;
    const ly = up ? cy - 78 : cy + 52;
    s += `<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${up ? ly + 26 : ly}" class="rt-ln"/>`;
    s += `<rect x="${cx - 74}" y="${ly}" width="148" height="26" rx="7" class="rt-lan"/>`;
    s += `<text x="${cx}" y="${ly + 17.5}" text-anchor="middle" class="rt-lant">${rtCidr(N.ip, N.n)}</text>`;
    s += `<text x="${cx + 8}" y="${up ? cy - 32 : cy + 42}" class="rt-if">m0 ${oct(r.ifs[0].ip)}</text>`;
    s += `<circle cx="${cx}" cy="${cy}" r="22" class="rt-rt${i === hi ? ' on' : ''}"/>`;
    s += `<text x="${cx}" y="${cy + 5}" text-anchor="middle" class="rt-rn${i === hi ? ' on' : ''}">${r.name}</text>`;
  });
  return `<div class="rt-svgwrap"><svg class="rt-svg" viewBox="0 0 ${W} ${H}" style="max-width:${W}px" role="img" aria-label="네트워크 토폴로지">${s}</svg></div>
    <div class="pr-sub">각 라우터 아래위 상자는 그 라우터의 LAN, 선 위 주소는 라우터 사이 링크 네트워크입니다. <span class="rt-mono">m1 .2</span> = 인터페이스 m1, 주소는 그 네트워크의 .2.</div>`;
}

// ════════════════════════════════════════════════════════
//  RIP
// ════════════════════════════════════════════════════════
// 갱신 규칙 [10장 p.16]: 받은 홉 수 +1 → 새 주소 추가 · 같은 Next Hop 이면 교체 · 다른 Next Hop 이면 작을 때만 교체
//  table / msg: { net: { cost, nh } } (msg 의 cost 는 받은 그대로) → { out, why: { net: 'keep'|'new'|'same'|'big'|'small' } }
function rtRipApply(table, msg, from) {
  const out = {}, why = {};
  Object.keys(table).forEach(k => { out[k] = { ...table[k] }; why[k] = 'keep'; });
  Object.keys(msg).forEach(k => {
    const c = Math.min(16, msg[k].cost + 1), cur = out[k];
    if (!cur) { out[k] = { cost: c, nh: from }; why[k] = 'new'; }
    else if (cur.nh === from) { out[k] = { cost: c, nh: from }; why[k] = 'same'; }
    else if (c < cur.cost) { out[k] = { cost: c, nh: from }; why[k] = 'small'; }
    else why[k] = 'big';
  });
  return { out, why };
}
// 모든 라우터가 동시에 k번 테이블을 교환한 뒤의 테이블: T[r] = Map(net → { cost, nh: 라우터 번호 | -1 = 직접 연결 })
function rtRipRun(topo, k) {
  let T = topo.R.map(r => new Map(r.ifs.map(f => [f.net, { cost: 0, nh: -1 }])));
  for (let round = 0; round < k; round++) {
    const old = T;
    T = old.map((m, i) => {
      const nm = new Map(m);
      rtAdj(topo, i).forEach(u => old[u].forEach((e, net) => {
        const c = Math.min(16, e.cost + 1), cur = nm.get(net);
        if (!cur || (cur.nh === u && cur.nh !== -1) || (cur.nh !== u && c < cur.cost)) nm.set(net, { cost: c, nh: u });
      }));
      return nm;
    });
  }
  return T;
}

// ════════════════════════════════════════════════════════
//  Dijkstra (OSPF SPF)
// ════════════════════════════════════════════════════════
// E: [{ a, b, w }] → { dist, prev, order, steps: [{ u, dist, prev, done }], tie }
function rtDijk(n, E, s) {
  const dist = Array(n).fill(Infinity), prev = Array(n).fill(-1), done = [], steps = [];
  let tie = false;
  dist[s] = 0;
  steps.push({ u: null, dist: dist.slice(), prev: prev.slice(), done: [] });
  while (done.length < n) {
    let u = -1;
    for (let v = 0; v < n; v++) if (!done.includes(v) && (u < 0 || dist[v] < dist[u])) u = v;
    if (dist[u] === Infinity) break;
    for (let v = 0; v < n; v++) if (v !== u && !done.includes(v) && dist[v] === dist[u]) tie = true;
    done.push(u);
    E.forEach(e => {
      const v = e.a === u ? e.b : e.b === u ? e.a : -1;
      if (v < 0 || done.includes(v)) return;
      const t = dist[u] + e.w;
      if (t < dist[v]) { dist[v] = t; prev[v] = u; } else if (t === dist[v]) tie = true;
    });
    steps.push({ u, dist: dist.slice(), prev: prev.slice(), done: done.slice() });
  }
  return { dist, prev, order: done, steps, tie };
}
function rtFirstHop(prev, s, v) { let x = v; while (prev[x] !== s && prev[x] >= 0) x = prev[x]; return x; }
const RT_GLAYOUT = {
  4: { pos: [[0, 1], [1, 0], [1, 2], [2, 1]], cand: [[0, 1], [0, 2], [1, 2], [1, 3], [2, 3]], m: [4, 5] },
  5: { pos: [[0, 1], [1, 0], [1, 2], [2, 0], [2, 2]], cand: [[0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4], [1, 4]], m: [6, 7] },
  6: { pos: [[0, 1], [1, 0], [1, 2], [2, 0], [2, 2], [3, 1]], cand: [[0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4], [3, 5], [4, 5], [1, 4]], m: [7, 9] },
};
function rtNewGraph() {
  const lv = rtLv(), n = { easy: 4, mid: 5, hard: 6 }[lv], L = RT_GLAYOUT[n], wmax = { easy: 9, mid: 12, hard: 20 }[lv];
  for (let t = 0; t < 2000; t++) {
    const m = prRand(L.m[0], L.m[1]), cand = rtShuffle(L.cand), par = [...Array(n).keys()];
    const find = x => (par[x] === x ? x : (par[x] = find(par[x])));
    const pickE = [], rest = [];
    cand.forEach(([a, b]) => { if (find(a) !== find(b)) { par[find(a)] = find(b); pickE.push([a, b]); } else rest.push([a, b]); });
    if (pickE.length !== n - 1) continue;
    const E = pickE.concat(rest.slice(0, Math.max(0, m - pickE.length))).map(([a, b]) => ({ a, b, w: prRand(1, wmax) }));
    const res = rtDijk(n, E, 0);
    if (res.tie || res.order.length !== n) continue;
    // 직통 링크보다 우회가 싼 경우가 하나는 있어야 연습이 된다
    if (!E.some(e => e.a === 0 && res.prev[e.b] !== 0) && Math.random() < 0.8) continue;
    return { n, pos: L.pos, E, res };
  }
  throw new Error('그래프 생성 실패');
}
function rtGraphSvg(g) {
  const X = x => 50 + x * 170, Y = y => 38 + y * 88;
  const W = X(Math.max(...g.pos.map(p => p[0]))) + 50, H = Y(2) + 40;
  let s = '';
  g.E.forEach(e => {
    const [ax, ay] = g.pos[e.a], [bx, by] = g.pos[e.b];
    const x1 = X(ax), y1 = Y(ay), x2 = X(bx), y2 = Y(by), mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="rt-ln"/>`;
    s += `<rect x="${mx - 13}" y="${my - 11}" width="26" height="20" rx="5" class="rt-wbg"/><text x="${mx}" y="${my + 4}" text-anchor="middle" class="rt-w">${e.w}</text>`;
  });
  g.pos.forEach(([x, y], i) => {
    s += `<circle cx="${X(x)}" cy="${Y(y)}" r="21" class="rt-rt${i === 0 ? ' on' : ''}"/><text x="${X(x)}" y="${Y(y) + 5}" text-anchor="middle" class="rt-rn${i === 0 ? ' on' : ''}">R${i + 1}</text>`;
  });
  return `<div class="rt-svgwrap"><svg class="rt-svg" viewBox="0 0 ${W} ${H}" style="max-width:${W}px" role="img" aria-label="링크 비용 그래프">${s}</svg></div>`;
}

// ════════════════════════════════════════════════════════
//  단일 문항 생성기 (경로 선택 · OSPF 링크 비용 · 실전 세트)
//   문항 = { cat, kind: 'text' | 'choice', q, ans, check(v) | opts + ansIdx, exp }
// ════════════════════════════════════════════════════════
function rtTI(cat, q, ans, check, exp) { return { cat, kind: 'text', q, ans, check, exp }; }
function rtCI(cat, q, opts, ansIdx, exp) { return { cat, kind: 'choice', q, opts, ansIdx, ans: opts[ansIdx], exp }; }
function rtRandLan() { return rtIp(rtPick([192, 172, 10]), prRand(0, 255), prRand(0, 255), 0) >>> 0; }
function rtTable(head, rows) {
  return `<div class="pr-tablewrap"><table class="pr-table rt-t"><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table></div>`;
}
function rtEnt(net, c, nh) { return `(${net}, ${c}, ${nh})`; }

const RT_GEN = {
  // 관리 거리로 경로 고르기
  adPick() {
    const k = { easy: 2, mid: 3, hard: 4 }[rtLv()];
    let pro = rtShuffle(RT_AD.slice(1)).slice(0, k);
    if (rtLv() !== 'easy' && Math.random() < 0.4 && !pro.some(p => p[0] === 'RIP')) pro[0] = RT_AD.find(p => p[0] === 'RIP');
    const dest = rtRandLan(), rows = pro.map(p => ({ p: p[0], ad: p[1], nh: rtStr(rtIp(10, 0, prRand(1, 99), prRand(1, 2))), met: rtMetric(p[0]) }));
    const ans = rows.reduce((b, r, i) => (r.ad < rows[b].ad ? i : b), 0);
    const rip = rows.find(r => r.p === 'RIP');
    if (rip && ans !== rows.indexOf(rip)) rip.met = '1 홉';
    return rtCI('관리 거리', `목적지 <b class="rt-mono">${rtCidr(dest, 24)}</b>로 가는 경로를 여러 라우팅 프로토콜이 함께 알려 왔다. 라우팅 테이블에 올라가는 경로는?
      ${rtTable(['출처 프로토콜', 'Next Hop', '메트릭'], rows.map(r => [escHtml(r.p), `<span class="rt-mono">${r.nh}</span>`, escHtml(r.met)]))}`,
    rows.map(r => `${r.p} 경로 (next hop ${r.nh})`), ans,
    `같은 목적지를 여러 프로토콜이 알려 주면 <b>관리 거리(AD)가 가장 작은</b> 프로토콜의 경로를 고릅니다 [9장 p.25]. ${rows.slice().sort((a, b) => a.ad - b.ad).map(r => `${escHtml(r.p)} ${r.ad}`).join(' &lt; ')} → <b>${escHtml(rows[ans].p)}</b>.
      메트릭(홉 수 · 비용)은 단위가 달라 프로토콜끼리 비교하지 않습니다.${rtAdTable(rows.map(r => r.p))}`);
  },
  adNum() {
    const p = Math.random() < 0.08 ? RT_AD_UNKNOWN : rtPick(RT_AD);
    return rtTI('관리 거리', `<b>${escHtml(p[0])}</b>의 관리 거리(AD)는? (숫자만)`, String(p[1]), v => rtParseNum(v) === p[1],
      `값이 작을수록 우선합니다${p[1] === 255 ? '. 255는 신뢰할 수 없는 경로로, 트래픽을 폐기합니다' : ''}.${rtAdTable([p[0]])}`);
  },
  // 최장 프리픽스 우선 → 없으면 디폴트 → 그것도 없으면 폐기
  lpmPick() {
    const lv = rtLv(), a = prRand(1, 250), b = prRand(0, 255), h = prRand(0, 1) * 128;
    const ents = [{ ip: rtIp(10, a, 0, 0), n: 16 }, { ip: rtIp(10, a, b, 0), n: 24 }];
    if (lv !== 'easy') ents.push({ ip: rtIp(10, a, b, h), n: 25 });
    const srcs = rtShuffle(['OSPF', 'RIP', 'Static', 'Internal EIGRP']);
    ents.forEach((e, i) => { e.src = srcs[i]; e.nh = rtStr(rtIp(10, 9, prRand(1, 99), prRand(1, 2))); });
    if (Math.random() < 0.65) ents.push({ ip: 0, n: 0, src: 'Static (디폴트)', nh: rtStr(rtIp(10, 9, prRand(1, 99), 1)), def: true });
    const tbl = rtShuffle(ents);
    tbl.forEach((e, i) => { e.ifc = 'm' + i; });
    const real = tbl.filter(e => !e.def), want = rtPick(real.concat([null, null].slice(0, lv === 'easy' ? 1 : 2)));
    let dst = null;
    for (let t = 0; t < 400 && dst == null; t++) {
      const ip = want ? want.ip + prRand(0, 2 ** (32 - want.n) - 1) : (Math.random() < 0.5 ? rtIp(10, (a + prRand(1, 5)) % 256, prRand(0, 255), prRand(1, 254)) : rtIp(rtPick([172, 192, 203]), prRand(0, 255), prRand(0, 255), prRand(1, 254)));
      const m = real.filter(e => rtIn(ip, e.ip, e.n));
      const best = m.reduce((x, e) => (!x || e.n > x.n ? e : x), null);
      if ((want && best === want) || (!want && !best)) dst = ip;
    }
    const m = real.filter(e => rtIn(dst, e.ip, e.n)), best = m.reduce((x, e) => (!x || e.n > x.n ? e : x), null), def = tbl.find(e => e.def);
    const hit = best || def || null, opts = tbl.map(e => e.ifc).concat(['폐기 (drop)']);
    return rtCI('포워딩', `라우터의 라우팅 테이블이 다음과 같다. 목적지 <b class="rt-mono">${rtStr(dst)}</b>인 패킷은 어디로 가는가?
      ${rtTable(['출처', 'Network / Mask', 'Next Hop', 'Interface'], tbl.map(e => [escHtml(e.src), `<span class="rt-mono">${e.def ? '0.0.0.0 / 0.0.0.0' : `${rtStr(e.ip)} / ${rtStr(rtMask(e.n))}`}</span>`, `<span class="rt-mono">${e.nh}</span>`, `<b>${e.ifc}</b>`]))}`,
    opts, hit ? tbl.indexOf(hit) : opts.length - 1,
    (m.length ? `일치하는 항목: ${m.map(e => `<span class="pr-chip rt-mono">${rtCidr(e.ip, e.n)} (${escHtml(e.src)})</span>`).join('')}<br>그중 prefix가 가장 긴 <b>/${best.n}</b> → <b>${best.ifc}</b>. 관리 거리는 같은 목적지(같은 prefix) 경로끼리 고를 때 쓰고, 포워딩은 최장 프리픽스가 먼저입니다.`
      : def ? `일치하는 항목이 없어 디폴트 경로(0.0.0.0 0.0.0.0) → <b>${def.ifc}</b>. 디폴트 라우팅은 테이블에 없는 목적지 패킷을 지정 경로로 보냅니다 [9장 p.12].`
        : `일치하는 항목도 디폴트 경로도 없으므로 <b>폐기</b>합니다. 라우터는 테이블에 목적지가 없으면 패킷을 버립니다 [9장 p.11~12].`));
  },
  ospfCost() {
    const b = rtPick(rtBwList()), c = rtCost(b.bps);
    return rtTI('OSPF 비용', `참고 대역폭 100Mbps 기준, <b>${escHtml(rtBwName(b))}</b> 인터페이스의 OSPF 링크 비용은? (숫자만)`, String(c), v => rtParseNum(v) === c,
      `비용 = 10<sup>8</sup> / 인터페이스 대역폭(bps), 소수점은 버리고 1 미만이면 1 [9장 p.37].<br>${rtCostWhy(b)}`);
  },
  pathCost() {
    const L = rtBwList(), p = Array.from({ length: prRand(2, rtLv() === 'easy' ? 3 : 4) }, () => rtPick(L)), sum = p.reduce((s, b) => s + rtCost(b.bps), 0);
    return rtTI('OSPF 비용', `다음 링크를 차례로 지나는 경로의 OSPF 총 비용은? (참고 대역폭 100Mbps, 숫자만)<br>${rtPathHtml(p)}`, String(sum), v => rtParseNum(v) === sum,
      p.map(rtCostWhy).join('<br>') + `<br>합 = ${p.map(b => rtCost(b.bps)).join(' + ')} = <b>${sum}</b>`);
  },
  ripHop() {
    const n = prRand(3, rtLv() === 'easy' ? 3 : 5), oc = prRand(1, 9);
    const nets = [rtIp(oc, oc, oc, 0)];
    for (let i = 1; i < n; i++) nets.push(rtIp(192, 168, i * 10 + i + 1, 0));
    nets.push(rtIp(oc + 1, oc + 1, oc + 1, 0));
    // nets[j] 는 라우터 j-1 · j 사이 (0번은 R1 왼쪽, 마지막은 Rn 오른쪽)
    const at = j => [j - 1, j].filter(r => r >= 0 && r < n);
    let r, j, hop;
    do { r = prRand(0, n - 1); j = prRand(0, n); hop = Math.min(...at(j).map(x => Math.abs(x - r))); } while (hop === 0 && Math.random() < 0.85);
    const chain = nets.map((x, i) => `<span class="rt-mono">${rtCidr(x, 24)}</span>${i < n ? ` — <b>R${i + 1}</b> — ` : ''}`).join('');
    return rtTI('RIP 홉 수', `${chain}<br>순으로 연결된 망에서 RIP를 쓸 때, <b>R${r + 1}</b>이 <b class="rt-mono">${rtCidr(nets[j], 24)}</b>까지 계산하는 홉 수는? (숫자만)`, String(hop), v => rtParseNum(v) === hop,
      `RIP 메트릭 = 목적지 네트워크까지 거치는 라우터 수. 직접 연결된 네트워크는 0, 이웃에게서 받을 때마다 1씩 늘어납니다 [9장 p.36]. ${rtCidr(nets[j], 24)}는 ${at(j).map(x => 'R' + (x + 1)).join(' · ')}에 직접 연결 → R${r + 1}까지 <b>${hop}</b>.`);
  },
  ripRule() {
    const kind = rtPick(['new', 'same', 'same', 'big', 'small']), net = 'Net' + prRand(1, 6), X = rtPick(['A', 'B', 'D']), Y = rtPick(['A', 'B', 'D', 'E'].filter(x => x !== X));
    let c, m;
    if (kind === 'same') { c = prRand(2, 9); do { m = prRand(1, 12); } while (m + 1 === c); }
    else if (kind === 'big') { c = prRand(2, 8); m = prRand(c, c + 5); }
    else if (kind === 'small') { c = prRand(4, 12); m = prRand(1, c - 2); }
    else { c = null; m = prRand(1, 10); }
    const cur = c == null ? null : { cost: c, nh: kind === 'same' ? X : Y };
    const r = rtRipApply(cur ? { [net]: cur } : {}, { [net]: { cost: m } }, X), res = r.out[net];
    const show = e => rtEnt(net, e.cost, e.nh);
    const opts = [...new Set([show(res), cur ? show(cur) : '테이블에 추가하지 않는다', show({ cost: m, nh: X }), cur ? show({ cost: cur.cost + 1, nh: cur.nh }) : show({ cost: m + 2, nh: X })])].slice(0, 4);
    const sh = rtShuffle(opts);
    return rtCI('RIP 갱신', `라우터의 라우팅 테이블에 ${cur ? `<b class="rt-mono">${show(cur)}</b>` : `<b>${net}</b>에 대한 항목이 없다`}. 이웃 <b>${X}</b>로부터 RIP 메시지 <b class="rt-mono">(${net}, ${m})</b>를 받았다. 갱신 후 ${net} 항목은? (Network, Cost, Next Hop)`,
      sh, sh.indexOf(show(res)), rtRipWhy(r.why[net], m, X, cur, res));
  },
  ipCmd() {
    const nh = rtIp(10, 0, prRand(0, 99), 2), def = Math.random() < 0.35, ip = def ? 0 : rtIp(192, 168, prRand(1, 250), 0), n = def ? 0 : 24, ifc = 'S' + prRand(0, 1);
    const ans = rtCmd(ip, n, rtStr(nh));
    return rtTI('정적 경로 설정', def
      ? `R1에서 테이블에 없는 모든 목적지를 next hop <b class="rt-mono">${rtStr(nh)}</b>(나가는 인터페이스 ${ifc})로 보내는 <b>디폴트 경로</b> 설정 명령은? (Router(config)# 뒤에 입력할 부분)`
      : `R1에서 목적지 <b class="rt-mono">${rtCidr(ip, n)}</b>로 가는 <b>정적 경로</b>를 next hop <b class="rt-mono">${rtStr(nh)}</b>(나가는 인터페이스 ${ifc})로 설정하는 명령은? (Router(config)# 뒤에 입력할 부분)`,
    ans, v => rtCmdOk(v, ip, n, nh, ifc),
    `형식: <span class="rt-mono">ip route &lt;목적지 네트워크&gt; &lt;서브넷 마스크&gt; &lt;next hop IP 또는 출구 인터페이스&gt;</span> [9장 p.30].${def ? ' 디폴트 경로는 목적지와 마스크를 모두 0.0.0.0으로 씁니다 [9장 p.33].' : ''} 출구 인터페이스로 쓴 <span class="rt-mono">${rtCmd(ip, n, ifc)}</span>도 정답입니다.`);
  },
};
function rtRipWhy(w, m, X, cur, res) {
  const plus = `받은 홉 수 ${m} + 1 = ${Math.min(16, m + 1)}${m + 1 >= 16 ? ' (16 = 무한대, 도달 불가로 처리)' : ''}`;
  const t = {
    keep: () => '받은 정보가 없어 그대로 둡니다.',
    new: () => `${plus}. 테이블에 없는 새 주소 → <b>추가</b>.`,
    same: () => `${plus}. Next Hop이 기존과 같은 ${X} → 홉 수가 ${res.cost > cur.cost ? '커졌어도' : '작아졌으므로'} <b>교체</b> (같은 이웃이 알려 준 최신 정보를 따른다).`,
    big: () => `${plus}. Next Hop이 다르고(${cur.nh} ≠ ${X}) 기존 ${cur.cost}보다 크다 → 기존 엔트리 <b>유지</b>.`,
    small: () => `${plus}. Next Hop이 다르지만(${cur.nh} ≠ ${X}) 기존 ${cur.cost}보다 작다 → <b>교체</b>.`,
  };
  return t[w]() + ' [10장 p.12~16]';
}
function rtPathHtml(p) {
  return `<span class="rt-path"><span class="pr-chip">출발</span>${p.map(b => ` ─ <b>${escHtml(rtBwName(b))}</b> ─ <span class="rt-dot">●</span>`).join('').replace(/<span class="rt-dot">●<\/span>$/, '<span class="pr-chip">목적지</span>')}</span>`;
}
const RT_SELECT_KINDS = ['adPick', 'adPick', 'lpmPick', 'lpmPick', 'adNum'];
const RT_COST_KINDS = ['ospfCost', 'ospfCost', 'pathCost'];
const RT_EXAM_KINDS = ['adPick', 'adNum', 'lpmPick', 'ospfCost', 'pathCost', 'ripHop', 'ripRule', 'ipCmd', 'adPick', 'lpmPick', 'ripRule', 'ipCmd'];

// ════════════════════════════════════════════════════════
//  화면
// ════════════════════════════════════════════════════════
let RT = null;
const RT_VIEWS = [['table', '🗺️ 테이블 작성'], ['select', '⚖️ 경로 선택'], ['rip', '🔁 RIP'], ['ospf', '🧮 OSPF'], ['exam', '📝 실전 세트']];
const RT_SUBS = { rip: [['upd', '갱신 규칙'], ['ex', 'n차 교환 후 테이블']], ospf: [['cost', '링크 비용'], ['path', '경로 비교'], ['dijk', 'Dijkstra']] };
const RT_LV_NAME = { easy: '쉬움', mid: '보통', hard: '어려움' };
const RT_CSS = `
  .pr-num.rt-in { width: 138px; text-align: left; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 13px; }
  .pr-num.rt-in.sm { width: 64px; text-align: center; }
  .pr-num.rt-in.md { width: 92px; }
  .pr-num.rt-in.wide { width: 100%; max-width: 520px; }
  .rt-svgwrap { overflow-x: auto; margin: 4px 0 2px; }
  .rt-svg { width: 100%; height: auto; display: block; }
  .rt-ln { stroke: #94a3b8; stroke-width: 2.5; }
  .rt-lan { fill: #f0fdf4; stroke: #86efac; stroke-width: 1.5; }
  .rt-lant { font: 600 12.5px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; fill: #166534; }
  .rt-net { font: 600 12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; fill: #475569; }
  .rt-if { font: 11.5px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; fill: #7c3aed; }
  .rt-rt { fill: #eef2ff; stroke: #6366f1; stroke-width: 2; }
  .rt-rt.on { fill: #4f46e5; stroke: #3730a3; }
  .rt-rn { font: 800 13px system-ui, sans-serif; fill: #3730a3; }
  .rt-rn.on { fill: #fff; }
  .rt-wbg { fill: #fff; stroke: #cbd5e1; }
  .rt-w { font: 800 12.5px system-ui, sans-serif; fill: #b45309; }
  .pr-table.rt-t td, .pr-table.rt-t th { text-align: left; }
  .pr-table.rt-t td.c { text-align: center; }
  .pr-table.rt-t td.why { font-size: 12px; line-height: 1.55; max-width: 360px; color: #334155; }
  .rt-adlist { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
  .pr-chip.rt-hi { background: #e0e7ff; border-color: #818cf8; }
  .rt-given { font-size: 14.5px; margin: 0 0 10px; line-height: 1.7; }
  .rt-two { display: flex; gap: 16px; flex-wrap: wrap; align-items: flex-start; }
  .rt-path { line-height: 2.1; }
  .rt-dot { color: #6366f1; }
  .rt-lbl { display: block; font-size: 12px; font-weight: 700; color: #475569; margin: 12px 0 4px; }
  .rt-step td.sel { background: #eef2ff; font-weight: 800; }
  .rt-step td.dn { color: #cbd5e1; }
  .rt-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
  .rt-q { border-top: 1px solid #e2e8f0; padding: 14px 0 6px; font-size: 14px; line-height: 1.75; }
  .rt-q:first-of-type { border-top: none; padding-top: 0; }
  .rt-qn { font-weight: 800; color: #4338ca; margin-right: 6px; }
  .rt-mark { font-weight: 800; margin-left: 6px; }
  .rt-exp { background: #f8fafc; border-radius: 10px; padding: 8px 12px; margin-top: 8px; font-size: 13px; line-height: 1.7; }
`;

function rtMount(root) {
  let opt = { lv: 'easy' };
  try { const o = JSON.parse(localStorage.getItem('rtOpt') || 'null'); if (o && RT_LV_NAME[o.lv]) opt = { lv: o.lv }; } catch (e) { /* 저장소 없음 */ }
  RT = { view: 'table', sub: { rip: 'upd', ospf: 'cost' }, opt, st: null };
  root.innerHTML = `<style>${RT_CSS}</style>
    <div class="pr-card">
      <h3 class="pr-h">⚙️ 모드</h3>
      <div class="pr-seg" id="rt-views"></div>
      <div class="pr-row" style="margin:12px 0 0;align-items:center"><div class="pr-seg" id="rt-lv"></div><div class="pr-seg" id="rt-sub"></div></div>
      <div class="pr-sub" style="margin-top:8px">마스크는 255.255.255.0 · /24 · 24 아무 형식이나 됩니다. 직접 연결된 네트워크의 Next Hop은 <b>C</b>. 입력칸에서 Enter = 채점.</div>
    </div>
    <div id="rt-main"></div>`;
  rtSetView('table');
}
function rtSetLv(v) {
  RT.opt.lv = v;
  try { localStorage.setItem('rtOpt', JSON.stringify(RT.opt)); } catch (e) { /* 무시 */ }
  rtSetView(RT.view);
}
function rtSetSub(v) { RT.sub[RT.view] = v; rtSetView(RT.view); }
function rtSetView(v) {
  RT.view = v;
  document.getElementById('rt-views').innerHTML = RT_VIEWS.map(([id, nm]) => `<button class="${v === id ? 'active' : ''}" onclick="rtSetView('${id}')">${nm}</button>`).join('');
  document.getElementById('rt-lv').innerHTML = Object.keys(RT_LV_NAME).map(k => `<button class="${RT.opt.lv === k ? 'active' : ''}" onclick="rtSetLv('${k}')">${RT_LV_NAME[k]}</button>`).join('');
  const subs = RT_SUBS[v], sub = document.getElementById('rt-sub');
  sub.innerHTML = subs ? subs.map(([id, nm]) => `<button class="${RT.sub[v] === id ? 'active' : ''}" onclick="rtSetSub('${id}')">${nm}</button>`).join('') : '';
  sub.style.display = subs ? '' : 'none';
  RT.st = null;
  rtNext();
}
function rtMain() { return document.getElementById('rt-main'); }
function rtModeKey() { return RT_SUBS[RT.view] ? RT.view + ':' + RT.sub[RT.view] : RT.view; }
function rtMode() { return RT_MODES[rtModeKey()]; }
function rtNext() { rtMode().make(); rtRender(); }
function rtRender() { rtMode().render(); }
function rtCheck() { rtMode().check(); rtRender(); }
function rtReveal() { rtMode().reveal(); rtRender(); }
function rtKey(e) {
  if (e.key !== 'Enter' || e.isComposing) return;
  e.preventDefault();
  if (RT.view !== 'exam') { rtCheck(); return; }
  const ins = [...rtMain().querySelectorAll('input.rt-in')], k = ins.indexOf(e.target);
  if (k >= 0 && k + 1 < ins.length) ins[k + 1].focus();
}

// 입력칸 (값 RT.st.vals[key], 채점 표시 RT.st.marks[key])
function rtInput(key, cls, ph) {
  const S = RT.st, mk = S.marks && key in S.marks ? (S.marks[key] ? ' ok' : ' ng') : '';
  return `<input class="pr-num rt-in${cls ? ' ' + cls : ''}${mk}" value="${escHtml(S.vals[key] || '')}" placeholder="${ph || ''}" spellcheck="false" autocomplete="off"
    oninput="RT.st.vals['${key}'] = this.value" onkeydown="rtKey(event)">`;
}
function rtActions(nextLabel) {
  return `<div class="pr-actions">
    <button class="pr-btn indigo" onclick="rtCheck()">✅ 채점하기</button>
    <button class="pr-btn ghost" onclick="rtReveal()">👀 정답 보기</button>
    <button class="pr-btn" onclick="rtNext()">${nextLabel || '다음 문제'} →</button></div>`;
}
function rtSummary(ok, all) {
  return `<div class="pr-result ${ok === all ? 'good' : 'bad'}"><b>${ok === all ? '🎉 모두 정답입니다!' : '채점 결과'}</b> ${ok} / ${all} 정답${ok === all ? '' : ' · 빨간 칸을 다시 확인하세요.'}</div>`;
}
// 칸 목록 [key, 정답 표시, check]
function rtFormCheck(F) { const S = RT.st; S.marks = {}; F.forEach(([k, , c]) => { S.marks[k] = !!c(S.vals[k]); }); }
function rtFormReveal(F) { const S = RT.st; S.revealed = true; S.marks = null; F.forEach(([k, a]) => { S.vals[k] = a; }); }
function rtFormSummary(F, extra) {
  const S = RT.st;
  if (!S.marks) return '';
  const e = extra || [0, 0];
  return rtSummary(F.filter(f => S.marks[f[0]]).length + e[0], F.length + e[1]);
}
function rtShown() { return RT.st.marks || RT.st.revealed; }

// ── 1. 라우팅 테이블 작성 (정적 · 디폴트) ──
function rtNewTable() {
  const topo = rtTopo(rtShapeFor('table')), n = topo.R.length;
  const leaves = topo.R.map((r, i) => i).filter(i => rtAdj(topo, i).length === 1);
  const stub = Math.random() < 0.4, t = stub ? rtPick(leaves) : prRand(0, n - 1);
  const rows = [];
  topo.nets.forEach((N, k) => {
    const r = rtRoute(topo, t, k);
    if (stub && !r.c) return;
    rows.push({ k, ip: N.ip, n: N.n, r });
  });
  let cmd;
  if (stub) {
    const nb = rtAdj(topo, t)[0], lk = topo.link[t][nb];
    const r = { c: false, nh: rtIf(topo, nb, lk).ip, nhR: nb, ifc: rtIf(topo, t, lk).name, path: [t, nb] };
    rows.push({ k: -1, ip: 0, n: 0, r, def: true });
    cmd = rows[rows.length - 1];
  } else {
    const far = rows.filter(x => !x.r.c);
    cmd = rtPick(far.filter(x => topo.nets[x.k].kind === 'lan').length ? far.filter(x => topo.nets[x.k].kind === 'lan') : far);
  }
  RT.st = { topo, t, stub, rows, cmd, vals: {}, marks: null, revealed: false };
}
function rtTableFields(S) {
  const F = [];
  S.rows.forEach((x, i) => {
    F.push([`r${i}_m`, rtStr(rtMask(x.n)), v => rtParseMask(v) === x.n]);
    F.push([`r${i}_h`, x.r.c ? 'C' : rtStr(x.r.nh), v => (x.r.c ? rtIsC(v) : rtParseIp(v) === x.r.nh)]);
    F.push([`r${i}_i`, x.r.ifc, v => rtSame(v, x.r.ifc)]);
  });
  const c = S.cmd;
  F.push(['cmd', rtCmd(c.ip, c.n, rtStr(c.r.nh)), v => rtCmdOk(v, c.ip, c.n, c.r.nh, c.r.ifc)]);
  return F;
}
function rtTableWhy(S, x) {
  const T = S.topo, me = T.R[S.t].name;
  if (x.def) return `스텁 라우터: 나가는 길이 ${T.R[x.r.nhR].name} 하나뿐이므로 직접 연결 외의 모든 목적지를 디폴트 경로 하나로 보냅니다. 마스크 0.0.0.0, next hop = ${T.R[x.r.nhR].name}의 링크 쪽 주소.`;
  if (x.r.c) return `${me}의 ${x.r.ifc}에 직접 연결 → Next Hop C`;
  return `${x.r.path.map(i => T.R[i].name).join(' → ')}${T.nets[x.k].kind === 'link' ? ' (링크의 가까운 쪽 라우터까지)' : ''}. 첫 홉 ${T.R[x.r.nhR].name}의 링크 주소 ${rtStr(x.r.nh)}, ${me}에서는 ${x.r.ifc}로 나감`;
}
function rtRenderTable() {
  const S = RT.st, T = S.topo, me = T.R[S.t].name, F = rtTableFields(S), shown = rtShown(), c = S.cmd;
  const rows = S.rows.map((x, i) => `<tr><td class="rt-mono">${x.def ? '0.0.0.0' : rtStr(x.ip)}${x.def ? ' <small>(디폴트)</small>' : ` <small style="color:#64748b">${rtNetName(T, x.k)}</small>`}</td>
    <td>${rtInput(`r${i}_m`, '', i ? '' : '예: 255.255.255.0')}</td><td>${rtInput(`r${i}_h`, '', i ? '' : 'IP 또는 C')}</td><td>${rtInput(`r${i}_i`, 'sm', i ? '' : 'm?')}</td>
    ${shown ? `<td class="why">${rtTableWhy(S, x)}</td>` : ''}</tr>`).join('');
  const cmdQ = c.def ? `${me}의 <b>디폴트 경로</b>를 설정하는 명령` : `${me}에서 <b class="rt-mono">${rtCidr(c.ip, c.n)}</b>(${rtNetName(T, c.k)})로 가는 <b>정적 경로</b>를 next hop으로 설정하는 명령`;
  rtMain().innerHTML = `<div class="pr-card">
    <h3 class="pr-h">🗺️ ${me}의 라우팅 테이블 ${S.stub ? '<small style="font-weight:500;color:#64748b">· 스텁 라우터 (정적 + 디폴트)</small>' : '<small style="font-weight:500;color:#64748b">· 정적 라우팅</small>'}</h3>
    ${rtTopoSvg(T, S.t)}
    <div class="rt-given">${S.stub
      ? `<b>${me}</b>는 바깥으로 나가는 길이 하나뿐인 스텁 라우터다. 직접 연결된 네트워크와 <b>디폴트 경로</b>로 테이블을 완성하세요.`
      : `<b>${me}</b>에 정적 경로를 설정해 모든 네트워크에 도달하게 한다. 각 목적지의 Mask · Next Hop · Interface를 채우세요.`}</div>
    <div class="pr-tablewrap"><table class="pr-table rt-t"><tr><th>Network</th><th>Mask</th><th>Next Hop</th><th>Interface</th>${shown ? '<th>풀이</th>' : ''}</tr>${rows}</table></div>
    <span class="rt-lbl">${cmdQ} (Router(config)# 뒤에 입력할 부분)</span>${rtInput('cmd', 'wide', 'ip route 목적지 마스크 next-hop')}
    ${rtFormSummary(F)}
    ${shown ? `<div class="pr-answer"><b>풀이</b><div class="pr-sub">Next Hop = 패킷을 넘길 <b>이웃 라우터의 주소</b>(자기 인터페이스 주소가 아님), Interface = 그 이웃 쪽으로 나가는 <b>자기 인터페이스</b> [9장 p.6].
      명령: <span class="rt-mono">${rtCmd(c.ip, c.n, rtStr(c.r.nh))}</span> 또는 출구 인터페이스로 <span class="rt-mono">${rtCmd(c.ip, c.n, c.r.ifc)}</span> [9장 p.30${c.def ? ', 33' : ''}]</div></div>` : ''}
    ${rtActions()}</div>`;
}

// ── 단일 문항 흐름 (경로 선택 · OSPF 링크 비용) ──
function rtStreamMake(kinds) {
  const S = RT.st && RT.st.stream ? RT.st : { stream: true, score: 0, total: 0 };
  Object.assign(S, { item: RT_GEN[rtPick(kinds)](), vals: {}, marks: null, pick: null, done: false, ok: false });
  RT.st = S;
}
function rtRenderStream(icon, hint) {
  const S = RT.st, it = S.item, done = S.done;
  const body = it.kind === 'choice'
    ? `<div class="wq-choices" style="margin-top:10px">${it.opts.map((o, i) => `<button class="wq-choice${done ? (i === it.ansIdx ? ' ok' : i === S.pick ? ' ng' : '') : ''}" ${done ? 'disabled' : ''} onclick="rtStreamPick(${i})"><pre>${i + 1}. ${escHtml(o)}</pre></button>`).join('')}</div>`
    : `<div class="pr-row" style="margin-top:10px">${rtInput('a', it.cat === '정적 경로 설정' ? 'wide' : '', '답')}${done ? '' : '<button class="pr-btn indigo" onclick="rtCheck()">확인</button>'}</div>`;
  rtMain().innerHTML = `<div class="pr-card">
    <h3 class="pr-h">${icon} ${S.total + (done ? 0 : 1)}번째 문제 <small style="font-weight:500;color:#64748b">· ${escHtml(it.cat)} · 지금까지 ${S.score} / ${S.total}</small></h3>
    <div style="font-size:14px;line-height:1.8">${it.q}</div>
    ${body}
    ${done ? `<div class="pr-result ${S.ok ? 'good' : 'bad'}"><b>${S.ok ? '정답!' : '오답'}</b>${S.ok ? '' : ' — 정답: <b class="rt-mono">' + escHtml(it.ans) + '</b>'}<div class="rt-exp">${it.exp}</div></div>
      <div class="pr-actions"><button class="pr-btn" onclick="rtNext()">다음 →</button></div>` : ''}
    ${hint ? `<div class="pr-sub" style="margin-top:8px">${hint}</div>` : ''}
  </div>`;
  if (!done && it.kind === 'text') { const el = rtMain().querySelector('input'); if (el && el.focus) el.focus(); }
}
function rtStreamPick(i) {
  const S = RT.st;
  if (S.done) return;
  S.pick = i; S.done = true; S.ok = i === S.item.ansIdx; S.total++; if (S.ok) S.score++;
  rtRender();
}
function rtStreamCheck() {
  const S = RT.st;
  if (S.done || S.item.kind !== 'text' || !(S.vals.a || '').trim()) return;
  S.done = true; S.ok = !!S.item.check(S.vals.a); S.total++; if (S.ok) S.score++;
  S.marks = { a: S.ok };
}

// ── 3a. RIP 갱신 규칙 ──
function rtNewRipUpd() {
  const lv = rtLv(), cnt = { easy: 4, mid: 5, hard: 6 }[lv], X = rtPick(['B', 'D']), others = ['A', 'B', 'D', 'E'].filter(x => x !== X);
  const cases = ['keep', 'new', 'same', 'big', 'small'];
  if (lv === 'hard') cases.push('inf');
  while (cases.length < cnt) cases.push(rtPick(['same', 'big', 'small', 'new']));
  const C = rtShuffle(cases);
  const table = {}, msg = {}, nets = [];
  C.forEach((kind, i) => {
    const net = 'Net' + (i + 1), Y = rtPick(others);
    nets.push(net);
    if (kind === 'keep') table[net] = { cost: prRand(1, 9), nh: rtPick(['A', 'B', 'D', 'E']) };
    else if (kind === 'new') msg[net] = { cost: prRand(1, 9) };
    else if (kind === 'same') { const c = prRand(2, 9); let m; do { m = prRand(1, 11); } while (m + 1 === c); table[net] = { cost: c, nh: X }; msg[net] = { cost: m }; }
    else if (kind === 'big') { const c = prRand(1, 8); table[net] = { cost: c, nh: Y }; msg[net] = { cost: prRand(c, c + 5) }; }
    else if (kind === 'small') { const c = prRand(4, 12); table[net] = { cost: c, nh: Y }; msg[net] = { cost: prRand(1, c - 2) }; }
    else { table[net] = { cost: prRand(2, 8), nh: X }; msg[net] = { cost: 15 + prRand(0, 1) }; }
  });
  RT.st = { X, nets, table, msg, res: rtRipApply(table, msg, X), vals: {}, marks: null, revealed: false };
}
function rtRipUpdFields(S) {
  return S.nets.flatMap(net => {
    const r = S.res.out[net];
    return [[`${net}_c`, String(r.cost), v => rtParseNum(v) === r.cost], [`${net}_h`, r.nh, v => rtSame(v, r.nh)]];
  });
}
function rtRenderRipUpd() {
  const S = RT.st, F = rtRipUpdFields(S), shown = rtShown();
  const cur = rtTable(['Network', 'Cost', 'Next Hop'], S.nets.filter(n => S.table[n]).map(n => [n, `<b>${S.table[n].cost}</b>`, S.table[n].nh]));
  const msg = rtTable(['Network', 'Cost'], S.nets.filter(n => S.msg[n]).map(n => [n, `<b>${S.msg[n].cost}</b>`]));
  const rows = S.nets.map(net => `<tr><td>${net}</td><td>${rtInput(`${net}_c`, 'sm')}</td><td>${rtInput(`${net}_h`, 'sm')}</td>
    ${shown ? `<td class="why">${rtRipWhy(S.res.why[net], S.msg[net] ? S.msg[net].cost : 0, S.X, S.table[net], S.res.out[net]).replace(/ \[10장 p\.12~16\]$/, '')}</td>` : ''}</tr>`).join('');
  rtMain().innerHTML = `<div class="pr-card">
    <h3 class="pr-h">🔁 RIP 라우팅 테이블 갱신</h3>
    <div class="rt-given">이웃 라우터 <b>${S.X}</b>로부터 RIP 메시지를 받았다. 갱신 후 라우팅 테이블을 채우세요.</div>
    <div class="rt-two"><div><span class="rt-lbl">갱신 전 라우팅 테이블</span>${cur}</div><div><span class="rt-lbl">${S.X}로부터 받은 RIP 메시지</span>${msg}</div></div>
    <span class="rt-lbl">갱신 후 라우팅 테이블</span>
    <div class="pr-tablewrap"><table class="pr-table rt-t"><tr><th>Network</th><th>Cost</th><th>Next Hop</th>${shown ? '<th>풀이</th>' : ''}</tr>${rows}</table></div>
    ${rtFormSummary(F)}
    ${shown ? `<div class="pr-answer"><b>갱신 규칙</b> [10장 p.12~16]
      ${rtTable(['받은 네트워크 주소', 'Next Hop', '홉 수(+1 한 값)', '갱신'], [['새 주소', '무관', '무관', '추가'], ['기존과 같음', '기존과 같음', '무관', '교체'], ['기존과 같음', '기존과 다름', '기존보다 큼', '유지'], ['기존과 같음', '기존과 다름', '기존보다 작음', '교체']])}
      <div class="pr-sub">받은 홉 수에 먼저 1을 더합니다. 16은 무한대(도달 불가)입니다.</div></div>` : ''}
    ${rtActions()}</div>`;
}

// ── 3b. RIP n차 교환 후 테이블 ──
function rtNewRipEx() {
  const topo = rtTopo(rtShapeFor('rip')), t = prRand(0, topo.R.length - 1), B = rtBfs(topo, t);
  const far = Math.max(...B.dist), k = prRand(1, Math.max(1, far));
  const T = rtRipRun(topo, k)[t];
  RT.st = { topo, t, k, T, vals: {}, marks: null, revealed: false };
}
function rtRipExFields(S) {
  const T = S.topo;
  return T.nets.flatMap((N, k) => {
    const e = S.T.get(k);
    if (!e) return [[`n${k}_c`, '-', v => rtIsNone(v)], [`n${k}_h`, '-', v => !String(v || '').trim() || rtIsNone(v)]];
    if (e.nh === -1) return [[`n${k}_c`, '0', v => rtParseNum(v) === 0], [`n${k}_h`, 'C', v => rtIsC(v)]];
    const nip = rtIf(T, e.nh, T.link[S.t][e.nh]).ip;
    return [[`n${k}_c`, String(e.cost), v => rtParseNum(v) === e.cost], [`n${k}_h`, rtStr(nip), v => rtParseIp(v) === nip || rtParseR(v) === e.nh]];
  });
}
function rtRenderRipEx() {
  const S = RT.st, T = S.topo, me = T.R[S.t].name, F = rtRipExFields(S), shown = rtShown();
  const rows = T.nets.map((N, k) => {
    const e = S.T.get(k), r = rtRoute(T, S.t, k);
    const why = !e ? `가장 가까운 연결 라우터까지 ${r.cost}홉 → ${r.cost}차 교환부터 알게 됨 (아직 모름)`
      : e.nh === -1 ? '직접 연결 → 홉 수 0' : `${r.path.map(i => T.R[i].name).join(' → ')}: ${e.cost}차 교환에서 처음 받음, 홉 수 ${e.cost}`;
    return `<tr><td class="rt-mono">${rtCidr(N.ip, N.n)} <small style="color:#64748b">${rtNetName(T, k)}</small></td><td>${rtInput(`n${k}_c`, 'sm')}</td><td>${rtInput(`n${k}_h`, 'md', 'IP · C · -')}</td>${shown ? `<td class="why">${why}</td>` : ''}</tr>`;
  }).join('');
  rtMain().innerHTML = `<div class="pr-card">
    <h3 class="pr-h">🔁 RIP — ${S.k}차 교환 후 ${me}의 테이블</h3>
    ${rtTopoSvg(T, S.t)}
    <div class="rt-given">모든 라우터가 RIP를 막 시작했다(처음엔 직접 연결 네트워크만 안다). 이웃끼리 동시에 테이블을 <b>${S.k}번</b> 교환한 뒤 <b>${me}</b>의 테이블을 채우세요.
      <br><span style="font-size:13px;color:#475569">아직 모르는 네트워크는 Cost에 <b>-</b>. Next Hop은 이웃의 링크 쪽 IP(R2처럼 라우터 이름도 인정), 직접 연결은 C.</span></div>
    <div class="pr-tablewrap"><table class="pr-table rt-t"><tr><th>Network</th><th>Cost (홉)</th><th>Next Hop</th>${shown ? '<th>풀이</th>' : ''}</tr>${rows}</table></div>
    ${rtFormSummary(F)}
    ${shown ? `<div class="pr-answer"><b>풀이</b><div class="pr-sub">1차 교환에서 이웃의 직접 연결 네트워크를 홉 수 1로, 2차 교환에서 이웃이 1차에 배운 네트워크를 홉 수 2로 받습니다. k차 교환이 끝나면 k홉 이내 네트워크를 모두 압니다 [10장 p.17~19].</div></div>` : ''}
    ${rtActions()}</div>`;
}

// ── 4b. OSPF 경로 비교 ──
function rtNewPath() {
  const lv = rtLv(), np = lv === 'hard' ? 3 : lv === 'mid' ? prRand(2, 3) : 2, L = rtBwList(), maxLen = lv === 'easy' ? 4 : 5;
  for (;;) {
    const paths = Array.from({ length: np }, () => Array.from({ length: prRand(1, maxLen) }, () => rtPick(L)));
    const sums = paths.map(p => p.reduce((s, b) => s + rtCost(b.bps), 0)), mn = Math.min(...sums), best = sums.indexOf(mn);
    if (sums.filter(s => s === mn).length > 1) continue;
    const trap = paths.some((p, i) => i !== best && p.length < paths[best].length);
    if (!trap && Math.random() < 0.7) continue;
    RT.st = { paths, sums, best, pick: null, vals: {}, marks: null, revealed: false };
    return;
  }
}
function rtPathFields(S) { return S.paths.map((p, i) => [`p${i}`, String(S.sums[i]), v => rtParseNum(v) === S.sums[i]]); }
function rtRenderPath() {
  const S = RT.st, F = rtPathFields(S), shown = rtShown(), nm = i => '경로 ' + 'ABC'[i];
  const pickOk = S.marks ? S.pick === S.best : null;
  rtMain().innerHTML = `<div class="pr-card">
    <h3 class="pr-h">🧮 OSPF 경로 비교</h3>
    <div class="rt-given">출발 라우터에서 목적지 네트워크로 가는 경로가 ${S.paths.length}개 있다. 참고 대역폭 100Mbps로 각 경로의 총 비용을 구하고 OSPF가 고르는 경로를 고르세요.</div>
    ${S.paths.map((p, i) => `<div style="margin:6px 0"><b>${nm(i)}</b> <small style="color:#64748b">(${p.length}개 링크)</small><br>${rtPathHtml(p)}<div class="pr-row" style="margin:4px 0 0;align-items:center"><span class="pr-sub">총 비용</span>${rtInput(`p${i}`, 'md')}</div></div>`).join('')}
    <span class="rt-lbl">OSPF가 선택하는 경로</span>
    <div class="wq-choices">${S.paths.map((p, i) => `<button class="wq-choice${S.pick === i ? ' sel' : ''}${shown ? (i === S.best ? ' ok' : i === S.pick ? ' ng' : '') : ''}" onclick="RT.st.pick = ${i}; rtRender()"><pre>${i + 1}. ${nm(i)}</pre></button>`).join('')}</div>
    ${S.marks ? rtFormSummary(F, [pickOk ? 1 : 0, 1]) : ''}
    ${shown ? `<div class="pr-answer"><b>풀이</b>${S.paths.map((p, i) => `<div class="pr-sub" style="margin-top:6px"><b>${nm(i)}</b>: ${p.map(rtCostWhy).join(' · ')}<br>합 ${p.map(b => rtCost(b.bps)).join(' + ')} = <b>${S.sums[i]}</b></div>`).join('')}
      <div class="pr-sub" style="margin-top:6px">→ 총 비용이 가장 작은 <b>${nm(S.best)}</b>(${S.sums[S.best]}). OSPF는 홉 수가 아니라 대역폭 기반 비용의 합으로 고르므로 링크가 더 많은 경로가 선택될 수도 있습니다 [9장 p.38].</div></div>` : ''}
    ${rtActions()}</div>`;
}

// ── 4c. Dijkstra ──
function rtNewDijk() { RT.st = { g: rtNewGraph(), vals: {}, marks: null, revealed: false }; }
function rtDijkFields(S) {
  const g = S.g, res = g.res, F = [];
  for (let k = 1; k < g.n; k++) { const u = res.order[k]; F.push([`o${k}`, 'R' + (u + 1), v => rtParseR(v) === u]); }
  for (let v = 1; v < g.n; v++) {
    const f = rtFirstHop(res.prev, 0, v), d = res.dist[v];
    F.push([`d${v}`, String(d), x => rtParseNum(x) === d]);
    F.push([`h${v}`, f === v ? '직접 연결' : 'R' + (f + 1), x => (f === v ? rtIsC(x) || rtParseR(x) === v : rtParseR(x) === f)]);
  }
  return F;
}
function rtDijkSteps(g) {
  const res = g.res, cell = (st, v) => {
    if (st.done.includes(v)) return '<td class="dn">-</td>';
    const d = st.dist[v], p = st.prev[v];
    return `<td>(${d === Infinity ? '∞' : d}, ${p < 0 ? 'X' : 'R' + (p + 1)})</td>`;
  };
  const rows = res.steps.slice(0, g.n).map((st, k) => {
    const nx = res.order[k];   // 이 단계 다음에 고를 노드 (색칠)
    return `<tr><td>${k}</td><td>${st.u == null ? '초기화' : 'R' + (st.u + 1)}</td>${[...Array(g.n).keys()].map(v => (v === nx ? cell(st, v).replace('<td>', '<td class="sel">') : cell(st, v))).join('')}</tr>`;
  }).join('');
  return `<div class="pr-tablewrap"><table class="pr-table rt-t rt-step"><tr><th>Step</th><th>선택 노드</th>${[...Array(g.n).keys()].map(v => `<th>R${v + 1}</th>`).join('')}</tr>${rows}</table></div>
    <div class="pr-sub">(거리, 이전 노드). 색칠한 칸이 다음 단계에서 선택(확정)되는 최소 거리 노드, - 는 이미 확정된 노드입니다.</div>`;
}
function rtRenderDijk() {
  const S = RT.st, g = S.g, F = rtDijkFields(S), shown = rtShown();
  const order = [...Array(g.n - 1).keys()].map(k => `<td>${rtInput(`o${k + 1}`, 'sm', 'R?')}</td>`).join('');
  const rows = [...Array(g.n).keys()].slice(1).map(v => `<tr><td class="pname">R${v + 1}</td><td>${rtInput(`d${v}`, 'sm')}</td><td>${rtInput(`h${v}`, 'md', 'R? · 직접')}</td></tr>`).join('');
  rtMain().innerHTML = `<div class="pr-card">
    <h3 class="pr-h">🧮 Dijkstra — R1의 최단 경로</h3>
    ${rtGraphSvg(g)}
    <div class="rt-given">선 위 숫자는 링크 비용이다. R1에서 Dijkstra(SPF) 알고리즘을 돌릴 때</div>
    <span class="rt-lbl">① 확정되는 순서 (R1 다음부터)</span>
    <div class="pr-tablewrap"><table class="pr-table"><tr>${[...Array(g.n - 1).keys()].map(k => `<th>${k + 2}번째</th>`).join('')}</tr><tr>${order}</tr></table></div>
    <span class="rt-lbl">② R1의 라우팅 테이블 (Next Hop = R1에서 처음 거치는 라우터, 바로 이웃으로 가는 게 최단이면 "직접")</span>
    <div class="pr-tablewrap"><table class="pr-table rt-t"><tr><th>목적지</th><th>Cost</th><th>Next Hop</th></tr>${rows}</table></div>
    ${rtFormSummary(F)}
    ${shown ? `<div class="pr-answer"><b>풀이</b> [10장 p.28~48]${rtDijkSteps(g)}
      ${rtTable(['목적지', 'Cost', '경로', 'Next Hop'], [...Array(g.n).keys()].slice(1).map(v => {
        const path = [v]; while (path[0] !== 0) path.unshift(g.res.prev[path[0]]);
        const f = rtFirstHop(g.res.prev, 0, v);
        return ['R' + (v + 1), `<b>${g.res.dist[v]}</b>`, path.map(x => 'R' + (x + 1)).join(' → '), f === v ? '(직접 연결)' : 'R' + (f + 1)];
      }))}</div>` : ''}
    ${rtActions('다음 그래프')}</div>`;
}

// ── 5. 실전 세트 ──
function rtNewExam(cnt) {
  cnt = cnt || (RT.st && RT.st.cnt) || 10;
  const kinds = [];
  while (kinds.length < cnt) kinds.push(...rtShuffle(RT_EXAM_KINDS));
  RT.st = { cnt, items: kinds.slice(0, cnt).map(k => RT_GEN[k]()), vals: {}, picks: {}, marks: null, graded: false };
}
function rtExamOk(S, i) { const it = S.items[i]; return it.kind === 'choice' ? S.picks[i] === it.ansIdx : !!it.check(S.vals['e' + i]); }
function rtRenderExam() {
  const S = RT.st, g = S.graded;
  S.marks = g ? Object.fromEntries(S.items.map((it, i) => ['e' + i, rtExamOk(S, i)])) : null;
  const score = g ? S.items.filter((it, i) => rtExamOk(S, i)).length : 0;
  const qs = S.items.map((it, i) => {
    const ok = g && rtExamOk(S, i);
    const body = it.kind === 'choice'
      ? `<div class="wq-choices" style="margin-top:6px">${it.opts.map((o, k) => `<button class="wq-choice${S.picks[i] === k ? ' sel' : ''}${g ? (k === it.ansIdx ? ' ok' : S.picks[i] === k ? ' ng' : '') : ''}" ${g ? 'disabled' : ''} onclick="RT.st.picks[${i}] = ${k}; rtRender()"><pre>${k + 1}. ${escHtml(o)}</pre></button>`).join('')}</div>`
      : `<div style="margin-top:6px">${rtInput('e' + i, it.cat === '정적 경로 설정' ? 'wide' : '', '답')}</div>`;
    return `<div class="rt-q"><span class="rt-qn">${i + 1}.</span><small class="pr-chip">${escHtml(it.cat)}</small>${g ? `<span class="rt-mark" style="color:${ok ? '#15803d' : '#b91c1c'}">${ok ? '⭕' : '❌'}</span>` : ''}
      <div>${it.q}</div>${body}
      ${g ? `<div class="rt-exp">${ok ? '' : `정답: <b class="rt-mono">${escHtml(it.ans)}</b><br>`}${it.exp}</div>` : ''}</div>`;
  }).join('');
  rtMain().innerHTML = `<div class="pr-card">
    <h3 class="pr-h">📝 실전 세트</h3>
    <div class="pr-row" style="align-items:center;margin-bottom:0"><span class="pr-sub">문제 수</span>
      <div class="pr-seg">${[10, 15, 20].map(c => `<button class="${S.cnt === c ? 'active' : ''}" onclick="rtNewExam(${c}); rtRender()">${c}문제</button>`).join('')}</div></div>
    ${g ? `<div class="pr-result ${score === S.cnt ? 'good' : 'bad'}" style="font-size:15px"><b>${score} / ${S.cnt}</b> (${Math.round(score / S.cnt * 100)}점)</div>` : ''}
  </div>
  <div class="pr-card">${qs}
    ${g ? '' : '<div class="pr-actions"><button class="pr-btn indigo" onclick="rtCheck()">✅ 한꺼번에 채점</button></div>'}
    ${g ? `<div class="pr-result ${score === S.cnt ? 'good' : 'bad'}"><b>${score} / ${S.cnt}</b> 정답</div>` : ''}
    <div class="pr-actions"><button class="pr-btn" onclick="rtNext(); window.scrollTo(0, 0)">🔁 새 시험지</button></div></div>`;
}

const RT_MODES = {
  table: { make: rtNewTable, render: rtRenderTable, check() { rtFormCheck(rtTableFields(RT.st)); }, reveal() { rtFormReveal(rtTableFields(RT.st)); } },
  select: {
    make() { rtStreamMake(RT_SELECT_KINDS); }, check: rtStreamCheck, reveal() {},
    render() { rtRenderStream('⚖️', '선택 순서: ① 목적지와 일치하는 항목 중 prefix가 가장 긴 것 → ② 같은 목적지를 여러 프로토콜이 알려 주면 관리 거리(AD)가 작은 것 → ③ 같은 프로토콜 안에서는 메트릭이 작은 것.'); },
  },
  'rip:upd': { make: rtNewRipUpd, render: rtRenderRipUpd, check() { rtFormCheck(rtRipUpdFields(RT.st)); }, reveal() { rtFormReveal(rtRipUpdFields(RT.st)); } },
  'rip:ex': { make: rtNewRipEx, render: rtRenderRipEx, check() { rtFormCheck(rtRipExFields(RT.st)); }, reveal() { rtFormReveal(rtRipExFields(RT.st)); } },
  'ospf:cost': { make() { rtStreamMake(RT_COST_KINDS); }, check: rtStreamCheck, reveal() {}, render() { rtRenderStream('🧮', '비용 = 10<sup>8</sup> / bps, 소수점 버림, 1 미만은 1 (100Mbps 이상은 모두 1).'); } },
  'ospf:path': {
    make: rtNewPath, render: rtRenderPath, check() { rtFormCheck(rtPathFields(RT.st)); },
    reveal() { rtFormReveal(rtPathFields(RT.st)); RT.st.pick = RT.st.best; },
  },
  'ospf:dijk': { make: rtNewDijk, render: rtRenderDijk, check() { rtFormCheck(rtDijkFields(RT.st)); }, reveal() { rtFormReveal(rtDijkFields(RT.st)); } },
  exam: { make() { rtNewExam(); }, render: rtRenderExam, check() { RT.st.graded = true; }, reveal() {} },
};

registerPractice({
  id: 'routing', subject: '컴퓨터네트워크', exams: ['기말고사'], icon: '🛣️', title: '라우팅 테이블 · 라우팅 프로토콜 연습',
  desc: '토폴로지를 보고 정적 · 디폴트 경로와 ip route 명령 작성, 관리 거리 · 최장 프리픽스로 경로 고르기, RIP 갱신 규칙과 n차 교환, OSPF 비용 · Dijkstra를 무작위 문제로 연습하세요',
  mount: rtMount,
  onKey(act, e) {
    if (!RT || act[0] !== 'c') return;
    const i = +act.slice(1) - 1, S = RT.st, k = rtModeKey();
    if (S.stream && S.item.kind === 'choice' && !S.done && i < S.item.opts.length) { e.preventDefault(); rtStreamPick(i); }
    else if (k === 'ospf:path' && i < S.paths.length) { e.preventDefault(); S.pick = i; rtRender(); }
  },
  onEnter(e) {
    if (!RT) return;
    const S = RT.st;
    if (S.stream && S.done) { e.preventDefault(); rtNext(); }
    else if (S.stream && S.item.kind === 'text') { e.preventDefault(); const el = rtMain().querySelector('input'); if (el) el.focus(); }
    else if (RT.view !== 'exam' && !S.stream && (S.marks || S.revealed)) { e.preventDefault(); rtNext(); }
  },
});
