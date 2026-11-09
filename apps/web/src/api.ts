// API 클라이언트 (docs/설계_v2.md 14장). 타입 계약은 @quiz/core.
import type {
  Me, Manifest, SetDetail, Term, SessionSubmit, SessionResult, Analysis, SubjectPref, ReviewSummary, ReviewBatch,
  LeaderboardRow, FileCheckResult, UploadView, ReportView, ReportType, CommentView, InviteView, AdminUserView,
  AliasCandidateView, ContentStatus, Exam,
} from '@quiz/core';
import { lsGet, lsSet } from './lib/util.ts';

export class ApiError extends Error {
  status: number; body: unknown;
  constructor(status: number, message: string, body: unknown) { super(message); this.status = status; this.body = body; }
}

/** 401 을 받으면 부르는 콜백 (main 에서 로그인 화면으로 보냄) */
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(f: () => void) { onUnauthorized = f; }

async function req<T>(method: string, path: string, body?: unknown, opts: { raw?: boolean; quiet401?: boolean } = {}): Promise<T> {
  const init: RequestInit = { method, credentials: 'same-origin', headers: {} };
  if (body instanceof FormData) init.body = body;
  else if (body !== undefined) { init.body = JSON.stringify(body); (init.headers as Record<string, string>)['Content-Type'] = 'application/json'; }
  const r = await fetch('/api' + path, init);
  if (opts.raw && r.ok) return (await r.text()) as unknown as T;
  const text = await r.text();
  let data: unknown = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!r.ok) {
    if (r.status === 401 && !opts.quiet401 && onUnauthorized) onUnauthorized();
    const msg = data && typeof data === 'object' && 'error' in (data as object) ? String((data as { error: unknown }).error) : `요청 실패 (${r.status})`;
    throw new ApiError(r.status, msg, data);
  }
  return data as T;
}
const enc = encodeURIComponent;
const q = (o: Record<string, string | undefined>) => '?' + new URLSearchParams(Object.entries(o).filter(([, v]) => v != null) as [string, string][]).toString();

