// 🛠 관리자: 업로드 승인 · 신고 · 별칭 후보 · 시험 범위 · 초대 링크 · 계정 · 콘텐츠
import { useEffect, useState } from 'preact/hooks';
import type { Difficulty, Exam, ExamScope, ExamScopeInput, ReportView, ScopePreview, ScopeSaveResult, SetDetail, UploadView } from '@quiz/core';
import { DEFAULT_DIFFICULTY_MIX, DIFFICULTIES, EXAMS } from '@quiz/core';
import { api, ApiError } from '../../api.ts';
import { me, toast, loadManifest, manifest } from '../../state.ts';
import { route, qs, navigate } from '../../lib/router.ts';
import { fmtDate, unitSort } from '../../lib/util.ts';
import { Page, Spinner, ErrorBox, useAsync, Pill, absUrl, copyText } from '../../components/common.tsx';
import { Player } from '../../components/Player.tsx';
import { CheckResultView, statusPill } from '../Social.tsx';

const TABS = [
  ['uploads', '업로드 승인'], ['reports', '신고'], ['aliases', '별칭 후보'], ['scope', '시험 범위'], ['invites', '초대 링크'], ['users', '계정'], ['content', '콘텐츠'],
] as const;

export function AdminPage({ tab }: { tab: string }) {
  if (me.value?.role !== 'admin') return <Page><div class="banner err">관리자만 볼 수 있습니다.</div></Page>;
  const t = TABS.some(([k]) => k === tab) ? tab : 'uploads';
  return (
    <Page>
      <h1>🛠 관리자</h1>
      <div class="tabs">{TABS.map(([k, l]) => <a key={k} href={'/admin/' + k} class={t === k ? 'on' : ''}>{l}</a>)}</div>
      {t === 'uploads' && <Uploads />}
      {t === 'reports' && <Reports />}
      {t === 'aliases' && <Aliases />}
      {t === 'scope' && <ScopeEditor />}
      {t === 'invites' && <Invites />}
      {t === 'users' && <Users />}
      {t === 'content' && <Content />}
    </Page>
  );
}

function Uploads() {
  const [status, setStatus] = useState('pending');
  const [open, setOpen] = useState<number | null>(null);
  const r = useAsync(() => api.admin.uploads(status), [status]);
  if (open != null) return <UploadDetail id={open} onClose={() => { setOpen(null); r.reload(); }} />;
  return (
    <>
      <div class="btn-row" style={{ marginBottom: 10 }}>
        {[['pending', '대기'], ['done', '처리 완료'], ['cancelled', '취소'], ['', '전체']].map(([k, l]) => <button key={k} class={'mini' + (status === k ? ' on' : '')} onClick={() => setStatus(k)}>{l}</button>)}
      </div>
      {r.loading ? <Spinner /> : r.error ? <ErrorBox error={r.error} onRetry={r.reload} /> : !r.data?.length ? <div class="banner info">해당하는 제출이 없습니다.</div> : (
        <div class="table-wrap"><table class="table">
          <thead><tr><th>#</th><th>올린 사람</th><th>파일</th><th>상태</th><th>시각</th><th /></tr></thead>
          <tbody>{r.data.map((u) => (
            <tr key={u.id}><td>{u.id}</td><td>{u.user.nickname} <span class="muted">({u.user.username})</span></td>
              <td>{u.files.map((f) => <div key={f.id}>{f.subject} · {f.title} {f.newSubject && <Pill tone="blue">새 과목</Pill>}</div>)}</td>
              <td>{statusPill(u.status)}</td><td>{fmtDate(u.createdAt)}</td>
              <td><button class="btn sm" onClick={() => setOpen(u.id)}>열기</button></td></tr>))}</tbody>
        </table></div>
      )}
    </>
  );
}

