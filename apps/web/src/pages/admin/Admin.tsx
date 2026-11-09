// 🛠 관리자: 업로드 승인 · 신고 · 별칭 후보 · 초대 링크 · 계정 · 콘텐츠
import { useState } from 'preact/hooks';
import type { SetDetail, UploadView } from '@quiz/core';
import { api } from '../../api.ts';
import { me, toast, loadManifest } from '../../state.ts';
import { fmtDate } from '../../lib/util.ts';
import { Page, Spinner, ErrorBox, useAsync, Pill, absUrl, copyText } from '../../components/common.tsx';
import { Player } from '../../components/Player.tsx';
import { CheckResultView, statusPill } from '../Social.tsx';

const TABS = [
  ['uploads', '업로드 승인'], ['reports', '신고'], ['aliases', '별칭 후보'], ['invites', '초대 링크'], ['users', '계정'], ['content', '콘텐츠'],
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

function Reports() {
  const [status, setStatus] = useState('open');
  const r = useAsync(() => api.admin.reports(status), [status]);
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
            <div class="btn-row"><Pill tone="blue">{x.type}</Pill><b>{x.reporter}</b><span class="muted">{fmtDate(x.createdAt)}</span><span class="muted">{x.itemId}</span></div>
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
