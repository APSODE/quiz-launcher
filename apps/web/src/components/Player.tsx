// 문제 풀이 화면 (기존 실행기 renderPlayer · renderResult 동작을 옮김).
// 세트를 끝까지 풀었을 때만 세션을 보낸다(설계 5.1). session 이 null 이면 미리보기(기록 안 함).
import { useEffect, useRef, useState } from 'preact/hooks';
import type { Exam, Item, RawAnswer, SessionKind, SessionResult } from '@quiz/core';
import { gradeAnswer } from '@quiz/core';
import { submitSessionQueued, api, ApiError } from '../api.ts';
import { catStyle, pct } from '../lib/util.ts';
import { keyAction, keyEventUsable, enterUsable, keyHintText, type KeyAct } from '../lib/keys.ts';
import { ItemExtras } from './ItemExtras.tsx';
import { toast } from '../state.ts';

export type PlayItem = Item & { setPath: string };
export interface SessionCtx { kind: SessionKind; subject: string; exam: Exam; setPath?: string; reviewBatchId?: number }

interface Props {
  title: string;
  subtitle?: string;
  items: PlayItem[];
  session: SessionCtx | null;
  backLabel?: string;
  onBack: () => void;
}

interface Run { items: PlayItem[]; session: SessionCtx | null; label: string; startedAt: number; id: string }
interface St { idx: number; raws: RawAnswer[]; oks: boolean[]; revealed: boolean; selected: RawAnswer; input: string; showHint: boolean; finished: boolean }
const fresh = (): St => ({ idx: 0, raws: [], oks: [], revealed: false, selected: null, input: '', showHint: false, finished: false });

function KeyHint({ act }: { act: KeyAct }) { const t = keyHintText(act); return t ? <span class="key-hint">{t}</span> : null; }

export function answerText(q: Item): string {
  if (q.type === 'ox') return q.answer ? 'O' : 'X';
  if (q.type === 'choice') return q.answerIndex != null && q.answerIndex >= 0 && q.choices ? `${q.answerIndex + 1}. ${q.choices[q.answerIndex]}` : '(정답 오류)';
  return (q.answers && q.answers[0]) || '';
}
function rawText(q: Item, raw: RawAnswer): string {
  if (raw === null || raw === undefined || raw === '') return '(미입력)';
  if (q.type === 'ox') return raw ? 'O' : 'X';
  if (q.type === 'choice' && typeof raw === 'number' && q.choices) return `${raw + 1}. ${q.choices[raw] ?? ''}`;
  return String(raw);
}

