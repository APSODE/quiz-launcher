// 2_DNS_질의흐름.js — quiz_launcher 플러그인: DNS 질의 흐름 · 캐시
// 실행기가 일반 <script>로 실행한다. 실행기 공통 함수(escHtml, pr* 유틸, SCHED_COLORS, registerPractice 등)를 전역으로 쓴다.

// ════════════════════════════════════════════════════════
//  6-1. DNS 질의 흐름 · 캐시 (컴퓨터네트워크 Ch2 s.40~45)
//   dnsResolve(S, name, mode) 는 화면과 무관한 순수 함수: Local DNS 캐시 상태 S 에서 name 을 조회하면
//     { msgs: [{ from, to, kind: 'q'|'r', text }], visited: [서버], fromCache, S: 조회 후 상태 } 를 돌려준다.
//   - 메시지 번호는 슬라이드 그림과 같다. iterated: 1 host→local, 2 local→root, 3 root→local, 4 local→TLD, 5 TLD→local,
//     6 local→auth, 7 auth→local, 8 local→host / recursive: 1, 2 local→root, 3 root→TLD, 4 TLD→auth, 5 auth→TLD, 6 TLD→root, 7 root→local, 8
//   - 캐시는 Local DNS 서버 것만 모델링한다. iterated 는 TLD 서버 · 권한 서버 정보(NS)와 답(A)을 모두 알게 되어 캐시하고,
//     recursive 는 Local DNS 가 최종 답(A)만 받으므로 A 만 캐시한다. (실제로는 중간 서버들도 캐시한다 — 화면에 안내)
// ════════════════════════════════════════════════════════
const DNS_HOSTS = [
  { name: 'gaia.cs.umass.edu', ip: '128.119.245.12', domain: 'cs.umass.edu', auth: 'dns.cs.umass.edu', tld: 'edu' },
  { name: 'www.cs.umass.edu', ip: '128.119.240.84', domain: 'cs.umass.edu', auth: 'dns.cs.umass.edu', tld: 'edu' },
  { name: 'www.amazon.com', ip: '52.84.150.39', domain: 'amazon.com', auth: 'dns.amazon.com', tld: 'com' },
  { name: 'images.amazon.com', ip: '52.84.150.77', domain: 'amazon.com', auth: 'dns.amazon.com', tld: 'com' },
  { name: 'www.yahoo.com', ip: '98.137.11.163', domain: 'yahoo.com', auth: 'dns.yahoo.com', tld: 'com' },
  { name: 'www.pbs.org', ip: '54.225.198.196', domain: 'pbs.org', auth: 'dns.pbs.org', tld: 'org' },
];
const DNS_NODES = {
  host:  { ko: '요청 호스트', sub: 'cis.poly.edu', x: 120, y: 320, color: '#475569' },
  local: { ko: 'Local DNS', sub: 'dns.poly.edu', x: 120, y: 175, color: '#0284c7' },
  root:  { ko: 'Root DNS', sub: '루트 서버', x: 560, y: 50, color: '#9333ea' },
  tld:   { ko: 'TLD DNS', sub: '', x: 625, y: 190, color: '#d97706' },
  auth:  { ko: '권한 있는 DNS', sub: '', x: 560, y: 330, color: '#16a34a' },
};
const DNS_LEVELS = ['root', 'tld', 'auth'];

function dnsHost(name) { return DNS_HOSTS.find(h => h.name === name) || DNS_HOSTS[0]; }
function dnsNodeSub(id, h) { return id === 'tld' ? '.' + h.tld + ' 서버' : id === 'auth' ? h.auth : DNS_NODES[id].sub; }

// 캐시 상태: { now(초), ttl(초), cache: { key: { type, name, value, exp } } }  key = 'A:이름' | 'NS:도메인' | 'NS:tld'
function dnsInitState(ttl) { return { now: 0, ttl: ttl || 300, cache: {} }; }
function dnsLive(S) {
  const c = {};
  Object.keys(S.cache).forEach(k => { if (S.cache[k].exp > S.now) c[k] = S.cache[k]; });
  return c;
}
function dnsAdvance(S, sec) { const N = JSON.parse(JSON.stringify(S)); N.now += sec; N.cache = dnsLive(N); return N; }

