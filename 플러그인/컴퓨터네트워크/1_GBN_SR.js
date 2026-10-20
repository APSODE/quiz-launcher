// 1_GBN_SR.js — quiz_launcher 플러그인: GBN / SR 송수신 애니메이션
// 실행기가 일반 <script>로 실행한다. 실행기 공통 함수(escHtml, pr* 유틸, SCHED_COLORS, registerPractice 등)를 전역으로 쓴다.

// ════════════════════════════════════════════════════════
//  5. GBN / SR 송수신 애니메이션 (컴퓨터네트워크 3.4, s.38~53)
//   gbSim(cfg) 은 화면과 무관한 순수 함수: 정해진 손실 목록대로 1틱 단위로 시뮬레이션해
//     { msgs: [송수신 메시지], timeouts, snaps: [틱별 송·수신 변수], log, tEnd } 를 돌려준다. → 문제 출제에 그대로 사용
//   cfg = { proto: 'gbn' | 'sr', N: 윈도우, total: 보낼 패킷 수, D: 편도 지연(틱), T: 타임아웃(틱), loss: Set(메시지 키) }
//   메시지 키: 데이터 'd{번호}.{몇 번째 전송}' · ACK 'a{번호}.{몇 번째 전송}'  예) 'd2.1' = pkt2의 첫 전송
//   가정: 송신자는 1틱에 패킷 1개 전송 · 순서 번호는 0부터 계속 증가 (모듈러 생략) · 중복 ACK에 의한 빠른 재전송 없음
// ════════════════════════════════════════════════════════
const GB_D = 3, GB_T = 8;

