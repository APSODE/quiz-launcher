// 3_상태전이.js — quiz_launcher 플러그인: 프로세스 상태 전이 보기
// 실행기가 일반 <script>로 실행한다. 실행기 공통 함수(escHtml, pr* 유틸, SCHED_COLORS, registerPractice 등)를 전역으로 쓴다.

// ════════════════════════════════════════════════════════
//  3. 프로세스 상태 전이 시각화 (강의 3장 p.27~33)
//  문제 출제 없이 흐름을 보여 주는 화면이지만, 규칙은 화면과 분리된 순수 함수로 두어 나중에 문제화할 수 있다.
//   ST_STATES / ST_TRANS / ST_MODELS   상태 · 전이 · 모델 정의 (데이터만 고치면 그림과 버튼이 바뀐다)
//   ST_INVALID                          없는 전이를 시도했을 때의 설명 (OX · 오답 해설 소재)
//   stInit(modelId, n)                  → 시스템 상태 S (원본을 바꾸지 않는 값 객체)
//   stCandidates(S, trId)               → { ok: [적용 가능한 프로세스], reason: 불가능한 이유 }
//   stApply(S, trId, name)              → { S: 다음 상태, entry: 로그 항목 }
//   stRandomEvent(S, rand)              → 지금 가능한 { trId, name } 하나 (없으면 null)
//   stScenario(modelId, n, steps, rand) → { frames: [S0..Sk], log: [entry] }
//     예) "k단계 뒤 B의 상태는?", "이 전이의 이름은?", "다음에 디스패치되는 프로세스는?", "문맥 교환 횟수는?"
// ════════════════════════════════════════════════════════
const ST_W = 132, ST_H = 64;
const ST_STATES = {
  new:      { ko: '생성', en: 'New / Created', x: 75, y: 90, color: '#64748b',
              desc: '프로세스가 만들어지는 중입니다. PCB를 생성하고 메모리를 할당합니다.' },
  ready:    { ko: '준비', en: 'Ready', x: 290, y: 90, color: '#0284c7',
              desc: 'CPU만 받으면 바로 실행할 수 있는 상태입니다. 준비 큐에서 차례를 기다립니다.' },
  running:  { ko: '실행', en: 'Running', x: 520, y: 90, color: '#16a34a',
              desc: 'CPU를 배정받아 실행 중입니다. CPU가 1개이므로 실행 상태 프로세스는 최대 1개입니다.' },
  exit:     { ko: '종료', en: 'Terminated', x: 728, y: 90, color: '#475569',
              desc: '실행을 마친 상태입니다. PCB를 제거하고 메모리를 반납합니다.' },
  blocked:  { ko: '대기', en: 'Blocked / Waiting', x: 520, y: 250, color: '#d97706',
              desc: '입출력이나 이벤트를 기다리는 상태입니다. CPU를 주어도 실행할 수 없습니다.' },
  sready:   { ko: '중단 준비', en: 'Suspended Ready', x: 290, y: 400, color: '#9333ea',
              desc: '준비 상태에서 메모리를 반납하고 디스크로 스왑아웃된 상태입니다. 스왑인되어야 다시 준비 큐에 들어갑니다.' },
  sblocked: { ko: '중단 대기', en: 'Suspended Blocked', x: 520, y: 400, color: '#db2777',
              desc: '대기 상태에서 스왑아웃된 상태입니다. 입출력이 끝나면 중단 준비로, 스왑인되면 대기로 갑니다.' },
};