function UploadDetail({ id, onClose }: { id: number; onClose: () => void }) {
  const r = useAsync(() => api.admin.upload(id), [id]);
  const [dec, setDec] = useState<Record<number, { approve: boolean | null; reason: string }>>({});
  const [preview, setPreview] = useState<SetDetail | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; commitSha?: string; hookOutput?: string; error?: string } | null>(null);
  if (preview) return <Player key={preview.path} title={'[미리보기] ' + preview.title} subtitle={preview.subject} items={preview.items.map((it) => ({ ...it, setPath: preview.path }))} session={null} backLabel="제출로 돌아가기" onBack={() => setPreview(null)} />;
  if (r.loading) return <Spinner />;
  if (r.error || !r.data) return <ErrorBox error={r.error || '없음'} onRetry={r.reload} />;
  const u: UploadView = r.data;
  const pending = u.files.filter((f) => f.status === 'pending');
  const ready = pending.length > 0 && pending.every((f) => dec[f.id]?.approve != null && (dec[f.id].approve || dec[f.id].reason.trim()));
  const setD = (fid: number, v: Partial<{ approve: boolean | null; reason: string }>) => setDec({ ...dec, [fid]: { ...{ approve: null, reason: '' }, ...dec[fid], ...v } });
  const openPreview = async (fid: number) => { try { setPreview(await api.admin.preview(id, fid)); } catch (e) { toast((e as Error).message, 'err'); } };
  const decide = async () => {
    setBusy(true); setResult(null);
    try {
      const res = await api.admin.decide(id, pending.map((f) => ({ id: f.id, approve: !!dec[f.id].approve, reason: dec[f.id].approve ? undefined : dec[f.id].reason.trim() })));
      setResult(res);
      if (res.ok) { toast('처리했습니다.', 'ok'); void loadManifest(true); r.reload(); }
    } catch (e) { setResult({ ok: false, error: (e as Error).message }); } finally { setBusy(false); }
  };
  return (
    <>
      <button class="btn ghost sm" onClick={onClose}>← 목록</button>
      <h2 style={{ fontSize: 17, margin: '12px 0 4px' }}>제출 #{u.id} {statusPill(u.status)}</h2>
      <p class="muted" style={{ marginBottom: 12 }}>{u.user.nickname} ({u.user.username}) · {fmtDate(u.createdAt)}{u.commitSha ? ` · 커밋 ${u.commitSha.slice(0, 10)}` : ''}</p>
      {u.files.map((f) => (
        <div key={f.id}>
          <CheckResultView r={f} />
          <div class="btn-row" style={{ margin: '-6px 0 16px' }}>
            {statusPill(f.status)}
            <button class="btn sm ghost" onClick={() => openPreview(f.id)}>👀 미리보기로 풀어 보기</button>
            {f.status === 'pending' ? <>
              <button class={'btn sm ' + (dec[f.id]?.approve === true ? 'green' : 'ghost')} onClick={() => setD(f.id, { approve: true })}>승인</button>
              <button class={'btn sm ' + (dec[f.id]?.approve === false ? 'red' : 'ghost')} onClick={() => setD(f.id, { approve: false })}>반려</button>
              {dec[f.id]?.approve === false && <input class="input" style={{ flex: 1, minWidth: 200, width: 'auto' }} placeholder="반려 사유 (필수)" value={dec[f.id].reason} onInput={(e) => setD(f.id, { reason: (e.target as HTMLInputElement).value })} />}
            </> : <>
              {f.rejectReason && <span class="err-text">사유: {f.rejectReason}</span>}
              {f.targetPath && <span class="muted">{f.targetPath}</span>}
            </>}
          </div>
        </div>
      ))}
      {pending.length > 0 && <button class="btn" disabled={!ready || busy} onClick={decide}>{busy ? '처리 중 (커밋 · push)…' : '결정 확정 — 승인한 파일을 커밋 하나로 반영'}</button>}
      {result && (
        <div class={'banner ' + (result.ok ? 'info' : 'err')} style={{ marginTop: 12 }}>
          {result.ok ? `✅ 반영했습니다${result.commitSha ? ` (커밋 ${result.commitSha.slice(0, 10)})` : ''}.` : `⚠️ ${result.error || '실패'}`}
          {result.hookOutput && <pre class="out" style={{ marginTop: 8 }}>{result.hookOutput}</pre>}
        </div>
      )}
    </>
  );
}