function gbSim(cfg) {
  const { proto, N, total, D, T, loss } = cfg, gbn = proto === 'gbn';
  const msgs = [], timeouts = [], snaps = [], log = [];
  const sendCnt = {}, ackCnt = {}, acked = new Set(), timers = {}, buf = new Set(), delivered = [];
  let base = 0, next = 0, timer = null, exp = 0, rb = 0, retx = [], tEnd = 0;
  const say = (t, side, text) => log.push({ t, side, text });

  const sendData = (t, seq, isRetx) => {
    const tr = sendCnt[seq] = (sendCnt[seq] || 0) + 1, key = 'd' + seq + '.' + tr;
    msgs.push({ kind: 'data', seq, tr, key, t0: t, t1: t + D, lost: loss.has(key), retx: isRetx, note: '' });
    if (gbn) { if (timer === null) timer = t; } else timers[seq] = t;
    say(t, 'S', `pkt${seq} ${isRetx ? '재전송' : '전송'}${loss.has(key) ? ' (손실됨)' : ''}`);
  };
  const sendAck = (t, n, m) => {
    const tr = ackCnt[n] = (ackCnt[n] || 0) + 1, key = 'a' + n + '.' + tr;
    msgs.push({ kind: 'ack', seq: n, tr, key, t0: t, t1: t + D, lost: loss.has(key), note: '', useful: false });
    m.note += ` → ACK${n}${loss.has(key) ? '(손실)' : ''}`;
  };

  for (let t = 0; t < 400; t++) {
    // 1) 수신자: 이번 틱에 도착한 데이터
    msgs.filter(m => m.kind === 'data' && m.t1 === t && !m.lost).forEach(m => {
      const s = m.seq;
      if (gbn) {
        if (s === exp) { delivered.push(s); exp++; m.note = '전달'; m.res = 'ok'; sendAck(t, s, m); }
        else { m.note = `폐기 (기다리는 번호 ${exp})`; m.res = 'drop'; if (exp > 0) sendAck(t, exp - 1, m); else m.note += ' · 보낼 ACK 없음'; }
      } else if (s >= rb && s < rb + N) {
        if (buf.has(s)) { m.note = '중복 (이미 버퍼에 있음)'; m.res = 'dup'; }
        else {
          buf.add(s);
          if (s === rb) {
            const run = [];
            while (buf.has(rb)) { buf.delete(rb); delivered.push(rb); run.push(rb); rb++; }
            m.note = run.length > 1 ? `전달 (버퍼의 pkt${run.slice(1).join(', pkt')}까지 함께)` : '전달'; m.res = 'ok';
          } else { m.note = `버퍼 저장 (기다리는 번호 ${rb})`; m.res = 'buf'; }
        }
        sendAck(t, s, m);
      } else if (s >= rb - N && s < rb) { m.note = '이미 전달한 패킷'; m.res = 'dup'; sendAck(t, s, m); }
      else { m.note = '윈도우 밖 → 무시'; m.res = 'drop'; }
      say(t, 'R', `pkt${s} 도착: ${m.note}`);
    });
    // 2) 송신자: 이번 틱에 도착한 ACK
    msgs.filter(m => m.kind === 'ack' && m.t1 === t && !m.lost).forEach(m => {
      const n = m.seq;
      if (gbn) {
        if (n >= base) { base = n + 1; timer = base === next ? null : t; m.useful = true; m.note = `누적 확인 → SendBase=${base}`; }
        else m.note = '중복 ACK → 무시';
      } else if (n >= base && n < base + N && !acked.has(n)) {
        acked.add(n); delete timers[n]; m.useful = true;
        if (n === base) { while (acked.has(base)) base++; m.note = `SendBase=${base}`; } else m.note = `pkt${n} 확인 (SendBase=${base} 유지)`;
      } else m.note = '중복 ACK → 무시';
      say(t, 'S', `ACK${n} 도착: ${m.note}`);
    });
    // 3) 타임아웃
    if (gbn) {
      if (timer !== null && t - timer >= T && base < next) {
        const seqs = []; for (let s = base; s < next; s++) seqs.push(s);
        retx = retx.concat(seqs.filter(s => !retx.includes(s))); timer = t;
        timeouts.push({ t, seqs, base, next }); say(t, 'S', `⏰ 타임아웃 (가장 오래된 pkt${base}) → pkt${seqs.join(', pkt')} 모두 재전송`);
      }
    } else {
      const due = Object.keys(timers).map(Number).filter(s => t - timers[s] >= T).sort((a, b) => a - b);
      if (due.length) {
        due.forEach(s => { timers[s] = t; if (!retx.includes(s)) retx.push(s); });
        timeouts.push({ t, seqs: due, base, next }); say(t, 'S', `⏰ pkt${due.join(', pkt')} 타이머 만료 → 그 패킷만 재전송`);
      }
    }
    // 4) 전송 (1틱에 1개, 재전송 우선)
    let sent = false;
    while (retx.length && !sent) {
      const s = retx.shift();
      if (gbn ? s < base : acked.has(s)) continue;
      sendData(t, s, true); sent = true;
    }
    if (!sent && next < base + N && next < total) { sendData(t, next, false); next++; }
    snaps.push({ t, base, next, acked: [...acked], exp, rb, buf: [...buf].sort((a, b) => a - b), delivered: delivered.slice() });
    tEnd = t;
    if (base >= total && !msgs.some(m => m.t1 > t)) break;
  }
  return { msgs, timeouts, snaps, log, tEnd };
}

// 무작위 손실: 데이터 첫 전송 1~2개 + (선택) ACK 첫 전송 1개
function gbRandomLoss(total, ackLoss) {
  const loss = new Set(), pool = [];
  for (let s = 1; s < total - 1; s++) pool.push(s);
  const k = Math.min(pool.length, prRand(1, 2));
  const lost = [];
  for (let i = 0; i < k; i++) lost.push(pool.splice(prRand(0, pool.length - 1), 1)[0]);
  lost.forEach(s => loss.add('d' + s + '.1'));
  if (ackLoss && pool.length) loss.add('a' + pool[prRand(0, pool.length - 1)] + '.1');
  return loss;
}

// 출제용 정답 묶음
function gbAnswers(sim) {
  const data = sim.msgs.filter(m => m.kind === 'data');
  const uniq = arr => [...new Set(arr)].sort((a, b) => a - b);
  const to = sim.timeouts[0];   // base · next 는 타임아웃 처리 직전 값
  return {
    retx: uniq(data.filter(m => m.retx).map(m => m.seq)),
    sends: data.length,
    dropped: uniq(data.filter(m => m.res === 'drop').map(m => m.seq)),
    buffered: uniq(data.filter(m => m.res === 'buf').map(m => m.seq)),
    firstTimeout: to ? { t: to.t, base: to.base, next: to.next } : null,
  };
}

// ── 화면 ──
let GB = null;

