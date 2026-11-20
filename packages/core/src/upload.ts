// 업로드 JSON 검사 · JSX 변환 (설계 8장)
import { parseJSX, type Evaluate } from './parse.ts';
import { validateParsedSet } from './validate.ts';
import { newFixedId } from './itemId.ts';
import { similarity } from './similar.ts';
import { scopeIssues } from './scope.ts';
import { DEFAULT_DIFFICULTY_MIX, difficultyMixGap } from './difficulty.ts';
import type { Catalog, CheckMessage, Difficulty, Exam, FileCheckResult, Kind, ParsedSet, UploadJson } from './types.ts';
import { DIFFICULTIES, EXAMS, KINDS } from './types.ts';

const META_KEYS = new Set(['subject', 'exam', 'kind', 'title', 'unit', 'topic', 'grade', 'semester', 'scopeRev']);
const Q_KEYS = new Set(['category', 'question', 'answer', 'choices', 'answers', 'displayAnswer', 'hint', 'explanation', 'source', 'difficulty']);
/** 난이도 비율 경고: 난이도를 적은 문항이 이만큼 이상일 때, 목표 비율과 이만큼(%p) 넘게 다르면 */
export const MIX_WARN_MIN = 10, MIX_WARN_GAP = 15;
const T_KEYS = new Set(['terms', 'group', 'desc']);

export interface ExistingQuestion { subject: string; path: string; question: string }
export interface CheckUploadContext {
  catalog: Catalog;
  existing: ExistingQuestion[];       // 같은 과목 비교용 (기존 콘텐츠)
  dupThreshold?: number;              // 기본 0.8
  evaluate?: Evaluate;
}

/** 스키마 검사. 통과하면 data 를 돌려준다 */
export function checkUploadSchema(raw: unknown, catalog: Catalog): { data: UploadJson | null; messages: CheckMessage[]; newSubject: { grade: number; semester: 1 | 2 } | null } {
  const messages: CheckMessage[] = [];
  const err = (where: string, message: string) => messages.push({ level: 'error', where, message });
  let newSubject: { grade: number; semester: 1 | 2 } | null = null;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) { err('파일', '최상위는 객체여야 합니다.'); return { data: null, messages, newSubject }; }
  const o = raw as Record<string, unknown>;
  for (const k of Object.keys(o)) if (!['meta', 'questions', 'terms'].includes(k)) err('파일', `모르는 필드: ${k}`);
  const m = o.meta as Record<string, unknown> | undefined;
  if (!m || typeof m !== 'object') { err('meta', 'meta 가 없습니다.'); return { data: null, messages, newSubject }; }
  for (const k of Object.keys(m)) if (!META_KEYS.has(k)) err('meta', `받지 않는 필드: ${k}`);
  const str = (k: string, req: boolean) => {
    const v = m[k];
    if (v == null) { if (req) err('meta', `${k} 가 필요합니다.`); return; }
    if (typeof v !== 'string' || !v.trim()) err('meta', `${k} 는 비어 있지 않은 문자열이어야 합니다.`);
  };
  str('subject', true); str('title', true); str('unit', false); str('topic', false);
  if (!EXAMS.includes(m.exam as never)) err('meta', 'exam 은 "중간고사" 또는 "기말고사"');
  if (!KINDS.includes(m.kind as never)) err('meta', 'kind 는 일반문제 · 모의고사 · 기출 · 단어집 중 하나');
  if (m.scopeRev != null && (!Number.isInteger(m.scopeRev) || (m.scopeRev as number) < 1)) err('meta', 'scopeRev 는 1 이상의 정수(범위 rev)여야 합니다.');
  if (typeof m.subject === 'string' && /[\/\\]|^\.|\.\./.test(m.subject)) err('meta', 'subject 에 / \\ . 로 시작하는 이름은 쓸 수 없습니다.');
  if (typeof m.subject === 'string') {
    const subj = m.subject.normalize('NFC').trim();
    const entry = catalog.find((c) => c.subject === subj);
    if (entry) {
      if (m.grade != null && m.grade !== entry.grade) err('meta', `grade 가 과목목록(${entry.grade}학년)과 다릅니다.`);
      if (m.semester != null && m.semester !== entry.semester) err('meta', `semester 가 과목목록(${entry.semester}학기)과 다릅니다.`);
    } else {
      if (!Number.isInteger(m.grade) || (m.grade as number) < 1) err('meta', '새 과목이면 grade(학년, 1 이상 정수)가 필요합니다.');
      if (m.semester !== 1 && m.semester !== 2) err('meta', '새 과목이면 semester(1 또는 2)가 필요합니다.');
      if (Number.isInteger(m.grade) && (m.semester === 1 || m.semester === 2)) newSubject = { grade: m.grade as number, semester: m.semester };
    }
  }
  const qs = o.questions, ts = o.terms;
  if (qs != null && !Array.isArray(qs)) err('questions', '배열이어야 합니다.');
  if (ts != null && !Array.isArray(ts)) err('terms', '배열이어야 합니다.');
  const qa = Array.isArray(qs) ? qs : [], ta = Array.isArray(ts) ? ts : [];
  if (!qa.length && !ta.length) err('파일', 'questions 와 terms 가 모두 비어 있습니다.');
  if (m.kind === '단어집' && !ta.length) err('terms', '단어집은 terms 가 필요합니다.');
  qa.forEach((q, i) => {
    if (!q || typeof q !== 'object') { err(`${i + 1}번`, '객체여야 합니다.'); return; }
    for (const k of Object.keys(q)) if (!Q_KEYS.has(k)) err(`${i + 1}번`, `받지 않는 필드: ${k}`);
    const x = q as Record<string, unknown>;
    if (x.difficulty != null && !DIFFICULTIES.includes(x.difficulty as Difficulty)) err(`${i + 1}번`, `difficulty 는 "기초" · "표준" · "심화" 중 하나여야 합니다: ${JSON.stringify(x.difficulty)}`);
    if (x.source != null && (typeof x.source !== 'string' || !x.source.trim())) err(`${i + 1}번`, 'source 는 비어 있지 않은 문자열이어야 합니다.');
  });
  ta.forEach((t, i) => {
    if (!t || typeof t !== 'object') { err(`용어 ${i + 1}번`, '객체여야 합니다.'); return; }
    for (const k of Object.keys(t)) if (!T_KEYS.has(k)) err(`용어 ${i + 1}번`, `받지 않는 필드: ${k}`);
  });
  if (JSON.stringify(raw).includes('registerPractice(')) err('파일', '"registerPractice(" 글자는 쓸 수 없습니다.');
  return { data: messages.some((x) => x.level === 'error') ? null : (raw as UploadJson), messages, newSubject };
}

