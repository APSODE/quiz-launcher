// 4_서브넷_슈퍼넷.js — quiz_launcher 플러그인: 서브넷팅 · 슈퍼네팅 연습
// 실행기가 일반 <script>로 실행한다. 실행기 공통 함수(escHtml, prRand, registerPractice 등)를 전역으로 쓴다.
// 문항 데이터 없이 문제를 무작위로 만든다. 최상위 이름은 모두 sn / SN 접두어.

// ════════════════════════════════════════════════════════
//  계산 (순수 함수 — 주소는 0 ~ 2^32-1 정수)
//   snMask(n) · snNet(ip, n) · snBc(ip, n) · snSize(n) · snHosts(n)
//   snParseIp / snParsePrefix / snParseCidr / snParseCount   입력 해석 (실패 = null)
//   snAggregate(blocks)        집약 가능 여부 · 이유 · 가장 작은 포함 블록
//   snLpm(table, ip)           최장 프리픽스 매칭 항목 인덱스
//   snVlsmGrade(base, reqs, rows)  VLSM 할당 채점 (정답 하나와 비교하지 않고 조건으로 판정)
// ════════════════════════════════════════════════════════
function snMask(n) { return n <= 0 ? 0 : (0xFFFFFFFF << (32 - n)) >>> 0; }
function snSize(n) { return 2 ** (32 - n); }
function snNet(ip, n) { return (ip & snMask(n)) >>> 0; }
function snBc(ip, n) { return snNet(ip, n) + snSize(n) - 1; }
function snHosts(n) { return n >= 31 ? 0 : snSize(n) - 2; }
function snStr(x) { return [x >>> 24, (x >>> 16) & 255, (x >>> 8) & 255, x & 255].join('.'); }
function snCidr(ip, n) { return snStr(ip) + '/' + n; }
function snIsPow2(t) { return t > 0 && 2 ** Math.round(Math.log2(t)) === t; }
function snNeedPrefix(h) { let e = 0; while (2 ** e < h + 2) e++; return 32 - e; }   // 호스트 h대를 담는 가장 긴 prefix
function snOverlap(a, an, b, bn) { return a <= b + snSize(bn) - 1 && b <= a + snSize(an) - 1; }

function snParseIp(s) {
  const m = String(s == null ? '' : s).replace(/\s+/g, '').match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return null;
  const o = m.slice(1).map(Number);
  if (o.some(v => v > 255)) return null;
  return ((o[0] * 256 + o[1]) * 256 + o[2]) * 256 + o[3];
}
function snMaskToPrefix(m) {
  const inv = (~m) >>> 0;
  if (((inv + 1) & inv) !== 0) return null;     // 1이 앞에서부터 연속이어야 마스크
  return 32 - Math.round(Math.log2(inv + 1));
}
// "/26" · "26" · (allowMask 이면) "255.255.255.192"
function snParsePrefix(s, allowMask) {
  const t = String(s == null ? '' : s).replace(/\s+/g, '');
  const m = t.match(/^\/?(\d{1,2})$/);
  if (m) return +m[1] <= 32 ? +m[1] : null;
  if (allowMask === false) return null;
  const ip = snParseIp(t);
  return ip == null ? null : snMaskToPrefix(ip);
}
function snParseCidr(s) {
  const t = String(s == null ? '' : s).replace(/\s+/g, ''), i = t.indexOf('/');
  if (i < 0) return null;
  const ip = snParseIp(t.slice(0, i)), n = snParsePrefix(t.slice(i + 1));
  return ip == null || n == null ? null : { ip, n };
}
function snParseCount(s) { const t = String(s == null ? '' : s).replace(/[\s,]/g, ''); return /^\d+$/.test(t) ? Number(t) : null; }

// blocks: [{ ip, n }] → { ok, reason: ok|gap|count|align|overlap, cover: {ip, n}, total, coverSize, waste, first, gapAt }
function snAggregate(blocks) {
  const b = blocks.map(x => ({ s: snNet(x.ip, x.n), e: snBc(x.ip, x.n) })).sort((p, q) => p.s - q.s);
  const first = b[0].s, last = Math.max(...b.map(x => x.e));
  const x = (first ^ last) >>> 0, n = x === 0 ? 32 : Math.clz32(x);
  const total = b.reduce((t, y) => t + (y.e - y.s + 1), 0);
  let reason = 'ok', gapAt = null;
  for (let i = 1; i < b.length; i++) {
    if (b[i].s <= b[i - 1].e) { reason = 'overlap'; break; }
    if (b[i].s !== b[i - 1].e + 1) { reason = 'gap'; gapAt = [b[i - 1].e + 1, b[i].s - 1]; break; }
  }
  if (reason === 'ok' && !snIsPow2(total)) reason = 'count';
  if (reason === 'ok' && first % total !== 0) reason = 'align';
  return { ok: reason === 'ok', reason, cover: { ip: snNet(first, n), n }, total, coverSize: snSize(n), waste: snSize(n) - total, first, gapAt };
}

// table: [{ ip, n, ifc }] → 가장 긴 일치 항목의 인덱스 (-1 = 없음)
function snLpm(table, ip) {
  let best = -1;
  table.forEach((r, i) => { if (snNet(ip, r.n) === snNet(r.ip, r.n) && (best < 0 || r.n > table[best].n)) best = i; });
  return best;
}

// base: {ip, n} · reqs: [{ name, h }] · rows: [{ net, pre }] (입력 문자열) → [{ ok, why, ip, n }]
function snVlsmGrade(base, reqs, rows) {
  const P = rows.map(r => ({ ip: snParseIp(r.net), n: snParsePrefix(r.pre) }));
  const valid = p => p.ip != null && p.n != null && snNet(p.ip, p.n) === p.ip;
  return P.map((p, i) => {
    const h = reqs[i].h, need = snNeedPrefix(h);
    if (!String(rows[i].net || '').trim() && !String(rows[i].pre || '').trim()) return { ok: false, why: '비어 있습니다.' };
    if (p.ip == null) return { ok: false, why: '네트워크 주소 형식이 올바르지 않습니다 (예: 192.168.1.64).' };
    if (p.n == null) return { ok: false, why: 'prefix 형식이 올바르지 않습니다 (예: /26 또는 255.255.255.192).' };
    if (p.n > need) return { ok: false, why: snSize(p.n) >= h
      ? `/${p.n}은 주소 ${snSize(p.n)}개지만 네트워크 · 브로드캐스트 주소 2개를 빼면 호스트는 ${snHosts(p.n)}대뿐입니다. ${h} + 2 = ${h + 2}개가 필요하므로 /${need}.`
      : `/${p.n}은 호스트 ${snHosts(p.n)}대까지만 담습니다. ${h}대 → /${need}.` };
    if (p.n < need) return { ok: false, why: `${h}대에는 /${need}(호스트 ${snHosts(need)}대)이면 충분합니다. 필요 이상으로 큰 블록입니다.` };
    if (snNet(p.ip, p.n) !== p.ip) return { ok: false, why: `${snStr(p.ip)}는 /${p.n} 블록의 시작 주소가 아닙니다. /${p.n} 블록은 주소 ${snSize(p.n)}개 단위로 시작합니다 (이 주소가 속한 블록: ${snCidr(snNet(p.ip, p.n), p.n)}).` };
    if (p.ip < base.ip || snBc(p.ip, p.n) > snBc(base.ip, base.n)) return { ok: false, why: `주어진 블록 ${snCidr(base.ip, base.n)} 밖입니다.` };
    const j = P.findIndex((q, k) => k !== i && valid(q) && snOverlap(p.ip, p.n, q.ip, q.n));
    if (j >= 0) return { ok: false, why: `${reqs[j].name}에 할당한 블록과 주소가 겹칩니다.` };
    return { ok: true, ip: p.ip, n: p.n };
  });
}
// 정석 배치: 큰 블록부터 차례로
function snVlsmCanon(base, reqs) {
  const order = reqs.map((r, i) => i).sort((a, b) => reqs[b].h - reqs[a].h || a - b);
  const out = []; let cur = base.ip;
  order.forEach(i => { const n = snNeedPrefix(reqs[i].h); out[i] = { ip: cur, n }; cur += snSize(n); });
  return { rows: out, order };
}

