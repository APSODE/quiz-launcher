// 리더보드 · 업로드 · 내 제출 · 내 신고
import { useState } from 'preact/hooks';
import type { FileCheckResult, UploadView, CheckMessage } from '@quiz/core';
import { api, ApiError } from '../api.ts';
import { manifest, me, toast } from '../state.ts';
import { fmtDate } from '../lib/util.ts';
import { Page, Spinner, ErrorBox, useAsync, Pill } from '../components/common.tsx';

export function LeaderboardPage() {
  const r = useAsync(() => api.leaderboard(), []);
  const [sort, setSort] = useState<'solved' | 'accuracy'>('solved');
  const rows = [...(r.data || [])].sort((a, b) => sort === 'solved'
    ? b.solved - a.solved || b.accuracy - a.accuracy
    : b.accuracy - a.accuracy || b.solved - a.solved);
  return (
    <Page>
      <h1>🏆 리더보드</h1>
      <p class="lead">세트를 끝까지 푼 기록(복습 포함)만 셉니다. 푼 문제 수 = 서로 다른 문항 수, 정답률 = 맞힌 횟수 / 전체 풀이 횟수.</p>
      <div class="tabs">
        <a href="#" class={sort === 'solved' ? 'on' : ''} onClick={(e) => { e.preventDefault(); setSort('solved'); }}>푼 문제 수</a>
        <a href="#" class={sort === 'accuracy' ? 'on' : ''} onClick={(e) => { e.preventDefault(); setSort('accuracy'); }}>정답률</a>
      </div>
      {r.loading ? <Spinner /> : r.error ? <ErrorBox error={r.error} onRetry={r.reload} /> : !rows.length ? <div class="banner info">아직 기록이 없습니다.</div> : (
        <div class="table-wrap"><table class="table">
          <thead><tr><th>순위</th><th>닉네임</th><th>푼 문제 수</th><th>정답률</th><th>풀이 횟수</th></tr></thead>
          <tbody>{rows.map((x, i) => (
            <tr key={x.nickname} style={x.nickname === me.value?.nickname ? { background: '#eef2ff' } : undefined}>
              <td>{i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}</td><td><b>{x.nickname}</b></td><td>{x.solved}</td>
              <td>{(x.accuracy * 100).toFixed(1)}% <span class="muted">({x.correct}/{x.attempts})</span></td><td>{x.attempts}</td>
            </tr>))}</tbody>
        </table></div>
      )}
    </Page>
  );
}

export function Messages({ list }: { list: CheckMessage[] }) {
  if (!list.length) return null;
  return <ul class="msg-list">{list.map((m, i) => <li key={i} class={m.level}>{m.level === 'error' ? '⛔' : '⚠️'} <b>{m.where}</b> {m.message}</li>)}</ul>;
}
export function CheckResultView({ r }: { r: FileCheckResult }) {
  const errs = r.messages.filter((m) => m.level === 'error').length, warns = r.messages.length - errs;
  return (
    <div class="panel">
      <div class="btn-row">
        <b>{r.name}</b>
        {r.ok ? <Pill tone="ok">통과</Pill> : <Pill tone="err">오류 {errs}</Pill>}
        {warns > 0 && <Pill tone="warn">경고 {warns}</Pill>}
        {r.newSubject && <Pill tone="blue">새 과목 ({r.newSubject.grade}학년 {r.newSubject.semester}학기)</Pill>}
      </div>
      {r.subject && <div class="muted" style={{ marginTop: 4 }}>{r.subject} · {r.exam} · {r.kind} · {r.title} · 문제 {r.questionCount ?? 0} · 용어 {r.termCount ?? 0}</div>}
      <Messages list={r.messages} />
    </div>
  );
}

