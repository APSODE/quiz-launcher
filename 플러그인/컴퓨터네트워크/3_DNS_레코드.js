// 3_DNS_레코드.js — quiz_launcher 플러그인: DNS 레코드 연습
// 실행기가 일반 <script>로 실행한다. 실행기 공통 함수(escHtml, pr* 유틸, SCHED_COLORS, registerPractice 등)를 전역으로 쓴다.

// ════════════════════════════════════════════════════════
//  6-2. DNS 레코드 연습 (컴퓨터네트워크 Ch2 s.46~47)
//   rrCompany()          무작위 회사(도메인 · DNS 서버 · 웹 · 메일 · 별칭)
//   rrExpected(C)        { tld: [TLD 서버에 넣을 RR], auth: [권한 서버에 넣을 RR] }  RR = { name, value, type }
//   rrGrade(exp, rows)   순서와 무관하게 짝을 맞춰 채점 + 흔한 실수 진단
//   rrTypeItems(C)       레코드 타입 맞히기 문항
// ════════════════════════════════════════════════════════
const RR_WORDS = ['bluefox', 'moonbase', 'pinetree', 'redwave', 'starlab', 'oceanic', 'hanbit', 'nimbus', 'greenleaf', 'ironbridge', 'sunrise', 'snowpeak'];
const RR_TLDS = ['com', 'org', 'net'];
const RR_NETS = ['192.0.2.', '198.51.100.', '203.0.113.'];

function rrIp() { return RR_NETS[prRand(0, 2)] + prRand(2, 250); }
function rrCompany() {
  const w = RR_WORDS[prRand(0, RR_WORDS.length - 1)], d = w + '.' + RR_TLDS[prRand(0, 2)];
  let wwwIp = rrIp(), dnsIp = rrIp();
  while (dnsIp === wwwIp) dnsIp = rrIp();
  return {
    word: w, domain: d,
    dns: ['dns1.', 'ns.', 'ns1.'][prRand(0, 2)] + d, dnsIp,
    www: 'www.' + d, wwwIp,
    mail: ['mail.', 'mx.', 'post.'][prRand(0, 2)] + d,
    alias: Math.random() < 0.5 ? ['shop.', 'blog.', 'web.'][prRand(0, 2)] + d : null,
  };
}
function rrExpected(C) {
  const auth = [{ name: C.www, value: C.wwwIp, type: 'A' }, { name: C.domain, value: C.mail, type: 'MX' }];
  if (C.alias) auth.push({ name: C.alias, value: C.www, type: 'CNAME' });
  return { tld: [{ name: C.domain, value: C.dns, type: 'NS' }, { name: C.dns, value: C.dnsIp, type: 'A' }], auth };
}

function rrNorm(v) { return String(v || '').trim().toLowerCase().replace(/^\(|\)$/g, '').replace(/\.$/, '').replace(/\s+/g, ''); }
function rrIsIp(v) { return /^\d{1,3}(\.\d{1,3}){3}$/.test(rrNorm(v)); }

// 흔한 실수 진단 (행 하나 기준). exp = 그 표에 들어가야 하는 레코드들
function rrDiagnose(r, exp, other) {
  const t = rrNorm(r.type).toUpperCase(), name = rrNorm(r.name), val = rrNorm(r.value);
  if (!name && !val && !t) return '비어 있습니다.';
  if (!['A', 'NS', 'CNAME', 'MX'].includes(t)) return 'type을 고르세요 (A · NS · CNAME · MX).';
  if (t === 'NS' && rrIsIp(val)) return 'NS 레코드의 value는 IP 주소가 아니라 권한 있는 DNS 서버의 <b>호스트 이름</b>입니다.';
  if (t === 'A' && !rrIsIp(val)) return 'A 레코드의 value는 <b>IP 주소</b>입니다.';
  if (t !== 'A' && rrIsIp(val)) return t + ' 레코드의 value에는 IP 주소가 들어가지 않습니다.';
  if (t === 'MX' && exp.some(e => e.type === 'MX' && rrNorm(e.value) === name)) return 'MX 레코드의 name은 메일 서버가 아니라 <b>도메인</b>이고, value가 메일 서버 이름입니다.';
  if (t === 'CNAME' && exp.some(e => e.type === 'CNAME' && rrNorm(e.name) === val && rrNorm(e.value) === name)) return 'CNAME은 name = <b>별칭</b>, value = <b>정식(canonical) 이름</b>입니다. 둘이 바뀌었습니다.';
  if (t === 'NS' && exp.some(e => e.type === 'NS' && rrNorm(e.value) === name)) return 'NS 레코드의 name은 <b>도메인</b>, value가 DNS 서버 이름입니다.';
  if (other && other.some(e => rrNorm(e.name) === name && rrNorm(e.value) === val && e.type === t)) return '맞는 레코드지만 <b>다른 서버</b>에 넣는 레코드입니다.';
  if (!exp.some(e => e.type === t)) return '여기에 넣을 레코드 중 type이 ' + t + '인 것은 없습니다.';
  return 'type은 맞지만 name 또는 value가 다릅니다.';
}