//  pick: 'head' = 준비 큐 맨 앞이 대상 / 그 외 = 해당 상태의 프로세스 중 선택
//  off: 양방향 화살표를 나란히 그리기 위한 간격 · flip: 라벨을 반대쪽에 그림 · lt: 라벨 위치(0=출발 ~ 1=도착, 기본 0.5) · cs: 문맥 교환(PCB 저장) 발생
const ST_TRANS = {
  admit:     { from: 'new', to: 'ready', ko: '승인', en: 'Admit',
               cause: '생성이 끝난 프로세스가 준비 큐 맨 뒤에 들어갑니다. (강의 그림에는 이름이 없는 전이입니다)' },
  dispatch:  { from: 'ready', to: 'running', ko: '디스패치', en: 'Dispatch', pick: 'head', off: 12,
               cause: 'CPU 스케줄러가 준비 큐에서 다음 프로세스를 골라 실행 상태로 바꿉니다. (여기서는 준비 큐 맨 앞, FCFS로 가정)' },
  timeout:   { from: 'running', to: 'ready', ko: '타임아웃', en: 'Time Out', off: 12, cs: true,
               cause: '타임 퀀텀 안에 작업을 끝내지 못해 타이머 인터럽트로 CPU를 내놓고 준비 큐 맨 뒤로 갑니다.' },
  block:     { from: 'running', to: 'blocked', ko: '입출력·이벤트 대기', en: 'I/O or Event Wait', flip: true, cs: true,
               cause: '입출력처럼 시간이 걸리는 작업을 요청해 CPU를 양보하고 대기 상태로 갑니다.' },
  wakeup:    { from: 'blocked', to: 'ready', ko: '입출력·이벤트 완료', en: 'Wake Up', lt: 0.3,
               cause: '기다리던 입출력·이벤트가 끝나 준비 큐 맨 뒤로 갑니다. 바로 실행되지 않습니다.' },
  exit:      { from: 'running', to: 'exit', ko: '종료', en: 'Exit',
               cause: '작업을 마쳤습니다. PCB를 제거하고 메모리를 반납합니다.' },
  outReady:  { from: 'ready', to: 'sready', ko: '스왑아웃', en: 'Swap-out (Suspend)', off: 12,
               cause: '메모리가 부족하거나 사용자가 중단시켜 메모리를 반납하고 디스크로 나갑니다.' },
  inReady:   { from: 'sready', to: 'ready', ko: '스왑인', en: 'Swap-in (Resume)', off: 12,
               cause: '다시 메모리에 올라와 준비 큐 맨 뒤로 들어갑니다.' },
  outBlock:  { from: 'blocked', to: 'sblocked', ko: '스왑아웃', en: 'Swap-out (Suspend)', off: 12,
               cause: '대기 중인 프로세스가 메모리를 반납하고 디스크로 나갑니다.' },
  inBlock:   { from: 'sblocked', to: 'blocked', ko: '스왑인', en: 'Swap-in (Resume)', off: 12,
               cause: '다시 메모리에 올라오지만 입출력이 아직 끝나지 않아 대기 상태입니다.' },
  sWakeup:   { from: 'sblocked', to: 'sready', ko: '입출력·이벤트 완료', en: 'I/O Completion',
               cause: '디스크에 있는 동안 입출력이 끝났습니다. 아직 메모리에 없으므로 중단 준비로 갑니다.' },
};

const ST_MODELS = [
  { id: 'batch', name: '일괄 처리', states: ['new', 'ready', 'running', 'exit'], trans: ['admit', 'dispatch', 'exit'],
    desc: '한 프로세스의 실행이 끝나야 다음 프로세스가 실행됩니다. 실행 → 준비 / 대기 전이가 없습니다.' },
  { id: 'ts', name: '시분할', states: ['new', 'ready', 'running', 'exit', 'blocked'],
    trans: ['admit', 'dispatch', 'timeout', 'block', 'wakeup', 'exit'],
    desc: '타임 퀀텀이 끝나거나 입출력을 요청하면 CPU를 양보하고 다른 프로세스가 실행됩니다.' },
  { id: 'susp', name: '시분할 + 중단', states: Object.keys(ST_STATES), trans: Object.keys(ST_TRANS),
    desc: '중단(Suspended) 상태 = 메모리 반납 상태. 준비·대기 상태에서 스왑아웃되고, 스왑인으로 돌아옵니다.' },
];