function dnsResolve(S0, name, mode) {
  const S = JSON.parse(JSON.stringify(S0)); S.cache = dnsLive(S);
  const h = dnsHost(name), msgs = [], q = '"' + h.name + '"의 IP 주소는?';
  const ans = h.name + ' = ' + h.ip;
  const put = (type, nm, value) => { S.cache[type + ':' + nm] = { type, name: nm, value, exp: S.now + S.ttl }; };
  msgs.push({ from: 'host', to: 'local', kind: 'q', text: q });
  if (S.cache['A:' + h.name]) {
    msgs.push({ from: 'local', to: 'host', kind: 'r', text: ans + ' (Local DNS 캐시에서 바로 응답)' });
    return { msgs, visited: [], fromCache: 'A', S };
  }
  const start = S.cache['NS:' + h.domain] ? 'auth' : S.cache['NS:' + h.tld] ? 'tld' : 'root';
  const levels = DNS_LEVELS.slice(DNS_LEVELS.indexOf(start));
  const refer = { root: '".' + h.tld + '" TLD 서버에 물어보세요 (TLD 서버 정보)', tld: '"' + h.auth + '"에 물어보세요 (권한 있는 서버 정보)' };
  if (mode === 'iterated') {
    levels.forEach(lv => {
      msgs.push({ from: 'local', to: lv, kind: 'q', text: q });
      msgs.push({ from: lv, to: 'local', kind: 'r', text: lv === 'auth' ? ans : refer[lv] });
    });
    put('NS', h.tld, '.' + h.tld + ' TLD 서버'); put('NS', h.domain, h.auth);
  } else {
    let prev = 'local';
    levels.forEach(lv => { msgs.push({ from: prev, to: lv, kind: 'q', text: q + (prev === 'local' ? '' : ' (대신 알아봐 주세요)') }); prev = lv; });
    for (let i = levels.length - 1; i >= 0; i--) msgs.push({ from: levels[i], to: i ? levels[i - 1] : 'local', kind: 'r', text: ans });
  }
  put('A', h.name, h.ip);
  msgs.push({ from: 'local', to: 'host', kind: 'r', text: ans });
  return { msgs, visited: levels, fromCache: start === 'root' ? null : start === 'tld' ? 'NS:tld' : 'NS:domain', S };
}

// ── 화면 ──
let DN = null;

function dnsMount(root) {
  DN = { mode: 'iterated', name: DNS_HOSTS[0].name, ttl: 300, S: dnsInitState(300), res: null, step: 0, timer: null, hist: [], view: 'view', qz: null, preview: true };
  root.innerHTML = `
    <div class="pr-card">
      <h3 class="pr-h">⚙️ 설정</h3>
      <div class="pr-f" style="margin-bottom:12px">모드<div class="pr-seg" id="dn-views"></div></div>
      <div id="dn-ctrl"></div>
    </div>
    <div id="dn-main"></div>`;
  dnsRenderTop();
  dnsQuery(true);
}