export const api = {
  // 계정
  login: (username: string, password: string) => req<Me>('POST', '/auth/login', { username, password }, { quiet401: true }),
  logout: () => req<unknown>('POST', '/auth/logout'),
  me: () => req<Me>('GET', '/auth/me', undefined, { quiet401: true }),
  invite: (token: string) => req<{ valid: boolean }>('GET', `/invites/${enc(token)}`, undefined, { quiet401: true }),
  register: (b: { token: string; username: string; nickname: string; password: string }) => req<Me>('POST', '/auth/register', b, { quiet401: true }),
  reset: (token: string, password: string) => req<unknown>('POST', '/auth/reset', { token, password }, { quiet401: true }),
  updateMe: (b: { nickname?: string; password?: string; currentPassword?: string }) => req<Me>('PATCH', '/me', b),
  // 콘텐츠
  manifest: () => req<Manifest>('GET', '/content/manifest'),
  set: (path: string) => req<SetDetail>('GET', '/content/set' + q({ path })),
  terms: (subject?: string, exam?: string) => req<Term[]>('GET', '/content/terms' + q({ subject, exam })),
  raw: (path: string) => req<string>('GET', '/content/raw' + q({ path }), undefined, { raw: true }),
  // 풀이
  submitSession: (s: SessionSubmit) => req<SessionResult>('POST', '/sessions', s),
  analysis: (subject: string, exam: Exam) => req<Analysis>('GET', '/me/analysis' + q({ subject, exam })),
  pins: (subject: string) => req<string[]>('GET', '/me/pins' + q({ subject })),
  setPins: (subject: string, itemIds: string[], on: boolean) => req<unknown>('PUT', '/me/pins', { subject, itemIds, on }),
  resetAnalysis: (subject: string, exam: Exam) => req<unknown>('POST', '/me/analysis/reset', { subject, exam }),
  prefs: () => req<SubjectPref[]>('GET', '/me/subject-prefs'),
  setPrefs: (subjects: SubjectPref[]) => req<SubjectPref[]>('PUT', '/me/subject-prefs', { subjects }),
  reviewSummary: (subject: string, exam: Exam) => req<ReviewSummary>('GET', '/review/summary' + q({ subject, exam })),
  reviewBatch: (subject: string, exam: Exam) => req<ReviewBatch>('POST', '/review/batches', { subject, exam }),
  leaderboard: () => req<LeaderboardRow[]>('GET', '/leaderboard'),
  // 업로드
  checkUploads: (files: File[]) => { const f = new FormData(); files.forEach((x) => f.append('files', x, x.name)); return req<FileCheckResult[]>('POST', '/uploads/check', f); },
  submitUploads: (files: File[]) => { const f = new FormData(); files.forEach((x) => f.append('files', x, x.name)); return req<{ upload: UploadView; results: FileCheckResult[] }>('POST', '/uploads', f); },
  myUploads: () => req<UploadView[]>('GET', '/uploads/mine'),
  cancelUpload: (id: number) => req<unknown>('DELETE', `/uploads/${id}`),
  // 신고 · 댓글
  report: (b: { itemId: string; type: ReportType; body: string; setPath: string }) => req<unknown>('POST', '/reports', b),
  myReports: () => req<ReportView[]>('GET', '/reports/mine'),
  comments: (itemId: string) => req<CommentView[]>('GET', `/items/${enc(itemId)}/comments`),
  addComment: (itemId: string, body: string) => req<CommentView>('POST', `/items/${enc(itemId)}/comments`, { body }),
  editComment: (id: number, body: string) => req<CommentView>('PATCH', `/comments/${id}`, { body }),
  deleteComment: (id: number) => req<unknown>('DELETE', `/comments/${id}`),
  // 관리자
  admin: {
    uploads: (status?: string) => req<UploadView[]>('GET', '/admin/uploads' + q({ status })),
    upload: (id: number) => req<UploadView>('GET', `/admin/uploads/${id}`),
    preview: (id: number, fileId: number) => req<SetDetail>('GET', `/admin/uploads/${id}/files/${fileId}/preview`),
    decide: (id: number, files: { id: number; approve: boolean; reason?: string }[]) =>
      req<{ ok: boolean; commitSha?: string; hookOutput?: string; error?: string }>('POST', `/admin/uploads/${id}/decide`, { files }),
    reports: (status?: string) => req<ReportView[]>('GET', '/admin/reports' + q({ status })),
    updateReport: (id: number, status: string, note: string) => req<unknown>('PATCH', `/admin/reports/${id}`, { status, note }),
    aliases: () => req<AliasCandidateView[]>('GET', '/admin/aliases'),
    decideAlias: (id: number, confirm: boolean) => req<unknown>('POST', `/admin/aliases/${id}`, { confirm }),
    invites: () => req<InviteView[]>('GET', '/admin/invites'),
    createInvite: (expiresInDays: number, maxUses: number) => req<InviteView>('POST', '/admin/invites', { expiresInDays, maxUses }),
    revokeInvite: (id: number) => req<unknown>('DELETE', `/admin/invites/${id}`),
    users: () => req<AdminUserView[]>('GET', '/admin/users'),
    setUserStatus: (id: number, status: 'active' | 'suspended') => req<unknown>('PATCH', `/admin/users/${id}`, { status }),
    resetLink: (id: number) => req<{ url: string }>('POST', `/admin/users/${id}/reset-link`),
    reload: () => req<unknown>('POST', '/admin/content/reload'),
    contentStatus: () => req<ContentStatus>('GET', '/admin/content/status'),
  },
};

// ── 세션 대기열: 전송 실패한 세션을 localStorage 에 두고 다시 보낸다 ──
const QUEUE_KEY = 'quizV2.pendingSessions';
export function pendingSessions(): SessionSubmit[] { return lsGet<SessionSubmit[]>(QUEUE_KEY, []); }
function savePending(list: SessionSubmit[]) { lsSet(QUEUE_KEY, list); }

/** 세션을 보낸다. 네트워크 · 서버 오류(5xx)면 대기열에 넣고 null. 4xx(검증 실패)는 버리고 오류를 던진다 */
export async function submitSessionQueued(s: SessionSubmit): Promise<SessionResult | null> {
  try {
    const r = await api.submitSession(s);
    void flushPending();
    return r;
  } catch (e) {
    if (e instanceof ApiError && e.status >= 400 && e.status < 500 && e.status !== 401 && e.status !== 408 && e.status !== 429) throw e;
    const list = pendingSessions();
    if (!list.some((x) => x.clientSessionId === s.clientSessionId)) { list.push(s); savePending(list); }
    return null;
  }
}
let flushing = false;
export async function flushPending(): Promise<number> {
  if (flushing) return 0;
  flushing = true;
  let sent = 0;
  try {
    for (const s of pendingSessions()) {
      try {
        await api.submitSession(s);
        sent++;
        savePending(pendingSessions().filter((x) => x.clientSessionId !== s.clientSessionId));
      } catch (e) {
        if (e instanceof ApiError && e.status >= 400 && e.status < 500 && e.status !== 401 && e.status !== 408 && e.status !== 429) {
          savePending(pendingSessions().filter((x) => x.clientSessionId !== s.clientSessionId)); // 검증 실패: 버림
        } else break;
      }
    }
  } finally { flushing = false; }
  return sent;
}
window.addEventListener('online', () => { void flushPending(); });