// 없는 전이 해설: '출발>도착'
const ST_INVALID = {
  'blocked>running':  '대기 → 실행으로 바로 가는 전이는 없습니다. 입출력이 끝나면 먼저 준비 큐로 가서(Wake Up) 디스패치를 기다립니다.',
  'ready>blocked':    '준비 상태는 CPU를 쓰고 있지 않아 입출력을 요청할 수 없습니다. 입출력 요청은 실행 중에만 일어납니다.',
  'new>running':      '생성된 프로세스는 바로 실행되지 않고 반드시 준비 큐를 거칩니다.',
  'ready>exit':       '종료는 실행 중인 프로세스가 작업을 마쳐야 일어납니다. 준비 상태에서 바로 끝날 수 없습니다.',
  'blocked>exit':     '대기 중인 프로세스는 실행 중이 아니므로 바로 종료되지 않습니다. (이 강의 모델 기준)',
  'running>sready':   '강의 그림에서 스왑아웃은 준비·대기 상태에서만 일어납니다. 실행 중인 프로세스는 먼저 CPU를 내놓아야 합니다.',
  'running>sblocked': '강의 그림에서 스왑아웃은 준비·대기 상태에서만 일어납니다. 실행 중인 프로세스는 먼저 CPU를 내놓아야 합니다.',
  'sready>running':   '중단 준비는 메모리에 없으므로 바로 실행될 수 없습니다. 스왑인으로 준비 큐에 들어간 뒤 디스패치됩니다.',
  'sblocked>running': '중단 대기는 메모리에도 없고 입출력도 끝나지 않았습니다. 바로 실행될 수 없습니다.',
  'sblocked>ready':   '중단 대기 → 준비로 한 번에 가지 않습니다. 스왑인(→ 대기) 후 입출력 완료, 또는 입출력 완료(→ 중단 준비) 후 스왑인을 거칩니다.',
  'sready>blocked':   '중단 준비 → 대기 전이는 없습니다. 이미 입출력이 끝난 프로세스는 다시 대기할 이유가 없습니다.',
  'running>new':      '생성 상태로 돌아가는 전이는 없습니다.',
};
function stWhyNot(from, to, model) {
  if (from === 'exit') return '종료된 프로세스는 PCB가 제거되어 다른 상태로 갈 수 없습니다.';
  if (to === 'new') return '생성 상태로 돌아가는 전이는 없습니다. 생성은 프로세스가 처음 만들어질 때만 거칩니다.';
  if (!model.states.includes(to)) return `${model.name} 모델에는 ${ST_STATES[to].ko} 상태가 없습니다.`;
  const k = from + '>' + to;
  if (ST_INVALID[k]) return ST_INVALID[k];
  const tr = Object.keys(ST_TRANS).find(id => ST_TRANS[id].from === from && ST_TRANS[id].to === to);
  if (tr && !model.trans.includes(tr)) return `${model.name} 모델에는 ${ST_TRANS[tr].ko} 전이가 없습니다. ${model.desc}`;
  return `${ST_STATES[from].ko} → ${ST_STATES[to].ko}로 바로 가는 전이는 없습니다.`;
}

function stModel(id) { return ST_MODELS.find(m => m.id === id) || ST_MODELS[0]; }
function stClone(S) { return JSON.parse(JSON.stringify(S)); }
function stName(i) { return String.fromCharCode(65 + i); }

function stInit(modelId, n) {
  return { model: stModel(modelId).id, step: 0, cs: 0,
    procs: Array.from({ length: n }, (_, i) => ({ name: stName(i), state: 'new' })), queue: [] };
}
function stProc(S, name) { return S.procs.find(p => p.name === name); }

function stCandidates(S, trId) {
  const tr = ST_TRANS[trId], model = stModel(S.model);
  if (!model.trans.includes(trId)) return { ok: [], reason: `${model.name} 모델에는 ${tr.ko} 전이가 없습니다.` };
  if (trId === 'dispatch') {
    const run = S.procs.find(p => p.state === 'running');
    if (run) return { ok: [], reason: `CPU를 이미 ${run.name}가 쓰고 있습니다. CPU가 1개라 실행 상태는 하나뿐입니다.` };
    if (!S.queue.length) return { ok: [], reason: '준비 큐가 비어 있습니다.' };
    return { ok: [S.queue[0]], reason: '' };
  }
  const ok = S.procs.filter(p => p.state === tr.from).map(p => p.name);
  return { ok, reason: ok.length ? '' : `${ST_STATES[tr.from].ko} 상태인 프로세스가 없습니다.` };
}