function dnsRenderTop() {
  document.getElementById('dn-views').innerHTML = [['view', '▶ 질의 흐름 · 캐시 보기'], ['quiz', '✍️ 문제 풀기']].map(([id, nm]) =>
    `<button class="${DN.view === id ? 'active' : ''}" onclick="dnsSetView('${id}')">${nm}</button>`).join('');
  const ctrl = document.getElementById('dn-ctrl');
  if (DN.view === 'quiz') { ctrl.innerHTML = '<div class="pr-sub">무작위 시나리오(질의 방식 · 조회 이름 · Local DNS 캐시 상태)가 나옵니다. 메시지 흐름을 머릿속으로 그려 보고 답하세요.</div>'; return; }
  ctrl.innerHTML = `
    <div class="pr-f" style="margin-bottom:12px">질의 방식<div class="pr-seg">${[['iterated', 'iterated (반복적)'], ['recursive', 'recursive (재귀적)']].map(([id, nm]) =>
      `<button class="${DN.mode === id ? 'active' : ''}" onclick="DN.mode = '${id}'; dnsRenderTop(); dnsQuery(true)">${nm}</button>`).join('')}</div></div>
    <div class="pr-row">
      <label class="pr-f">조회할 이름
        <select onchange="DN.name = this.value; dnsQuery(true)">${DNS_HOSTS.map(h => `<option ${h.name === DN.name ? 'selected' : ''}>${h.name}</option>`).join('')}</select></label>
      <label class="pr-f">캐시 TTL
        <select onchange="DN.ttl = +this.value; DN.S.ttl = DN.ttl; dnsRender()">${[[60, '1분'], [300, '5분'], [3600, '1시간']].map(([v, t]) => `<option value="${v}" ${v === DN.ttl ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
      <button class="pr-btn indigo" onclick="dnsQuery(false)">🔍 이 이름 조회 (캐시 반영)</button>
      <button class="pr-btn ghost" onclick="dnsTime(30)">⏩ 30초</button>
      <button class="pr-btn ghost" onclick="dnsTime(300)">⏩ 5분</button>
      <button class="pr-btn ghost" onclick="dnsClear()">🗑 캐시 비우기</button>
    </div>
    <div class="pr-sub">"조회"를 누를 때마다 Local DNS 캐시가 쌓입니다. 같은 이름(또는 같은 도메인 · 같은 TLD의 다른 이름)을 다시 조회해 보세요. 시간을 흘려 TTL이 지나면 캐시가 사라집니다.<br>
      질의 방식이나 이름을 바꾸면 <b>지금 캐시 상태 그대로</b> 흐름을 미리 보여 줍니다(캐시는 "조회"를 눌러야 바뀝니다). TTL 변경은 다음 조회부터 적용됩니다.</div>`;
}

function dnsSetView(v) { DN.view = v; dnsStop(); dnsRenderTop(); if (v === 'quiz') dnsNewQuiz(); else dnsQuery(true); }

// preview=true: 캐시를 바꾸지 않고 현재 상태에서의 흐름만 계산 / false: 조회를 실행해 캐시 갱신
function dnsQuery(preview) {
  dnsStop();
  const r = dnsResolve(DN.S, DN.name, DN.mode);
  DN.res = r; DN.step = preview ? r.msgs.length : 0;
  if (!preview) {
    DN.hist.unshift({ t: DN.S.now, name: DN.name, mode: DN.mode, n: r.msgs.length, cache: r.fromCache });
    DN.S = r.S;
  }
  DN.preview = !!preview;
  dnsRender();
  if (!preview) dnsPlay();
}
function dnsTime(sec) { DN.S = dnsAdvance(DN.S, sec); dnsQuery(true); }
function dnsClear() { DN.S = dnsInitState(DN.ttl); DN.hist = []; dnsQuery(true); }

function dnsStop() { if (DN && DN.timer) { clearInterval(DN.timer); DN.timer = null; } }
function dnsPlay() {
  if (DN.timer) { dnsStop(); dnsRender(); return; }
  if (DN.step >= DN.res.msgs.length) DN.step = 0;
  DN.timer = setInterval(() => {
    if (!document.getElementById('dn-svg')) { dnsStop(); return; }
    DN.step++;
    if (DN.step >= DN.res.msgs.length) { DN.step = DN.res.msgs.length; dnsStop(); }
    dnsRender();
  }, 900);
  dnsRender();
}
function dnsSeek(k) { dnsStop(); DN.step = Math.max(0, Math.min(DN.res.msgs.length, k)); dnsRender(); }

function dnsEdge(a, b, off) {
  const A = DNS_NODES[a], B = DNS_NODES[b], W = 168, H = 52;
  const dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, px = -uy, py = ux;
  const cut = Math.min(Math.abs(ux) < 1e-9 ? Infinity : (W / 2) / Math.abs(ux), Math.abs(uy) < 1e-9 ? Infinity : (H / 2) / Math.abs(uy));
  return { x1: A.x + px * off + ux * (cut + 2), y1: A.y + py * off + uy * (cut + 2), x2: B.x + px * off - ux * (cut + 8), y2: B.y + py * off - uy * (cut + 8) };
}

function dnsSvg(h, msgs, step, highlight) {
  const nodes = Object.keys(DNS_NODES).map(id => {
    const n = DNS_NODES[id], used = msgs.some(m => m.from === id || m.to === id);
    return `<g opacity="${used ? 1 : 0.35}"><rect x="${n.x - 84}" y="${n.y - 26}" width="168" height="52" rx="12" fill="white" stroke="${n.color}" stroke-width="2.5"/>
      <text x="${n.x}" y="${n.y - 4}" text-anchor="middle" font-size="14" font-weight="800" fill="${n.color}">${n.ko}</text>
      <text x="${n.x}" y="${n.y + 14}" text-anchor="middle" font-size="11" fill="#64748b">${escHtml(dnsNodeSub(id, h))}</text></g>`;
  }).join('');
  const lines = msgs.slice(0, step).map((m, i) => {
    const g = dnsEdge(m.from, m.to, 13), cur = i === step - 1 && highlight;
    const c = m.kind === 'q' ? '#2563eb' : '#16a34a', mx = (g.x1 + g.x2) / 2, my = (g.y1 + g.y2) / 2;
    return `<g><line x1="${g.x1}" y1="${g.y1}" x2="${g.x2}" y2="${g.y2}" stroke="${c}" stroke-width="${cur ? 3.5 : 2}" ${m.kind === 'r' ? 'stroke-dasharray="7 4"' : ''} marker-end="url(#dn-${m.kind})" opacity="${cur ? 1 : 0.75}"/>
      <circle cx="${mx}" cy="${my}" r="11" fill="${cur ? c : 'white'}" stroke="${c}" stroke-width="2"/>
      <text x="${mx}" y="${my + 4}" text-anchor="middle" font-size="11" font-weight="800" fill="${cur ? 'white' : c}">${i + 1}</text></g>`;
  }).join('');
  const mk = (id, c) => `<marker id="dn-${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${c}"/></marker>`;
  return `<svg class="st-svg" ${highlight ? 'id="dn-svg"' : ''} viewBox="0 0 760 380"><defs>${mk('q', '#2563eb')}${mk('r', '#16a34a')}</defs>${nodes}${lines}</svg>`;
}

function dnsCacheTable(S) {
  const live = Object.values(dnsLive(S));
  if (!live.length) return '<div class="pr-sub">비어 있음</div>';
  const isTld = e => e.type === 'NS' && e.name.indexOf('.') < 0;
  const desc = e => e.type === 'A' ? '호스트 이름 → IP' : isTld(e) ? 'TLD 서버 정보' : '권한 있는 서버 정보';
  return `<div class="pr-tablewrap"><table class="pr-table"><tr><th>type</th><th>name</th><th>value</th><th>의미</th><th>남은 TTL</th></tr>
    ${live.map(e => `<tr><td>${e.type}</td><td>${escHtml(isTld(e) ? '.' + e.name : e.name)}</td><td>${escHtml(e.value)}</td><td>${desc(e)}</td><td>${e.exp - S.now}초</td></tr>`).join('')}</table></div>`;
}

function dnsRender() {
  if (DN.view === 'quiz') return dnsRenderQuiz();
  const r = DN.res, h = dnsHost(DN.name), k = DN.step, cur = r.msgs[k - 1];
  const nm = id => DNS_NODES[id].ko;
  const skip = r.fromCache === 'A' ? 'Local DNS 캐시에 답(A)이 있어 상위 서버에 묻지 않습니다.'
    : r.fromCache === 'NS:tld' ? 'Local DNS 캐시에 .' + h.tld + ' TLD 서버 정보가 있어 <b>Root를 건너뜁니다</b>.'
    : r.fromCache === 'NS:domain' ? 'Local DNS 캐시에 ' + escHtml(h.auth) + ' 정보가 있어 <b>Root · TLD를 건너뜁니다</b>.' : '캐시에 쓸 만한 정보가 없어 Root부터 차례로 묻습니다.';
  document.getElementById('dn-main').innerHTML = `
    <div class="pr-card">
      <h3 class="pr-h">🌐 ${DN.mode} query · ${escHtml(h.name)} <small style="font-weight:500;color:#64748b">메시지 ${r.msgs.length}개${DN.preview ? ' · 미리보기(캐시 변화 없음)' : ''}</small></h3>
      <div class="pr-actions" style="margin-top:0;margin-bottom:8px;align-items:center">
        <button class="pr-btn indigo" onclick="dnsPlay()">${DN.timer ? '⏸ 멈춤' : '▶ 재생'}</button>
        <button class="pr-btn ghost" onclick="dnsSeek(0)">⏮ 처음</button>
        <button class="pr-btn ghost" onclick="dnsSeek(DN.step - 1)">◀ 이전</button>
        <button class="pr-btn ghost" onclick="dnsSeek(DN.step + 1)">다음 ▶</button>
        <button class="pr-btn ghost" onclick="dnsSeek(${r.msgs.length})">⏭ 전체</button>
        <span class="pr-sub">${k} / ${r.msgs.length}</span>
      </div>
      ${dnsSvg(h, r.msgs, k, true)}
      <div class="st-msg ${cur ? 'ok' : 'info'}">${cur ? `<b>${k}. ${nm(cur.from)} → ${nm(cur.to)}</b> (${cur.kind === 'q' ? '질의' : '응답'})<br>${escHtml(cur.text)}` : ''}${cur ? '' : skip}${cur && k === r.msgs.length ? '<br>' + skip : ''}</div>
      <div class="pr-sub" style="margin-top:6px">${DN.mode === 'iterated'
        ? 'iterated: 접촉한 서버가 "나는 모르지만 이 서버에 물어봐라"라고 다음 서버 이름을 알려 줍니다. Local DNS가 직접 차례로 묻습니다.'
        : 'recursive: 이름 해석 부담을 접촉한 서버에 넘깁니다. 상위 계층(Root · TLD)의 부하가 커질 수 있습니다.'}
        파란 실선 = 질의, 초록 점선 = 응답.</div>
    </div>
    <div class="pr-card">
      <h3 class="pr-h">🗄 Local DNS 캐시 <small style="font-weight:500;color:#64748b">현재 시각 t=${DN.S.now}초 · TTL ${DN.S.ttl}초</small></h3>
      ${dnsCacheTable(DN.S)}
      <div class="pr-sub" style="margin-top:6px">${DN.mode === 'iterated' ? 'iterated는 Local DNS가 TLD · 권한 서버 정보(NS)와 답(A)을 모두 직접 받으므로 셋 다 캐시합니다.' : 'recursive는 Local DNS가 최종 답(A)만 받으므로 A만 캐시합니다.'}
        TLD 서버 정보가 캐시되어 있으면 Root는 자주 방문하지 않습니다. 캐시는 TTL이 지나면 사라지며, 그 전까지는 오래된 정보일 수도 있습니다(best effort).
        <br>※ 이 화면은 Local DNS 캐시만 보여 줍니다. 실제로는 매핑을 알게 된 모든 서버가 캐시합니다.</div>
      ${DN.hist.length ? `<h3 class="pr-h" style="margin-top:12px">📝 조회 기록</h3><div class="pr-log">${DN.hist.map(x =>
        `t=${x.t}초 ${x.name} (${x.mode}) → 메시지 ${x.n}개${x.cache === 'A' ? ' · 캐시 적중(A)' : x.cache === 'NS:tld' ? ' · Root 생략' : x.cache === 'NS:domain' ? ' · Root·TLD 생략' : ''}`).join('\n')}</div>` : ''}
    </div>`;
}

// ── 문제 ──
function dnsNewQuiz() {
  const h = DNS_HOSTS[prRand(0, DNS_HOSTS.length - 1)], mode = Math.random() < 0.5 ? 'iterated' : 'recursive';
  const cacheKind = ['none', 'none', 'tld', 'domain', 'A'][prRand(0, 4)];
  const S = dnsInitState(300);
  let cacheText = 'Local DNS 캐시는 비어 있다.';
  if (cacheKind === 'tld') { S.cache['NS:' + h.tld] = { type: 'NS', name: h.tld, value: '.' + h.tld + ' TLD 서버', exp: 300 }; cacheText = 'Local DNS 캐시에 .' + h.tld + ' TLD 서버 정보가 있다(TTL 남음). 다른 정보는 없다.'; }
  if (cacheKind === 'domain') {
    S.cache['NS:' + h.tld] = { type: 'NS', name: h.tld, value: '.' + h.tld + ' TLD 서버', exp: 300 };
    S.cache['NS:' + h.domain] = { type: 'NS', name: h.domain, value: h.auth, exp: 300 };
    cacheText = 'Local DNS 캐시에 .' + h.tld + ' TLD 서버 정보와 ' + h.domain + '의 권한 있는 서버(' + h.auth + ') 정보가 있다(TTL 남음). ' + h.name + '의 IP는 없다.';
  }
  if (cacheKind === 'A') { S.cache['A:' + h.name] = { type: 'A', name: h.name, value: h.ip, exp: 300 }; cacheText = 'Local DNS 캐시에 ' + h.name + '의 IP 주소가 있다(TTL 남음).'; }
  const r = dnsResolve(S, h.name, mode);
  const pick = r.msgs.length > 2 ? prRand(2, r.msgs.length - 1) : 2;
  DN.qz = { h, mode, cacheText, r, pick, a: {}, checked: false, revealed: false };
  dnsRender();
}

function dnsQuizAnswers(Q) {
  const m = Q.r.msgs, rootOut = m.filter(x => x.from === 'root');
  let rootSays = 3;                                           // 관여하지 않음
  if (rootOut.length) rootSays = Q.mode === 'iterated' ? 0 : 1;
  return {
    total: m.length,
    localQ: m.filter(x => x.from === 'local' && x.kind === 'q').length,
    rootSays,                                                  // 0 TLD 서버 정보 / 1 최종 IP / 3 관여 안 함
    from: m[Q.pick - 1].from, to: m[Q.pick - 1].to,
  };
}
const DNS_ROOT_CHOICES = ['다음에 물어볼 TLD 서버 정보를 Local DNS에 알려 준다', '최종 IP 주소를 Local DNS에 알려 준다', '권한 있는 DNS 서버의 IP 주소를 호스트에 직접 알려 준다', 'Root 서버는 이 조회에 관여하지 않는다'];

function dnsRenderQuiz() {
  const Q = DN.qz, a = Q.a;
  const nodeSel = (key) => `<select onchange="DN.qz.a['${key}'] = this.value"><option value="">선택</option>${Object.keys(DNS_NODES).map(id =>
    `<option value="${id}" ${a[key] === id ? 'selected' : ''}>${DNS_NODES[id].ko}</option>`).join('')}</select>`;
  document.getElementById('dn-main').innerHTML = `
    <div class="pr-card">
      <h3 class="pr-h">✍️ 시나리오</h3>
      <div style="font-size:14px;line-height:1.8">호스트 cis.poly.edu가 <b>${escHtml(Q.h.name)}</b>의 IP 주소를 알고 싶다. 질의 방식은 <b>${Q.mode === 'iterated' ? 'iterated(반복적)' : 'recursive(재귀적)'}</b>이다.<br>${escHtml(Q.cacheText)}<br>
        <span class="pr-sub">호스트 → Local DNS 질의를 1번으로 하여 메시지마다 번호를 붙인다. Root/TLD/권한 서버의 캐시는 고려하지 않는다.</span></div>
      <div class="pr-q">1. 호스트가 답을 받을 때까지 오가는 DNS 메시지는 모두 몇 개인가? (질의 + 응답)</div>
      <input class="pr-num" id="dn-q-total" inputmode="numeric" value="${a.total || ''}" oninput="DN.qz.a.total = this.value">
      <div class="pr-q">2. Local DNS 서버가 다른 DNS 서버에 보내는 질의 메시지는 몇 개인가?</div>
      <input class="pr-num" id="dn-q-localQ" inputmode="numeric" value="${a.localQ || ''}" oninput="DN.qz.a.localQ = this.value">
      <div class="pr-q">3. 이 조회에서 Root DNS 서버의 역할은?</div>
      <div class="wq-choices" id="dn-q-root">${DNS_ROOT_CHOICES.map((c, i) => `<button class="wq-choice${a.root === i ? ' sel' : ''}" onclick="DN.qz.a.root = ${i}; dnsRender()"><pre>${c}</pre></button>`).join('')}</div>
      <div class="pr-q">4. ${Q.pick}번 메시지를 보내는 쪽과 받는 쪽은?</div>
      <span class="pr-vec" id="dn-q-pair"><span class="lbl">보내는 쪽</span>${nodeSel('from')}<span class="lbl">받는 쪽</span>${nodeSel('to')}</span>
      <div id="dn-feedback"></div>
      <div class="pr-actions">
        <button class="pr-btn indigo" onclick="dnsQuizCheck()">✅ 채점하기</button>
        <button class="pr-btn ghost" onclick="DN.qz.revealed = true; dnsRender()">👀 정답 · 흐름 보기</button>
        <button class="pr-btn" onclick="dnsNewQuiz()">다음 문제 →</button>
      </div>
      <div id="dn-answer"></div>
    </div>`;
  if (Q.checked) dnsQuizCheck();
  if (Q.revealed) dnsQuizReveal();
}

function dnsQuizCheck() {
  const Q = DN.qz, a = Q.a, A = dnsQuizAnswers(Q);
  const res = [
    ['dn-q-total', parseInt(a.total, 10) === A.total],
    ['dn-q-localQ', parseInt(a.localQ, 10) === A.localQ],
    ['dn-q-root', a.root === A.rootSays],
    ['dn-q-pair', a.from === A.from && a.to === A.to],
  ];
  res.forEach(([id, ok]) => {
    const el = document.getElementById(id);
    if (el.tagName === 'INPUT') prMark(id, ok);
    else { el.style.outline = `2px solid ${ok ? '#22c55e' : '#ef4444'}`; el.style.outlineOffset = '3px'; el.style.borderRadius = '10px'; }
  });
  const okN = res.filter(x => x[1]).length;
  Q.checked = true;
  document.getElementById('dn-feedback').innerHTML = `<div class="pr-result ${okN === 4 ? 'good' : 'bad'}"><b>${okN === 4 ? '🎉 모두 정답입니다!' : '채점 결과'}</b> ${okN} / 4 정답</div>`;
}

function dnsQuizReveal() {
  const Q = DN.qz, A = dnsQuizAnswers(Q), nm = id => DNS_NODES[id].ko;
  document.getElementById('dn-answer').innerHTML = `<div class="pr-answer">
    <b>정답</b><br>1. ${A.total}개 · 2. ${A.localQ}개 · 3. ${DNS_ROOT_CHOICES[A.rootSays]} · 4. ${nm(A.from)} → ${nm(A.to)}
    ${dnsSvg(Q.h, Q.r.msgs, Q.r.msgs.length, false)}
    <div class="pr-log">${Q.r.msgs.map((m, i) => `${i + 1}. ${nm(m.from)} → ${nm(m.to)} [${m.kind === 'q' ? '질의' : '응답'}] ${escHtml(m.text)}`).join('\n')}</div>
    <div class="pr-sub" style="margin-top:6px">${Q.mode === 'iterated' ? 'iterated: Local DNS가 각 서버에 직접 묻고, 각 서버는 다음에 물어볼 서버를 알려 줍니다.' : 'recursive: 접촉한 서버가 대신 다음 서버에 묻고 답을 거꾸로 돌려줍니다. Local DNS는 상위 서버에 질의를 한 번만 보냅니다.'}
      캐시에 TLD 정보가 있으면 Root를, 권한 서버 정보까지 있으면 TLD도 건너뜁니다.</div></div>`;
}

registerPractice({
  id: 'dnsflow', subject: '컴퓨터네트워크', icon: '🌐', title: 'DNS 질의 흐름 · 캐시',
  desc: 'iterated / recursive 질의가 Root → TLD → 권한 있는 서버로 오가는 과정을 번호대로 보고, Local DNS 캐시와 TTL에 따라 흐름이 어떻게 줄어드는지 확인하세요',
  mount: dnsMount,
});