export interface JsxOptions { uploaderUsername: string; uploaderNickname: string; date: string; assignIds?: boolean; now?: number }

/** JSON → JSX 원문. 문항마다 고정 id 를 붙인다 */
export function uploadToJsx(data: UploadJson, o: JsxOptions): string {
  const m = data.meta;
  const meta: Record<string, unknown> = { group: m.subject.normalize('NFC').trim(), exam: m.exam };
  if (m.unit) meta.unit = m.unit;
  meta.title = m.title;
  if (m.topic) meta.topic = m.topic;
  if (m.scopeRev != null) meta.scopeRev = m.scopeRev;
  meta.uploader = o.uploaderUsername;
  let t = o.now ?? Date.now();
  const lines = [`// 업로드: ${o.uploaderNickname.replace(/[\r\n]/g, ' ')}(${o.uploaderUsername}) · ${o.date}`, `const META = ${JSON.stringify(meta)};`, ''];
  if (data.questions?.length) {
    lines.push('const QUESTIONS = [');
    for (const q of data.questions) lines.push('  ' + JSON.stringify(o.assignIds === false ? q : { id: newFixedId(t++), ...q }) + ',');
    lines.push('];', '');
  }
  if (data.terms?.length) {
    lines.push('const TERMS = [');
    for (const x of data.terms) lines.push('  ' + JSON.stringify(x) + ',');
    lines.push('];', '');
  }
  return lines.join('\n');
}