function stApply(S, trId, name) {
  const tr = ST_TRANS[trId], N = stClone(S), p = stProc(N, name);
  if (!p || p.state !== tr.from) throw new Error('invalid transition ' + trId + ' ' + name);
  if (tr.from === 'ready') N.queue = N.queue.filter(x => x !== name);
  if (tr.to === 'ready') N.queue.push(name);
  p.state = tr.to;
  N.step++;
  if (tr.cs) N.cs++;
  return { S: N, entry: { step: N.step, name, trId, from: tr.from, to: tr.to } };
}

function stAddProc(S) {
  const N = stClone(S), name = stName(N.procs.length);
  N.procs.push({ name, state: 'new' });
  N.step++;
  return { S: N, entry: { step: N.step, name, trId: 'create', from: null, to: 'new' } };
}

// 자동 진행용 가중치: CPU가 비면 디스패치를 우선하고, 종료는 너무 빨리 일어나지 않게 한다
const ST_WEIGHT = { admit: 2, dispatch: 6, timeout: 3, block: 2, wakeup: 2.5, exit: 1.2,
  outReady: 0.6, inReady: 1, outBlock: 0.6, inBlock: 0.8, sWakeup: 1 };
function stRandomEvent(S, rand = Math.random) {
  const opts = stModel(S.model).trans.map(id => ({ id, c: stCandidates(S, id).ok })).filter(o => o.c.length);
  if (!opts.length) return null;
  const total = opts.reduce((s, o) => s + ST_WEIGHT[o.id], 0);
  let r = rand() * total, pick = opts[opts.length - 1];
  for (const o of opts) { r -= ST_WEIGHT[o.id]; if (r < 0) { pick = o; break; } }
  return { trId: pick.id, name: pick.c[Math.floor(rand() * pick.c.length)] };
}

function stScenario(modelId, n, steps, rand = Math.random) {
  const frames = [stInit(modelId, n)], log = [];
  for (let i = 0; i < steps; i++) {
    const ev = stRandomEvent(frames[frames.length - 1], rand);
    if (!ev) break;
    const r = stApply(frames[frames.length - 1], ev.trId, ev.name);
    frames.push(r.S); log.push(r.entry);
  }
  return { frames, log };
}

// ── 화면 ──
let ST = null;
const ST_SPEEDS = [{ ms: 600, name: '빠르게' }, { ms: 1200, name: '보통' }, { ms: 2000, name: '느리게' }];

function stCur() { return ST.frames[ST.frames.length - 1]; }
function stColor(name) { return SCHED_COLORS[(name.charCodeAt(0) - 65) % SCHED_COLORS.length]; }

function stateMount(root) {
  ST = { modelId: 'ts', n: 3, en: false, speed: 1200, timer: null, sel: '', frames: [], log: [], flash: null, flashNode: null, msg: null };
  root.innerHTML = `
    <div class="pr-card">
      <h3 class="pr-h">⚙️ 설정</h3>
      <div class="pr-f" style="margin-bottom:12px">상태 전이 모델<div class="pr-seg" id="st-models"></div></div>
      <div class="pr-row">
        <label class="pr-f">처음 프로세스 수
          <select id="st-n" onchange="ST.n = +this.value; stReset()">${[1, 2, 3, 4].map(n => `<option value="${n}" ${n === 3 ? 'selected' : ''}>${n}개</option>`).join('')}</select></label>
        <label class="pr-f">자동 재생 속도
          <select id="st-speed" onchange="stSetSpeed(+this.value)">${ST_SPEEDS.map(s => `<option value="${s.ms}" ${s.ms === 1200 ? 'selected' : ''}>${s.name}</option>`).join('')}</select></label>
        <label class="pr-chk"><input type="checkbox" id="st-en" onchange="ST.en = this.checked; stRender()"> 영어 표기 함께 보기</label>
        <button class="pr-btn ghost" onclick="stReset()">↺ 처음부터</button>
      </div>
      <div class="pr-sub" id="st-model-desc"></div>
    </div>
    <div id="st-main"></div>`;
  stRenderModels();
  stReset();
}

function stRenderModels() {
  document.getElementById('st-models').innerHTML = ST_MODELS.map(m =>
    `<button class="${m.id === ST.modelId ? 'active' : ''}" onclick="stPickModel('${m.id}')">${m.name}</button>`).join('');
  document.getElementById('st-model-desc').textContent = stModel(ST.modelId).desc;
}
function stPickModel(id) { ST.modelId = id; stRenderModels(); stReset(); }

