// 시험 범위 (과목목록.json 의 scope[시험]) 미리보기 · 저장 — 관리자 전용
import { Hono } from 'hono';
import {
  formatCatalog, scopeIssues, validateExamScope, EXAMS,
  type Exam, type ExamScope, type ScopePreview, type ScopeSaveResult,
} from '@quiz/core';
import type { AppContext } from './context.ts';
import { requireAdmin, type Env } from './auth.ts';
import { commitContent, readCatalogFile } from './contentCommit.ts';
import { body, fail, int, str } from './util.ts';

/** 요청 본문의 subject · exam · scope(ExamScopeInput) 검사. rev · updatedAt 은 서버가 정하므로 무시한다 */
function parseRequest(b: Record<string, unknown>): { subject: string; exam: Exam; scope: ExamScope } {
  const subject = str(b.subject, 'subject', { max: 100 }).normalize('NFC');
  const exam = b.exam as Exam;
  if (!EXAMS.includes(exam)) fail(400, 'exam 은 중간고사 · 기말고사 중 하나여야 합니다.');
  if (!b.scope || typeof b.scope !== 'object' || Array.isArray(b.scope)) fail(400, 'scope 객체가 필요합니다.');
  const { rev: _r, updatedAt: _u, ...input } = b.scope as Record<string, unknown>;
  const r = validateExamScope(input, { requireRev: false });
  if (!r.scope) fail(400, '범위 형식 오류: ' + r.errors.join(' · '));
  return { subject, exam, scope: r.scope };
}

/** 현재 콘텐츠에 범위를 적용했을 때 의심 문항 (세트 경로 순) */
export function previewScope(app: AppContext, subject: string, exam: Exam, scope: ExamScope | undefined): ScopePreview {
  const sets: ScopePreview['sets'] = [];
  let suspectCount = 0;
  const entries = [...app.content.data.sets.values()].filter((s) => s.summary.subject === subject && s.summary.exam === exam)
    .sort((a, b) => a.summary.path.localeCompare(b.summary.path));
  for (const s of entries) {
    const suspects = s.items.map((q) => ({ itemId: q.itemId, question: q.question, reasons: scopeIssues(scope, { unit: s.summary.unit, category: q.category, topic: s.summary.topic, question: q.question }) }))
      .filter((x) => x.reasons.length);
    if (!suspects.length) continue;
    suspectCount += suspects.length;
    sets.push({ path: s.summary.path, title: s.summary.title, suspects });
  }
  return { subject, exam, suspectCount, sets };
}

export function scopeRoutes(): Hono<Env> {
  const r = new Hono<Env>();

  // 커밋 없이 의심 문항 계산
  r.post('/admin/scope/preview', async (c) => {
    requireAdmin(c);
    const app = c.get('app');
    const { subject, exam, scope } = parseRequest(await body(c));
    return c.json(previewScope(app, subject, exam, scope));
  });

  // 저장: 잠금 안에서 pull → rev 비교(다르면 409) → rev + 1 · updatedAt → 과목목록 커밋 · push · reload
  r.put('/admin/scope', async (c) => {
    const admin = requireAdmin(c);
    const app = c.get('app');
    const b = await body(c);
    const { subject, exam, scope } = parseRequest(b);
    const baseRev = int(b.baseRev ?? 0, 'baseRev');
    const st = { rev: 0, conflict: null as string | null };
    const out = await app.lock.run(() => commitContent(app, () => {
      const cat = readCatalogFile(app.config.contentDir);
      if (cat.fatal) return { error: cat.fatal };
      if (cat.errors.length) return { error: '과목목록.json 오류를 먼저 고치세요: ' + cat.errors.join(' / ') };
      const entry = cat.entries.find((e) => e.subject === subject);
      if (!entry) return { error: `과목목록에 없는 과목입니다: ${subject}` };
      const cur = entry.scope?.[exam]?.rev ?? 0;
      if (cur !== baseRev) { st.conflict = `다른 곳에서 범위가 바뀌었습니다(현재 rev ${cur}, 편집 시작 rev ${baseRev}). 새로 불러온 뒤 다시 저장하세요.`; return { error: st.conflict }; }
      const rev = st.rev = cur + 1;
      const saved: ExamScope = { ...scope, rev, updatedAt: new Date().toISOString().slice(0, 10) };
      entry.scope = { ...entry.scope, [exam]: saved };
      return { writes: [{ path: '과목목록.json', content: formatCatalog(cat.entries) }], message: `범위: ${subject} ${exam} rev ${rev} (${admin.nickname})` };
    }));
    if (st.conflict) return c.json({ ok: false, error: st.conflict } satisfies ScopeSaveResult, 409);
    const res: ScopeSaveResult = { ok: out.ok, ...(out.committed ? { rev: st.rev } : {}), ...(out.commitSha ? { commitSha: out.commitSha } : {}), ...(out.hookOutput ? { hookOutput: out.hookOutput } : {}), ...(out.error ? { error: out.error } : {}) };
    if (out.committed) res.suspectCount = previewScope(app, subject, exam, app.content.data.catalog.find((e) => e.subject === subject)?.scope?.[exam]).suspectCount;
    return c.json(res);
  });

  return r;
}