/** 저장 경로 후보: <과목>/<kind>/<과목>_<제목>.jsx (중복이면 _2, _3 …) */
export function uploadTargetPath(data: UploadJson, exists: (p: string) => boolean): string {
  const subj = data.meta.subject.normalize('NFC').trim();
  const title = data.meta.title.normalize('NFC').trim().replace(/\s+/g, '_').replace(/[\\/:*?"<>|#%\u0000-\u001f]/g, '').slice(0, 80) || '세트';
  const base = `${subj}/${data.meta.kind as Kind}/${subj}_${title}`;
  let p = base + '.jsx', n = 2;
  while (exists(p)) p = `${base}_${n++}.jsx`;
  return p;
}

/** 파일 하나 전체 검사 (스키마 → JSX 변환 → 파서로 다시 읽기 → 세트 규칙 → 기존 · 같은 제출 내 비슷한 문제) */
export function checkUploadFile(name: string, raw: unknown, ctx: CheckUploadContext, batchOthers: { name: string; data: UploadJson }[] = []): FileCheckResult & { data: UploadJson | null; parsed: ParsedSet | null } {
  const { data, messages, newSubject } = checkUploadSchema(raw, ctx.catalog);
  const res: FileCheckResult & { data: UploadJson | null; parsed: ParsedSet | null } = { name, ok: false, messages, data, parsed: null, newSubject };
  if (!data) return res;
  res.subject = data.meta.subject.normalize('NFC').trim(); res.exam = data.meta.exam; res.kind = data.meta.kind; res.title = data.meta.title;
  let parsed: ParsedSet;
  try {
    const code = uploadToJsx(data, { uploaderUsername: 'x', uploaderNickname: 'x', date: '', assignIds: false });
    parsed = parseJSX(`${res.subject}/${data.meta.kind}/x.jsx`, code, { group: res.subject, evaluate: ctx.evaluate });
  } catch (e) {
    messages.push({ level: 'error', where: '파일', message: '변환 후 다시 읽기 실패: ' + (e as Error).message });
    return res;
  }
  res.parsed = parsed;
  res.questionCount = parsed.questions.length; res.termCount = parsed.terms.length;
  messages.push(...validateParsedSet(parsed));
  const th = ctx.dupThreshold ?? 0.8;
  const same = ctx.existing.filter((e) => e.subject === res.subject);
  parsed.questions.forEach((q, i) => {
    for (const e of same) {
      const s = similarity(q.question, e.question);
      if (s >= th) { messages.push({ level: 'warn', where: `${i + 1}번`, message: `기존 문제와 비슷합니다(${Math.round(s * 100)}%): ${e.path} — ${e.question.slice(0, 60)}` }); break; }
    }
    for (const o of batchOthers) {
      if (o.name === name || o.data.meta.subject.normalize('NFC').trim() !== res.subject) continue;
      const hit = (o.data.questions || []).find((x) => similarity(q.question, String((x as { question?: unknown }).question ?? '')) >= th);
      if (hit) { messages.push({ level: 'warn', where: `${i + 1}번`, message: `같이 올린 ${o.name} 의 문제와 비슷합니다.` }); break; }
    }
  });
  messages.push(...scopeAndDifficultyWarnings(data, parsed, ctx.catalog));
  res.ok = !messages.some((x) => x.level === 'error');
  return res;
}

/** 범위 · 난이도 경고 (오류 아님): 출처 · 난이도 누락, scopeRev, 범위 밖 의심, 난이도 비율 */
function scopeAndDifficultyWarnings(data: UploadJson, parsed: ParsedSet, catalog: Catalog): CheckMessage[] {
  const out: CheckMessage[] = [];
  const warn = (where: string, message: string) => out.push({ level: 'warn', where, message });
  const qs = parsed.questions;
  if (qs.length) {
    const noDiff = qs.filter((q) => !q.difficulty).length, noSrc = qs.filter((q) => !q.source).length;
    if (noDiff) warn('파일', `difficulty 가 없는 문항 ${noDiff}개 / ${qs.length}개 ("기초" · "표준" · "심화" 중 하나를 적어 주세요)`);
    if (noSrc) warn('파일', `source(출처)가 없는 문항 ${noSrc}개 / ${qs.length}개`);
  }
  const subj = data.meta.subject.normalize('NFC').trim();
  const scope = catalog.find((c) => c.subject === subj)?.scope?.[data.meta.exam as Exam];
  const rev = data.meta.scopeRev;
  if (scope) {
    if (rev == null) warn('meta', `scopeRev 가 없습니다. 지금 ${data.meta.exam} 범위는 rev ${scope.rev} 입니다.`);
    else if (rev !== scope.rev) warn('meta', `scopeRev ${rev} 가 지금 ${data.meta.exam} 범위(rev ${scope.rev})와 다릅니다. 바뀐 범위를 확인하세요.`);
    qs.forEach((q, i) => {
      const r = scopeIssues(scope, { unit: parsed.unit, category: q.category, topic: parsed.topic, question: q.question });
      if (r.length) warn(`${i + 1}번`, `범위 밖 의심: ${r.join(' · ')}`);
    });
  } else if (rev != null) warn('meta', `scopeRev 를 적었지만 ${subj} ${data.meta.exam} 에는 등록된 범위가 없습니다.`);
  const counts: Partial<Record<Difficulty, number>> = {};
  for (const q of qs) if (q.difficulty && DIFFICULTIES.includes(q.difficulty)) counts[q.difficulty] = (counts[q.difficulty] ?? 0) + 1;
  const n = Object.values(counts).reduce((a, b) => a + (b ?? 0), 0);
  if (n >= MIX_WARN_MIN) {
    const mix = scope?.difficultyMix ?? DEFAULT_DIFFICULTY_MIX;
    const g = difficultyMixGap(counts, mix);
    if (g && g.gap > MIX_WARN_GAP) {
      const show = (c: Partial<Record<Difficulty, number>>) => DIFFICULTIES.map((d) => `${d} ${c[d] ?? 0}`).join(' : ');
      warn('파일', `난이도 비율이 목표와 다릅니다 — ${g.difficulty} ${Math.round(g.actual)}% (목표 ${Math.round(g.target)}%). 이 파일 ${show(counts)}, 목표 ${show(mix)}`);
    }
  }
  return out;
}