function stReset() {
  stStop();
  ST.frames = [stInit(ST.modelId, ST.n)]; ST.log = []; ST.sel = ''; ST.flash = null; ST.flashNode = null;
  ST.msg = { kind: 'info', html: '프로세스를 고른 뒤 <b>화살표(전이)</b>나 <b>가고 싶은 상태</b>를 누르세요. 없는 전이를 누르면 왜 안 되는지 알려 줍니다.<br>▶ 자동 재생을 누르면 가능한 전이가 무작위로 이어집니다.' };
  stRender();
}

function stSetSpeed(ms) { ST.speed = ms; if (ST.timer) { stStop(); stToggleAuto(); } }
function stStop() { if (ST && ST.timer) { clearInterval(ST.timer); ST.timer = null; } }
function stToggleAuto() {
  if (ST.timer) { stStop(); stRender(); return; }
  ST.timer = setInterval(stTick, ST.speed);
  stTick();
}
function stTick() {
  if (!document.getElementById('st-svg')) { stStop(); return; }   // 다른 화면으로 나가면 멈춘다
  const ev = stRandomEvent(stCur());
  if (!ev) { stStop(); ST.msg = { kind: 'info', html: '모든 프로세스가 종료되었습니다. <b>+ 프로세스 생성</b>으로 새 프로세스를 만들거나 처음부터 다시 시작하세요.' }; stRender(); return; }
  stDo(ev.trId, ev.name);
}

function stDo(trId, name) {
  const r = stApply(stCur(), trId, name);
  ST.frames.push(r.S); ST.log.push(r.entry);
  const tr = ST_TRANS[trId], f = ST_STATES[tr.from], t = ST_STATES[tr.to];
  ST.flash = trId; ST.flashNode = tr.to; ST.sel = name;
  ST.msg = { kind: 'ok', html: `<b>${name}</b>: ${f.ko} → ${t.ko} · <b>${tr.ko}</b> (${tr.en})<br>${escHtml(tr.cause)}` +
    (tr.cs ? '<br>※ <b>문맥 교환</b>: 실행 중이던 상태(레지스터 · PC 등)를 PCB에 저장하고, 다음에 디스패치되는 프로세스의 PCB를 복원합니다.' : '') };
  stRender();
}

function stBad(html) { ST.msg = { kind: 'bad', html }; ST.flash = null; ST.flashNode = null; stRender(); }

// 화살표/전이 버튼 클릭. forced: 상태 노드 클릭처럼 대상 프로세스가 정해진 경우
function stAct(trId, forced) {
  const S = stCur(), tr = ST_TRANS[trId], c = stCandidates(S, trId);
  if (!c.ok.length) return stBad(`<b>${tr.ko}</b> 불가: ${escHtml(c.reason)}`);
  let name;
  if (tr.pick === 'head') {
    name = c.ok[0];
    if (forced && forced !== name) return stBad(`<b>${forced}</b>는 디스패치할 수 없습니다. 준비 큐 맨 앞은 <b>${name}</b>입니다. (준비 큐 순서대로 = FCFS 가정)`);
  } else if (forced) {
    name = forced;
  } else if (ST.sel && c.ok.includes(ST.sel)) {
    name = ST.sel;
  } else if (c.ok.length === 1) {
    name = c.ok[0];
  } else {
    return stBad(`${ST_STATES[tr.from].ko} 상태 프로세스가 여러 개입니다 (${c.ok.join(', ')}). 위에서 프로세스를 먼저 고르세요.` +
      (ST.sel ? `<br>지금 고른 <b>${ST.sel}</b>는 ${ST_STATES[stProc(S, ST.sel).state].ko} 상태입니다.` : ''));
  }
  stStop();
  stDo(trId, name);
}

