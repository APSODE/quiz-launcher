// 🗳️ 검수 대기: 대기 중인 업로드 세트를 미리 풀어 보고 승인 · 반려 투표 (설계 8.3)
import { useState } from 'preact/hooks';
import type { ReportType, ReviewFileView, SetDetail, UploadVoteTally } from '@quiz/core';
import { REPORT_TYPES } from '@quiz/core';
import { api } from '../api.ts';
import { loadManifest, toast } from '../state.ts';
import { fmtDate } from '../lib/util.ts';
import { Page, Spinner, ErrorBox, useAsync, Pill } from '../components/common.tsx';
import { Player } from '../components/Player.tsx';
import { CheckResultView } from './Social.tsx';

// TODO: 출제 규칙 md(문제 출제 규칙)에서 불러오기. 지금은 고정 목록
const CHECKLIST = [
  '정답 · 해설이 정확한가',
  '시험 범위 안인가',
  '지엽적이지 않은가 (단축키 · 메뉴 위치 · 과제 전용 명령어 · 참고자료 · 제출/감점 조건 · 운영 정보)',
  '기존 문제와 중복이 아닌가',
  '질문이 답을 알려 주지 않는가',
];

/** 찬성 · 반대 / 투표권자(과반 기준) */
export function VoteProgress({ v }: { v: UploadVoteTally }) {
  const need = v.voters ? Math.floor(v.voters / 2) + 1 : 0;
  return (
    <span class="btn-row" style={{ display: 'inline-flex', gap: 6 }}>
      <Pill tone="ok">찬성 {v.approve}</Pill><Pill tone="err">반대 {v.reject}</Pill>
      <span class="muted">{v.voters == null ? '투표 도입 전 제출' : v.voters === 0 ? '투표권자 0명 → 관리자 판단' : `투표권자 ${v.voters}명 · 과반 ${need}표`}</span>
      {v.decidedBy && <span class="muted">결정: {v.decidedBy}</span>}
      {v.needsAdmin && <Pill tone="warn">판단 필요</Pill>}
    </span>
  );
}

export function ReviewPage() {
  const r = useAsync(() => api.reviews(), []);
  const [preview, setPreview] = useState<{ d: SetDetail; f: ReviewFileView } | null>(null);
  if (preview) {
    const { d, f } = preview;
    return <Player key={d.path} title={'[검수 중] ' + d.title} subtitle={`${d.subject} · 찬성 ${f.vote.approve} · 반대 ${f.vote.reject}`} items={d.items.map((it) => ({ ...it, setPath: d.path }))} session={null} backLabel="검수 목록으로" onBack={() => setPreview(null)} />;
  }
  const open = async (f: ReviewFileView) => { try { setPreview({ d: await api.reviewPreview(f.uploadId, f.id), f }); } catch (e) { toast((e as Error).message, 'err'); } };
  return (
    <Page>
      <h1>🗳️ 검수 대기</h1>
      <p class="lead">올라온 세트를 풀어 보고 승인 · 반려에 투표하세요. 업로드 때 최근 14일 활동자(올린 사람 제외)의 과반이 승인하면 반영되고, 과반이 반려하면 반려됩니다. 관리자도 승인할 수 있습니다. 7일 안에 결정되지 않으면 관리자가 판단합니다. 검수 중 풀이는 기록 · 난이도 통계에 들어가지 않습니다.</p>
      <div class="panel">
        <h3>검수 체크리스트</h3>
        <ul class="muted" style={{ lineHeight: 1.8, paddingLeft: 18 }}>{CHECKLIST.map((x) => <li key={x}>{x}</li>)}</ul>
      </div>
      {r.loading ? <Spinner /> : r.error ? <ErrorBox error={r.error} onRetry={r.reload} /> : !r.data?.length ? <div class="banner info">검수 대기 중인 세트가 없습니다.</div> :
        r.data.map((f) => <ReviewCard key={f.id} f={f} onOpen={() => open(f)} onDone={r.reload} />)}
    </Page>
  );
}

function ReviewCard({ f, onOpen, onDone }: { f: ReviewFileView; onOpen: () => void; onDone: () => void }) {
  const [rejecting, setRejecting] = useState(false);
  const [type, setType] = useState<ReportType>(f.myVote?.reasonType ?? '정답 오류');
  const [text, setText] = useState(f.myVote?.reason ?? '');
  const [busy, setBusy] = useState(false);
  const send = async (approve: boolean) => {
    setBusy(true);
    try {
      const res = await api.vote(f.uploadId, f.id, approve ? { approve } : { approve, reasonType: type, reason: text.trim() });
      if (res.decided === 'approved') { toast('과반 승인으로 반영되었습니다.', 'ok'); void loadManifest(true); }
      else if (res.decided === 'rejected') toast('과반 반려로 반려되었습니다.', 'ok');
      else if (res.error) toast('과반 승인이지만 반영 실패: ' + res.error, 'err');
      else toast('투표했습니다.', 'ok');
      setRejecting(false); onDone();
    } catch (e) { toast((e as Error).message, 'err'); } finally { setBusy(false); }
  };
  return (
    <div>
      <CheckResultView r={f} />
      <div style={{ margin: '-6px 0 16px' }}>
        <div class="btn-row">
          <Pill tone="warn">🗳️ 검수 중</Pill>
          <span class="muted">{f.uploader.nickname} · {fmtDate(f.createdAt)}</span>
          <VoteProgress v={f.vote} />
        </div>
        {f.reasons.length > 0 && <ul class="msg-list">{f.reasons.map((x, i) => <li key={i} class="warn"><b>{x.type}</b> {x.body}</li>)}</ul>}
        <div class="btn-row" style={{ marginTop: 6 }}>
          <button class="btn sm ghost" onClick={onOpen}>👀 풀어 보기</button>
          {f.mine ? <span class="muted">내가 올린 세트는 투표할 수 없습니다.</span> : <>
            <button class={'btn sm ' + (f.myVote?.approve === true ? 'green' : 'ghost')} disabled={busy} onClick={() => send(true)}>승인</button>
            <button class={'btn sm ' + (f.myVote?.approve === false ? 'red' : 'ghost')} disabled={busy} onClick={() => setRejecting(!rejecting)}>반려…</button>
            {f.myVote && <span class="muted">내 표: {f.myVote.approve ? '승인' : `반려 (${f.myVote.reasonType})`} · 바꿀 수 있음</span>}
          </>}
        </div>
        {rejecting && (
          <div style={{ marginTop: 8 }}>
            <div class="btn-row" style={{ marginBottom: 6 }}>
              {REPORT_TYPES.map((t) => <button key={t} class={'mini' + (t === type ? ' on' : '')} onClick={() => setType(t)}>{t}</button>)}
            </div>
            <textarea class="input" maxLength={500} placeholder="설명 (선택, 500자)" value={text} onInput={(e) => setText((e.target as HTMLTextAreaElement).value)} />
            <div class="btn-row" style={{ marginTop: 6 }}>
              <button class="btn sm red" disabled={busy} onClick={() => send(false)}>반려에 투표</button>
              <button class="btn sm ghost" onClick={() => setRejecting(false)}>취소</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
