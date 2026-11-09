// 📝 단어 암기 테스트 (내장, 기록 없음) · 🔎 용어 확인 — 그 시험의 용어만 (기존 실행기 VT_ · memory 코드를 옮김)
import { useEffect, useRef, useState } from 'preact/hooks';
import type { Exam, Term } from '@quiz/core';
import { checkTermAnswer, normalizeTerm } from '@quiz/core';
import { api } from '../api.ts';
import { manifest } from '../state.ts';
import { subjectHome } from '../lib/nav.ts';
import { catStyle, groupColor, shuffle } from '../lib/util.ts';
import { keyAction, keyEventUsable, enterUsable, keyHintText, type KeyAct } from '../lib/keys.ts';
import { Page, Spinner, ErrorBox, useAsync } from '../components/common.tsx';

type Entry = Term & { group: string };
const MODES = [
  { id: 'choice', name: '객관식', desc: '설명을 보고 알맞은 용어를 4지선다에서 고릅니다.' },
  { id: 'type', name: '주관식', desc: '설명을 보고 용어를 직접 입력합니다. 표기가 여러 개면 어느 것이든 정답입니다.' },
  { id: 'recall', name: '나열하기', desc: '설명 없이 떠오르는 용어를 하나씩 입력해 몇 개나 기억하는지 확인합니다.' },
] as const;
type Mode = (typeof MODES)[number]['id'];

const reEsc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function mask(e: Entry): string {
  let d = String(e.desc || '');
  [...e.terms].map(String).filter((t) => t.trim().length >= 2).sort((a, b) => b.length - a.length)
    .forEach((t) => { d = d.replace(new RegExp(reEsc(t.trim()), 'gi'), '○○'); });
  return d;
}
const primary = (e: Entry) => String(e.terms[0]);
function makeOpts(e: Entry, all: Entry[]): string[] {
  const bad = new Set(e.terms.map(normalizeTerm));
  const cands = shuffle(all.filter((x) => x !== e && !x.terms.some((t) => bad.has(normalizeTerm(t)))));
  const seen = new Set([normalizeTerm(primary(e))]);
  const opts = [primary(e)];
  for (const c of cands) {
    const p = primary(c), n = normalizeTerm(p);
    if (seen.has(n)) continue;
    seen.add(n); opts.push(p);
    if (opts.length >= 4) break;
  }
  return shuffle(opts);
}
function unitsOf(list: Entry[]) {
  const m: Record<string, number> = {};
  list.forEach((e) => { m[e.group] = (m[e.group] || 0) + 1; });
  return Object.keys(m).sort((a, b) => a.localeCompare(b, 'ko', { numeric: true })).map((u) => ({ name: u, count: m[u] }));
}
function useTerms(subject: string, exam: Exam) {
  return useAsync(async () => (await api.terms(subject, exam)).filter((t) => Array.isArray(t.terms) && t.terms.length).map((t) => ({ ...t, group: t.group || t.chapter || '기타' }) as Entry), [subject, exam]);
}

interface RunItem { e: Entry; opts: string[] | null }
interface Run { mode: 'choice' | 'type'; items: RunItem[]; idx: number; score: number; results: { e: Entry; ok: boolean; answer: string }[]; revealed: boolean; selected: number | null; input: string; last: boolean | null }
interface Recall { pool: Entry[]; found: Set<Entry>; feed: { kind: 'hit' | 'dup' | 'miss'; word: string; e?: Entry }[]; miss: number; revealed: boolean }

export function VocabPage({ subject, exam }: { subject: string; exam: Exam }) {
  const t = useTerms(subject, exam);
  const back = subjectHome(manifest.value, subject, exam);
  return (
    <Page>
      <nav class="crumbs"><a href={back}>← {subject} {exam}</a></nav>
      <h1>📝 단어 암기 테스트</h1>
      <p class="lead">{subject} · {exam} 용어집으로 시험을 봅니다. 기록은 저장하지 않습니다.</p>
      {t.loading ? <Spinner /> : t.error ? <ErrorBox error={t.error} onRetry={t.reload} /> : <div class="legacy-practice"><Vocab all={t.data || []} subject={subject} /></div>}
    </Page>
  );
}