function rrGrade(exp, rows, other) {
  const used = new Set(), res = rows.map(() => null);
  rows.forEach((r, i) => {
    const k = exp.findIndex((e, j) => !used.has(j) && rrNorm(e.name) === rrNorm(r.name) && rrNorm(e.value) === rrNorm(r.value) && e.type.toLowerCase() === rrNorm(r.type));
    if (k >= 0) { used.add(k); res[i] = { ok: true }; }
  });
  rows.forEach((r, i) => { if (!res[i]) res[i] = { ok: false, why: rrDiagnose(r, exp, other) }; });
  return { res, missing: exp.filter((e, j) => !used.has(j)) };
}

// 타입 맞히기: kind 'type' = 레코드 + 설명 → type 고르기 / kind 'pick' = 목적 → 맞는 레코드 고르기
function rrTypeItems(C) {
  const items = [
    { kind: 'type', rec: [C.www, C.wwwIp], ctx: C.www + '는 웹 서버이고 value는 그 IP 주소다.', ans: 'A' },
    { kind: 'type', rec: [C.dns, C.dnsIp], ctx: C.dns + '는 DNS 서버이고 value는 그 IP 주소다.', ans: 'A' },
    { kind: 'type', rec: [C.domain, C.dns], ctx: C.dns + '는 ' + C.domain + ' 도메인의 권한 있는 DNS 서버다.', ans: 'NS' },
    { kind: 'type', rec: [C.domain, C.mail], ctx: C.mail + '는 ' + C.domain + ' 도메인의 메일 서버다.', ans: 'MX' },
    { kind: 'type', rec: ['shop.' + C.domain, C.www], ctx: 'shop.' + C.domain + '는 별칭이고 실제(정식) 이름은 ' + C.www + '다.', ans: 'CNAME' },
    { kind: 'pick', goal: C.domain + ' 도메인의 권한 있는 DNS 서버가 ' + C.dns + '(' + C.dnsIp + ')임을 TLD 서버에 알리는 NS 레코드는?',
      opts: [[C.domain, C.dns, 'NS'], [C.domain, C.dnsIp, 'NS'], [C.dns, C.domain, 'NS'], [C.domain, C.dns, 'A']], ans: 0 },
    { kind: 'pick', goal: C.domain + ' 도메인의 메일 서버(' + C.mail + ')를 알리는 레코드는?',
      opts: [[C.mail, C.domain, 'MX'], [C.domain, C.mail, 'MX'], [C.domain, C.mail, 'CNAME'], [C.mail, C.wwwIp, 'MX']], ans: 1 },
    { kind: 'pick', goal: 'blog.' + C.domain + '를 ' + C.www + '의 별칭으로 등록하는 레코드는?',
      opts: [[C.www, 'blog.' + C.domain, 'CNAME'], ['blog.' + C.domain, C.www, 'A'], ['blog.' + C.domain, C.www, 'CNAME'], ['blog.' + C.domain, C.wwwIp, 'CNAME']], ans: 2 },
    { kind: 'pick', goal: '웹 서버 ' + C.www + '의 IP 주소(' + C.wwwIp + ')를 알리는 레코드는?',
      opts: [[C.www, C.wwwIp, 'NS'], [C.wwwIp, C.www, 'A'], [C.domain, C.wwwIp, 'A'], [C.www, C.wwwIp, 'A']], ans: 3 },
  ];
  for (let i = items.length - 1; i > 0; i--) { const j = prRand(0, i); [items[i], items[j]] = [items[j], items[i]]; }
  return items;
}
function rrFmt(r) { return '(' + r.join(', ') + ')'; }

// ── 화면 ──
let RR = null;

