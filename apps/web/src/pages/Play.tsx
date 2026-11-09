// 세트 풀이(/q?path=) · 오늘의 복습(/review) · 오답 다시 풀기 · 📌 목록 풀기
import type { Exam, SetDetail } from '@quiz/core';
import { api } from '../api.ts';
import { manifest } from '../state.ts';
import { navigate } from '../lib/router.ts';
import { subjectHome } from '../lib/nav.ts';
import { Player, type PlayItem } from '../components/Player.tsx';
import { Page, Spinner, ErrorBox, useAsync } from '../components/common.tsx';

export function PlaySet({ path }: { path: string }) {
  const r = useAsync(() => api.set(path), [path]);
  if (r.loading) return <Spinner />;
  if (r.error || !r.data) return <Page><ErrorBox error={r.error || '세트를 찾을 수 없습니다.'} onRetry={r.reload} /></Page>;
  const s: SetDetail = r.data;
  const back = subjectHome(manifest.value, s.subject, s.exam);
  const items: PlayItem[] = s.items.map((it) => ({ ...it, setPath: s.path }));
  return <Player key={s.path + s.hash} title={s.title} subtitle={s.topic} items={items}
    session={{ kind: 'set', subject: s.subject, exam: s.exam, setPath: s.path }}
    backLabel={`${s.subject} ${s.exam}`} onBack={() => navigate(back)} />;
}

export function PlayReview({ subject, exam }: { subject: string; exam: Exam }) {
  // 복습할 문항이 없으면 서버가 빈 items 를 준다
  const r = useAsync(() => api.reviewBatch(subject, exam), [subject, exam]);
  const back = subjectHome(manifest.value, subject, exam);
  if (r.loading) return <Spinner text="복습 목록을 만드는 중…" />;
  if (r.error || !r.data) return <Page><ErrorBox error={r.error || '복습 목록을 만들지 못했습니다.'} onRetry={r.reload} /></Page>;
  if (!r.data.items.length) return (
    <Page narrow>
      <div class="result-card" style={{ margin: '40px auto' }}>
        <div style={{ fontSize: 44 }}>🎉</div>
        <div class="result-title">오늘 복습할 문항이 없습니다</div>
        <p class="muted" style={{ marginBottom: 16 }}>세트를 끝까지 풀면 그 문항이 복습 대상이 됩니다. 복습할 때가 되면 여기에 나타나요.</p>
        <button class="primary-btn" onClick={() => navigate(back)}>← {subject} {exam}</button>
      </div>
    </Page>
  );
  return <Player key={r.data.batchId} title={`${subject} 오늘의 복습`} subtitle={exam} items={r.data.items}
    session={{ kind: 'review', subject, exam, reviewBatchId: r.data.batchId }}
    backLabel={`${subject} ${exam}`} onBack={() => navigate(back)} />;
}

/** 문항 ID 목록을 실제 문항으로 (세트별로 받아서 찾는다) */
export async function resolveItems(refs: { itemId: string; setPath: string }[]): Promise<PlayItem[]> {
  const paths = [...new Set(refs.map((r) => r.setPath))];
  const sets = await Promise.all(paths.map((p) => api.set(p).catch(() => null)));
  const byId = new Map<string, PlayItem>();
  sets.forEach((s) => s?.items.forEach((it) => byId.set(it.itemId, { ...it, setPath: s.path })));
  return refs.map((r) => byId.get(r.itemId)).filter((x): x is PlayItem => !!x);
}