const EXAMPLE = {
  meta: { subject: '운영체제', exam: '기말고사', kind: '일반문제', title: '스케줄링 OX 3문제', unit: '4장', topic: '선점 · 비선점' },
  questions: [
    { category: '스케줄링', question: 'FCFS는 선점형 스케줄링이다.', answer: false, explanation: 'FCFS는 비선점형이다.' },
    { category: '교착상태', question: '교착상태의 필요조건이 아닌 것은?', choices: ['상호 배제', '점유와 대기', '선점', '환형 대기'], answer: 2, explanation: '필요조건은 비선점이다.' },
    { category: '스케줄링', question: '작업시간이 가장 짧은 프로세스를 먼저 실행하는 비선점 스케줄링은?', answers: ['SJF', '최단 작업 우선', '최단작업우선'], displayAnswer: 'SJF', hint: 'Shortest …', explanation: 'SJF는 평균 대기시간이 가장 짧다.' },
  ],
  terms: [{ terms: ['SJF', '최단 작업 우선'], group: '4장', desc: '작업시간이 가장 짧은 프로세스를 먼저 실행하는 비선점 스케줄링' }],
};

export function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<FileCheckResult[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<UploadView | null>(null);
  const m = manifest.value;
  const pick = async (list: FileList | null) => {
    const fs = [...(list || [])];
    setFiles(fs); setResults(null); setDone(null);
    if (!fs.length) return;
    setBusy(true);
    try { setResults(await api.checkUploads(fs)); } catch (e) { toast((e as Error).message, 'err'); } finally { setBusy(false); }
  };
  const submit = async () => {
    setBusy(true);
    try { const r = await api.submitUploads(files); setResults(r.results); setDone(r.upload); toast('제출했습니다. 관리자가 승인하면 반영됩니다.', 'ok'); }
    catch (e) {
      if (e instanceof ApiError && e.body && typeof e.body === 'object' && 'results' in (e.body as object)) setResults((e.body as { results: FileCheckResult[] }).results);
      toast((e as Error).message, 'err');
    } finally { setBusy(false); }
  };
  const download = () => {
    const blob = new Blob([JSON.stringify(EXAMPLE, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = '예시_문제세트.json'; a.click(); URL.revokeObjectURL(a.href);
  };
  const allOk = !!results && results.length > 0 && results.every((r) => r.ok);
  return (
    <Page>
      <h1>⬆️ 문제 업로드</h1>
      <p class="lead">JSON 파일 하나 = 세트 하나. 여러 파일을 한 번에 올릴 수 있습니다. 검사를 통과한 제출은 관리자가 승인하면 레포에 커밋되어 모두에게 보입니다.</p>
      <div class="panel">
        <h3>1. 파일 고르기</h3>
        <input type="file" accept=".json,application/json" multiple onChange={(e) => pick((e.target as HTMLInputElement).files)} />
        <div class="btn-row" style={{ marginTop: 10 }}>
          <button class="btn ghost sm" onClick={download}>📄 예시 JSON 내려받기</button>
          <a class="btn ghost sm" href="/my/uploads">내 제출 보기</a>
        </div>
      </div>
      {busy && <Spinner text="검사 중…" />}
      {results && <>
        <div class="section-title">2. 검사 결과 ({results.filter((r) => r.ok).length}/{results.length} 통과)</div>
        {results.map((r, i) => <CheckResultView key={i} r={r} />)}
        {!done && <div class="btn-row">
          <button class="btn green" disabled={!allOk || busy} onClick={submit}>제출하기 ({files.length}개 파일)</button>
          {!allOk && <span class="err-text">오류가 있는 파일이 있으면 제출할 수 없습니다. 고친 뒤 다시 골라 주세요.</span>}
        </div>}
        {done && <div class="banner info">✅ 제출 #{done.id} 접수. <a href="/my/uploads">내 제출</a>에서 진행 상태를 볼 수 있어요.</div>}
      </>}
      <div class="panel" style={{ marginTop: 20 }}>
        <h3>형식 안내</h3>
        <ul class="muted" style={{ lineHeight: 1.8, paddingLeft: 18 }}>
          <li><code>meta.subject</code>(과목) · <code>meta.exam</code>(중간고사 | 기말고사) · <code>meta.kind</code>(일반문제 | 모의고사 | 기출 | 단어집) · <code>meta.title</code> 필수. <code>unit</code> · <code>topic</code> 선택.</li>
          <li>처음 보는 과목이면 <code>meta.grade</code>(학년) · <code>meta.semester</code>(1 | 2) 필수. 과목명은 기존 과목과 한 글자도 다르지 않게 쓰세요.</li>
          <li>문항: OX는 <code>answer: true/false</code>, 객관식은 <code>choices</code> + <code>answer</code>(0부터 세는 번호), 단답은 <code>answers</code>(인정 표기 전부). <code>explanation</code> 권장.</li>
          <li><code>id</code> · <code>uploader</code> · <code>practice</code> 필드는 쓰지 않습니다(서버가 붙임). 모르는 필드는 오류입니다.</li>
        </ul>
        {m && <><div class="muted" style={{ marginTop: 8 }}><b>지금 있는 과목</b></div>
          <div class="btn-row" style={{ marginTop: 4 }}>{m.subjects.map((s) => <Pill key={s.subject}>{s.subject} {s.grade != null ? `· ${s.grade}학년 ${s.semester}학기` : '· 미분류'}</Pill>)}</div></>}
      </div>
    </Page>
  );
}

function statusPill(s: string) {
  return s === 'approved' || s === 'done' ? <Pill tone="ok">{s === 'done' ? '처리 완료' : '승인'}</Pill>
    : s === 'rejected' ? <Pill tone="err">반려</Pill>
      : s === 'cancelled' ? <Pill>취소</Pill> : <Pill tone="warn">대기</Pill>;
}
export { statusPill };

export function MyUploadsPage() {
  const r = useAsync(() => api.myUploads(), []);
  const cancel = async (id: number) => {
    if (!confirm('이 제출을 취소할까요?')) return;
    try { await api.cancelUpload(id); r.reload(); } catch (e) { toast((e as Error).message, 'err'); }
  };
  return (
    <Page>
      <h1>내 제출</h1>
      <p class="lead">업로드한 문제 세트의 진행 상태입니다. <a href="/upload">새로 올리기</a></p>
      {r.loading ? <Spinner /> : r.error ? <ErrorBox error={r.error} onRetry={r.reload} /> : !r.data?.length ? <div class="banner info">제출한 것이 없습니다.</div> :
        r.data.map((u) => (
          <div key={u.id} class="panel">
            <div class="btn-row"><b>제출 #{u.id}</b>{statusPill(u.status)}<span class="muted">{fmtDate(u.createdAt)}</span>
              {u.commitSha && <span class="muted">커밋 {u.commitSha.slice(0, 8)}</span>}
              {u.status === 'pending' && <button class="btn sm ghost" onClick={() => cancel(u.id)}>취소</button>}</div>
            {u.files.map((f) => (
              <div key={f.id} style={{ borderTop: '1px solid #f1f5f9', marginTop: 8, paddingTop: 8 }}>
                <div class="btn-row"><span>{f.name}</span>{statusPill(f.status)}<span class="muted">{f.subject} · {f.exam} · {f.title}</span></div>
                {f.rejectReason && <div class="err-text">반려 사유: {f.rejectReason}</div>}
                {f.targetPath && <div class="muted">반영 위치: {f.targetPath}</div>}
              </div>
            ))}
          </div>
        ))}
    </Page>
  );
}

export function MyReportsPage() {
  const r = useAsync(() => api.myReports(), []);
  return (
    <Page>
      <h1>내 신고</h1>
      <p class="lead">신고한 문항과 처리 결과입니다.</p>
      {r.loading ? <Spinner /> : r.error ? <ErrorBox error={r.error} onRetry={r.reload} /> : !r.data?.length ? <div class="banner info">신고한 문항이 없습니다.</div> :
        r.data.map((x) => (
          <div key={x.id} class="panel">
            <div class="btn-row"><Pill tone="blue">{x.type}</Pill>
              {x.status === 'open' ? <Pill tone="warn">처리 대기</Pill> : x.status === 'resolved' ? <Pill tone="ok">처리함</Pill> : <Pill>기각</Pill>}
              <span class="muted">{fmtDate(x.createdAt)}</span></div>
            <div style={{ marginTop: 6, whiteSpace: 'pre-wrap', fontSize: 13 }}><b>{x.snapshot.question}</b></div>
            <div class="muted">{x.snapshot.setPath}</div>
            {x.body && <div style={{ fontSize: 13, marginTop: 4 }}>내 설명: {x.body}</div>}
            {x.adminNote && <div class="ok-text" style={{ marginTop: 4 }}>운영자 메모: {x.adminNote}</div>}
          </div>
        ))}
    </Page>
  );
}