function rrMount(root) {
  RR = { view: 'reg', C: null, rows: null, graded: null, revealed: false, feedback: null, items: null, idx: 0, pick: null, score: 0 };
  root.innerHTML = `
    <div class="pr-card">
      <h3 class="pr-h">⚙️ 모드</h3>
      <div class="pr-seg" id="rr-views"></div>
      <div class="pr-sub" style="margin-top:8px">RR 형식 (name, value, type, ttl) — 여기서는 ttl을 생략하고 (name, value, type)만 씁니다.<br>
        A: 호스트 이름 → IP · NS: 도메인 → 권한 있는 DNS 서버의 호스트 이름 · CNAME: 별칭 → 정식 이름 · MX: 도메인 → 메일 서버 이름. 예시 IP는 문서용 주소 대역입니다.</div>
    </div>
    <div id="rr-main"></div>`;
  rrSetView('reg');
}
function rrSetView(v) {
  RR.view = v;
  document.getElementById('rr-views').innerHTML = [['reg', '🏢 도메인 등록 레코드 작성'], ['type', '🏷 레코드 타입 맞히기']].map(([id, nm]) =>
    `<button class="${RR.view === id ? 'active' : ''}" onclick="rrSetView('${id}')">${nm}</button>`).join('');
  v === 'reg' ? rrNewReg() : rrNewType();
}

function rrNewReg() {
  RR.C = rrCompany();
  const E = rrExpected(RR.C);
  RR.rows = { tld: E.tld.map(() => ({ name: '', value: '', type: '' })), auth: E.auth.map(() => ({ name: '', value: '', type: '' })) };
  RR.graded = null; RR.revealed = false; RR.feedback = null;
  rrRenderReg();
}

function rrRenderReg() {
  const C = RR.C, E = rrExpected(C);
  const rowsHtml = grp => RR.rows[grp].map((r, i) => {
    const g = RR.graded && RR.graded[grp].res[i];
    const cls = g ? (g.ok ? ' ok' : ' ng') : '';
    return `<tr><td class="pname">${i + 1}</td>
      ${['name', 'value'].map(f => `<td><input class="pr-num rr-in${cls}" value="${escHtml(r[f])}" oninput="RR.rows.${grp}[${i}].${f} = this.value" placeholder="${f}" spellcheck="false" autocomplete="off"></td>`).join('')}
      <td><select class="rr-type${cls}" onchange="RR.rows.${grp}[${i}].type = this.value">${['', 'A', 'NS', 'CNAME', 'MX'].map(t => `<option value="${t}" ${r.type === t ? 'selected' : ''}>${t || 'type'}</option>`).join('')}</select></td>
      <td class="rr-why">${g ? (g.ok ? '✅' : '❌ ' + g.why) : ''}</td></tr>`;
  }).join('');
  const table = (grp, title) => `<h3 class="pr-h" style="margin-top:12px">${title}</h3>
    <div class="pr-tablewrap"><table class="pr-table rr-table"><tr><th></th><th>name</th><th>value</th><th>type</th><th></th></tr>${rowsHtml(grp)}</table></div>`;
  document.getElementById('rr-main').innerHTML = `
    <div class="pr-card">
      <h3 class="pr-h">🏢 새 회사 "${escHtml(C.word)}" 도메인 등록</h3>
      <div style="font-size:14px;line-height:1.9">
        • 도메인: <b>${C.domain}</b><br>
        • 권한 있는 DNS 서버: <b>${C.dns}</b> (${C.dnsIp})<br>
        • 웹 서버: <b>${C.www}</b> (${C.wwwIp})<br>
        • 메일 서버: <b>${C.mail}</b>${C.alias ? `<br>• 별칭: <b>${C.alias}</b> 는 ${C.www} 의 별칭이다` : ''}</div>
      ${table('tld', `① 등록 기관(registrar)이 .${C.domain.split('.').pop()} TLD 서버에 넣는 레코드 ${E.tld.length}개`)}
      ${table('auth', `② 회사의 권한 있는 DNS 서버(${C.dns})에 넣는 레코드 ${E.auth.length}개 — 웹 서버 주소 · 메일 서버${C.alias ? ' · 별칭' : ''}`)}
      <div class="pr-sub">각 표 안의 순서는 상관없습니다. 대소문자 · 공백 · 끝의 점(.)은 무시합니다.</div>
      <div id="rr-feedback">${RR.feedback || ''}</div>
      <div class="pr-actions">
        <button class="pr-btn indigo" onclick="rrCheckReg()">✅ 채점하기</button>
        <button class="pr-btn ghost" onclick="RR.revealed = true; rrRenderReg()">👀 정답 보기</button>
        <button class="pr-btn" onclick="rrNewReg()">다음 문제 →</button>
      </div>
      ${RR.revealed ? `<div class="pr-answer"><b>정답</b><br>① TLD 서버<br>${E.tld.map(r => '&nbsp;&nbsp;' + rrFmt([r.name, r.value, r.type])).join('<br>')}<br>② 권한 있는 DNS 서버<br>${E.auth.map(r => '&nbsp;&nbsp;' + rrFmt([r.name, r.value, r.type])).join('<br>')}
        <div class="pr-sub" style="margin-top:6px">TLD 서버에는 "이 도메인은 어느 DNS 서버가 책임지는가"(NS)와 "그 DNS 서버의 IP"(A)를 함께 넣어야 합니다. NS의 value가 호스트 이름이라 A가 없으면 그 서버를 찾아갈 수 없습니다. (슬라이드 networkutopia.com 예제와 같은 구조)</div></div>` : ''}
    </div>`;
}