/** '범위 밖' · '출제 방향 다름' 신고 → 시험 범위 탭 링크 (과목 = 경로 첫 칸, 시험 = 매니페스트의 세트) */
function scopeLinkFor(x: ReportView): string | null {
  if (x.type !== '범위 밖' && x.type !== '출제 방향 다름') return null;
  const set = manifest.value?.sets.find((s) => s.path === x.snapshot.setPath);
  const subject = set?.subject ?? x.snapshot.setPath.split('/')[0];
  return '/admin/scope' + qs({ subject, exam: set?.exam });
}

function Reports() {
  const [status, setStatus] = useState('open');
  const r = useAsync(() => api.admin.reports(status), [status]);
  useEffect(() => { void loadManifest(); }, []);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const act = async (id: number, st: 'resolved' | 'dismissed') => {
    try { await api.admin.updateReport(id, st, notes[id] || ''); r.reload(); } catch (e) { toast((e as Error).message, 'err'); }
  };
  return (
    <>
      <div class="btn-row" style={{ marginBottom: 10 }}>
        {[['open', '열림'], ['resolved', '처리함'], ['dismissed', '기각'], ['', '전체']].map(([k, l]) => <button key={k} class={'mini' + (status === k ? ' on' : '')} onClick={() => setStatus(k)}>{l}</button>)}
      </div>
      {r.loading ? <Spinner /> : r.error ? <ErrorBox error={r.error} onRetry={r.reload} /> : !r.data?.length ? <div class="banner info">해당하는 신고가 없습니다.</div> :
        r.data.map((x) => (
          <div key={x.id} class="panel">
            <div class="btn-row"><Pill tone="blue">{x.type}</Pill><b>{x.reporter}</b><span class="muted">{fmtDate(x.createdAt)}</span><span class="muted">{x.itemId}</span>{scopeLinkFor(x) && <a class="btn sm ghost" href={scopeLinkFor(x)!}>📌 시험 범위 보기</a>}</div>
            <div style={{ whiteSpace: 'pre-wrap', fontSize: 13, marginTop: 6 }}><b>{x.snapshot.question}</b></div>
            <div class="muted">정답: {JSON.stringify(x.snapshot.answer)} · {x.snapshot.setPath}</div>
            {x.snapshot.explanation && <div class="muted">해설: {x.snapshot.explanation}</div>}
            {x.body && <div style={{ fontSize: 13, marginTop: 4 }}>설명: {x.body}</div>}
            {x.status === 'open' ? (
              <div class="btn-row" style={{ marginTop: 8 }}>
                <input class="input" style={{ flex: 1, minWidth: 200, width: 'auto' }} placeholder="메모 (신고한 사람에게 보임)" value={notes[x.id] || ''} onInput={(e) => setNotes({ ...notes, [x.id]: (e.target as HTMLInputElement).value })} />
                <button class="btn sm green" onClick={() => act(x.id, 'resolved')}>처리함</button>
                <button class="btn sm ghost" onClick={() => act(x.id, 'dismissed')}>기각</button>
              </div>
            ) : <div class="muted" style={{ marginTop: 6 }}>{x.status === 'resolved' ? '처리함' : '기각'} · {fmtDate(x.resolvedAt)} {x.adminNote ? '· ' + x.adminNote : ''}</div>}
          </div>
        ))}
      <p class="muted">문항 수정은 git(GENERATE.md 흐름)으로 하고, 고친 뒤 생기는 별칭 후보를 "별칭 후보" 탭에서 확정하세요.</p>
    </>
  );
}

function Aliases() {
  const r = useAsync(() => api.admin.aliases(), []);
  const act = async (id: number, confirm: boolean) => { try { await api.admin.decideAlias(id, confirm); r.reload(); } catch (e) { toast((e as Error).message, 'err'); } };
  return r.loading ? <Spinner /> : r.error ? <ErrorBox error={r.error} onRetry={r.reload} /> : !r.data?.length ? <div class="banner info">별칭 후보가 없습니다.</div> : (
    <>{r.data.map((a) => (
      <div key={a.id} class="panel">
        <div class="btn-row"><span class="muted">{a.setPath}</span><Pill tone="blue">유사도 {Math.round(a.similarity * 100)}%</Pill>{a.status !== 'open' && <Pill>{a.status === 'confirmed' ? '확정' : '무시'}</Pill>}</div>
        <div style={{ fontSize: 13, marginTop: 6 }}><span class="err-text">옛</span> {a.oldQuestion} <span class="muted">({a.oldId})</span></div>
        <div style={{ fontSize: 13, marginTop: 2 }}><span class="ok-text">새</span> {a.newQuestion} <span class="muted">({a.newId})</span></div>
        {a.status === 'open' && <div class="btn-row" style={{ marginTop: 8 }}><button class="btn sm green" onClick={() => act(a.id, true)}>같은 문항으로 확정</button><button class="btn sm ghost" onClick={() => act(a.id, false)}>다른 문항 (무시)</button></div>}
      </div>
    ))}</>
  );
}

