// 문항 신고 · 댓글 (설계 9장) + 관리자 기능(신고 처리 · 별칭 · 초대 · 계정 · 콘텐츠)
import { Hono } from 'hono';
import {
  REPORT_TYPES,
  type AdminUserView, type AliasCandidateView, type CommentView, type InviteView, type Item, type ReportType, type ReportView,
} from '@quiz/core';
import type { AppContext } from './context.ts';
import { all, get, run, tx } from './db.ts';
import { createInvite, createResetLink, requireAdmin, requireUser, type Env } from './auth.ts';
import { body, fail, int, now, str } from './util.ts';

interface ReportRow { id: number; user_id: number; item_id: string; type: ReportType; body: string; snapshot: string; status: ReportView['status']; admin_note: string | null; created_at: number; resolved_at: number | null }
interface CommentRow { id: number; user_id: number; item_id: string; body: string; created_at: number; updated_at: number | null; deleted_at: number | null }

function reportView(app: AppContext, r: ReportRow): ReportView {
  const nick = get<{ nickname: string }>(app.db, 'SELECT nickname FROM users WHERE id = ?', r.user_id)?.nickname ?? '?';
  return { id: r.id, itemId: app.resolve(r.item_id), type: r.type, body: r.body, snapshot: JSON.parse(r.snapshot), status: r.status, adminNote: r.admin_note, createdAt: r.created_at, resolvedAt: r.resolved_at, reporter: nick };
}
function commentView(app: AppContext, r: CommentRow, me: number): CommentView {
  const nick = get<{ nickname: string }>(app.db, 'SELECT nickname FROM users WHERE id = ?', r.user_id)?.nickname ?? '?';
  return { id: r.id, itemId: app.resolve(r.item_id), nickname: nick, mine: r.user_id === me, body: r.body, createdAt: r.created_at, updatedAt: r.updated_at };
}
const answerOf = (q: Item): unknown =>
  q.type === 'ox' ? q.answer : q.type === 'choice' ? (q.choices ?? [])[q.answerIndex ?? -1] ?? null : q.displayAnswer ?? (q.answers ?? [])[0] ?? null;