// 상태 노드 클릭: 프로세스를 골랐으면 그 상태로 옮기기 시도, 아니면 상태 설명
function stNodeClick(to) {
  const S = stCur(), model = stModel(S.model), st = ST_STATES[to];
  const p = ST.sel ? stProc(S, ST.sel) : null;
  if (!p || p.state === to) {
    ST.msg = { kind: 'info', html: `<b>${st.ko}</b> (${st.en})<br>${escHtml(st.desc)}` };
    ST.flash = null; ST.flashNode = null;
    return stRender();
  }
  const trId = model.trans.find(id => ST_TRANS[id].from === p.state && ST_TRANS[id].to === to);
  if (!trId) return stBad(`<b>${p.name}</b>: ${ST_STATES[p.state].ko} → ${st.ko} 불가<br>${escHtml(stWhyNot(p.state, to, model))}`);
  stAct(trId, p.name);
}

function stSelect(name) {
  ST.sel = ST.sel === name ? '' : name;
  const p = ST.sel ? stProc(stCur(), ST.sel) : null;
  if (p) {
    const model = stModel(stCur().model);
    const next = model.trans.filter(id => ST_TRANS[id].from === p.state)
      .map(id => `${ST_TRANS[id].ko}(→ ${ST_STATES[ST_TRANS[id].to].ko})`);
    ST.msg = { kind: 'info', html: `<b>${p.name}</b>는 지금 <b>${ST_STATES[p.state].ko}</b> 상태입니다. ` +
      (next.length ? '갈 수 있는 전이: ' + next.join(', ') : '더 이상 갈 수 있는 상태가 없습니다.') };
  }
  ST.flash = null; ST.flashNode = null;
  stRender();
}

function stAdd() {
  const S = stCur();
  if (S.procs.length >= 6) return stBad('프로세스는 최대 6개까지 만들 수 있습니다.');
  const r = stAddProc(S);
  ST.frames.push(r.S); ST.log.push(r.entry);
  ST.sel = r.entry.name; ST.flash = null; ST.flashNode = 'new';
  ST.msg = { kind: 'ok', html: `<b>${r.entry.name}</b> 생성 · ${escHtml(ST_STATES.new.desc)}` };
  stRender();
}

function stUndo() {
  if (ST.frames.length <= 1) return;
  stStop();
  ST.frames.pop(); ST.log.pop();
  ST.flash = null; ST.flashNode = null;
  if (ST.sel && !stProc(stCur(), ST.sel)) ST.sel = '';
  ST.msg = { kind: 'info', html: '한 단계 되돌렸습니다.' };
  stRender();
}

function stStep() {
  stStop();
  const ev = stRandomEvent(stCur());
  if (!ev) return stBad('지금 가능한 전이가 없습니다. 모든 프로세스가 종료되었습니다.');
  stDo(ev.trId, ev.name);
}

// 화살표 좌표: 두 노드 중심을 잇고, 노드 테두리에서 자른다. off만큼 진행 방향 오른쪽으로 평행 이동
function stEdgeGeom(tr) {
  const a = ST_STATES[tr.from], b = ST_STATES[tr.to];
  const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  const px = -uy, py = ux, o = tr.off || 0;
  const cut = Math.min(Math.abs(ux) < 1e-9 ? Infinity : (ST_W / 2) / Math.abs(ux), Math.abs(uy) < 1e-9 ? Infinity : (ST_H / 2) / Math.abs(uy));
  const x1 = a.x + px * o + ux * (cut + 3), y1 = a.y + py * o + uy * (cut + 3);
  const x2 = b.x + px * o - ux * (cut + 7), y2 = b.y + py * o - uy * (cut + 7);
  const s = tr.flip ? -1 : 1, d = o + 14;
  const lt = tr.lt === undefined ? 0.5 : tr.lt;
  const lx = x1 + (x2 - x1) * lt + px * d * s, ly = y1 + (y2 - y1) * lt + py * d * s;
  const qx = px * s, qy = py * s;
  return { x1, y1, x2, y2, lx, ly, anchor: qx > 0.5 ? 'start' : qx < -0.5 ? 'end' : 'middle', below: qy > 0.5, above: qy < -0.5 };
}

