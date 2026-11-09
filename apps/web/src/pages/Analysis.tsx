// 📊 오답 분석 (시험별, 서버 데이터) + 📌 다시 풀 목록 + 틀린 문제 다시 풀기(partial)
import { useEffect, useState } from 'preact/hooks';
import type { Analysis, Exam } from '@quiz/core';
import { api } from '../api.ts';
import { manifest, toast } from '../state.ts';
import { navigate } from '../lib/router.ts';
import { subjectHome } from '../lib/nav.ts';
import { fmtDate, pct, unitSort } from '../lib/util.ts';
import { Page, Spinner, ErrorBox, useAsync } from '../components/common.tsx';
import { Player, answerText, type PlayItem } from '../components/Player.tsx';
import { resolveItems } from './Play.tsx';

function Bar({ rate }: { rate: number }) {
  return <span class="weak-bar" style={{ display: 'inline-block', width: 90, verticalAlign: 'middle' }}><div style={{ width: Math.round(rate * 100) + '%' }} /></span>;
}

export function AnalysisPage({ subject, exam }: { subject: string; exam: Exam }) {
  const r = useAsync(() => api.analysis(subject, exam), [subject, exam]);
  const [play, setPlay] = useState<{ title: string; items: PlayItem[] } | null>(null);
  const [texts, setTexts] = useState<Map<string, PlayItem>>(new Map());
  const [pins, setPins] = useState<Set<string>>(new Set());
  const back = subjectHome(manifest.value, subject, exam);
  const a: Analysis | null = r.data;

  useEffect(() => {
    if (!a) return;
    setPins(new Set(a.pinned));
    const refs = a.items.filter((x) => x.wrong > 0 || a.pinned.includes(x.itemId)).map((x) => ({ itemId: x.itemId, setPath: x.setPath }));
    resolveItems(refs).then((list) => setTexts(new Map(list.map((it) => [it.itemId, it]))), () => { /* 문항 글 없이 표시 */ });
  }, [a]);

  if (play) return <Player key={play.title + play.items.length} title={play.title} subtitle={exam} items={play.items}
    session={{ kind: 'partial', subject, exam }} backLabel="오답 분석" onBack={() => { setPlay(null); r.reload(); }} />;
  if (r.loading) return <Spinner />;
  if (r.error || !a) return <Page><ErrorBox error={r.error || '오답 분석을 불러오지 못했습니다.'} onRetry={r.reload} /></Page>;

  const wrongNow = a.items.filter((x) => !x.lastOk);
  const startPlay = async (title: string, refs: { itemId: string; setPath: string }[]) => {
    if (!refs.length) return toast('풀 문항이 없습니다.', 'info');
    const items = await resolveItems(refs);
    if (!items.length) return toast('문항을 찾지 못했습니다(세트가 바뀌었거나 지워졌을 수 있어요).', 'err');
    setPlay({ title, items });
  };
  const togglePin = async (itemId: string) => {
    const on = !pins.has(itemId);
    try { await api.setPins(subject, [itemId], on); const n = new Set(pins); if (on) n.add(itemId); else n.delete(itemId); setPins(n); }
    catch (e) { toast((e as Error).message, 'err'); }
  };
  const clearPins = async () => {
    if (!pins.size || !confirm('다시 풀 목록을 비울까요?')) return;
    try { await api.setPins(subject, [...pins], false); setPins(new Set()); } catch (e) { toast((e as Error).message, 'err'); }
  };
  const reset = async () => {
    if (!confirm(`${subject} ${exam} 오답 분석 기록을 지금부터 새로 시작할까요? (리더보드 · 복습 기록은 그대로입니다)`)) return;
    try { await api.resetAnalysis(subject, exam); toast('오답 분석을 새로 시작합니다.', 'ok'); r.reload(); } catch (e) { toast((e as Error).message, 'err'); }
  };
  const itemsSorted = a.items.filter((x) => x.wrong > 0).sort((x, y) => y.wrong - x.wrong || y.wrong / y.n - x.wrong / x.n).slice(0, 50);
  const pinRefs = a.items.filter((x) => pins.has(x.itemId)).map((x) => ({ itemId: x.itemId, setPath: x.setPath }));
  const totalN = a.units.reduce((s, u) => s + u.n, 0), totalW = a.units.reduce((s, u) => s + u.wrong, 0);

  return (
    <Page>
      <nav class="crumbs"><a href={back}>← {subject} {exam}</a></nav>
      <h1>📊 오답 분석</h1>
      <p class="lead">{subject} · {exam} · 지금까지 {totalN}문항 풀이, 오답률 {pct(totalW, totalN)}%</p>
      <div class="btn-row" style={{ marginBottom: 16 }}>
        <button class="btn purple" disabled={!wrongNow.length} onClick={() => startPlay(`${subject} 틀린 문제 다시 풀기`, wrongNow.map((x) => ({ itemId: x.itemId, setPath: x.setPath })))}>❌ 최근에 틀린 {wrongNow.length}문제 다시 풀기</button>
        <button class="btn" disabled={!pinRefs.length} onClick={() => startPlay(`${subject} 📌 다시 풀 목록`, pinRefs)}>📌 다시 풀 목록 풀기 ({pinRefs.length})</button>
        <button class="btn ghost" disabled={!pins.size} onClick={clearPins}>📌 목록 비우기</button>
        <button class="btn ghost" onClick={reset}>↺ 오답 분석 새로 시작</button>
      </div>
      {!totalN && <div class="banner info">아직 기록이 없습니다. 세트를 끝까지 풀면 기록이 쌓입니다.</div>}

      {a.units.length > 0 && <div class="panel weak-box">
        <h3>장별 오답률</h3>
        <table class="weak-hist"><thead><tr><th>장</th><th>오답률</th><th>틀림 / 풀이</th></tr></thead><tbody>
          {[...a.units].sort((x, y) => unitSort(x.unit, y.unit)).map((u) => <tr key={u.unit}><td>{u.unit}</td><td><Bar rate={u.n ? u.wrong / u.n : 0} /> {pct(u.wrong, u.n)}%</td><td>{u.wrong} / {u.n}</td></tr>)}
        </tbody></table>
      </div>}

      {a.categories.length > 0 && <div class="panel weak-box">
        <h3>범위(category)별 오답률</h3>
        <table class="weak-hist"><thead><tr><th>범위</th><th>장</th><th>오답률</th><th>틀림 / 풀이</th></tr></thead><tbody>
          {[...a.categories].sort((x, y) => y.wrong / (y.n || 1) - x.wrong / (x.n || 1)).map((c) => <tr key={c.category}><td>{c.category}</td><td>{c.unit}</td><td><Bar rate={c.n ? c.wrong / c.n : 0} /> {pct(c.wrong, c.n)}%</td><td>{c.wrong} / {c.n}</td></tr>)}
        </tbody></table>
      </div>}

      {itemsSorted.length > 0 && <div class="panel weak-box">
        <h3>자주 틀린 문제</h3>
        {itemsSorted.map((x) => {
          const it = texts.get(x.itemId);
          return (
            <div key={x.itemId} class="weak-q">
              <div class="q">{it ? it.question : <span class="muted">{x.itemId}</span>}</div>
              {it && <div class="a">정답: {answerText(it)}</div>}
              {it?.explanation && <div class="ex">{it.explanation}</div>}
              <div class="muted" style={{ marginTop: 2 }}>{x.category} · {x.unit} · 틀림 {x.wrong} / 풀이 {x.n} · 마지막 {x.lastOk ? '✅' : '❌'} {fmtDate(x.at)}
                {' '}<button class={'mini' + (pins.has(x.itemId) ? ' on' : '')} onClick={() => togglePin(x.itemId)}>📌</button></div>
            </div>
          );
        })}
      </div>}

      {a.sets.length > 0 && <div class="panel weak-box">
        <h3>세트별 기록</h3>
        <table class="weak-hist"><thead><tr><th>세트</th><th>최근 점수</th><th>풀이 횟수</th><th>마지막</th></tr></thead><tbody>
          {a.sets.map((s) => { const lr = s.runs[s.runs.length - 1]; return <tr key={s.setPath}><td>{s.title}</td><td>{lr ? `${lr.score} / ${lr.total}` : '-'}</td><td>{s.runs.length}</td><td>{fmtDate(lr?.at)}</td></tr>; })}
        </tbody></table>
      </div>}
      <p class="muted">이 화면의 다시 풀기는 부분 풀이로 기록되어 오답 분석에만 반영됩니다(리더보드 · 복습 제외).</p>
      <p class="muted"><a href="#" onClick={(e) => { e.preventDefault(); navigate(back); }}>← {subject} {exam}로 돌아가기</a></p>
    </Page>
  );
}