function Vocab({ all, subject }: { all: Entry[]; subject: string }) {
  const [mode, setMode] = useState<Mode>('choice');
  const [units, setUnits] = useState<Set<string>>(() => new Set(unitsOf(all).map((u) => u.name)));
  const [count, setCount] = useState(10);
  const [doMask, setDoMask] = useState(true);
  const [run, setRun] = useState<Run | null>(null);
  const [recall, setRecall] = useState<Recall | null>(null);
  const [warn, setWarn] = useState('');
  const runRef = useRef(run); runRef.current = run;
  const inputRef = useRef<HTMLInputElement>(null);

  const pool = () => all.filter((e) => units.has(e.group));
  const begin = (entries: Entry[], m: 'choice' | 'type') => {
    setRun({ mode: m, items: entries.map((e) => ({ e, opts: m === 'choice' ? makeOpts(e, all) : null })), idx: 0, score: 0, results: [], revealed: false, selected: null, input: '', last: null });
  };
  const start = () => {
    setWarn('');
    const p = pool();
    if (mode === 'recall') {
      if (!p.length) return setWarn('범위를 한 개 이상 선택해 주세요.');
      setRecall({ pool: p, found: new Set(), feed: [], miss: 0, revealed: false });
      return;
    }
    const usable = p.filter((e) => String(e.desc || '').trim());
    if (usable.length < (mode === 'choice' ? 2 : 1)) return setWarn('출제할 수 있는 용어가 부족합니다. 범위를 넓혀 주세요.');
    const n = Math.max(1, Math.min(usable.length, count || 10));
    begin(shuffle(usable).slice(0, n), mode);
  };
  const finish = (ok: boolean, answer: string, selected: number | null) => {
    const R = runRef.current!;
    setRun({ ...R, revealed: true, last: ok, score: R.score + (ok ? 1 : 0), selected, input: R.mode === 'type' ? answer : R.input, results: [...R.results, { e: R.items[R.idx].e, ok, answer }] });
  };
  const pick = (i: number) => {
    const R = runRef.current; if (!R || R.revealed || R.idx >= R.items.length) return;
    const it = R.items[R.idx];
    finish(normalizeTerm(it.opts![i]) === normalizeTerm(primary(it.e)), it.opts![i], i);
  };
  const submit = () => {
    const R = runRef.current; if (!R || R.revealed || R.idx >= R.items.length) return;
    finish(checkTermAnswer(R.input, R.items[R.idx].e), R.input, null);
  };
  const next = () => { const R = runRef.current; if (!R) return; setRun({ ...R, idx: R.idx + 1, revealed: false, selected: null, input: '', last: null }); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const R = runRef.current; if (!R || R.idx >= R.items.length) return;
      if (e.key === 'Enter') {
        if (!enterUsable(e)) return;
        if (R.revealed) { e.preventDefault(); next(); }
        else if (R.mode === 'type') { e.preventDefault(); if (R.input.trim()) submit(); else inputRef.current?.focus(); }
        return;
      }
      if (!keyEventUsable(e) || R.revealed || R.mode !== 'choice') return;
      const act = keyAction(e.code);
      if (act && act[0] === 'c') { const i = +act.slice(1) - 1; const it = R.items[R.idx]; if (it.opts && i < it.opts.length) { e.preventDefault(); pick(i); } }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { inputRef.current?.focus(); }, [run?.idx, run?.revealed, recall?.feed.length]);

  if (!all.length) return (
    <div class="pr-card">
      <h3 class="pr-h">📭 이 시험의 용어집이 없습니다</h3>
      <div class="pr-sub">용어집은 <code>{subject}/단어집/</code> 폴더의 JSX(또는 업로드 JSON의 <code>terms</code>)에서 읽습니다. 용어집 META 의 <code>exam</code> 이 이 시험과 같아야 합니다.<br />
        형식: <code>{'{ terms: ["대표 표기", "다른 표기"], group: "4장", desc: "한 줄 정의" }'}</code></div>
    </div>
  );

  // 나열하기
  if (recall) {
    const R = recall, total = R.pool.length, got = R.found.size;
    const rest = R.pool.filter((e) => !R.found.has(e));
    const add = () => {
      const el = inputRef.current; const word = (el?.value || '').trim(); if (!word) return;
      const e = R.pool.find((x) => checkTermAnswer(word, x));
      const n: Recall = { ...R, feed: [...R.feed] };
      if (!e) { n.miss++; n.feed.unshift({ kind: 'miss', word }); }
      else if (R.found.has(e)) n.feed.unshift({ kind: 'dup', word });
      else { n.found = new Set(R.found); n.found.add(e); n.feed.unshift({ kind: 'hit', word, e }); }
      if (el) el.value = '';
      setRecall(n);
    };
    return (
      <div>
        <div class="memory-stats">
          <div class="mstat"><span class="green">{got}</span>맞춘 용어</div>
          <div class="mstat"><span class="blue">{total - got}</span>남은 용어</div>
          <div class="mstat"><span class="red">{R.miss}</span>틀린 입력</div>
        </div>
        <div class="memory-input-wrap">
          <input ref={inputRef} class="memory-input" autoComplete="off" placeholder="기억나는 용어를 입력하세요..." onKeyDown={(e) => { if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); add(); } }} />
          <button class="memory-submit" onClick={add}>입력</button>
        </div>
        <div class="pr-actions" style={{ margin: '0 0 12px' }}>
          <button class="pr-btn ghost" onClick={() => setRecall({ ...R, revealed: !R.revealed })}>👀 남은 용어 보기</button>
          <button class="pr-btn ghost" onClick={() => setRecall({ pool: R.pool, found: new Set(), feed: [], miss: 0, revealed: false })}>↺ 처음부터</button>
          <button class="pr-btn ghost" onClick={() => setRecall(null)}>← 설정으로</button>
        </div>
        {R.revealed && <div class="pr-answer"><b>맞추지 못한 용어 {rest.length}개</b><br />{rest.length ? rest.map((e, i) => <span key={i} class="pr-chip">{primary(e)}</span>) : '없음 🎉'}</div>}
        <div class="memory-feed">{R.feed.map((f, i) => f.kind === 'hit'
          ? <div key={i} class="feed-item hit"><span class="feed-icon">✅</span><div><div class="feed-word">{f.word}</div><div class="feed-info"><span class="feed-chapter" style={{ background: groupColor(f.e!.group) + '22', color: groupColor(f.e!.group) }}>{f.e!.group}</span>{primary(f.e!)}{f.e!.desc ? ' — ' + f.e!.desc : ''}</div></div></div>
          : f.kind === 'dup'
            ? <div key={i} class="feed-item"><span class="feed-icon">🔁</span><div><div class="feed-word">{f.word}</div><div class="feed-info">이미 입력한 용어입니다.</div></div></div>
            : <div key={i} class="feed-item miss"><span class="feed-icon">❌</span><div><div class="feed-word">{f.word}</div><div class="feed-info" style={{ color: '#ef4444' }}>선택한 범위의 용어집에 없는 표기입니다.</div></div></div>)}
        </div>
      </div>
    );
  }

  // 객관식 · 주관식 진행
  if (run && run.idx < run.items.length) {
    const R = run, it = R.items[R.idx], e = it.e;
    return (
      <div class="pr-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span class="pr-chip">{R.mode === 'choice' ? '객관식' : '주관식'}</span>
          <span class="pr-sub">{R.idx + 1} / {R.items.length} · 현재 {R.score}점</span>
        </div>
        <div class="progress-bar-bg" style={{ borderRadius: 2, marginBottom: 14 }}><div class="progress-bar-fill" style={{ width: (R.idx / R.items.length) * 100 + '%', background: '#6366f1' }} /></div>
        <span class="cat-badge" style={catStyle(e.group)}>{e.group}</span>
        <p class="question-text">다음 설명에 해당하는 용어는?{'\n\n'}{doMask ? mask(e) : String(e.desc)}</p>
        {R.mode === 'choice' ? (
          <div class="choice-list">{it.opts!.map((o, i) => {
            let cls = 'choice-btn';
            if (R.revealed) cls += normalizeTerm(o) === normalizeTerm(primary(e)) ? ' correct' : i === R.selected ? ' wrong' : ' dim';
            const hint = i < 6 ? keyHintText(('c' + (i + 1)) as KeyAct) : '';
            return <button key={i} class={cls} disabled={R.revealed} onClick={() => pick(i)}><span class="num">{i + 1}.</span><span>{o}</span>{!R.revealed && hint && <span class="key-hint">{hint}</span>}</button>;
          })}</div>
        ) : !R.revealed && <>
          <input ref={inputRef} class="memory-input" style={{ width: '100%', marginTop: 14 }} autoComplete="off" placeholder="용어를 입력하세요..." value={R.input}
            onInput={(ev) => setRun({ ...runRef.current!, input: (ev.target as HTMLInputElement).value })}
            onKeyDown={(ev) => { if (ev.key === 'Enter' && !ev.isComposing) { ev.preventDefault(); submit(); } }} />
          <button class="primary-btn purple-btn" style={{ marginTop: 12 }} onClick={submit}>제출</button>
        </>}
        {R.revealed && <>
          <div class={'explanation ' + (R.last ? 'correct' : 'wrong')} style={{ marginTop: 12 }}>
            <div class="label" style={{ color: R.last ? '#15803d' : '#dc2626' }}>{R.last ? '✅ 정답입니다!' : '❌ 오답입니다.'}</div>
            {R.mode === 'type' && <div class="desc">내 답: {R.input || '(미입력)'}</div>}
            <div class="answer-text">정답: {primary(e)}</div>
            {e.terms.length > 1 && <div class="desc">인정 표기: {e.terms.join(' / ')}</div>}
            <div class="desc">{e.desc}</div>
          </div>
          <button class="primary-btn" onClick={next}>{R.idx + 1 >= R.items.length ? '결과 보기' : '다음 문제 →'}</button>
        </>}
        <div class="pr-actions"><button class="pr-btn ghost" onClick={() => setRun(null)}>← 설정으로</button></div>
      </div>
    );
  }

  // 결과
  if (run) {
    const R = run, n = R.items.length, p = Math.round((R.score / n) * 100);
    const wrong = R.results.filter((r) => !r.ok);
    const grade = p >= 90 ? '🏆 완벽합니다!' : p >= 70 ? '👍 잘 하셨습니다!' : p >= 50 ? '📚 조금 더 복습이 필요합니다.' : '💪 용어를 다시 정리해 보세요.';
    return (
      <div>
        <div class="pr-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40 }}>📊</div>
          <div class="result-title">단어 암기 테스트 결과</div>
          <div class="result-score-box"><div class="result-score">{R.score}<span class="result-total"> / {n}</span></div><div class="result-pct">{p}점</div></div>
          <div class="result-grade">{grade}</div>
          <div class="answer-dots">{R.results.map((r, i) => <div key={i} class={'answer-dot ' + (r.ok ? 'ok' : 'ng')}>{i + 1}</div>)}</div>
          <div class="pr-actions" style={{ justifyContent: 'center' }}>
            {wrong.length > 0 && <button class="pr-btn indigo" onClick={() => begin(shuffle(wrong.map((r) => r.e)), R.mode)}>❌ 틀린 {wrong.length}개 다시 풀기</button>}
            <button class="pr-btn" onClick={start}>🔁 같은 설정으로 새로 풀기</button>
            <button class="pr-btn ghost" onClick={() => setRun(null)}>설정으로</button>
          </div>
        </div>
        {wrong.length > 0 && <div class="pr-card"><h3 class="pr-h">틀린 용어</h3>{wrong.map((r, i) => (
          <div key={i} class="feed-item miss" style={{ marginBottom: 8, boxShadow: 'none', border: '1px solid #fee2e2' }}>
            <span class="feed-icon">❌</span>
            <div><div class="feed-word">{primary(r.e)}</div>
              <div class="feed-info">{r.e.terms.length > 1 && <>표기: {r.e.terms.join(' / ')}<br /></>}{r.e.desc}{r.answer && <><br /><span style={{ color: '#ef4444' }}>내 답: {r.answer}</span></>}</div></div>
          </div>))}</div>}
      </div>
    );
  }

  // 설정
  const us = unitsOf(all);
  const poolN = pool().length;
  return (
    <div class="pr-card">
      <h3 class="pr-h">출제 방식</h3>
      <div class="pr-actions" style={{ marginTop: 0 }}>
        {MODES.map((m) => <button key={m.id} class={'pr-btn' + (mode === m.id ? ' indigo' : ' ghost')} onClick={() => setMode(m.id)}>{m.name}</button>)}
      </div>
      <p class="pr-sub" style={{ margin: '6px 0 14px' }}>{MODES.find((m) => m.id === mode)!.desc}</p>
      <h3 class="pr-h">범위 (단원) <span class="pr-sub">· 선택 {poolN}개 / 전체 {all.length}개</span></h3>
      <div class="pr-actions" style={{ marginTop: 0 }}>
        {us.map((u) => <button key={u.name} class={'pr-btn' + (units.has(u.name) ? ' indigo' : ' ghost')} onClick={() => { const n = new Set(units); if (n.has(u.name)) n.delete(u.name); else n.add(u.name); setUnits(n); }}>{u.name} ({u.count})</button>)}
      </div>
      <div class="pr-actions">
        <button class="pr-btn ghost" onClick={() => setUnits(new Set(us.map((u) => u.name)))}>전체 선택</button>
        <button class="pr-btn ghost" onClick={() => setUnits(new Set())}>전체 해제</button>
      </div>
      {mode !== 'recall' && <div style={{ marginTop: 14, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <label class="pr-sub">문제 수 <input type="number" min={1} class="input" style={{ width: 80, display: "inline-block", padding: "4px 8px" }} value={count} onInput={(e) => setCount(parseInt((e.target as HTMLInputElement).value, 10) || 1)} /></label>
        <label class="pr-sub"><input type="checkbox" checked={doMask} onChange={(e) => setDoMask((e.target as HTMLInputElement).checked)} /> 설명 속 정답 용어 가리기(○○)</label>
      </div>}
      {warn && <p class="err-text" style={{ marginTop: 10 }}>{warn}</p>}
      <button class="primary-btn" style={{ marginTop: 16 }} onClick={start}>시작</button>
    </div>
  );
}

// 🔎 용어 확인
export function TermsPage({ subject, exam }: { subject: string; exam: Exam }) {
  const t = useTerms(subject, exam);
  const back = subjectHome(manifest.value, subject, exam);
  const [log, setLog] = useState<{ word: string; e: Entry | null }[]>([]);
  const ref = useRef<HTMLInputElement>(null);
  const norm = (s: string) => String(s).trim().toLowerCase().replace(/[.,\-_]/g, '').replace(/\s+/g, '');
  const search = (input: string): Entry | null => {
    const n = norm(input); if (!n) return null;
    const db = t.data || [];
    for (const e of db) for (const x of e.terms) if (norm(x) === n) return e;
    for (const e of db) for (const x of e.terms) { const nt = norm(x); if (nt && (nt.includes(n) || n.includes(nt))) return e; }
    return null;
  };
  const check = () => {
    const w = (ref.current?.value || '').trim(); if (!w) return;
    setLog([{ word: w, e: search(w) }, ...log]);
    if (ref.current) { ref.current.value = ''; ref.current.focus(); }
  };
  const hit = log.filter((l) => l.e).length;
  return (
    <Page>
      <nav class="crumbs"><a href={back}>← {subject} {exam}</a></nav>
      <h1>🔎 용어 확인</h1>
      <p class="lead">{subject} · {exam} 용어집({t.data?.length ?? 0}개)에 포함되는지 확인합니다.</p>
      {t.loading ? <Spinner /> : t.error ? <ErrorBox error={t.error} onRetry={t.reload} /> : <>
        <div class="memory-stats">
          <div class="mstat"><span class="blue">{log.length}</span>확인</div>
          <div class="mstat"><span class="green">{hit}</span>있음</div>
          <div class="mstat"><span class="red">{log.length - hit}</span>없음</div>
        </div>
        <div class="memory-input-wrap">
          <input ref={ref} class="memory-input" autoComplete="off" placeholder="용어를 입력하세요..." onKeyDown={(e) => { if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); check(); } }} />
          <button class="memory-submit" onClick={check}>확인</button>
        </div>
        <div class="memory-feed">{log.map((l, i) => l.e
          ? <div key={i} class="feed-item hit"><span class="feed-icon">✅</span><div><div class="feed-word">{l.word}</div><div class="feed-info"><span class="feed-chapter" style={{ background: groupColor(l.e.group) + '22', color: groupColor(l.e.group) }}>{l.e.group}</span>{l.e.terms.join(' / ')}{l.e.desc ? ' — ' + l.e.desc : ''}</div></div></div>
          : <div key={i} class="feed-item miss"><span class="feed-icon">❌</span><div><div class="feed-word">{l.word}</div><div class="feed-info">용어집에 없습니다.</div></div></div>)}
        </div>
      </>}
    </Page>
  );
}