// ── 시험 범위 ──
interface ScopeForm { units: string[]; include: string; exclude: string; trend: string; mix: Record<Difficulty, number>; note: string }
/** 장 단원: '3장' · '10 장' · '07 JavaScript'(번호로 시작하는 장 제목). 나머지(모의고사 · 기출 · 중간고사 대비 …)는 수동 분류 */
const isChapterUnit = (u: string) => /^\d+\s*장(\s|$)/.test(u) || /^\d{1,2}\s+\S/.test(u);
const lines = (t: string) => t.split('\n').map((x) => x.trim()).filter(Boolean);
function formFrom(sc: ExamScope | undefined): ScopeForm {
  return {
    units: sc?.units ?? [], include: (sc?.include ?? []).join('\n'), exclude: (sc?.exclude ?? []).join('\n'),
    trend: sc?.trend ?? '', mix: { ...DEFAULT_DIFFICULTY_MIX, ...(sc?.difficultyMix || {}) }, note: sc?.note ?? '',
  };
}
function inputFrom(f: ScopeForm): ExamScopeInput {
  const mixDefault = DIFFICULTIES.every((d) => f.mix[d] === DEFAULT_DIFFICULTY_MIX[d]);
  return {
    units: f.units, include: lines(f.include), exclude: lines(f.exclude),
    ...(f.trend.trim() ? { trend: f.trend.trim() } : {}),
    ...(mixDefault ? {} : { difficultyMix: { ...f.mix } }),
    ...(f.note.trim() ? { note: f.note.trim() } : {}),
  };
}