function stSvg(S) {
  const model = stModel(S.model);
  const maxY = Math.max(...model.states.map(s => ST_STATES[s].y)) + ST_H / 2 + 14;
  const edges = model.trans.map(id => {
    const tr = ST_TRANS[id], g = stEdgeGeom(tr);
    const on = stCandidates(S, id).ok.length > 0;
    const cls = 'st-edge' + (on ? '' : ' off') + (ST.flash === id ? ' flash' : '');
    const ty = g.ly + (g.below ? 10 : g.above ? (ST.en ? -17 : -4) : 4);
    const label = `<text x="${g.lx}" y="${ty}" text-anchor="${g.anchor}">${tr.ko}${ST.en ? `<tspan class="en" x="${g.lx}" dy="13">${tr.en}</tspan>` : ''}</text>`;
    return `<g class="${cls}" onclick="stAct('${id}')"><title>${tr.ko} (${tr.en}): ${tr.cause}</title>
      <line class="line" x1="${g.x1}" y1="${g.y1}" x2="${g.x2}" y2="${g.y2}" marker-end="url(#st-arr${on ? '' : '-off'})"/>
      <line class="hit" x1="${g.x1}" y1="${g.y1}" x2="${g.x2}" y2="${g.y2}"/>${label}</g>`;
  }).join('');
  const selP = ST.sel ? stProc(S, ST.sel) : null;
  const nodes = model.states.map(id => {
    const st = ST_STATES[id];
    const ps = id === 'ready' ? S.queue.map(n => stProc(S, n)) : S.procs.filter(p => p.state === id);
    const x0 = st.x - (ps.length - 1) * 10;
    const toks = ps.map((p, i) => `<g class="st-tok" onclick="event.stopPropagation(); stSelect('${p.name}')">
      <circle cx="${x0 + i * 20}" cy="${st.y + 13}" r="9" fill="${stColor(p.name)}" ${ST.sel === p.name ? 'stroke="#1e293b" stroke-width="3"' : ''}/>
      <text x="${x0 + i * 20}" y="${st.y + 17}" text-anchor="middle">${p.name}</text></g>`).join('');
    const target = selP && selP.state !== id && model.trans.some(t => ST_TRANS[t].from === selP.state && ST_TRANS[t].to === id);
    return `<g class="st-node${ST.flashNode === id ? ' flash' : ''}${target ? ' target' : ''}" onclick="stNodeClick('${id}')"><title>${st.ko}: ${st.desc}</title>
      <rect x="${st.x - ST_W / 2}" y="${st.y - ST_H / 2}" width="${ST_W}" height="${ST_H}" rx="14" stroke="${st.color}"/>
      <text x="${st.x}" y="${st.y - (ST.en ? 12 : 8)}" text-anchor="middle" fill="${st.color}">${st.ko}</text>
      ${ST.en ? `<text class="en" x="${st.x}" y="${st.y}" text-anchor="middle">${st.en}</text>` : ''}${toks}</g>`;
  }).join('');
  const arrow = (id, c) => `<marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${c}"/></marker>`;
  return `<svg class="st-svg" id="st-svg" viewBox="0 0 800 ${maxY}">
    <defs>${arrow('st-arr', '#64748b')}${arrow('st-arr-off', '#cbd5e1')}</defs>${edges}${nodes}</svg>`;
}

