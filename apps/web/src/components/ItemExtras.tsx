// 문항별 🚩 신고 · 💬 댓글 (설계 9장). 채점이 끝난 문항에서만 그린다.
import { useEffect, useState } from 'preact/hooks';
import type { CommentView, ReportType } from '@quiz/core';
import { REPORT_TYPES } from '@quiz/core';
import { api } from '../api.ts';
import { toast } from '../state.ts';
import { fmtDate } from '../lib/util.ts';

export function ItemExtras({ itemId, setPath, disabled }: { itemId: string; setPath: string; disabled?: boolean }) {
  const [mode, setMode] = useState<'none' | 'report' | 'comments'>('none');
  if (disabled) return null;
  return (
    <div class="extras">
      <div class="extras-bar">
        <button class={'mini' + (mode === 'comments' ? ' on' : '')} onClick={() => setMode(mode === 'comments' ? 'none' : 'comments')}>💬 댓글</button>
        <button class={'mini' + (mode === 'report' ? ' on' : '')} onClick={() => setMode(mode === 'report' ? 'none' : 'report')}>🚩 신고</button>
      </div>
      {mode === 'report' && <ReportForm itemId={itemId} setPath={setPath} onDone={() => setMode('none')} />}
      {mode === 'comments' && <Comments itemId={itemId} />}
    </div>
  );
}

function ReportForm({ itemId, setPath, onDone }: { itemId: string; setPath: string; onDone: () => void }) {
  const [type, setType] = useState<ReportType>('정답 오류');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const send = async () => {
    setBusy(true);
    try { await api.report({ itemId, type, body: body.trim(), setPath }); toast('신고했습니다. "내 신고"에서 처리 결과를 볼 수 있어요.', 'ok'); onDone(); }
    catch (e) { toast((e as Error).message, 'err'); }
    finally { setBusy(false); }
  };
  return (
    <div style={{ marginTop: 8 }}>
      <div class="btn-row" style={{ marginBottom: 6 }}>
        {REPORT_TYPES.map((t) => <button key={t} class={'mini' + (t === type ? ' on' : '')} onClick={() => setType(t)}>{t}</button>)}
      </div>
      <textarea class="input" maxLength={1000} placeholder="설명 (선택, 1000자)" value={body} onInput={(e) => setBody((e.target as HTMLTextAreaElement).value)} />
      <div class="btn-row" style={{ marginTop: 6 }}>
        <button class="btn sm red" disabled={busy} onClick={send}>신고하기</button>
        <button class="btn sm ghost" onClick={onDone}>취소</button>
      </div>
    </div>
  );
}

function Comments({ itemId }: { itemId: string }) {
  const [list, setList] = useState<CommentView[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [edit, setEdit] = useState<{ id: number; body: string } | null>(null);
  const load = () => api.comments(itemId).then(setList, (e: Error) => setErr(e.message));
  useEffect(() => { void load(); }, [itemId]); // eslint-disable-line react-hooks/exhaustive-deps
  const add = async () => {
    const b = text.trim(); if (!b) return;
    try { await api.addComment(itemId, b); setText(''); void load(); } catch (e) { toast((e as Error).message, 'err'); }
  };
  const save = async () => {
    if (!edit) return;
    try { await api.editComment(edit.id, edit.body.trim()); setEdit(null); void load(); } catch (e) { toast((e as Error).message, 'err'); }
  };
  const del = async (id: number) => {
    if (!confirm('댓글을 지울까요?')) return;
    try { await api.deleteComment(id); void load(); } catch (e) { toast((e as Error).message, 'err'); }
  };
  return (
    <div style={{ marginTop: 8 }}>
      {err && <div class="err-text">{err}</div>}
      {list === null && !err && <div class="muted">불러오는 중…</div>}
      {list && list.length === 0 && <div class="muted">아직 댓글이 없습니다.</div>}
      {list && list.map((c) => (
        <div key={c.id} class="comment">
          <div class="who">{c.nickname} <span class="muted">· {fmtDate(c.createdAt)}{c.updatedAt ? ' (수정됨)' : ''}</span>
            {c.mine && edit?.id !== c.id && <>
              {' '}<button class="mini" onClick={() => setEdit({ id: c.id, body: c.body })}>수정</button>
              {' '}<button class="mini" onClick={() => del(c.id)}>삭제</button>
            </>}
          </div>
          {edit?.id === c.id
            ? <div><textarea class="input" maxLength={1000} value={edit.body} onInput={(e) => setEdit({ id: c.id, body: (e.target as HTMLTextAreaElement).value })} />
                <div class="btn-row" style={{ marginTop: 4 }}><button class="btn sm" onClick={save}>저장</button><button class="btn sm ghost" onClick={() => setEdit(null)}>취소</button></div></div>
            : <div class="body">{c.body}</div>}
        </div>
      ))}
      <div style={{ marginTop: 8 }}>
        <textarea class="input" maxLength={1000} placeholder="댓글 (1000자)" value={text} onInput={(e) => setText((e.target as HTMLTextAreaElement).value)} />
        <button class="btn sm" style={{ marginTop: 4 }} onClick={add}>댓글 달기</button>
      </div>
    </div>
  );
}