function ScopeEditor() {
  useEffect(() => { void loadManifest(true); }, []);
  const m = manifest.value;
  const query = route.value.query;
  const subjects = (m?.subjects ?? []).map((s) => s.subject).sort((a, b) => a.localeCompare(b, 'ko'));
  const subject = query.get('subject') || subjects[0] || '';
  const examQ = query.get('exam');
  const exam: Exam = EXAMS.includes(examQ as Exam) ? (examQ as Exam) : '기말고사';
  const node = m?.subjects.find((s) => s.subject === subject);
  const current = node?.scope?.[exam];
  const curRev = current?.rev ?? 0;

  const [form, setForm] = useState<ScopeForm>(() => formFrom(current));
  const [baseRev, setBaseRev] = useState(curRev);
  const [newUnit, setNewUnit] = useState('');
  const [excluded, setExcluded] = useState<string[]>([]);   // 장 외 단원 중 '제외'로 명시한 것 (범위에는 저장 안 됨 · 화면용)
  const [preview, setPreview] = useState<ScopePreview | null>(null);
  const [busy, setBusy] = useState<'' | 'preview' | 'save'>('');
  const [result, setResult] = useState<(ScopeSaveResult & { conflict?: boolean }) | null>(null);
  const loadFromManifest = () => { setForm(formFrom(current)); setExcluded([]); setBaseRev(curRev); setPreview(null); setResult(null); };
  // 과목 · 시험을 바꾸거나 매니페스트가 처음 도착하면 저장된 범위를 불러온다 (편집 중에는 자동으로 덮지 않음)
  useEffect(loadFromManifest, [subject, exam, !!m]);

  if (!m) return <Spinner />;
  if (!subjects.length) return <div class="banner info">과목이 없습니다.</div>;
  const go = (sub: string, ex: Exam) => navigate('/admin/scope' + qs({ subject: sub, exam: ex }), true);
  const manifestUnits = [...new Set(m.sets.filter((s) => s.subject === subject && s.exam === exam && s.unit).map((s) => s.unit))];
  const allUnits = [...new Set([...manifestUnits, ...form.units])].sort(unitSort);
  const set = (v: Partial<ScopeForm>) => { setForm({ ...form, ...v }); setPreview(null); };
  const chapterUnits = allUnits.filter(isChapterUnit);
  const otherUnits = allUnits.filter((u) => !isChapterUnit(u));
  const unclassified = otherUnits.filter((u) => !form.units.includes(u) && !excluded.includes(u));
  const unitSets = (u: string) => m.sets.filter((s) => s.subject === subject && s.exam === exam && s.unit === u);
  const classify = (u: string, include: boolean) => {
    setExcluded(include ? excluded.filter((x) => x !== u) : [...new Set([...excluded, u])]);
    set({ units: include ? [...new Set([...form.units, u])].sort(unitSort) : form.units.filter((x) => x !== u) });
  };
  const toggleUnit = (u: string) => set({ units: form.units.includes(u) ? form.units.filter((x) => x !== u) : [...form.units, u].sort(unitSort) });
  const addUnit = () => { const u = newUnit.trim(); if (u && !form.units.includes(u)) set({ units: [...form.units, u].sort(unitSort) }); setNewUnit(''); };

  const runPreview = async () => {
    setBusy('preview');
    try { setPreview(await api.admin.scopePreview({ subject, exam, scope: inputFrom(form) })); } catch (e) { toast((e as Error).message, 'err'); } finally { setBusy(''); }
  };
  const save = async () => {
    if (unclassified.length && !confirm(`분류하지 않은 장 외 단원이 있습니다:\n${unclassified.map((u) => `· ${u} (${unitSets(u).reduce((n, s) => n + s.questionCount, 0)}문항)`).join('\n')}\n\n이 단원의 세트는 전부 범위 밖 의심으로 표시됩니다. 그래도 저장할까요?`)) return;
    setBusy('save'); setResult(null);
    try {
      const res = await api.admin.saveScope({ subject, exam, scope: inputFrom(form), baseRev });
      setResult(res);
      if (res.ok) { toast('범위를 저장했습니다.', 'ok'); if (res.rev != null) setBaseRev(res.rev); void loadManifest(true); }
    } catch (e) {
      if (e instanceof ApiError && e.status === 409) setResult({ ok: false, conflict: true, error: '다른 사람이 먼저 범위를 수정했습니다. 새로고침해서 최신 범위를 확인한 뒤 다시 편집하세요.' });
      else setResult({ ok: false, error: (e as Error).message });
    } finally { setBusy(''); }
  };
  const stale = curRev > baseRev;   // 저장 직후 매니페스트가 늦게 오는 동안(curRev < baseRev)은 경고 안 함

  return (
    <>
      <div class="btn-row" style={{ marginBottom: 10 }}>
        <select class="input" style={{ width: 'auto' }} value={subject} onChange={(e) => go((e.target as HTMLSelectElement).value, exam)}>
          {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {EXAMS.map((ex) => <button key={ex} class={'mini' + (exam === ex ? ' on' : '')} onClick={() => go(subject, ex)}>{ex}</button>)}
        <span class="muted">{current ? `현재 rev ${current.rev}${current.updatedAt ? ' · ' + current.updatedAt : ''}` : '저장된 범위 없음'}</span>
      </div>
      {stale && (
        <div class="banner warn">서버의 범위가 rev {curRev}(으)로 바뀌었습니다 (편집 기준 rev {baseRev}).{' '}
          <button class="mini" onClick={loadFromManifest}>최신 범위 불러오기 (편집 내용 버림)</button>
        </div>
      )}
      <div class="panel">
        <div class="field"><span>장 단원 (META.unit 과 정확히 일치 · 단원을 하나도 고르지 않으면 단원 판정 안 함)</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px' }}>
            {chapterUnits.map((u) => (
              <label key={u} style={{ fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.units.includes(u)} onChange={() => toggleUnit(u)} />{u}
                {!manifestUnits.includes(u) && <span class="muted">(세트 없음)</span>}
              </label>
            ))}
            {!chapterUnits.length && <span class="muted">이 시험에는 장 단원 세트가 없습니다.</span>}
          </div>
        </div>
        <div class="field"><span>장 외 단원 — 수동 분류 {unclassified.length > 0 && <Pill tone="warn">미분류 {unclassified.length}</Pill>}</span>
          <p class="muted" style={{ fontSize: 12, margin: '2px 0 6px' }}>모의고사 · 기출 · 시험 대비처럼 장이 아닌 단원은 자동으로 판단하지 않습니다. 단원마다 포함 / 제외를 직접 고르세요. 포함하면 범위 단원에 들어가고, 제외하거나 고르지 않으면 그 단원의 세트는 전부 범위 밖 의심이 됩니다.</p>
          {!otherUnits.length && <span class="muted">장 외 단원이 없습니다.</span>}
          {otherUnits.map((u) => {
            const inc = form.units.includes(u), exc = !inc && excluded.includes(u), sets = unitSets(u);
            return (
              <div key={u} style={{ padding: '6px 8px', marginBottom: 4, borderRadius: 6, border: '1px solid ' + (inc || exc ? '#e2e8f0' : '#fde68a'), background: inc || exc ? undefined : '#fffbeb' }}>
                <div class="btn-row" style={{ gap: 12 }}>
                  <b style={{ fontSize: 13 }}>{u}</b>
                  {!inc && !exc && <Pill tone="warn">미분류</Pill>}
                  <label style={{ fontSize: 13, cursor: 'pointer' }}><input type="radio" name={'unit-' + u} checked={inc} onChange={() => classify(u, true)} /> 포함</label>
                  <label style={{ fontSize: 13, cursor: 'pointer' }}><input type="radio" name={'unit-' + u} checked={exc} onChange={() => classify(u, false)} /> 제외</label>
                  {!manifestUnits.includes(u) && <span class="muted">(세트 없음)</span>}
                </div>
                {sets.length > 0 && (
                  <div class="muted" style={{ fontSize: 12, marginTop: 2 }}>
                    {sets.map((st) => `${st.title} (${st.questionCount}문항)`).join(' · ')}
                  </div>
                )}
              </div>
            );
          })}
          <div class="btn-row" style={{ marginTop: 6 }}>
            <input class="input" style={{ width: 160, padding: '4px 8px' }} placeholder="단원 직접 추가" value={newUnit}
              onInput={(e) => setNewUnit((e.target as HTMLInputElement).value)} onKeyDown={(e) => { if (e.key === 'Enter') addUnit(); }} />
            <button class="mini" onClick={addUnit} disabled={!newUnit.trim()}>추가</button>
          </div>
        </div>
        <label class="field"><span>포함 (한 줄에 하나 · 표시용)</span>
          <textarea class="input" value={form.include} onInput={(e) => set({ include: (e.target as HTMLTextAreaElement).value })} placeholder="8장 가상 메모리: 페이지 교체까지" /></label>
        <label class="field"><span>제외 키워드 (한 줄에 하나 · 분류 · 주제 · 문제에 들어 있으면 범위 밖 의심)</span>
          <textarea class="input" value={form.exclude} onInput={(e) => set({ exclude: (e.target as HTMLTextAreaElement).value })} placeholder="세그멘테이션 하드웨어" /></label>
        <label class="field"><span>출제 경향</span>
          <input class="input" value={form.trend} onInput={(e) => set({ trend: (e.target as HTMLInputElement).value })} placeholder="EAT · 페이지 교체 계산 비중 큼" /></label>
        <div class="field"><span>난이도 비율 (기본 3 : 5 : 2)</span>
          <div class="btn-row">
            {DIFFICULTIES.map((d) => (
              <label key={d} class="muted">{d} <input class="input" type="number" min={0} style={{ width: 64, display: 'inline-block', padding: '4px 8px' }} value={form.mix[d]}
                onInput={(e) => set({ mix: { ...form.mix, [d]: Math.max(0, +(e.target as HTMLInputElement).value || 0) } })} /></label>
            ))}
          </div>
        </div>
        <label class="field"><span>메모</span>
          <input class="input" value={form.note} onInput={(e) => set({ note: (e.target as HTMLInputElement).value })} placeholder="11/18 공지 기준" /></label>
        <div class="btn-row">
          <button class="btn ghost" disabled={!!busy} onClick={runPreview}>{busy === 'preview' ? '계산 중…' : '👀 미리보기 (범위 밖 의심 계산)'}</button>
          <button class="btn" disabled={!!busy} onClick={save}>{busy === 'save' ? '저장 중 (커밋 · push)…' : `저장 (커밋 · push → rev ${baseRev + 1})`}</button>
        </div>
      </div>
      {result && (
        <div class={'banner ' + (result.ok ? 'info' : 'err')} style={{ marginTop: 12 }}>
          {result.ok
            ? `✅ 저장했습니다${result.rev != null ? ` (rev ${result.rev})` : ''}${result.commitSha ? ` · 커밋 ${result.commitSha.slice(0, 10)}` : ''}${result.suspectCount != null ? ` · 범위 밖 의심 ${result.suspectCount}문항` : ''}.`
            : `⚠️ ${result.error || '실패'}`}
          {result.conflict && <> <button class="mini" onClick={() => { void loadManifest(true); }}>새로고침</button></>}
          {result.hookOutput && <pre class="out" style={{ marginTop: 8 }}>{result.hookOutput}</pre>}
        </div>
      )}
      {preview && (
        <div class="panel" style={{ marginTop: 12 }}>
          <h3>미리보기: 범위 밖 의심 {preview.suspectCount}문항</h3>
          {!preview.sets.length && <p class="muted">의심 문항이 없습니다.</p>}
          {preview.sets.map((st) => (
            <div key={st.path} style={{ marginTop: 10 }}>
              <div><b>{st.title}</b> <span class="muted">{st.path} · {st.suspects.length}문항</span></div>
              <ul class="msg-list">
                {st.suspects.map((x) => <li key={x.itemId} class="warn">{x.question} <span class="muted">— {x.reasons.join(', ')}</span></li>)}
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function Invites() {
  const r = useAsync(() => api.admin.invites(), []);
  const [days, setDays] = useState(7); const [uses, setUses] = useState(20);
  const [made, setMade] = useState<string | null>(null);
  const create = async () => {
    try { const inv = await api.admin.createInvite(days, uses); setMade(inv.url ? absUrl(inv.url) : null); r.reload(); } catch (e) { toast((e as Error).message, 'err'); }
  };
  const revoke = async (id: number) => { if (!confirm('이 초대 링크를 폐기할까요?')) return; try { await api.admin.revokeInvite(id); r.reload(); } catch (e) { toast((e as Error).message, 'err'); } };
  return (
    <>
      <div class="panel">
        <h3>새 초대 링크</h3>
        <div class="btn-row">
          <label class="muted">만료 <input class="input" type="number" min={1} style={{ width: 70, display: 'inline-block', padding: '4px 8px' }} value={days} onInput={(e) => setDays(+(e.target as HTMLInputElement).value || 1)} />일</label>
          <label class="muted">최대 <input class="input" type="number" min={1} style={{ width: 70, display: 'inline-block', padding: '4px 8px' }} value={uses} onInput={(e) => setUses(+(e.target as HTMLInputElement).value || 1)} />명</label>
          <button class="btn" onClick={create}>만들기</button>
        </div>
        {made && <div class="banner info" style={{ marginTop: 10 }}>링크(지금만 볼 수 있음): <code>{made}</code> <button class="mini" onClick={async () => toast((await copyText(made)) ? '복사했습니다.' : '복사하지 못했습니다.', 'info')}>복사</button></div>}
      </div>
      {r.loading ? <Spinner /> : r.error ? <ErrorBox error={r.error} onRetry={r.reload} /> : (
        <div class="table-wrap"><table class="table">
          <thead><tr><th>#</th><th>만든 시각</th><th>만료</th><th>사용</th><th>상태</th><th /></tr></thead>
          <tbody>{(r.data || []).map((i) => {
            const expired = i.expiresAt < Date.now();
            return <tr key={i.id}><td>{i.id}</td><td>{fmtDate(i.createdAt)}</td><td>{fmtDate(i.expiresAt)}</td><td>{i.usedCount} / {i.maxUses}</td>
              <td>{i.revoked ? <Pill>폐기</Pill> : expired ? <Pill>만료</Pill> : i.usedCount >= i.maxUses ? <Pill>소진</Pill> : <Pill tone="ok">사용 가능</Pill>}</td>
              <td>{!i.revoked && !expired && <button class="btn sm ghost" onClick={() => revoke(i.id)}>폐기</button>}</td></tr>;
          })}</tbody>
        </table></div>
      )}
    </>
  );
}

function Users() {
  const r = useAsync(() => api.admin.users(), []);
  const [link, setLink] = useState<{ user: string; url: string } | null>(null);
  const setStatus = async (id: number, status: 'active' | 'suspended') => { try { await api.admin.setUserStatus(id, status); r.reload(); } catch (e) { toast((e as Error).message, 'err'); } };
  const reset = async (id: number, user: string) => { try { const x = await api.admin.resetLink(id); setLink({ user, url: absUrl(x.url) }); } catch (e) { toast((e as Error).message, 'err'); } };
  return (
    <>
      {link && <div class="banner info">{link.user} 재설정 링크(1회용, 24시간): <code>{link.url}</code> <button class="mini" onClick={async () => toast((await copyText(link.url)) ? '복사했습니다.' : '복사하지 못했습니다.', 'info')}>복사</button></div>}
      {r.loading ? <Spinner /> : r.error ? <ErrorBox error={r.error} onRetry={r.reload} /> : (
        <div class="table-wrap"><table class="table">
          <thead><tr><th>아이디</th><th>닉네임</th><th>권한</th><th>상태</th><th>가입</th><th /></tr></thead>
          <tbody>{(r.data || []).map((u) => (
            <tr key={u.id}><td>{u.username}</td><td>{u.nickname}</td><td>{u.role}</td>
              <td>{u.status === 'active' ? <Pill tone="ok">활성</Pill> : <Pill tone="err">정지</Pill>}</td><td>{fmtDate(u.createdAt)}</td>
              <td class="btn-row">
                {u.role !== 'admin' && (u.status === 'active'
                  ? <button class="btn sm ghost" onClick={() => setStatus(u.id, 'suspended')}>정지</button>
                  : <button class="btn sm ghost" onClick={() => setStatus(u.id, 'active')}>해제</button>)}
                <button class="btn sm ghost" onClick={() => reset(u.id, u.username)}>재설정 링크</button>
              </td></tr>))}</tbody>
        </table></div>
      )}
    </>
  );
}

function Content() {
  const r = useAsync(() => api.admin.contentStatus(), []);
  const [busy, setBusy] = useState(false);
  const reload = async () => {
    setBusy(true);
    try { await api.admin.reload(); toast('콘텐츠를 새로 읽었습니다.', 'ok'); r.reload(); void loadManifest(true); } catch (e) { toast((e as Error).message, 'err'); } finally { setBusy(false); }
  };
  const s = r.data;
  return (
    <>
      <button class="btn" disabled={busy} onClick={reload}>🔄 콘텐츠 새로고침 (git pull)</button>
      <p class="muted" style={{ margin: '6px 0 14px' }}>보통은 GitHub webhook 으로 자동 반영됩니다. webhook 이 실패했을 때 쓰세요.</p>
      {r.loading ? <Spinner /> : r.error ? <ErrorBox error={r.error} onRetry={r.reload} /> : s && (
        <div class="panel">
          <div>현재 커밋 <code>{s.head}</code></div>
          <div>contentVersion <code>{s.contentVersion}</code></div>
          <div style={{ marginTop: 6 }}>마지막 webhook: {s.lastWebhook ? `${fmtDate(s.lastWebhook.at)} · ${s.lastWebhook.result} (${s.lastWebhook.delivery})` : '없음'}</div>
          {s.pullWarning && <div class="banner err" style={{ marginTop: 10 }}>⚠️ pull 실패 ({fmtDate(s.pullWarning.at)})<pre class="out" style={{ marginTop: 6 }}>{s.pullWarning.output}</pre></div>}
          {s.loadErrors.length > 0 && <div class="banner warn" style={{ marginTop: 10 }}>읽지 못한 파일 {s.loadErrors.length}개<ul class="msg-list">{s.loadErrors.map((e) => <li key={e.path} class="warn">{e.path} — {e.error}</li>)}</ul></div>}
        </div>
      )}
    </>
  );
}