function stRender() {
  const S = stCur(), model = stModel(S.model);
  const run = S.procs.find(p => p.state === 'running');
  const list = st => S.procs.filter(p => p.state === st);
  const box = p => `<div class="box" style="background:${stColor(p.name)}">${p.name}</div>`;
  const strip = (ps, empty) => `<div class="st-q">${ps.length ? ps.map(box).join('') : `<span class="empty">${empty}</span>`}</div>`;
  const panels = [
    `<div class="st-panel"><b>CPU (실행)</b>${strip(run ? [run] : [], '비어 있음 → 디스패치 가능')}</div>`,
    `<div class="st-panel"><b>준비 큐 <small style="font-weight:500">맨 앞 → 맨 뒤</small></b>${strip(S.queue.map(n => stProc(S, n)), '비어 있음')}</div>`,
  ];
  if (model.states.includes('blocked')) panels.push(`<div class="st-panel"><b>대기 (입출력 · 이벤트)</b>${strip(list('blocked'), '없음')}</div>`);
  if (model.states.includes('sready')) panels.push(`<div class="st-panel"><b>중단 (디스크, 메모리 반납)</b>${strip([...list('sready'), ...list('sblocked')], '없음')}
    ${list('sready').length || list('sblocked').length ? `<div class="pr-sub">중단 준비: ${list('sready').map(p => p.name).join(', ') || '-'} · 중단 대기: ${list('sblocked').map(p => p.name).join(', ') || '-'}</div>` : ''}</div>`);
  panels.push(`<div class="st-panel"><b>통계</b><div class="pr-sub">진행 ${S.step}단계 · 문맥 교환 ${S.cs}회 · 종료 ${list('exit').length} / ${S.procs.length}</div></div>`);

  const trBtns = model.trans.map(id => {
    const tr = ST_TRANS[id], c = stCandidates(S, id);
    return `<button ${c.ok.length ? '' : 'disabled'} title="${escHtml(c.ok.length ? '대상: ' + c.ok.join(', ') : c.reason)}" onclick="stAct('${id}')">${tr.ko} <small style="font-weight:500">${ST_STATES[tr.from].ko}→${ST_STATES[tr.to].ko}</small></button>`;
  }).join('');

  // 상태 타임라인: 행 = 프로세스, 열 = 단계
  const tl = `<table class="pr-table st-tl"><tr><th>단계</th>${ST.frames.map((_, i) => `<th>${i}</th>`).join('')}</tr>
    ${S.procs.map(p => `<tr><td class="pname" style="color:${stColor(p.name)}">${p.name}</td>${ST.frames.map(F => {
      const q = stProc(F, p.name);
      return q ? `<td class="c" style="background:${ST_STATES[q.state].color}">${ST_STATES[q.state].ko}</td>` : '<td class="none">-</td>';
    }).join('')}</tr>`).join('')}</table>`;

  const logHtml = ST.log.length ? ST.log.map(e => e.trId === 'create'
    ? `${e.step}. ${e.name} 생성`
    : `${e.step}. ${e.name}: ${ST_STATES[e.from].ko} → ${ST_STATES[e.to].ko} [${ST_TRANS[e.trId].ko}]${ST_TRANS[e.trId].cs ? ' · 문맥 교환' : ''}`).join('\n') : '아직 전이가 없습니다.';

  document.getElementById('st-main').innerHTML = `
    <div class="pr-card">
      <h3 class="pr-h">🔀 ${model.name} 상태 전이도</h3>
      <div class="pr-palette">
        ${S.procs.map(p => `<button class="pr-pal ${ST.sel === p.name ? 'sel' : ''}" style="background:${stColor(p.name)}" onclick="stSelect('${p.name}')">${p.name} · ${ST_STATES[p.state].ko}</button>`).join('')}
        <button class="pr-btn ghost" style="padding:6px 12px;font-size:12px" onclick="stAdd()">+ 프로세스 생성</button>
      </div>
      ${stSvg(S)}
      ${ST.msg ? `<div class="st-msg ${ST.msg.kind}">${ST.msg.html}</div>` : ''}
      <div class="pr-actions">
        <button class="pr-btn indigo" onclick="stToggleAuto()">${ST.timer ? '⏸ 멈춤' : '▶ 자동 재생'}</button>
        <button class="pr-btn" onclick="stStep()">⏭ 무작위 한 단계</button>
        <button class="pr-btn ghost" onclick="stUndo()" ${ST.frames.length > 1 ? '' : 'disabled'}>↶ 되돌리기</button>
      </div>
      <div class="pr-f" style="margin-top:14px">전이 버튼 <small style="font-weight:500;color:#64748b">회색 = 지금 불가능 (마우스를 올리면 이유)</small><div class="pr-seg">${trBtns}</div></div>
    </div>
    <div class="pr-card"><div class="st-grid">${panels.join('')}</div></div>
    <div class="pr-card">
      <h3 class="pr-h">📈 상태 타임라인</h3>
      <div class="pr-tablewrap">${tl}</div>
      <h3 class="pr-h" style="margin-top:14px">📝 전이 기록</h3>
      <div class="pr-log">${logHtml}</div>
    </div>`;
}

registerPractice({
  id: 'state', subject: '운영체제', icon: '🔀', title: '프로세스 상태 전이 보기',
  desc: '일괄 처리 · 시분할 · 중단 상태 모델에서 프로세스가 생성 → 준비 → 실행 → 대기 → 종료로 흘러가는 과정을 직접 움직여 보세요',
  mount: stateMount,
});