// ════════════════════════════════════════════════════════
//  무작위 생성 도우미
// ════════════════════════════════════════════════════════
const SN_LV = { easy: [24, 30], mid: [16, 30], hard: [8, 30] };
const SN_LV_NAME = { easy: '쉬움 (/24 이상)', mid: '보통 (/16 이상)', hard: '어려움 (/8 이상)' };
const SN_FIRST = [10, 59, 112, 130, 150, 165, 172, 192, 200, 201, 203, 211];
const SN_DEPTS = ['영업부', '개발부', '인사부', '연구소', '마케팅부', '고객지원', '디자인팀', '물류센터', '회계부', '서버실'];

function snPick(a) { return a[prRand(0, a.length - 1)]; }
function snShuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = prRand(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function snLv() { return SN ? SN.opt.lv : 'easy'; }
function snZero() { return SN ? SN.opt.zero : true; }
function snRp() { const [lo, hi] = SN_LV[snLv()]; return prRand(lo, hi); }
function snRandIp() { return ((SN_FIRST[prRand(0, SN_FIRST.length - 1)] * 256 + prRand(0, 255)) * 256 + prRand(0, 255)) * 256 + prRand(0, 255); }
function snRandIn(ip, n) { return snNet(ip, n) + Math.floor(Math.random() * snSize(n)); }
function snSplit(ip, n, pieces, maxN) {
  let arr = [{ ip, n }];
  while (arr.length < pieces) {
    const cand = arr.filter(b => b.n < Math.min(30, maxN));
    if (!cand.length) break;
    const b = snPick(cand), h = { ip: b.ip + snSize(b.n + 1), n: b.n + 1 };
    arr = arr.flatMap(x => x === b ? [{ ip: b.ip, n: b.n + 1 }, h] : [x]);
  }
  return arr.sort((a, b) => a.ip - b.ip);
}

// 슈퍼네팅 문제: kind = ok | count | align | gap (생략하면 무작위, ok 50%)
function snAggCase(kind) {
  const lv = snLv(), q = lv === 'easy' ? 24 : lv === 'mid' ? prRand(20, 26) : prRand(14, 26);
  const R = snNet(snRandIp(), q - 4), S = snSize(q);
  const run = (s, c) => Array.from({ length: c }, (_, i) => s + i);
  kind = kind || snPick(['ok', 'ok', 'ok', 'count', 'align', 'gap']);
  let idx;
  if (kind === 'ok') {
    const m = prRand(1, 3), c = 2 ** m, s = prRand(0, 16 / c - 1) * c;
    if (lv !== 'easy' && Math.random() < 0.4) return snSplit(R + s * S, q - m, prRand(2, 4), q + 2);
    idx = run(s, c);
  } else if (kind === 'count') {
    const c = snPick([3, 5, 6, 7]), span = c < 4 ? 4 : 8;
    idx = run(prRand(0, 16 / span - 1) * span + prRand(0, span - c), c);
  } else if (kind === 'align') {
    const c = 2 ** prRand(1, 3); let s;
    do { s = prRand(0, 16 - c); } while (s % c === 0);
    idx = run(s, c);
  } else {
    const c = 2 ** prRand(1, 2), span = 2 * c, s0 = prRand(0, 16 / span - 1) * span;
    do { idx = snShuffle(run(s0, span)).slice(0, c).sort((a, b) => a - b); } while (idx[c - 1] - idx[0] === c - 1);
  }
  return idx.map(i => ({ ip: R + i * S, n: q }));
}

// 포워딩 테이블 문제: X ⊃ Y (⊃ W), Z는 X와 겹치지 않음, 나머지는 default
function snLpmCase() {
  const lv = snLv(), p0 = lv === 'easy' ? 16 : lv === 'mid' ? prRand(12, 16) : prRand(8, 14);
  const R = snNet(snRandIp(), p0);
  const p1 = p0 + prRand(3, 6), X = snNet(snRandIn(R, p0), p1);
  const p2 = p1 + prRand(1, 3), Y = snNet(snRandIn(X, p1), p2);
  const p3 = Math.max(p0 + 1, p1 + prRand(-1, 2));
  let Z = null;
  for (let t = 0; t < 100 && Z == null; t++) { const z = snNet(snRandIn(R, p0), p3); if (!snOverlap(z, p3, X, p1)) Z = z; }
  if (Z == null) Z = (snNet(X, p3) ^ snSize(p3)) >>> 0;
  const p4 = Math.min(30, p2 + prRand(1, 3));
  const W = (lv === 'hard' || Math.random() < 0.4) && p4 > p2 ? snNet(snRandIn(Y, p2), p4) : null;
  const ents = [[X, p1], [Y, p2], [Z, p3]].concat(W != null ? [[W, p4]] : []);
  const ifcs = snShuffle(ents.map((e, i) => i));
  const table = snShuffle(ents.map(([ip, n], i) => ({ ip, n, ifc: ifcs[i] })));
  table.push({ ip: 0, n: 0, ifc: ents.length, def: true });
  const hit = (ip, ex) => ex.some(([b, n]) => snNet(ip, n) === b);
  const pickIn = (b, n, ex) => { for (let t = 0; t < 300; t++) { const ip = snRandIn(b, n); if (!hit(ip, ex)) return ip; } return null; };
  const dests = [W != null ? pickIn(W, p4, []) : null, pickIn(Y, p2, W != null ? [[W, p4]] : []), pickIn(X, p1, [[Y, p2]]),
    pickIn(Z, p3, []), pickIn(R, p0, [[X, p1], [Z, p3]])].filter(x => x != null);
  return { table, dests: snShuffle(dests) };
}

// ════════════════════════════════════════════════════════
//  풀이 표시
// ════════════════════════════════════════════════════════
// 32비트 2진수 (앞 n비트 강조, star 이면 뒤를 * 로)
function snBinHtml(x, n, star) {
  let net = '', host = '';
  for (let i = 0; i < 32; i++) {
    const c = (i && i % 8 === 0 ? ' ' : '') + (star && i >= n ? '*' : ((x >>> (31 - i)) & 1));
    if (i < n) net += c; else host += c;
  }
  return `<span class="sn-bin"><b class="sn-nb">${net}</b><span class="sn-hb">${host}</span></span>`;
}
function snExplain(ip, n) {
  const m = snMask(n), net = snNet(ip, n), bc = snBc(ip, n);
  const rows = [['IP 주소', ip], ['서브넷 마스크 /' + n, m], ['네트워크 주소 (IP AND 마스크)', net], ['브로드캐스트 (호스트 비트 모두 1)', bc]];
  let tip;
  if (n % 8 === 0) tip = `/${n}은 옥텟 경계입니다. 앞 ${n / 8}개 옥텟은 그대로 두고 나머지를 0(네트워크) · 255(브로드캐스트)로 채웁니다.`;
  else {
    const k = Math.floor(n / 8), sh = 24 - 8 * k, mv = (m >>> sh) & 255, step = 256 - mv, v = (ip >>> sh) & 255, s = Math.floor(v / step) * step;
    tip = `${k + 1}번째 옥텟의 마스크가 ${mv}이므로 블록 크기는 256 − ${mv} = <b>${step}</b>. ${v} 이하인 ${step}의 배수는 <b>${s}</b> → 네트워크 쪽 옥텟 ${s}, 브로드캐스트 쪽 옥텟 ${s} + ${step} − 1 = <b>${s + step - 1}</b>${k < 3 ? ' (그 뒤 옥텟은 0 / 255)' : ''}.`;
  }
  return `<div class="pr-tablewrap"><table class="pr-table sn-xt">${rows.map(([l, x]) => `<tr><th>${l}</th><td class="sn-mono">${snStr(x)}</td><td>${snBinHtml(x, n)}</td></tr>`).join('')}</table></div>
    <div class="pr-sub" style="margin-top:4px">💡 ${tip}<br>호스트 수 = 2<sup>${32 - n}</sup> − 2 = <b>${snHosts(n).toLocaleString()}</b> (호스트 비트 ${32 - n}개에서 네트워크 · 브로드캐스트 주소 제외). 첫 호스트 = 네트워크 + 1, 마지막 호스트 = 브로드캐스트 − 1.</div>`;
}
function snBlocksHtml(blocks) { return blocks.map(b => `<span class="pr-chip sn-mono">${snCidr(b.ip, b.n)}</span>`).join(''); }
function snAggExplain(blocks, r) {
  const b = blocks.slice().sort((x, y) => x.ip - y.ip);
  const rows = b.map(x => `<tr><td class="sn-mono">${snCidr(x.ip, x.n)}</td><td>${snBinHtml(x.ip, r.cover.n)}</td><td>${snBinHtml(snBc(x.ip, x.n), r.cover.n)}</td><td>${snSize(x.n).toLocaleString()}</td></tr>`).join('');
  const why = {
    ok: `블록이 빈틈없이 이어지고, 합 ${r.total.toLocaleString()}개가 2의 거듭제곱이며, 첫 주소가 ${r.total.toLocaleString()}개 단위 경계입니다 → <b>${snCidr(r.cover.ip, r.cover.n)}</b> 하나로 정확히 집약됩니다.`,
    count: `블록은 이어져 있지만 크기 합 ${r.total.toLocaleString()}개가 2의 거듭제곱이 아니므로, 크기가 정확히 같은 CIDR 블록이 없습니다.`,
    align: `합 ${r.total.toLocaleString()}개는 2의 거듭제곱이지만 첫 주소 ${snStr(r.first)}가 ${r.total.toLocaleString()}개 단위 경계가 아닙니다 (가까운 경계: ${snStr(r.first - r.first % r.total)}, ${snStr(r.first - r.first % r.total + r.total)}).`,
    gap: r.gapAt ? `${snStr(r.gapAt[0])} ~ ${snStr(r.gapAt[1])} 구간이 비어 있어 블록들이 연속되지 않습니다.` : '',
    overlap: '블록이 서로 겹칩니다.',
  }[r.reason];
  return `<div class="pr-tablewrap"><table class="pr-table sn-xt"><tr><th>블록</th><th>시작 주소</th><th>끝 주소</th><th>주소 수</th></tr>${rows}</table></div>
    <div class="pr-sub" style="margin-top:4px">💡 ${why}<br>모든 블록을 포함하는 가장 작은 블록 = 첫 주소와 끝 주소의 공통 앞부분 <b>${r.cover.n}비트</b>(굵게) → <b>${snCidr(r.cover.ip, r.cover.n)}</b> (주소 ${r.coverSize.toLocaleString()}개). 주어진 블록 밖의 주소 ${r.coverSize.toLocaleString()} − ${r.total.toLocaleString()} = <b>${r.waste.toLocaleString()}</b>개.</div>`;
}
function snLpmTableHtml(table, bin) {
  return `<div class="pr-tablewrap"><table class="pr-table sn-xt"><tr><th>목적지 주소 범위 (prefix)</th><th>링크 인터페이스</th></tr>${table.map(r =>
    `<tr><td class="sn-mono">${r.def ? '그 외 (default, 0.0.0.0/0)' : bin ? snBinHtml(r.ip, r.n, true) : snCidr(r.ip, r.n)}</td><td><b>${r.ifc}</b></td></tr>`).join('')}</table></div>`;
}
function snLpmExplain(table, ip) {
  const best = snLpm(table, ip);
  const m = table.map((r, i) => [r, i]).filter(([r]) => !r.def && snNet(ip, r.n) === snNet(r.ip, r.n));
  return `${snBinHtml(ip, table[best].n)} <span class="pr-sub">(${snStr(ip)})</span><br>` + (m.length
    ? `일치하는 항목: ${m.map(([r, i]) => `<span class="pr-chip sn-mono">${snCidr(r.ip, r.n)} → ${r.ifc}</span>`).join('')}<br>그중 가장 긴 /${table[best].n} → 인터페이스 <b>${table[best].ifc}</b>`
    : `일치하는 항목이 없어 default → 인터페이스 <b>${table[best].ifc}</b>`);
}

// ════════════════════════════════════════════════════════
//  단일 문항 생성기 (변환 · 판정 모드와 실전 세트가 함께 쓴다)
//   문항 = { cat, kind: 'text' | 'choice', q, ans(정답 표시), check(v) | opts + ansIdx, exp }
// ════════════════════════════════════════════════════════
function snTI(cat, q, ans, check, exp) { return { cat, kind: 'text', q, ans, check, exp }; }
function snCI(cat, q, opts, ansIdx, exp) { return { cat, kind: 'choice', q, opts, ansIdx, ans: opts[ansIdx], exp }; }
function snZeroNote() { return snZero() ? '' : ' <small>(subnet zero · all-ones 서브넷은 쓰지 않는다)</small>'; }

const SN_GEN = {
  mask() {
    const n = snRp(), m = snMask(n);
    return snTI('마스크 변환', `prefix <b>/${n}</b>의 서브넷 마스크를 점-10진 표기로 쓰세요.`, snStr(m), v => snParseIp(v) === m,
      `${snBinHtml(m, n)}<br>앞 ${n}비트가 1 → ${snStr(m)}`);
  },
  prefix() {
    const n = snRp(), m = snMask(n);
    return snTI('마스크 변환', `서브넷 마스크 <b class="sn-mono">${snStr(m)}</b>의 prefix 길이는? (/n)`, '/' + n, v => snParsePrefix(v, false) === n,
      `${snBinHtml(m, n)}<br>1의 개수 = ${n} → /${n}`);
  },
  hosts() {
    const n = snRp(), net = snNet(snRandIp(), n);
    return snTI('호스트 수', `<b class="sn-mono">${snCidr(net, n)}</b> 네트워크에서 호스트에 할당할 수 있는 주소는 몇 개인가?`, String(snHosts(n)), v => snParseCount(v) === snHosts(n),
      `호스트 비트 32 − ${n} = ${32 - n}개 → 2<sup>${32 - n}</sup> − 2 = <b>${snHosts(n).toLocaleString()}</b> (네트워크 · 브로드캐스트 주소 제외)`);
  },
  need() {
    const lo = SN_LV[snLv()][0], e = prRand(2, Math.min(32 - lo, 16)), h = prRand(2 ** (e - 1) - 1, 2 ** e - 2), n = 32 - e;
    return snTI('호스트 수', `호스트 <b>${h.toLocaleString()}대</b>가 들어갈 서브넷의 가장 긴 prefix(가장 작은 서브넷)는? (/n)`, '/' + n, v => snParsePrefix(v) === n,
      `${h} + 2(네트워크 · 브로드캐스트) = ${h + 2} ≤ 2<sup>${e}</sup> = ${2 ** e} → 호스트 비트 ${e}개 → <b>/${n}</b>${e > 2 ? ` (/${n + 1}은 호스트 ${snHosts(n + 1)}대뿐)` : ''}`);
  },
  same() {
    const n = snRp(), ip1 = snRandIp(), net = snNet(ip1, n), same = Math.random() < 0.5;
    let ip2;
    do { ip2 = same ? snRandIn(net, n) : snRandIn((net ^ snSize(n)) >>> 0, n); } while (ip2 === ip1);
    return snCI('같은 서브넷', `<b class="sn-mono">${snStr(ip1)}</b>와 <b class="sn-mono">${snStr(ip2)}</b>는 마스크 <b class="sn-mono">${snStr(snMask(n))}</b> (/${n})에서 같은 서브넷인가?`,
      ['같은 서브넷', '다른 서브넷'], same ? 0 : 1,
      `${snBinHtml(ip1, n)} → ${snCidr(snNet(ip1, n), n)}<br>${snBinHtml(ip2, n)} → ${snCidr(snNet(ip2, n), n)}<br>앞 ${n}비트(네트워크 부분)가 ${same ? '같습니다' : '다릅니다'}.`);
  },
  kind() {
    const n = prRand(SN_LV[snLv()][0], 30), net = snNet(snRandIp(), n), t = prRand(0, 2);
    const ip = t === 0 ? net : t === 1 ? snBc(net, n) : net + prRand(1, snSize(n) - 2);
    return snCI('주소 종류', `<b class="sn-mono">${snCidr(ip, n)}</b>는 어떤 주소인가?`, ['네트워크 주소', '브로드캐스트 주소', '호스트에 할당할 수 있는 주소'], t,
      `${snBinHtml(ip, n)}<br>이 주소가 속한 블록: ${snStr(net)} ~ ${snStr(snBc(net, n))}. 호스트 비트가 모두 0이면 네트워크, 모두 1이면 브로드캐스트 주소입니다.`);
  },
  net() { return snAddrItem('net'); },
  bc() { return snAddrItem('bc'); },
  first() { return snAddrItem('first'); },
  last() { return snAddrItem('last'); },
  count() {
    const zero = snZero(), n0 = prRand(SN_LV[snLv()][0], 28), b = prRand(zero ? 1 : 2, Math.min(6, 30 - n0)), n1 = n0 + b, net = snNet(snRandIp(), n0);
    const c = 2 ** b - (zero ? 0 : 2);
    return snTI('서브넷 수', `<b class="sn-mono">${snCidr(net, n0)}</b> 블록을 <b>/${n1}</b> 서브넷으로 나누면 사용할 수 있는 서브넷은 몇 개인가?${snZeroNote()}`, String(c), v => snParseCount(v) === c,
      `서브넷 비트 ${n1} − ${n0} = ${b}개 → 2<sup>${b}</sup>${zero ? '' : ' − 2'} = <b>${c}</b>`);
  },
  kth() {
    const zero = snZero(), n0 = prRand(SN_LV[snLv()][0], 27), b = prRand(2, Math.min(6, 30 - n0)), n1 = n0 + b, base = snNet(snRandIp(), n0);
    const k = prRand(1, 2 ** b - (zero ? 0 : 2)), idx = zero ? k - 1 : k, sz = snSize(n1), net = base + idx * sz;
    const [lab, x] = snPick([['네트워크 주소', net], ['브로드캐스트 주소', net + sz - 1], ['첫 번째 호스트 주소', net + 1], ['마지막 호스트 주소', net + sz - 2]]);
    return snTI('k번째 서브넷', `<b class="sn-mono">${snCidr(base, n0)}</b>를 <b>/${n1}</b> 서브넷으로 나눌 때, <b>${k}번째</b> 서브넷의 ${lab}는?${snZeroNote()}`, snStr(x), v => snParseIp(v) === x,
      `서브넷 하나의 크기 2<sup>${32 - n1}</sup> = ${sz.toLocaleString()}. ${k}번째 서브넷 = 서브넷 번호 ${idx}${zero ? ' (0번부터)' : ' (0번은 쓰지 않으므로 1번부터)'} → 시작 ${snStr(base)} + ${idx} × ${sz.toLocaleString()} = <b>${snStr(net)}</b>, 끝 ${snStr(net + sz - 1)}.`);
  },
  badmask() {
    const lo = SN_LV[snLv()][0], ns = snShuffle(Array.from({ length: 30 - lo + 1 }, (_, i) => lo + i)).slice(0, 4);
    const bad = prRand(0, 3), nb = Math.min(ns[bad], 29);
    const masks = ns.map((n, i) => i === bad ? (snMask(nb) | (1 << (31 - (nb + 1)))) >>> 0 : snMask(n));
    return snCI('마스크 변환', '다음 중 서브넷 마스크로 쓸 수 <b>없는</b> 것은?', masks.map(snStr), bad,
      `${snBinHtml(masks[bad], nb)}<br>1이 끊긴 뒤 다시 1이 나옵니다. 서브넷 마스크는 앞에서부터 1이 연속되고 그 뒤는 모두 0이어야 합니다.`);
  },
  agg() {
    const bl = snAggCase('ok'), r = snAggregate(bl);
    return snTI('슈퍼네팅', `다음 블록들을 하나의 CIDR 블록으로 집약하세요.<br>${snBlocksHtml(bl)}`, snCidr(r.cover.ip, r.cover.n),
      v => { const c = snParseCidr(v); return !!c && c.ip === r.cover.ip && c.n === r.cover.n; }, snAggExplain(bl, r));
  },
  aggwhy() {
    const bl = snAggCase(), r = snAggregate(bl);
    return snCI('슈퍼네팅', `다음 블록들을 하나의 CIDR 블록으로 정확히(다른 주소를 포함하지 않고) 집약할 수 있는가?<br>${snBlocksHtml(bl)}`, SN_AGG_OPTS, SN_AGG_IDX[r.reason], snAggExplain(bl, r));
  },
  lpm() {
    const C = snLpmCase(), ip = snPick(C.dests), ans = C.table[snLpm(C.table, ip)].ifc;
    return snCI('최장 프리픽스', `라우터의 포워딩 테이블이 다음과 같다. 목적지 <b class="sn-mono">${snStr(ip)}</b>인 데이터그램은 어느 인터페이스로 나가는가?${snLpmTableHtml(C.table)}`,
      C.table.map(r => String(r.ifc)), ans, snLpmExplain(C.table, ip));
  },
};
const SN_CONV_KINDS = ['mask', 'prefix', 'hosts', 'need', 'same', 'kind', 'net', 'bc', 'first', 'last', 'count', 'kth', 'badmask'];
const SN_EXAM_KINDS = SN_CONV_KINDS.concat(['agg', 'aggwhy', 'lpm', 'agg', 'aggwhy', 'lpm']);
const SN_AGG_OPTS = ['집약 가능 — 하나의 CIDR 블록과 정확히 같다', '집약 불가 — 블록 크기의 합이 2의 거듭제곱이 아니다',
  '집약 불가 — 첫 주소가 합친 크기의 경계에 정렬되어 있지 않다', '집약 불가 — 블록이 연속되지 않는다 (중간이 빈다)'];
const SN_AGG_IDX = { ok: 0, count: 1, align: 2, gap: 3, overlap: 3 };

function snAddrItem(what) {
  const n = prRand(SN_LV[snLv()][0], 30), ip = snRandIp(), net = snNet(ip, n), bc = snBc(ip, n);
  const [lab, x] = { net: ['네트워크 주소', net], bc: ['브로드캐스트 주소', bc], first: ['첫 번째 호스트 주소', net + 1], last: ['마지막 호스트 주소', bc - 1] }[what];
  const given = Math.random() < 0.6 ? `<b class="sn-mono">${snCidr(ip, n)}</b>` : `IP <b class="sn-mono">${snStr(ip)}</b>, 마스크 <b class="sn-mono">${snStr(snMask(n))}</b>`;
  return snTI('주소 계산', `${given}의 ${lab}는?`, snStr(x), v => snParseIp(v) === x, snExplain(ip, n));
}

// ════════════════════════════════════════════════════════
//  화면
// ════════════════════════════════════════════════════════
let SN = null;
const SN_VIEWS = [['addr', '🔍 주소 분석'], ['conv', '🔁 변환 · 판정'], ['flsm', '✂️ 서브넷팅'], ['vlsm', '🧩 VLSM'],
  ['agg', '🧲 슈퍼네팅'], ['lpm', '🧭 최장 프리픽스 매칭'], ['exam', '📝 실전 세트']];
const SN_CSS = `
  .pr-num.sn-in { width: 150px; text-align: left; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 13.5px; }
  .pr-num.sn-in.sm { width: 76px; text-align: center; }
  .sn-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 10px; }
  .sn-grid .pr-num.sn-in { width: 100%; }
  .sn-given { font-size: 17px; margin: 0 0 14px; line-height: 1.7; }
  .sn-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
  .sn-bin { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 12px; white-space: nowrap; }
  .sn-nb { color: #4338ca; font-weight: 800; }
  .sn-hb { color: #94a3b8; }
  .sn-xt th { text-align: left; white-space: nowrap; }
  .sn-xt td { text-align: left; }
  .pr-table td.sn-why { text-align: left; font-size: 12px; line-height: 1.5; max-width: 320px; }
  .sn-why.ng { color: #b91c1c; } .sn-why.ok { color: #15803d; }
  .sn-ifc { display: inline-flex; gap: 4px; flex-wrap: nowrap; }
  .pr-table .sn-nw { white-space: nowrap; }
  .sn-ifc button { min-width: 38px; padding: 5px 9px; border: 2px solid #e2e8f0; background: #f8fafc; border-radius: 8px; font-weight: 800; cursor: pointer; font-family: inherit; color: #1e293b; }
  .sn-ifc button.ok { border-color: #22c55e; background: #f0fdf4; } .sn-ifc button.ng { border-color: #ef4444; background: #fef2f2; }
  .sn-ifc button:disabled { cursor: default; }
  .sn-q { border-top: 1px solid #e2e8f0; padding: 14px 0 6px; font-size: 14px; line-height: 1.75; }
  .sn-q:first-of-type { border-top: none; padding-top: 0; }
  .sn-qn { font-weight: 800; color: #4338ca; margin-right: 6px; }
  .sn-mark { font-weight: 800; margin-left: 6px; }
  .sn-exp { background: #f8fafc; border-radius: 10px; padding: 8px 12px; margin-top: 8px; font-size: 13px; line-height: 1.7; }
  .sn-lbl { display: block; font-size: 12px; font-weight: 700; color: #475569; margin: 12px 0 4px; }
`;

function snMount(root) {
  let opt = { lv: 'easy', zero: true };
  try { const o = JSON.parse(localStorage.getItem('snOpt') || 'null'); if (o && SN_LV[o.lv]) opt = { lv: o.lv, zero: o.zero !== false }; } catch (e) { /* 저장소 없음 */ }
  SN = { view: 'addr', opt, st: null };
  root.innerHTML = `<style>${SN_CSS}</style>
    <div class="pr-card">
      <h3 class="pr-h">⚙️ 모드</h3>
      <div class="pr-seg" id="sn-views"></div>
      <div class="pr-row" style="margin:12px 0 0;align-items:center">
        <div class="pr-seg" id="sn-lv"></div>
        <label class="pr-chk"><input type="checkbox" id="sn-zero" ${opt.zero ? 'checked' : ''} onchange="snSetOpt('zero', this.checked)"> subnet zero · all-ones 서브넷 사용</label>
      </div>
      <div class="pr-sub" style="margin-top:8px">주소 입력은 점-10진(예: 192.168.1.64), prefix는 /26 · 26 · 255.255.255.192 중 아무 형식이나 됩니다. 입력칸에서 Enter = 채점.
        subnet zero를 끄면 첫 번째(서브넷 비트 모두 0) · 마지막(모두 1) 서브넷을 쓰지 않는 옛 규칙(RFC 950)으로 계산합니다.</div>
    </div>
    <div id="sn-main"></div>`;
  snSetView('addr');
}
function snSetOpt(k, v) {
  SN.opt[k] = v;
  try { localStorage.setItem('snOpt', JSON.stringify(SN.opt)); } catch (e) { /* 무시 */ }
  snSetView(SN.view);
}
function snSetView(v) {
  SN.view = v;
  document.getElementById('sn-views').innerHTML = SN_VIEWS.map(([id, nm]) => `<button class="${v === id ? 'active' : ''}" onclick="snSetView('${id}')">${nm}</button>`).join('');
  document.getElementById('sn-lv').innerHTML = Object.keys(SN_LV).map(k => `<button class="${SN.opt.lv === k ? 'active' : ''}" onclick="snSetOpt('lv', '${k}')">${SN_LV_NAME[k]}</button>`).join('');
  snNext();
}
function snMain() { return document.getElementById('sn-main'); }
function snMode() { return SN_MODES[SN.view]; }
function snNext() { snMode().make(); snRender(); }
function snRender() { snMode().render(); }
function snCheck() { snMode().check(); snRender(); }
function snReveal() { snMode().reveal(); snRender(); }
function snKey(e) {
  if (e.key !== 'Enter' || e.isComposing) return;
  e.preventDefault();
  if (SN.view !== 'exam') { snCheck(); return; }
  // 실전 세트: Enter = 다음 입력칸으로 (채점은 버튼으로만)
  const ins = [...snMain().querySelectorAll('input.sn-in')], k = ins.indexOf(e.target);
  if (k >= 0 && k + 1 < ins.length) ins[k + 1].focus();
}

// 입력칸 (값은 SN.st.vals[key], 채점 표시는 SN.st.marks[key])
function snInput(key, cls, ph) {
  const S = SN.st, mk = S.marks && key in S.marks ? (S.marks[key] ? ' ok' : ' ng') : '';
  return `<input class="pr-num sn-in${cls ? ' ' + cls : ''}${mk}" value="${escHtml(S.vals[key] || '')}" placeholder="${ph || ''}" spellcheck="false" autocomplete="off"
    oninput="SN.st.vals['${key}'] = this.value" onkeydown="snKey(event)">`;
}
function snActions(checkLabel) {
  return `<div class="pr-actions">
    <button class="pr-btn indigo" onclick="snCheck()">✅ ${checkLabel || '채점하기'}</button>
    <button class="pr-btn ghost" onclick="snReveal()">👀 정답 보기</button>
    <button class="pr-btn" onclick="snNext()">다음 문제 →</button></div>`;
}
function snSummary(ok, all) {
  return `<div class="pr-result ${ok === all ? 'good' : 'bad'}"><b>${ok === all ? '🎉 모두 정답입니다!' : '채점 결과'}</b> ${ok} / ${all} 정답${ok === all ? '' : ' · 빨간 칸을 다시 확인하세요.'}</div>`;
}
// 칸 목록 [key, label, 정답 표시, check] 를 쓰는 모드 공통
function snFormCheck(F) { const S = SN.st; S.marks = {}; F.forEach(([k, , , c]) => { S.marks[k] = !!c(S.vals[k]); }); }
function snFormReveal(F) { const S = SN.st; S.revealed = true; S.marks = null; F.forEach(([k, , a]) => { S.vals[k] = a; }); }
function snFormSummary(F) { const S = SN.st; return S.marks ? snSummary(F.filter(f => S.marks[f[0]]).length, F.length) : ''; }

// ── 1. 주소 분석 ──
function snAddrFields(S) {
  const net = snNet(S.ip, S.n), bc = snBc(S.ip, S.n), m = snMask(S.n);
  return [
    S.cidr ? ['mask', '서브넷 마스크 (점-10진)', snStr(m), v => snParseIp(v) === m] : ['pre', 'prefix 길이 (/n)', '/' + S.n, v => snParsePrefix(v, false) === S.n],
    ['net', '네트워크 주소', snStr(net), v => snParseIp(v) === net],
    ['bc', '브로드캐스트 주소', snStr(bc), v => snParseIp(v) === bc],
    ['first', '첫 번째 호스트', snStr(net + 1), v => snParseIp(v) === net + 1],
    ['last', '마지막 호스트', snStr(bc - 1), v => snParseIp(v) === bc - 1],
    ['hosts', '사용 가능한 호스트 수', String(snHosts(S.n)), v => snParseCount(v) === snHosts(S.n)],
  ];
}
function snRenderAddr() {
  const S = SN.st, F = snAddrFields(S);
  const given = S.cidr ? `<b class="sn-mono">${snCidr(S.ip, S.n)}</b>` : `IP <b class="sn-mono">${snStr(S.ip)}</b> · 서브넷 마스크 <b class="sn-mono">${snStr(snMask(S.n))}</b>`;
  snMain().innerHTML = `<div class="pr-card">
    <h3 class="pr-h">🔍 주소 분석</h3>
    <div class="sn-given">${given}</div>
    <div class="sn-grid">${F.map(([k, l]) => `<label class="pr-f">${l}${snInput(k)}</label>`).join('')}</div>
    ${snFormSummary(F)}
    ${S.marks || S.revealed ? `<div class="pr-answer"><b>풀이</b>${snExplain(S.ip, S.n)}</div>` : ''}
    ${snActions()}</div>`;
}

// ── 2. 변환 · 판정 (한 문제씩, 바로 채점) ──
function snRenderConv() {
  const S = SN.st, it = S.item, done = S.done;
  let body;
  if (it.kind === 'choice') {
    body = `<div class="wq-choices" style="margin-top:10px">${it.opts.map((o, i) => `<button class="wq-choice${done ? (i === it.ansIdx ? ' ok' : i === S.pick ? ' ng' : '') : ''}" ${done ? 'disabled' : ''} onclick="snConvPick(${i})"><pre>${i + 1}. ${escHtml(o)}</pre></button>`).join('')}</div>`;
  } else {
    body = `<div class="pr-row" style="margin-top:10px">${snInput('a', '', '답')}${done ? '' : '<button class="pr-btn indigo" onclick="snCheck()">확인</button>'}</div>`;
  }
  snMain().innerHTML = `<div class="pr-card">
    <h3 class="pr-h">🔁 ${S.total + (done ? 0 : 1)}번째 문제 <small style="font-weight:500;color:#64748b">· ${escHtml(it.cat)} · 지금까지 ${S.score} / ${S.total}</small></h3>
    <div style="font-size:14px;line-height:1.8">${it.q}</div>
    ${body}
    ${done ? `<div class="pr-result ${S.ok ? 'good' : 'bad'}"><b>${S.ok ? '정답!' : '오답'}</b>${S.ok ? '' : ' — 정답: <b class="sn-mono">' + escHtml(it.ans) + '</b>'}<div class="sn-exp">${it.exp}</div></div>
      <div class="pr-actions"><button class="pr-btn" onclick="snNext()">다음 →</button></div>` : ''}
  </div>`;
  if (!done && it.kind === 'text') { const el = snMain().querySelector('input'); if (el && el.focus) el.focus(); }
}
function snConvPick(i) {
  const S = SN.st;
  if (S.done) return;
  S.pick = i; S.done = true; S.ok = i === S.item.ansIdx; S.total++; if (S.ok) S.score++;
  snRender();
}

// ── 3. 고정 길이 서브넷팅 ──
function snFlCount(S) { return 2 ** (S.n1 - S.n0) - (S.zero ? 0 : 2); }
function snFlOrd(S, idx) { return S.zero ? idx + 1 : idx; }
function snNewFlsm() {
  const lv = snLv(), zero = snZero();
  const n0 = lv === 'easy' ? 24 : lv === 'mid' ? prRand(16, 24) : prRand(8, 24);
  const b = prRand(zero ? 1 : 2, Math.min(6, 30 - n0)), n1 = n0 + b, type = Math.random() < 0.5 ? 'cnt' : 'host';
  let need;
  if (type === 'cnt') need = prRand(Math.max(2, 2 ** (b - 1) - (zero ? 0 : 2) + 1), 2 ** b - (zero ? 0 : 2));
  else need = prRand(Math.max(1, snHosts(n1 + 1) + 1), snHosts(n1));
  const first = zero ? 0 : 1, last = 2 ** b - 1 - (zero ? 0 : 1);
  const rows = [...new Set([first, first + 1, prRand(first, last), last])].filter(i => i <= last).sort((a, c) => a - c);
  SN.st = { base: snNet(snRandIp(), n0), n0, n1, type, need, zero, rows, vals: {}, marks: null, revealed: false };
}
function snFlsmFields(S) {
  const sz = snSize(S.n1), F = [
    ['n1', '새 prefix (/n)', '/' + S.n1, v => snParsePrefix(v, false) === S.n1],
    ['mask', '서브넷 마스크', snStr(snMask(S.n1)), v => snParseIp(v) === snMask(S.n1)],
    ['cnt', '사용 가능한 서브넷 수', String(snFlCount(S)), v => snParseCount(v) === snFlCount(S)],
    ['hosts', '서브넷당 호스트 수', String(snHosts(S.n1)), v => snParseCount(v) === snHosts(S.n1)],
  ];
  S.rows.forEach(idx => {
    const net = S.base + idx * sz;
    [['net', net], ['first', net + 1], ['last', net + sz - 2], ['bc', net + sz - 1]].forEach(([k, x]) => F.push([`r${idx}_${k}`, '', snStr(x), v => snParseIp(v) === x]));
  });
  return F;
}
function snFlsmExplain(S) {
  const b = S.n1 - S.n0, sz = snSize(S.n1), tot = 2 ** b;
  const why = S.type === 'cnt'
    ? `서브넷 ${S.need}개 → 2<sup>b</sup>${S.zero ? '' : ' − 2'} ≥ ${S.need}인 가장 작은 b = <b>${b}</b>비트를 빌림`
    : `호스트 ${S.need}대 → 2<sup>h</sup> − 2 ≥ ${S.need}인 가장 작은 h = <b>${32 - S.n1}</b>비트 → 서브넷 비트 ${32 - S.n0} − ${32 - S.n1} = <b>${b}</b>`;
  const show = tot <= 12 ? [...Array(tot).keys()] : [0, 1, 2, 3, -1, tot - 2, tot - 1];
  const rows = show.map(i => i < 0 ? '<tr><td colspan="4">⋮</td></tr>' : (() => {
    const net = S.base + i * sz, unused = !S.zero && (i === 0 || i === tot - 1);
    return `<tr style="${unused ? 'opacity:.45' : ''}"><td>${unused ? '(사용 안 함)' : snFlOrd(S, i) + '번째'}</td><td class="sn-mono">${snCidr(net, S.n1)}</td><td class="sn-mono">${snStr(net + 1)} ~ ${snStr(net + sz - 2)}</td><td class="sn-mono">${snStr(net + sz - 1)}</td></tr>`;
  })()).join('');
  return `<div class="pr-sub">💡 ${why} → /${S.n0} + ${b} = <b>/${S.n1}</b>. 서브넷 하나의 크기 2<sup>${32 - S.n1}</sup> = ${sz.toLocaleString()} → 서브넷 주소는 ${sz.toLocaleString()}씩 증가합니다.
    전체 서브넷 2<sup>${b}</sup> = ${tot}개${S.zero ? '' : ` 중 첫 번째와 마지막을 빼고 ${tot - 2}개`}.</div>
    <div class="pr-tablewrap"><table class="pr-table sn-xt"><tr><th></th><th>서브넷</th><th>호스트 범위</th><th>브로드캐스트</th></tr>${rows}</table></div>`;
}
function snRenderFlsm() {
  const S = SN.st, F = snFlsmFields(S), last = S.rows[S.rows.length - 1], lastOrd = snFlOrd(S, last);
  const task = S.type === 'cnt'
    ? `서브넷이 <b>${S.need}개</b> 필요하다. 필요한 개수를 만족하는 가장 적은 비트만 빌려 같은 크기로 나눈다.`
    : `각 서브넷에 호스트 <b>${S.need.toLocaleString()}대</b>가 들어가야 한다. 이를 만족하면서 서브넷 수가 가장 많도록 같은 크기로 나눈다.`;
  const rowLabel = idx => idx === last && snFlCount(S) > 2 ? `마지막 (${lastOrd}번째)` : snFlOrd(S, idx) + '번째';
  snMain().innerHTML = `<div class="pr-card">
    <h3 class="pr-h">✂️ 고정 길이 서브넷팅</h3>
    <div class="sn-given">블록 <b class="sn-mono">${snCidr(S.base, S.n0)}</b><br><span style="font-size:14px">${task}${S.zero ? '' : ' (subnet zero · all-ones 서브넷은 쓰지 않는다)'}</span></div>
    <div class="sn-grid">${F.slice(0, 4).map(([k, l]) => `<label class="pr-f">${l}${snInput(k)}</label>`).join('')}</div>
    <span class="sn-lbl">서브넷 표</span>
    <div class="pr-tablewrap"><table class="pr-table"><tr><th></th><th>네트워크 주소</th><th>첫 호스트</th><th>마지막 호스트</th><th>브로드캐스트</th></tr>
      ${S.rows.map(idx => `<tr><td class="pname sn-nw">${rowLabel(idx)}</td>${['net', 'first', 'last', 'bc'].map(k => `<td>${snInput(`r${idx}_${k}`)}</td>`).join('')}</tr>`).join('')}</table></div>
    ${snFormSummary(F)}
    ${S.marks || S.revealed ? `<div class="pr-answer"><b>풀이</b>${snFlsmExplain(S)}</div>` : ''}
    ${snActions()}</div>`;
}

// ── 4. VLSM ──
function snNewVlsm() {
  const lv = snLv();
  for (;;) {
    const n0 = lv === 'easy' ? 24 : lv === 'mid' ? prRand(22, 24) : prRand(19, 23), cap = snSize(n0);
    const reqs = snShuffle(SN_DEPTS).slice(0, prRand(3, lv === 'easy' ? 4 : 5)).map(name => ({ name, e: prRand(3, 32 - n0 - 1) }));
    if (Math.random() < 0.5) reqs.push({ name: 'R1 – R2 연결 링크', e: 2 });
    const sum = reqs.reduce((s, r) => s + 2 ** r.e, 0);
    if (sum > cap || sum < cap / 2) continue;
    reqs.forEach(r => { r.h = r.e === 2 ? 2 : prRand(2 ** (r.e - 1) - 1, 2 ** r.e - 2); delete r.e; });
    SN.st = { base: { ip: snNet(snRandIp(), n0), n: n0 }, reqs: snShuffle(reqs), vals: {}, graded: null, revealed: false };
    return;
  }
}
function snVlsmRows(S) { return S.reqs.map((r, i) => ({ net: S.vals[`v${i}_net`], pre: S.vals[`v${i}_pre`] })); }
function snRenderVlsm() {
  const S = SN.st, G = S.graded;
  S.marks = G ? Object.fromEntries(G.flatMap((g, i) => [[`v${i}_net`, g.ok], [`v${i}_pre`, g.ok]])) : null;
  const canon = snVlsmCanon(S.base, S.reqs);
  const rows = S.reqs.map((r, i) => {
    const g = G && G[i];
    return `<tr><td class="pname">${escHtml(r.name)}</td><td>${r.h.toLocaleString()}</td><td>${snInput(`v${i}_net`, '', '네트워크 주소')}</td><td>${snInput(`v${i}_pre`, 'sm', '/n')}</td>
      <td class="sn-why ${g ? (g.ok ? 'ok' : 'ng') : ''}">${g ? (g.ok ? `✅ ${snStr(g.ip + 1)} ~ ${snStr(snBc(g.ip, g.n) - 1)}<br>브로드캐스트 ${snStr(snBc(g.ip, g.n))}` : '❌ ' + escHtml(g.why)) : ''}</td></tr>`;
  }).join('');
  const ok = G ? G.filter(g => g.ok).length : 0, used = canon.rows.reduce((s, x) => s + snSize(x.n), 0);
  snMain().innerHTML = `<div class="pr-card">
    <h3 class="pr-h">🧩 VLSM (가변 길이 서브넷 마스크)</h3>
    <div class="sn-given">블록 <b class="sn-mono">${snCidr(S.base.ip, S.base.n)}</b>를 부서별로 나누세요.<br>
      <span style="font-size:14px">각 부서에 필요한 호스트 수(라우터 인터페이스 포함)를 담는 <b>가장 작은</b> 서브넷을 주고, 서로 겹치지 않게 배치합니다.</span></div>
    <div class="pr-tablewrap"><table class="pr-table"><tr><th>부서</th><th>호스트 수</th><th>네트워크 주소</th><th>prefix</th><th></th></tr>${rows}</table></div>
    <div class="pr-sub">위치는 자유입니다. 블록 경계에 맞고 겹치지 않으며 크기가 최소이면 정답입니다.</div>
    ${G ? `<div class="pr-result ${ok === G.length ? 'good' : 'bad'}"><b>${ok === G.length ? '🎉 모두 정답입니다!' : '채점 결과'}</b> ${ok} / ${G.length} 부서 정답</div>` : ''}
    ${G || S.revealed ? `<div class="pr-answer"><b>정석 풀이 — 큰 부서부터 차례로 배치</b>
      <div class="pr-tablewrap"><table class="pr-table sn-xt"><tr><th>부서</th><th>필요</th><th>블록</th><th>범위</th></tr>${canon.order.map(i => {
        const r = S.reqs[i], x = canon.rows[i];
        return `<tr><td>${escHtml(r.name)}</td><td>${r.h} + 2 = ${r.h + 2} ≤ 2<sup>${32 - x.n}</sup></td><td class="sn-mono">${snCidr(x.ip, x.n)}</td><td class="sn-mono">${snStr(x.ip)} ~ ${snStr(snBc(x.ip, x.n))}</td></tr>`;
      }).join('')}</table></div>
      <div class="pr-sub">큰 블록부터 놓으면 앞 블록이 끝나는 주소가 항상 다음(더 작은) 블록의 경계라서 정렬이 저절로 맞습니다. 사용 ${used.toLocaleString()} / ${snSize(S.base.n).toLocaleString()}개, ${used < snSize(S.base.n) ? `남는 주소는 ${snStr(S.base.ip + used)}부터 ${(snSize(S.base.n) - used).toLocaleString()}개.` : '남는 주소 없음.'}</div></div>` : ''}
    ${snActions()}</div>`;
}

// ── 5. 슈퍼네팅 ──
function snNewAgg() {
  const blocks = snAggCase();
  SN.st = { blocks, r: snAggregate(blocks), pick: null, vals: {}, marks: null, revealed: false };
}
function snAggFields(S) {
  const c = S.r.cover;
  return [
    ['cover', '', snCidr(c.ip, c.n), v => { const p = snParseCidr(v); return !!p && p.ip === c.ip && p.n === c.n; }],
    ['waste', '', String(S.r.waste), v => snParseCount(v) === S.r.waste],
  ];
}
function snRenderAgg() {
  const S = SN.st, ans = SN_AGG_IDX[S.r.reason], shown = S.marks || S.revealed, F = snAggFields(S);
  const pickOk = S.marks ? S.pick === ans : null;
  snMain().innerHTML = `<div class="pr-card">
    <h3 class="pr-h">🧲 슈퍼네팅 (경로 집약)</h3>
    <div class="sn-given"><span style="font-size:14px">라우터가 다음 블록들을 하나의 엔트리로 광고하려 한다.</span><br>${snBlocksHtml(S.blocks)}</div>
    <span class="sn-lbl">① 하나의 CIDR 블록으로 <u>정확히</u>(다른 주소를 포함하지 않고) 집약할 수 있는가?</span>
    <div class="wq-choices">${SN_AGG_OPTS.map((o, i) => `<button class="wq-choice${S.pick === i ? ' sel' : ''}${shown ? (i === ans ? ' ok' : i === S.pick ? ' ng' : '') : ''}" onclick="SN.st.pick = ${i}; snRender()"><pre>${i + 1}. ${o}</pre></button>`).join('')}</div>
    <span class="sn-lbl">② 모든 블록을 포함하는 가장 작은 CIDR 블록 (예: 200.23.16.0/20)</span>${snInput('cover', '', 'a.b.c.d/n')}
    <span class="sn-lbl">③ ②의 블록에 들어 있지만 주어진 블록들에는 없는 주소 수 (정확히 집약되면 0)</span>${snInput('waste', 'sm')}
    ${S.marks ? snSummary(F.filter(f => S.marks[f[0]]).length + (pickOk ? 1 : 0), 3) : ''}
    ${shown ? `<div class="pr-answer"><b>풀이</b> — 정답: ① ${ans + 1}번 · ② ${snCidr(S.r.cover.ip, S.r.cover.n)} · ③ ${S.r.waste.toLocaleString()}${snAggExplain(S.blocks, S.r)}</div>` : ''}
    ${snActions()}</div>`;
}

// ── 6. 최장 프리픽스 매칭 ──
function snNewLpm() { const C = snLpmCase(); SN.st = { table: C.table, dests: C.dests.map(ip => ({ ip, pick: null })), bin: SN.st && SN.st.bin || false }; }
function snLpmPick(d, ifc) {
  const x = SN.st.dests[d];
  if (!x || x.pick !== null) return;
  x.pick = ifc; snRender();
}
function snRenderLpm() {
  const S = SN.st, n = S.table.length;
  const done = S.dests.filter(d => d.pick !== null), ok = done.filter(d => d.pick === S.table[snLpm(S.table, d.ip)].ifc).length;
  const rows = S.dests.map((d, i) => {
    const ans = S.table[snLpm(S.table, d.ip)].ifc, has = d.pick !== null;
    return `<tr><td class="sn-mono" style="text-align:left">${snStr(d.ip)}${S.bin ? '<br>' + snBinHtml(d.ip, 0) : ''}</td>
      <td><div class="sn-ifc">${[...Array(n).keys()].map(k => `<button class="${has ? (k === ans ? 'ok' : k === d.pick ? 'ng' : '') : ''}" ${has ? 'disabled' : ''} onclick="snLpmPick(${i}, ${k})">${k}</button>`).join('')}</div></td>
      <td class="sn-why" style="max-width:none">${has ? (d.pick === ans ? '✅ ' : '❌ ') + snLpmExplain(S.table, d.ip) : ''}</td></tr>`;
  }).join('');
  snMain().innerHTML = `<div class="pr-card">
    <h3 class="pr-h">🧭 최장 프리픽스 매칭 <small style="font-weight:500;color:#64748b">· ${ok} / ${done.length} 정답</small></h3>
    <div style="font-size:14px;margin-bottom:6px">라우터의 포워딩 테이블이 다음과 같다. 목적지 주소별로 나가는 링크 인터페이스를 고르세요.</div>
    ${snLpmTableHtml(S.table, S.bin)}
    <label class="pr-chk" style="margin:6px 0 10px"><input type="checkbox" ${S.bin ? 'checked' : ''} onchange="SN.st.bin = this.checked; snRender()"> 2진 표기로 보기</label>
    <div class="pr-tablewrap"><table class="pr-table"><tr><th>목적지 주소</th><th>인터페이스</th><th></th></tr>${rows}</table></div>
    <div class="pr-sub">여러 항목과 일치하면 prefix가 가장 긴(가장 구체적인) 항목을 따릅니다. 숫자 키로 위에서부터 차례로 고를 수 있습니다.</div>
    <div class="pr-actions"><button class="pr-btn ghost" onclick="SN.st.dests.forEach(d => { if (d.pick === null) d.pick = -1; }); snRender()">👀 정답 보기</button>
      <button class="pr-btn" onclick="snNext()">다음 테이블 →</button></div></div>`;
}

// ── 7. 실전 세트 (한 화면에 풀고 한꺼번에 채점) ──
function snNewExam(cnt) {
  cnt = cnt || (SN.st && SN.st.cnt) || 10;
  const kinds = [];
  while (kinds.length < cnt) kinds.push(...snShuffle(SN_EXAM_KINDS));
  SN.st = { cnt, items: kinds.slice(0, cnt).map(k => SN_GEN[k]()), vals: {}, picks: {}, marks: null, graded: false };
}
function snExamOk(S, i) { const it = S.items[i]; return it.kind === 'choice' ? S.picks[i] === it.ansIdx : !!it.check(S.vals['e' + i]); }
function snRenderExam() {
  const S = SN.st, g = S.graded;
  S.marks = g ? Object.fromEntries(S.items.map((it, i) => ['e' + i, snExamOk(S, i)])) : null;
  const score = g ? S.items.filter((it, i) => snExamOk(S, i)).length : 0;
  const qs = S.items.map((it, i) => {
    const ok = g && snExamOk(S, i);
    const body = it.kind === 'choice'
      ? `<div class="wq-choices" style="margin-top:6px">${it.opts.map((o, k) => `<button class="wq-choice${S.picks[i] === k ? ' sel' : ''}${g ? (k === it.ansIdx ? ' ok' : S.picks[i] === k ? ' ng' : '') : ''}" ${g ? 'disabled' : ''} onclick="SN.st.picks[${i}] = ${k}; snRender()"><pre>${k + 1}. ${escHtml(o)}</pre></button>`).join('')}</div>`
      : `<div style="margin-top:6px">${snInput('e' + i, '', '답')}</div>`;
    return `<div class="sn-q"><span class="sn-qn">${i + 1}.</span><small class="pr-chip">${escHtml(it.cat)}</small>${g ? `<span class="sn-mark" style="color:${ok ? '#15803d' : '#b91c1c'}">${ok ? '⭕' : '❌'}</span>` : ''}
      <div>${it.q}</div>${body}
      ${g ? `<div class="sn-exp">${ok ? '' : `정답: <b class="sn-mono">${escHtml(it.ans)}</b><br>`}${it.exp}</div>` : ''}</div>`;
  }).join('');
  snMain().innerHTML = `<div class="pr-card">
    <h3 class="pr-h">📝 실전 세트</h3>
    <div class="pr-row" style="align-items:center;margin-bottom:0"><span class="pr-sub">문제 수</span>
      <div class="pr-seg">${[10, 15, 20].map(c => `<button class="${S.cnt === c ? 'active' : ''}" onclick="snNewExam(${c}); snRender()">${c}문제</button>`).join('')}</div></div>
    ${g ? `<div class="pr-result ${score === S.cnt ? 'good' : 'bad'}" style="font-size:15px"><b>${score} / ${S.cnt}</b> (${Math.round(score / S.cnt * 100)}점)</div>` : ''}
  </div>
  <div class="pr-card">${qs}
    ${g ? '' : '<div class="pr-actions"><button class="pr-btn indigo" onclick="snCheck()">✅ 한꺼번에 채점</button></div>'}
    ${g ? `<div class="pr-result ${score === S.cnt ? 'good' : 'bad'}"><b>${score} / ${S.cnt}</b> 정답</div>` : ''}
    <div class="pr-actions"><button class="pr-btn" onclick="snNext(); window.scrollTo(0, 0)">🔁 새 시험지</button></div></div>`;
}

const SN_MODES = {
  addr: {
    make() { const n = snRp(); SN.st = { ip: snRandIp(), n, cidr: Math.random() < 0.6, vals: {}, marks: null, revealed: false }; },
    render: snRenderAddr, check() { snFormCheck(snAddrFields(SN.st)); }, reveal() { snFormReveal(snAddrFields(SN.st)); },
  },
  conv: {
    make() { const S = SN.st && SN.st.conv ? SN.st : { conv: true, score: 0, total: 0 }; Object.assign(S, { item: SN_GEN[snPick(SN_CONV_KINDS)](), vals: {}, marks: null, pick: null, done: false, ok: false }); SN.st = S; },
    render: snRenderConv,
    check() {
      const S = SN.st;
      if (S.done || S.item.kind !== 'text' || !(S.vals.a || '').trim()) return;
      S.done = true; S.ok = !!S.item.check(S.vals.a); S.total++; if (S.ok) S.score++;
      S.marks = { a: S.ok };
    },
    reveal() {},
  },
  flsm: { make: snNewFlsm, render: snRenderFlsm, check() { snFormCheck(snFlsmFields(SN.st)); }, reveal() { snFormReveal(snFlsmFields(SN.st)); } },
  vlsm: {
    make: snNewVlsm, render: snRenderVlsm,
    check() { const S = SN.st; S.graded = snVlsmGrade(S.base, S.reqs, snVlsmRows(S)); },
    reveal() {
      const S = SN.st, c = snVlsmCanon(S.base, S.reqs);
      c.rows.forEach((x, i) => { S.vals[`v${i}_net`] = snStr(x.ip); S.vals[`v${i}_pre`] = '/' + x.n; });
      S.graded = null; S.revealed = true;
    },
  },
  agg: {
    make: snNewAgg, render: snRenderAgg,
    check() { snFormCheck(snAggFields(SN.st)); },
    reveal() { snFormReveal(snAggFields(SN.st)); SN.st.pick = SN_AGG_IDX[SN.st.r.reason]; },
  },
  lpm: { make: snNewLpm, render: snRenderLpm, check() {}, reveal() {} },
  exam: { make() { snNewExam(); }, render: snRenderExam, check() { SN.st.graded = true; }, reveal() {} },
};

registerPractice({
  id: 'subnet', subject: '컴퓨터네트워크', exams: ['기말고사'], icon: '🧮', title: '서브넷팅 · 슈퍼네팅 연습',
  desc: '주소 분석(네트워크 · 브로드캐스트 · 호스트 수), 마스크 변환, 고정 길이 서브넷팅, VLSM, 경로 집약, 최장 프리픽스 매칭을 무작위 문제로 풀고 2진수 풀이를 확인하세요',
  mount: snMount,
  onKey(act, e) {
    if (!SN || act[0] !== 'c') return;
    const i = +act.slice(1) - 1, S = SN.st;
    if (SN.view === 'conv' && S.item.kind === 'choice' && !S.done && i < S.item.opts.length) { e.preventDefault(); snConvPick(i); }
    else if (SN.view === 'agg' && i < SN_AGG_OPTS.length) { e.preventDefault(); S.pick = i; snRender(); }
    else if (SN.view === 'lpm' && i < S.table.length) { const d = S.dests.findIndex(x => x.pick === null); if (d >= 0) { e.preventDefault(); snLpmPick(d, i); } }
  },
  onEnter(e) {
    if (!SN) return;
    const S = SN.st, v = SN.view;
    if ((v === 'conv' && S.done) || (v === 'lpm' && S.dests.every(d => d.pick !== null))) { e.preventDefault(); snNext(); }
    else if (v === 'conv' && S.item.kind === 'text') { e.preventDefault(); const el = snMain().querySelector('input'); if (el) el.focus(); }
    else if (['addr', 'flsm', 'agg'].includes(v) && (S.marks || S.revealed)) { e.preventDefault(); snNext(); }
    else if (v === 'vlsm' && (S.graded || S.revealed)) { e.preventDefault(); snNext(); }
  },
});