function gbnMount(root) {
  GB = { proto: 'gbn', N: 4, total: 8, ackLoss: false, loss: new Set(['d2.1']), sim: null, cur: 0, timer: null, mode: 'view', qa: null };
  root.innerHTML = `
    <div class="pr-card">
      <h3 class="pr-h">⚙️ 설정</h3>
      <div class="pr-f" style="margin-bottom:12px">프로토콜<div class="pr-seg" id="gb-protos"></div></div>
      <div class="pr-row">
        <label class="pr-f">윈도우 크기 N
          <select onchange="GB.N = +this.value; gbResim(true)">${[2, 3, 4, 5].map(n => `<option value="${n}" ${n === 4 ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
        <label class="pr-f">보낼 패킷 수
          <select onchange="GB.total = +this.value; gbResim(true)">${[5, 6, 7, 8, 9, 10, 12].map(n => `<option value="${n}" ${n === 8 ? 'selected' : ''}>${n}개 (pkt0~${n - 1})</option>`).join('')}</select></label>
        <label class="pr-chk"><input type="checkbox" onchange="GB.ackLoss = this.checked"> 무작위 손실에 ACK 손실 포함</label>
        <button class="pr-btn ghost" onclick="gbRandom()">🎲 무작위 손실</button>
        <button class="pr-btn ghost" onclick="GB.loss = new Set(); gbResim(true)">손실 모두 지우기</button>
      </div>
      <div class="pr-f">모드<div class="pr-seg" id="gb-modes"></div></div>
      <div class="pr-sub" style="margin-top:8px">편도 지연 ${GB_D}틱(왕복 ${2 * GB_D}틱) · 타임아웃 ${GB_T}틱 · 송신자는 1틱에 패킷 1개를 보냅니다. 순서 번호는 0부터 계속 증가합니다(모듈러 생략).<br>
        보기 모드에서 <b>그림의 화살표를 누르면 그 메시지의 손실을 켜고 끌 수 있습니다.</b></div>
    </div>
    <div id="gb-main"></div>`;
  gbRenderTop();
  gbResim(true);
}

function gbRenderTop() {
  document.getElementById('gb-protos').innerHTML = [['gbn', 'Go-Back-N'], ['sr', 'Selective Repeat']].map(([id, nm]) =>
    `<button class="${GB.proto === id ? 'active' : ''}" onclick="GB.proto = '${id}'; gbRenderTop(); gbResim(true)">${nm}</button>`).join('');
  document.getElementById('gb-modes').innerHTML = [['view', '▶ 애니메이션 보기'], ['quiz', '✍️ 문제 풀기']].map(([id, nm]) =>
    `<button class="${GB.mode === id ? 'active' : ''}" onclick="gbSetMode('${id}')">${nm}</button>`).join('');
}

function gbSetMode(m) {
  GB.mode = m; gbStop();
  if (m === 'quiz') { GB.loss = gbRandomLoss(GB.total, GB.ackLoss); GB.qa = { retx: new Set(), drop: new Set(), checked: false }; }
  gbRenderTop(); gbResim(true);
}
function gbRandom() {
  GB.loss = gbRandomLoss(GB.total, GB.ackLoss);
  if (GB.mode === 'quiz') GB.qa = { retx: new Set(), drop: new Set(), checked: false };
  gbResim(true);
}

function gbResim(rewind) {
  gbStop();
  GB.sim = gbSim({ proto: GB.proto, N: GB.N, total: GB.total, D: GB_D, T: GB_T, loss: GB.loss });
  if (rewind) GB.cur = 0;
  GB.cur = Math.min(GB.cur, GB.sim.tEnd + GB_D);
  gbRender();
}

function gbToggleLoss(key) {
  if (GB.mode !== 'view') return;
  GB.loss.has(key) ? GB.loss.delete(key) : GB.loss.add(key);
  gbResim(false);
}

function gbStop() { if (GB && GB.timer) { clearInterval(GB.timer); GB.timer = null; } }
function gbPlay() {
  if (GB.timer) { gbStop(); gbRender(); return; }
  if (GB.cur >= GB.sim.tEnd + GB_D) GB.cur = 0;
  GB.timer = setInterval(() => {
    if (!document.getElementById('gb-svg')) { gbStop(); return; }
    GB.cur = Math.round((GB.cur + 0.25) * 100) / 100;
    if (GB.cur >= GB.sim.tEnd + GB_D) { GB.cur = GB.sim.tEnd + GB_D; gbStop(); }
    gbRender();
  }, 120);
  gbRender();
}
function gbSeek(t) { gbStop(); GB.cur = Math.max(0, Math.min(GB.sim.tEnd + GB_D, t)); gbRender(); }

function gbSvg(sim, cur) {
  const SX = 250, RX = 590, Y = t => 34 + t * 20, H = Y(sim.tEnd + GB_D) + 24;
  const parts = [];
  for (let t = 0; t <= sim.tEnd + GB_D; t += 2) parts.push(`<text x="20" y="${Y(t) + 4}" font-size="10" fill="#94a3b8">t=${t}</text>`);
  parts.push(`<text x="${SX}" y="18" text-anchor="middle" font-size="13" font-weight="800" fill="#1e293b">송신자</text>
    <text x="${RX}" y="18" text-anchor="middle" font-size="13" font-weight="800" fill="#1e293b">수신자</text>
    <line x1="${SX}" y1="${Y(0)}" x2="${SX}" y2="${H - 10}" stroke="#334155" stroke-width="3"/>
    <line x1="${RX}" y1="${Y(0)}" x2="${RX}" y2="${H - 10}" stroke="#334155" stroke-width="3"/>`);
  sim.timeouts.filter(o => o.t <= cur).forEach(o => parts.push(
    `<text x="${SX - 8}" y="${Y(o.t) + 14}" text-anchor="end" font-size="11" font-weight="800" fill="#dc2626">⏰ timeout</text>`));
  sim.msgs.filter(m => m.t0 <= cur).forEach(m => {
    const data = m.kind === 'data';
    const [x0, x1] = data ? [SX, RX] : [RX, SX];
    const f = Math.min(m.lost ? 0.55 : 1, (cur - m.t0) / GB_D);
    const xe = x0 + (x1 - x0) * f, ye = Y(m.t0) + (Y(m.t1) - Y(m.t0)) * f;
    const color = m.lost ? '#dc2626' : data ? (m.retx ? '#9333ea' : '#2563eb') : (m.useful ? '#16a34a' : '#94a3b8');
    const arrived = f >= 1;
    const label = data ? `pkt${m.seq}` : `ACK${m.seq}`, lf = data ? 0.12 : 0.25;   // 라벨 위치(경로 비율)
    parts.push(`<g style="cursor:${GB.mode === 'view' ? 'pointer' : 'default'}" onclick="gbToggleLoss('${m.key}')"><title>${label} (${m.tr}번째 전송) · 클릭하면 손실 켜기/끄기</title>
      <line x1="${x0}" y1="${Y(m.t0)}" x2="${xe}" y2="${ye}" stroke="${color}" stroke-width="2" ${data ? '' : 'stroke-dasharray="6 4"'} ${arrived ? 'marker-end="url(#gb-arr)"' : ''}/>
      <line x1="${x0}" y1="${Y(m.t0)}" x2="${x0 + (x1 - x0) * (m.lost ? 0.55 : 1)}" y2="${Y(m.t0) + (Y(m.t1) - Y(m.t0)) * (m.lost ? 0.55 : 1)}" stroke="transparent" stroke-width="14"/>
      ${f >= lf ? `<text x="${x0 + (x1 - x0) * lf}" y="${Y(m.t0) + (Y(m.t1) - Y(m.t0)) * lf - 5}" text-anchor="middle" font-size="11" font-weight="800" fill="${color}">${label}</text>` : ''}
      ${m.lost && f >= 0.55 ? `<text x="${xe}" y="${ye + 5}" text-anchor="middle" font-size="16" font-weight="900" fill="#dc2626">✕</text>` : ''}
      ${arrived && m.note ? `<text x="${data ? x1 + 8 : x1 - 8}" y="${Y(m.t1) + 4}" text-anchor="${data ? 'start' : 'end'}" font-size="11" fill="#475569">${escHtml(data ? m.note : m.note.replace('→ ', ''))}</text>` : ''}</g>`);
  });
  parts.push(`<line x1="40" y1="${Y(cur)}" x2="810" y2="${Y(cur)}" stroke="#4f46e5" stroke-width="1" stroke-dasharray="3 3"/>`);
  return `<svg class="st-svg" id="gb-svg" viewBox="0 0 820 ${H}" style="max-width:820px">
    <defs><marker id="gb-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#475569"/></marker></defs>${parts.join('')}</svg>`;
}

function gbLegend(items) {
  return items.map(([c, t]) => `<span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${c};margin:0 3px 0 6px;vertical-align:-1px"></span>${t}`).join('');
}

function gbStrip(total, cls) {
  return `<div class="st-q">${Array.from({ length: total }, (_, s) => { const c = cls(s); return `<div class="box" style="background:${c.bg};color:${c.fg || 'white'};${c.win ? 'box-shadow:0 0 0 2px #4f46e5;' : ''}">${s}</div>`; }).join('')}</div>`;
}

function gbStatus(sim, cur) {
  const t = Math.min(Math.floor(cur), sim.tEnd), S = sim.snaps[t], N = GB.N, gbn = GB.proto === 'gbn';
  const ackedSet = new Set(S.acked);
  const send = gbStrip(GB.total, s => {
    const win = s >= S.base && s < S.base + N;
    if (gbn ? s < S.base : ackedSet.has(s) || s < S.base) return { bg: '#16a34a', win };
    if (s < S.next) return { bg: '#f59e0b', win };
    if (win) return { bg: '#e0e7ff', fg: '#3730a3', win };
    return { bg: '#e2e8f0', fg: '#94a3b8' };
  });
  const rbase = gbn ? S.exp : S.rb, bufSet = new Set(S.buf);
  const recv = gbStrip(GB.total, s => {
    if (s < rbase) return { bg: '#16a34a' };
    if (bufSet.has(s)) return { bg: '#f59e0b', win: true };
    if (!gbn && s < rbase + N) return { bg: '#e0e7ff', fg: '#3730a3', win: true };
    if (gbn && s === rbase) return { bg: '#e0e7ff', fg: '#3730a3', win: true };
    return { bg: '#e2e8f0', fg: '#94a3b8' };
  });
  const events = sim.log.filter(e => e.t === t);
  return `<div class="st-grid">
    <div class="st-panel"><b>송신자 (t=${t})</b>${send}
      <div class="pr-sub">SendBase = <strong>${S.base}</strong> · NextSeqNum = <strong>${S.next}</strong> · 윈도우 <strong>${S.base}~${S.base + N - 1}</strong><br>
      ${gbLegend([['#16a34a', 'ACK 받음'], ['#f59e0b', '보냈고 ACK 대기'], ['#e0e7ff', '보낼 수 있음'], ['#e2e8f0', '윈도우 밖']])}</div></div>
    <div class="st-panel"><b>수신자 (t=${t})</b>${recv}
      <div class="pr-sub">${gbn ? `ExpectedSeqNum = <strong>${S.exp}</strong> (수신 버퍼 없음)` : `RecvBase = <strong>${S.rb}</strong> · 수신 윈도우 <strong>${S.rb}~${S.rb + N - 1}</strong> · 버퍼 [${S.buf.join(', ')}]`}<br>
      ${gbLegend([['#16a34a', '상위 계층에 전달'], ...(gbn ? [] : [['#f59e0b', '버퍼에 저장']]), ['#e0e7ff', '받을 수 있음']])}</div></div>
  </div>
  <div class="pr-log" style="margin-top:8px">${events.length ? events.map(e => `t=${e.t} [${e.side === 'S' ? '송신' : '수신'}] ${escHtml(e.text)}`).join('\n') : `t=${t} 이벤트 없음`}</div>`;
}

function gbLossText() {
  const arr = [...GB.loss].map(k => { const m = k.match(/^([da])(\d+)\.(\d+)$/); return `${m[1] === 'd' ? 'pkt' : 'ACK'}${m[2]}${m[3] === '1' ? '' : ` (${m[3]}번째 전송)`}`; });
  return arr.length ? arr.join(', ') + ' 손실' : '손실 없음';
}

function gbRender() {
  const sim = GB.sim, gbn = GB.proto === 'gbn';
  const head = `<b>${gbn ? 'Go-Back-N' : 'Selective Repeat'}</b> · N=${GB.N} · pkt0~${GB.total - 1} · ${gbLossText()}`;
  if (GB.mode === 'quiz') return gbRenderQuiz(head);
  const end = sim.tEnd + GB_D;
  document.getElementById('gb-main').innerHTML = `
    <div class="pr-card">
      <h3 class="pr-h">📡 송수신 시간 흐름 <small style="font-weight:500;color:#64748b">${head}</small></h3>
      <div class="pr-actions" style="margin-top:0;margin-bottom:10px;align-items:center">
        <button class="pr-btn indigo" onclick="gbPlay()">${GB.timer ? '⏸ 멈춤' : '▶ 재생'}</button>
        <button class="pr-btn ghost" onclick="gbSeek(0)">⏮ 처음</button>
        <button class="pr-btn ghost" onclick="gbSeek(Math.ceil(GB.cur) - 1)">◀ 1틱</button>
        <button class="pr-btn ghost" onclick="gbSeek(Math.floor(GB.cur) + 1)">1틱 ▶</button>
        <button class="pr-btn ghost" onclick="gbSeek(${end})">⏭ 끝</button>
        <input type="range" min="0" max="${end}" step="1" value="${Math.floor(GB.cur)}" oninput="gbSeek(+this.value)" style="flex:1;min-width:140px">
      </div>
      ${gbStatus(sim, GB.cur)}
      <div style="margin-top:12px">${gbSvg(sim, GB.cur)}</div>
      <div class="pr-sub">${gbLegend([['#2563eb', '데이터'], ['#9333ea', '재전송'], ['#dc2626', '손실'], ['#16a34a', 'ACK (점선, 윈도우를 움직임)'], ['#94a3b8', '무시된 중복 ACK']])}</div>
    </div>
    <div class="pr-card">
      <h3 class="pr-h">🔍 GBN vs SR 핵심</h3>
      <div class="pr-tablewrap"><table class="pr-table">
        <tr><th></th><th>GBN</th><th>SR</th></tr>
        <tr><th>ACK</th><td>누적 (순서대로 받은 마지막 번호)</td><td>개별</td></tr>
        <tr><th>타이머</th><td>1개 (가장 오래된 미확인 패킷)</td><td>패킷마다</td></tr>
        <tr><th>타임아웃 재전송</th><td>그 패킷 및 이후 보낸 것 전부</td><td>그 패킷만</td></tr>
        <tr><th>수신 버퍼</th><td>없음 (순서 어긋나면 폐기)</td><td>있음</td></tr>
      </table></div>
      <div class="pr-sub">SR 딜레마: 순서 번호 개수 ≥ 송신 윈도우 + 수신 윈도우 여야 재전송된 패킷과 새 패킷을 구분할 수 있습니다.</div>
    </div>`;
}

function gbRenderQuiz(head) {
  const sim = GB.sim, A = gbAnswers(sim), gbn = GB.proto === 'gbn', q = GB.qa;
  const chips = (set, name) => Array.from({ length: GB.total }, (_, s) =>
    `<button class="pr-pal ${set.has(s) ? 'sel' : ''}" style="background:#4f46e5" onclick="gbQToggle('${name}', ${s})">${s}</button>`).join('');
  document.getElementById('gb-main').innerHTML = `
    <div class="pr-card">
      <h3 class="pr-h">✍️ 시나리오</h3>
      <div style="font-size:14px;line-height:1.8">${head}<br>
        <span class="pr-sub">편도 지연 ${GB_D}틱 · 타임아웃 ${GB_T}틱 · 1틱에 1개 전송 · 손실은 모두 첫 전송 기준</span></div>
      <div class="pr-q">1. 재전송되는 패킷 번호를 모두 고르세요</div>
      <div class="pr-palette" id="gb-q1">${chips(q.retx, 'retx')}</div>
      <div class="pr-q">2. 수신자가 ${gbn ? '<b>폐기</b>하는' : '<b>버퍼에 저장</b>하는 (순서가 어긋나 바로 전달하지 못하는)'} 패킷 번호를 모두 고르세요</div>
      <div class="pr-palette" id="gb-q2">${chips(q.drop, 'drop')}</div>
      <div class="pr-q">3. 송신자가 데이터 패킷을 보내는 총 횟수는? <small>(재전송 포함)</small></div>
      <input class="pr-num" id="gb-q3" inputmode="numeric" value="${q.v3 || ''}">
      ${A.firstTimeout ? `<div class="pr-q">4. 첫 타임아웃이 일어나기 직전의 SendBase와 NextSeqNum은?</div>
      <span class="pr-vec"><span class="lbl">SendBase</span><input class="pr-num" id="gb-q4a" inputmode="numeric" value="${q.v4a || ''}">
        <span class="lbl">NextSeqNum</span><input class="pr-num" id="gb-q4b" inputmode="numeric" value="${q.v4b || ''}"></span>` : ''}
      <div id="gb-feedback"></div>
      <div class="pr-actions">
        <button class="pr-btn indigo" onclick="gbQCheck()">✅ 채점하기</button>
        <button class="pr-btn ghost" onclick="gbQReveal()">👀 정답 보기</button>
        <button class="pr-btn" onclick="gbRandom()">다음 문제 →</button>
      </div>
      <div id="gb-answer"></div>
    </div>`;
  if (q.checked) gbQCheck();
  if (q.revealed) gbQReveal();
}

function gbQKeep() {
  const v = id => { const el = document.getElementById(id); return el ? el.value : ''; };
  GB.qa.v3 = v('gb-q3'); GB.qa.v4a = v('gb-q4a'); GB.qa.v4b = v('gb-q4b');
}
function gbQToggle(name, s) { gbQKeep(); const set = GB.qa[name]; set.has(s) ? set.delete(s) : set.add(s); gbRender(); }

function gbQCheck() {
  gbQKeep();
  const A = gbAnswers(GB.sim), q = GB.qa, gbn = GB.proto === 'gbn';
  const same = (set, arr) => [...set].sort((a, b) => a - b).join() === arr.join();
  const res = [['gb-q1', same(q.retx, A.retx)], ['gb-q2', same(q.drop, gbn ? A.dropped : A.buffered)], ['gb-q3', prInt('gb-q3') === A.sends]];
  if (A.firstTimeout) res.push(['gb-q4a', prInt('gb-q4a') === A.firstTimeout.base], ['gb-q4b', prInt('gb-q4b') === A.firstTimeout.next]);
  res.forEach(([id, ok]) => {
    const el = document.getElementById(id);
    if (el.tagName === 'INPUT') prMark(id, ok);
    else { el.style.outline = `2px solid ${ok ? '#22c55e' : '#ef4444'}`; el.style.outlineOffset = '3px'; el.style.borderRadius = '10px'; }
  });
  const okN = res.filter(r => r[1]).length;
  q.checked = true;
  document.getElementById('gb-feedback').innerHTML = `<div class="pr-result ${okN === res.length ? 'good' : 'bad'}">
    <b>${okN === res.length ? '🎉 모두 정답입니다!' : '채점 결과'}</b> ${okN} / ${res.length} 정답</div>`;
}

function gbQReveal() {
  gbQKeep();
  const A = gbAnswers(GB.sim), gbn = GB.proto === 'gbn', list = a => (a.length ? a.join(', ') : '없음');
  GB.qa.revealed = true;
  document.getElementById('gb-answer').innerHTML = `<div class="pr-answer">
    <b>정답</b><br>
    1. 재전송: ${list(A.retx)}<br>
    2. ${gbn ? '폐기' : '버퍼 저장'}: ${list(gbn ? A.dropped : A.buffered)}<br>
    3. 총 ${A.sends}회<br>
    ${A.firstTimeout ? `4. t=${A.firstTimeout.t} 타임아웃 직전 SendBase = ${A.firstTimeout.base}, NextSeqNum = ${A.firstTimeout.next}<br>` : ''}
    <div class="pr-log" style="margin-top:8px">${GB.sim.log.map(e => `t=${e.t} [${e.side === 'S' ? '송신' : '수신'}] ${escHtml(e.text)}`).join('\n')}</div>
    <div class="pr-actions"><button class="pr-btn ghost" onclick="gbSetMode('view')">▶ 같은 시나리오를 애니메이션으로 보기</button></div>
  </div>`;
}

registerPractice({
  id: 'gbnsr', subject: '컴퓨터네트워크', icon: '📡', title: 'GBN / SR 송수신 애니메이션',
  desc: '패킷 · ACK 손실을 직접 골라 Go-Back-N과 Selective Repeat의 재전송 · 윈도우 이동 · 수신자 처리를 시간 흐름으로 보고, 문제로도 풀어 보세요',
  mount: gbnMount,
});