export function Player({ title, subtitle, items, session, backLabel, onBack }: Props) {
  const [run, setRun] = useState<Run>(() => ({ items, session, label: title, startedAt: Date.now(), id: crypto.randomUUID() }));
  const [st, setSt] = useState<St>(fresh);
  const [saved, setSaved] = useState<{ state: 'idle' | 'saving' | 'saved' | 'queued' | 'error'; result?: SessionResult; error?: string }>({ state: 'idle' });
  const [pinned, setPinned] = useState<Set<string>>(new Set());
  const stRef = useRef(st); stRef.current = st;
  const runRef = useRef(run); runRef.current = run;
  const shortRef = useRef<HTMLTextAreaElement>(null);

  const total = run.items.length;
  const q = run.items[st.idx];

  const answer = (raw: RawAnswer) => {
    const s = stRef.current, cur = runRef.current.items[s.idx];
    if (s.revealed || s.finished || !cur) return;
    const ok = gradeAnswer(cur, raw);
    setSt({ ...s, revealed: true, selected: raw, raws: [...s.raws, raw], oks: [...s.oks, ok] });
  };
  const next = () => {
    const s = stRef.current;
    if (!s.revealed) return;
    const idx = s.idx + 1;
    if (idx >= runRef.current.items.length) { setSt({ ...s, finished: true }); finish(s); }
    else setSt({ ...s, idx, revealed: false, selected: null, input: '', showHint: false });
  };
  const finish = async (s: St) => {
    const r = runRef.current;
    if (!r.session) return;
    setSaved({ state: 'saving' });
    try {
      const res = await submitSessionQueued({
        clientSessionId: r.id, kind: r.session.kind, subject: r.session.subject, exam: r.session.exam,
        setPath: r.session.kind === 'set' ? r.session.setPath : undefined,
        reviewBatchId: r.session.kind === 'review' ? r.session.reviewBatchId : undefined,
        startedAt: r.startedAt, finishedAt: Date.now(),
        answers: r.items.map((it, i) => ({ itemId: it.itemId, raw: s.raws[i] ?? null })),
      });
      setSaved(res ? { state: 'saved', result: res } : { state: 'queued' });
    } catch (e) {
      setSaved({ state: 'error', error: e instanceof ApiError ? e.message : String(e) });
    }
    api.pins(r.session.subject).then((p) => setPinned(new Set(p)), () => { /* 무시 */ });
  };
  const restart = (list: PlayItem[], kind: SessionKind, label: string) => {
    const base = runRef.current.session;
    setRun({ items: list, session: base ? { kind, subject: base.subject, exam: base.exam, setPath: kind === 'set' ? base.setPath : undefined } : null, label, startedAt: Date.now(), id: crypto.randomUUID() });
    setSt(fresh()); setSaved({ state: 'idle' });
    window.scrollTo(0, 0);
  };
  const restartSame = () => {
    const r = runRef.current;
    // 세트는 다시 다 풀면 다시 반영된다. 복습 · 부분 풀이를 다시 풀면 부분 풀이(partial)로 기록
    restart(r.items, r.session?.kind === 'set' ? 'set' : 'partial', r.label);
  };
  const retryWrong = () => {
    const r = runRef.current, s = stRef.current;
    const wrong = r.items.filter((_, i) => !s.oks[i]);
    if (wrong.length) restart(wrong, 'partial', r.label + ' · 틀린 문제');
  };
  const togglePin = async (itemId: string) => {
    const r = runRef.current; if (!r.session) return;
    const on = !pinned.has(itemId);
    try {
      await api.setPins(r.session.subject, [itemId], on);
      const n = new Set(pinned); if (on) n.add(itemId); else n.delete(itemId); setPinned(n);
    } catch (e) { toast((e as Error).message, 'err'); }
  };

  // 단축키 · Enter
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = stRef.current, cur = runRef.current.items[s.idx];
      if (e.key === 'Enter') {
        if (!enterUsable(e)) return;
        if (s.finished) { e.preventDefault(); restartSame(); }
        else if (s.revealed) { e.preventDefault(); next(); }
        else if (cur && cur.type === 'short') {
          e.preventDefault();
          if (s.input.trim()) answer(s.input); else shortRef.current?.focus();
        }
        return;
      }
      if (!keyEventUsable(e) || s.finished || s.revealed || !cur) return;
      const act = keyAction(e.code); if (!act) return;
      if (cur.type === 'ox' && (act === 'o' || act === 'x')) { e.preventDefault(); answer(act === 'o'); }
      else if (cur.type === 'choice' && act[0] === 'c') { const i = +act.slice(1) - 1; if (cur.choices && i < cur.choices.length) { e.preventDefault(); answer(i); } }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (q && q.type === 'short' && !st.revealed) shortRef.current?.focus(); }, [st.idx, st.revealed, run]); // eslint-disable-line

  if (!total) return <div class="player-wrap"><div class="result-card">문항이 없습니다.<button class="primary-btn" style={{ marginTop: 16 }} onClick={onBack}>돌아가기</button></div></div>;

  if (st.finished) {
    const score = st.oks.filter(Boolean).length;
    const p = pct(score, total);
    const grade = p >= 90 ? '🏆 완벽합니다!' : p >= 70 ? '👍 잘 하셨습니다!' : p >= 50 ? '📚 조금 더 복습이 필요합니다.' : '💪 개념을 다시 정리해 보세요.';
    const wrongN = st.oks.filter((x) => !x).length;
    const order = run.items.map((it, i) => ({ it, i })).sort((a, b) => Number(st.oks[a.i]) - Number(st.oks[b.i]));
    return (
      <div class="player-wrap">
        <button class="back-btn" onClick={onBack}>← {backLabel || '돌아가기'}</button>
        <div class="result-card wide">
          <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
          <div class="result-sub">{run.label}{subtitle ? ' · ' + subtitle : ''}</div>
          <div class="result-title">최종 결과</div>
          <div class="result-score-box">
            <div class="result-score">{score}<span class="result-total"> / {total}</span></div>
            <div class="result-pct">{p}점</div>
          </div>
          <div class="result-grade">{grade}</div>
          <div class="answer-dots">{st.oks.map((a, i) => <div key={i} class={'answer-dot ' + (a ? 'ok' : 'ng')}>{i + 1}</div>)}</div>
          {run.session ? (
            <div class={'banner ' + (saved.state === 'error' ? 'err' : saved.state === 'queued' ? 'warn' : 'info')}>
              {saved.state === 'saving' && '기록 저장 중…'}
              {saved.state === 'saved' && (saved.result?.duplicate ? '이미 저장된 기록입니다.' : saved.result?.counted ? '✅ 기록을 저장했습니다(리더보드 · 복습에 반영).' : '✅ 기록을 저장했습니다(오답 분석에만 반영 — 부분 풀이).')}
              {saved.state === 'queued' && '📴 서버에 연결하지 못해 기록을 대기열에 두었습니다. 연결되면 자동으로 보냅니다.'}
              {saved.state === 'error' && <>⚠️ 기록이 저장되지 않았습니다: {saved.error}</>}
              {saved.state === 'saved' && saved.result && saved.result.score !== score && <div class="muted">서버 채점: {saved.result.score} / {saved.result.total}</div>}
            </div>
          ) : <div class="banner warn">미리보기 — 기록하지 않습니다.</div>}
          <div class="result-actions">
            <button class="primary-btn" onClick={restartSame}>다시 풀기</button>
            {wrongN > 0 && <button class="primary-btn purple-btn" onClick={retryWrong}>틀린 {wrongN}문제만 다시 풀기</button>}
          </div>
          <div class="wrong-list">
            {order.map(({ it, i }) => (
              <div key={it.itemId + i} class={'wrong-item' + (st.oks[i] ? ' okk' : '')}>
                <div class="q">{st.oks[i] ? '✅' : '❌'} {i + 1}. {it.question}</div>
                {it.type === 'choice' && it.choices && <div class="muted" style={{ marginTop: 2 }}>{it.choices.map((c, k) => `${k + 1}. ${c}`).join('   ')}</div>}
                <div class="a">정답: {answerText(it)}</div>
                {!st.oks[i] && <div class="mine">내 답: {rawText(it, st.raws[i])}</div>}
                {it.explanation && <div class="ex">{it.explanation}</div>}
                <div class="btn-row" style={{ marginTop: 6 }}>
                  {run.session && <button class={'mini' + (pinned.has(it.itemId) ? ' on' : '')} onClick={() => togglePin(it.itemId)}>📌 {pinned.has(it.itemId) ? '다시 풀 목록에서 빼기' : '다시 풀 목록에 넣기'}</button>}
                </div>
                <ItemExtras itemId={it.itemId} setPath={it.setPath} disabled={!run.session} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const progress = (st.idx / total) * 100;
  const barColor = q.type === 'ox' ? '#60a5fa' : q.type === 'choice' ? '#fb923c' : '#a78bfa';
  const ok = st.revealed ? st.oks[st.idx] : false;
  const last = st.idx + 1 >= total;
  const nextBtn = <button class="primary-btn" style={{ marginTop: 8 }} onClick={next}>{last ? '결과 보기' : '다음 문제 →'}</button>;
  const explain = (extra?: preact.ComponentChildren) => (
    <div class={'explanation ' + (ok ? 'correct' : 'wrong')}>
      <div class="label" style={{ color: ok ? '#15803d' : '#dc2626' }}>{ok ? '✅ 정답입니다!' : '❌ 오답입니다.'}</div>
      {extra}
      <div class="desc">{q.explanation}</div>
    </div>
  );

  let body: preact.ComponentChildren;
  if (q.type === 'ox') {
    const cls = (v: boolean) => {
      if (!st.revealed) return 'ox-btn';
      if (q.answer === v) return 'ox-btn correct';
      if (st.selected === v) return 'ox-btn wrong';
      return 'ox-btn dim';
    };
    const sub = (v: boolean) => st.revealed ? (q.answer === v ? <span class="sub">정답</span> : st.selected === v ? <span class="sub">오답</span> : null) : <KeyHint act={v ? 'o' : 'x'} />;
    body = <>
      <div class="ox-grid">
        <button class={cls(true)} disabled={st.revealed} onClick={() => answer(true)}>O{sub(true)}</button>
        <button class={cls(false)} disabled={st.revealed} onClick={() => answer(false)}>X{sub(false)}</button>
      </div>
      {st.revealed && <>{explain()}{nextBtn}</>}
    </>;
  } else if (q.type === 'choice') {
    body = <>
      <div class="choice-list">
        {(q.choices || []).map((c, i) => {
          let cls = 'choice-btn';
          if (st.revealed) cls += i === q.answerIndex ? ' correct' : i === st.selected ? ' wrong' : ' dim';
          return <button key={i} class={cls} disabled={st.revealed} onClick={() => answer(i)}>
            <span class="num">{i + 1}.</span><span>{c}</span>{!st.revealed && i < 6 && <KeyHint act={('c' + (i + 1)) as KeyAct} />}
          </button>;
        })}
      </div>
      {st.revealed && <>{explain(!ok && q.answerIndex != null && q.answerIndex >= 0 ? <div class="answer-text">정답: {answerText(q)}</div> : null)}{nextBtn}</>}
    </>;
  } else if (!st.revealed) {
    body = <>
      <textarea ref={shortRef} class="short-input" placeholder="답을 입력하세요..." value={st.input}
        onInput={(e) => setSt({ ...stRef.current, input: (e.target as HTMLTextAreaElement).value })}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); answer(stRef.current.input); } }} />
      {q.hint && String(q.hint).trim() && <>
        <button class="hint-btn" onClick={() => setSt({ ...st, showHint: !st.showHint })}>💡 힌트 보기</button>
        {st.showHint && <div class="hint-box">💡 {q.hint}</div>}
      </>}
      <button class="primary-btn purple-btn" style={{ marginTop: 12 }} onClick={() => answer(st.input)}>제출</button>
    </>;
  } else {
    body = <>
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 14px', marginTop: 16, marginBottom: 4, fontSize: 14, color: '#475569' }}>
        내 답: <strong style={{ color: '#1e293b' }}>{st.input || '(미입력)'}</strong>
      </div>
      {explain(!ok ? <div class="answer-text">정답: {answerText(q)}</div> : null)}
      {nextBtn}
    </>;
  }

  return (
    <div class="player-wrap">
      <div class="player-card">
        <div class="player-header">
          <button class="header-back" onClick={onBack} title={backLabel}>←</button>
          <div class="header-title">{run.label}{subtitle ? ' · ' + subtitle : ''}</div>
          <div class="header-progress-text">{st.idx + 1}/{total}</div>
        </div>
        <div class="progress-bar-bg"><div class="progress-bar-fill" style={{ width: progress + '%', background: barColor }} /></div>
        <div class="player-body">
          <span class="cat-badge" style={catStyle(q.category)}>{q.category}</span>
          <p class="question-text">{q.question}</p>
          {body}
          {st.revealed && <ItemExtras key={q.itemId} itemId={q.itemId} setPath={q.setPath} disabled={!run.session} />}
          <div class="score-info">현재 점수: {st.oks.filter(Boolean).length}점 / {st.oks.length}문제 완료</div>
        </div>
      </div>
    </div>
  );
}