function rrCheckReg() {
  const E = rrExpected(RR.C);
  RR.graded = { tld: rrGrade(E.tld, RR.rows.tld, E.auth), auth: rrGrade(E.auth, RR.rows.auth, E.tld) };
  const all = [...RR.graded.tld.res, ...RR.graded.auth.res], ok = all.filter(x => x.ok).length;
  RR.feedback = `<div class="pr-result ${ok === all.length ? 'good' : 'bad'}"><b>${ok === all.length ? '🎉 모두 정답입니다!' : '채점 결과'}</b> 레코드 ${ok} / ${all.length} 정답${ok === all.length ? '' : ' · ❌ 옆에 틀린 이유가 표시됩니다.'}</div>`;
  rrRenderReg();
}

function rrNewType() {
  RR.C = rrCompany(); RR.items = rrTypeItems(RR.C); RR.idx = 0; RR.pick = null; RR.score = 0;
  rrRenderType();
}
function rrAnsIdx(it) { return it.kind === 'type' ? ['A', 'NS', 'CNAME', 'MX'].indexOf(it.ans) : it.ans; }
function rrRenderType() {
  const box = document.getElementById('rr-main');
  if (RR.idx >= RR.items.length) {
    box.innerHTML = `<div class="pr-card" style="text-align:center"><h3 class="pr-h">결과</h3>
      <div style="font-size:28px;font-weight:800;margin:8px 0">${RR.score} / ${RR.items.length}</div>
      <button class="pr-btn indigo" onclick="rrNewType()">🔁 새 세트</button></div>`;
    return;
  }
  const it = RR.items[RR.idx], answered = RR.pick !== null, ansIdx = rrAnsIdx(it);
  const choices = it.kind === 'type' ? ['A', 'NS', 'CNAME', 'MX'] : it.opts.map(rrFmt);
  box.innerHTML = `<div class="pr-card">
    <h3 class="pr-h">${RR.idx + 1} / ${RR.items.length} <small style="font-weight:500;color:#64748b">현재 ${RR.score}점 · 도메인 ${RR.C.domain}</small></h3>
    <div style="font-size:14px;line-height:1.8;margin-bottom:10px">${it.kind === 'type'
      ? `레코드 <b>${escHtml(rrFmt([it.rec[0], it.rec[1], '?']))}</b><br>${escHtml(it.ctx)}<br>이 레코드의 type은?`
      : escHtml(it.goal)}</div>
    <div class="wq-choices">${choices.map((c, i) => `<button class="wq-choice${answered ? (i === ansIdx ? ' ok' : i === RR.pick ? ' ng' : '') : ''}" ${answered ? 'disabled' : ''} onclick="rrPickType(${i})"><pre>${escHtml(c)}</pre></button>`).join('')}</div>
    ${answered ? `<div class="pr-result ${RR.pick === ansIdx ? 'good' : 'bad'}">${RR.pick === ansIdx ? '정답!' : '오답'} — ${rrTypeExplain(it)}</div>
      <div class="pr-actions"><button class="pr-btn" onclick="RR.idx++; RR.pick = null; rrRenderType()">다음 →</button></div>` : ''}
  </div>`;
}
function rrPickType(i) {
  if (RR.pick !== null) return;
  RR.pick = i; if (i === rrAnsIdx(RR.items[RR.idx])) RR.score++;
  rrRenderType();
}
function rrTypeExplain(it) {
  const t = it.kind === 'type' ? it.ans : it.opts[it.ans][2];
  return { A: 'A: name = 호스트 이름, value = IP 주소.', NS: 'NS: name = 도메인, value = 그 도메인의 권한 있는 DNS 서버의 호스트 이름(IP 아님).',
    CNAME: 'CNAME: name = 별칭, value = 정식(canonical) 이름.', MX: 'MX: name = 도메인, value = 그 도메인의 메일 서버 이름.' }[t];
}

registerPractice({
  id: 'dnsrr', subject: '컴퓨터네트워크', icon: '🗂', title: 'DNS 레코드 연습',
  desc: '무작위 회사의 도메인 등록에 필요한 레코드(TLD 서버의 NS · A, 권한 서버의 A · MX · CNAME)를 직접 쓰고, 레코드 타입 맞히기로 A · NS · CNAME · MX를 구분해 보세요',
  mount: rrMount,
});