export function socialRoutes(): Hono<Env> {
  const r = new Hono<Env>();

  // ── 신고 ──
  r.post('/reports', async (c) => {
    const u = requireUser(c);
    const app = c.get('app');
    const b = await body(c);
    const itemId = app.resolve(str(b.itemId, 'itemId'));
    const type = b.type as ReportType;
    if (!REPORT_TYPES.includes(type)) fail(400, '신고 유형이 잘못됐습니다.');
    const text = str(b.body, '설명', { optional: true, max: 1000 });
    const q = app.content.item(itemId);
    if (!q) fail(404, '문항을 찾을 수 없습니다.');
    const setPath = app.content.data.items.get(itemId)!.setPath;
    const snapshot = { question: q.question, answer: answerOf(q), explanation: q.explanation, setPath };
    const id = run(app.db, 'INSERT INTO reports (user_id, item_id, type, body, snapshot, created_at) VALUES (?, ?, ?, ?, ?, ?)', u.id, itemId, type, text, JSON.stringify(snapshot), now()).id;
    return c.json(reportView(app, get<ReportRow>(app.db, 'SELECT * FROM reports WHERE id = ?', id)!));
  });
  r.get('/reports/mine', (c) => {
    const u = requireUser(c);
    const app = c.get('app');
    return c.json(all<ReportRow>(app.db, 'SELECT * FROM reports WHERE user_id = ? ORDER BY id DESC', u.id).map((x) => reportView(app, x)));
  });

  // ── 댓글 ──
  r.get('/items/:itemId/comments', (c) => {
    const u = requireUser(c);
    const app = c.get('app');
    const ids = app.sourcesOf(decodeURIComponent(c.req.param('itemId')));
    const rows = all<CommentRow>(app.db, `SELECT * FROM comments WHERE deleted_at IS NULL AND item_id IN (${ids.map(() => '?').join(',')}) ORDER BY created_at`, ...ids);
    return c.json(rows.map((x) => commentView(app, x, u.id)));
  });
  r.post('/items/:itemId/comments', async (c) => {
    const u = requireUser(c);
    const app = c.get('app');
    const itemId = app.resolve(decodeURIComponent(c.req.param('itemId')));
    if (!app.content.item(itemId)) fail(404, '문항을 찾을 수 없습니다.');
    const b = await body(c);
    const text = str(b.body, '댓글', { min: 1, max: 1000 });
    const id = run(app.db, 'INSERT INTO comments (user_id, item_id, body, created_at) VALUES (?, ?, ?, ?)', u.id, itemId, text, now()).id;
    return c.json(commentView(app, get<CommentRow>(app.db, 'SELECT * FROM comments WHERE id = ?', id)!, u.id));
  });
  const ownComment = (app: AppContext, id: number, userId: number, admin: boolean): CommentRow => {
    const row = get<CommentRow>(app.db, 'SELECT * FROM comments WHERE id = ? AND deleted_at IS NULL', id);
    if (!row) fail(404, '댓글을 찾을 수 없습니다.');
    if (row.user_id !== userId && !admin) fail(403, '본인 댓글만 고칠 수 있습니다.');
    return row;
  };
  r.patch('/comments/:id', async (c) => {
    const u = requireUser(c);
    const app = c.get('app');
    const row = ownComment(app, int(c.req.param('id'), 'id'), u.id, false);
    const b = await body(c);
    run(app.db, 'UPDATE comments SET body = ?, updated_at = ? WHERE id = ?', str(b.body, '댓글', { min: 1, max: 1000 }), now(), row.id);
    return c.json(commentView(app, get<CommentRow>(app.db, 'SELECT * FROM comments WHERE id = ?', row.id)!, u.id));
  });
  r.delete('/comments/:id', (c) => {
    const u = requireUser(c);
    const app = c.get('app');
    const row = ownComment(app, int(c.req.param('id'), 'id'), u.id, u.role === 'admin');
    run(app.db, 'UPDATE comments SET deleted_at = ? WHERE id = ?', now(), row.id);
    return c.json({ ok: true });
  });

  // ── 관리자: 신고 ──
  r.get('/admin/reports', (c) => {
    requireAdmin(c);
    const app = c.get('app');
    const st = c.req.query('status');
    const rows = st ? all<ReportRow>(app.db, 'SELECT * FROM reports WHERE status = ? ORDER BY id DESC', st) : all<ReportRow>(app.db, 'SELECT * FROM reports ORDER BY id DESC');
    return c.json(rows.map((x) => reportView(app, x)));
  });
  r.patch('/admin/reports/:id', async (c) => {
    requireAdmin(c);
    const app = c.get('app');
    const b = await body(c);
    const status = b.status as ReportView['status'];
    if (!['open', 'resolved', 'dismissed'].includes(status)) fail(400, 'status 는 open · resolved · dismissed');
    const id = int(c.req.param('id'), 'id');
    if (!get(app.db, 'SELECT 1 FROM reports WHERE id = ?', id)) fail(404, '신고를 찾을 수 없습니다.');
    run(app.db, 'UPDATE reports SET status = ?, admin_note = ?, resolved_at = ? WHERE id = ?', status, str(b.note, 'note', { optional: true, max: 1000 }) || null, status === 'open' ? null : now(), id);
    return c.json(reportView(app, get<ReportRow>(app.db, 'SELECT * FROM reports WHERE id = ?', id)!));
  });

  // ── 관리자: 별칭 ──
  r.get('/admin/aliases', (c) => {
    requireAdmin(c);
    const rows = all<{ id: number; old_id: string; new_id: string; similarity: number; set_path: string; old_question: string; new_question: string; status: AliasCandidateView['status'] }>(
      c.get('app').db, 'SELECT * FROM alias_candidates ORDER BY status = \'open\' DESC, id DESC');
    return c.json(rows.map((x): AliasCandidateView => ({ id: x.id, oldId: x.old_id, newId: x.new_id, similarity: x.similarity, setPath: x.set_path, oldQuestion: x.old_question, newQuestion: x.new_question, status: x.status })));
  });
  r.post('/admin/aliases/:id', async (c) => {
    const admin = requireAdmin(c);
    const app = c.get('app');
    const b = await body(c);
    const cand = get<{ id: number; old_id: string; new_id: string; status: string }>(app.db, 'SELECT * FROM alias_candidates WHERE id = ?', int(c.req.param('id'), 'id'));
    if (!cand) fail(404, '후보를 찾을 수 없습니다.');
    if (cand.status !== 'open') fail(409, '이미 처리한 후보입니다.');
    tx(app.db, () => {
      if (b.confirm) {
        run(app.db, 'INSERT OR REPLACE INTO item_aliases (old_id, new_id, confirmed_by, confirmed_at) VALUES (?, ?, ?, ?)', cand.old_id, cand.new_id, admin.id, now());
        // 카드 · 📌 를 새 ID 로 옮긴다(새 ID 에 이미 있으면 옛 것은 버린다)
        run(app.db, 'UPDATE OR IGNORE srs_cards SET item_id = ? WHERE item_id = ?', cand.new_id, cand.old_id);
        run(app.db, 'DELETE FROM srs_cards WHERE item_id = ?', cand.old_id);
        run(app.db, 'UPDATE OR IGNORE pinned_items SET item_id = ? WHERE item_id = ?', cand.new_id, cand.old_id);
        run(app.db, 'DELETE FROM pinned_items WHERE item_id = ?', cand.old_id);
        run(app.db, "UPDATE alias_candidates SET status = 'dismissed' WHERE old_id = ? AND id <> ? AND status = 'open'", cand.old_id, cand.id);
      }
      run(app.db, 'UPDATE alias_candidates SET status = ? WHERE id = ?', b.confirm ? 'confirmed' : 'dismissed', cand.id);
    });
    app.loadAliases();
    return c.json({ ok: true });
  });

  // ── 관리자: 초대 ──
  const inviteView = (x: { id: number; expires_at: number; max_uses: number; used_count: number; revoked_at: number | null; created_at: number }, url: string | null): InviteView =>
    ({ id: x.id, url, expiresAt: x.expires_at, maxUses: x.max_uses, usedCount: x.used_count, revoked: !!x.revoked_at, createdAt: x.created_at });
  r.get('/admin/invites', (c) => {
    requireAdmin(c);
    return c.json(all<Parameters<typeof inviteView>[0]>(c.get('app').db, 'SELECT * FROM invites ORDER BY id DESC').map((x) => inviteView(x, null)));
  });
  r.post('/admin/invites', async (c) => {
    const admin = requireAdmin(c);
    const app = c.get('app');
    const b = await body(c);
    const days = b.expiresInDays == null ? 7 : int(b.expiresInDays, 'expiresInDays');
    const max = b.maxUses == null ? 20 : int(b.maxUses, 'maxUses');
    if (days < 1 || days > 365 || max < 1 || max > 1000) fail(400, '만료일(1~365일) · 최대 사용 횟수(1~1000)를 확인하세요.');
    const inv = createInvite(app, admin.id, days, max);
    return c.json(inviteView(get(app.db, 'SELECT * FROM invites WHERE id = ?', inv.id)!, inv.url));
  });
  r.delete('/admin/invites/:id', (c) => {
    requireAdmin(c);
    run(c.get('app').db, 'UPDATE invites SET revoked_at = ? WHERE id = ? AND revoked_at IS NULL', now(), int(c.req.param('id'), 'id'));
    return c.json({ ok: true });
  });

  // ── 관리자: 계정 ──
  r.get('/admin/users', (c) => {
    requireAdmin(c);
    return c.json(all<AdminUserView & { created_at: number }>(c.get('app').db, 'SELECT id, username, nickname, role, status, created_at FROM users ORDER BY id')
      .map(({ created_at, ...x }) => ({ ...x, createdAt: created_at })));
  });
  r.patch('/admin/users/:id', async (c) => {
    const admin = requireAdmin(c);
    const app = c.get('app');
    const id = int(c.req.param('id'), 'id');
    const b = await body(c);
    if (b.status !== 'active' && b.status !== 'suspended') fail(400, 'status 는 active · suspended');
    if (id === admin.id) fail(400, '자기 계정은 정지할 수 없습니다.');
    if (!run(app.db, 'UPDATE users SET status = ? WHERE id = ?', b.status, id).changes) fail(404, '계정을 찾을 수 없습니다.');
    if (b.status === 'suspended') run(app.db, 'DELETE FROM auth_sessions WHERE user_id = ?', id);
    return c.json({ ok: true });
  });
  r.post('/admin/users/:id/reset-link', (c) => {
    const admin = requireAdmin(c);
    const app = c.get('app');
    const id = int(c.req.param('id'), 'id');
    if (!get(app.db, 'SELECT 1 FROM users WHERE id = ?', id)) fail(404, '계정을 찾을 수 없습니다.');
    return c.json({ url: createResetLink(app, id, admin.id) });
  });

  // ── 관리자: 콘텐츠 ──
  r.post('/admin/content/reload', async (c) => {
    requireAdmin(c);
    const app = c.get('app');
    await app.lock.run(() => app.pullAndReload());
    return c.json(app.status());
  });
  r.get('/admin/content/status', (c) => { requireAdmin(c); return c.json(c.get('app').status()); });

  return r;
}
