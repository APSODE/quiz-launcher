// 시험 범위 (과목목록.json 의 scope[시험]). 업로드 검사의 "범위 밖 의심" 경고와 서버 로더의 의심 표시가 같은 함수를 쓴다.
import { DIFFICULTIES, type Difficulty, type ExamScope } from './types.ts';

/** 키워드 비교용: NFC · 공백 제거 · 소문자 */
export function normalizeKw(s: unknown): string {
  return String(s ?? '').normalize('NFC').replace(/\s+/g, '').toLowerCase();
}

export interface ScopeTarget { unit?: string; category?: string; topic?: string; question?: string }

/** 범위 밖 의심 이유. 범위가 없거나 해당 없음이면 [] */
export function scopeIssues(scope: ExamScope | undefined | null, q: ScopeTarget): string[] {
  if (!scope) return [];
  const out: string[] = [];
  const unit = (q.unit ?? '').trim();
  // 단원: units 가 비었거나 세트에 unit 이 없으면 판정하지 않는다
  if (scope.units.length && unit && !scope.units.includes(unit)) out.push(`단원 '${unit}' 이 시험 범위(${scope.units.join(', ')})에 없습니다`);
  const hay = [q.category, q.topic, q.question].map(normalizeKw);
  for (const kw of scope.exclude) {
    const k = normalizeKw(kw);
    if (k && hay.some((h) => h.includes(k))) out.push(`제외 항목 '${kw}' 에 해당합니다`);
  }
  return out;
}

const SCOPE_KEYS = new Set(['rev', 'updatedAt', 'units', 'include', 'exclude', 'trend', 'difficultyMix', 'note']);

/** 범위 하나 검사 · 정규화. 잘못되면 scope = null + 오류. requireRev = false 면 관리자 입력(ExamScopeInput)처럼 rev 없이도 받는다(rev = 0) */
export function validateExamScope(v: unknown, opts: { requireRev?: boolean } = {}): { scope: ExamScope | null; errors: string[] } {
  const errors: string[] = [];
  if (!v || typeof v !== 'object' || Array.isArray(v)) return { scope: null, errors: ['객체여야 합니다'] };
  const o = v as Record<string, unknown>;
  for (const k of Object.keys(o)) if (!SCOPE_KEYS.has(k)) errors.push(`모르는 필드: ${k}`);
  if (opts.requireRev !== false || o.rev !== undefined) {
    if (!Number.isInteger(o.rev) || (o.rev as number) < 1) errors.push('rev 는 1 이상의 정수');
  }
  if (o.updatedAt !== undefined && (typeof o.updatedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(o.updatedAt))) errors.push('updatedAt 은 "YYYY-MM-DD"');
  const list = (k: string): string[] => {
    const x = o[k];
    if (x === undefined) return [];
    if (!Array.isArray(x) || x.some((s) => typeof s !== 'string' || !s.trim())) { errors.push(`${k} 는 비어 있지 않은 문자열 배열`); return []; }
    return x.map((s: string) => s.normalize('NFC').trim());
  };
  const scope: ExamScope = { rev: (o.rev as number | undefined) ?? 0, units: list('units'), include: list('include'), exclude: list('exclude') };
  if (typeof o.updatedAt === 'string') scope.updatedAt = o.updatedAt;
  for (const k of ['trend', 'note'] as const) {
    if (o[k] === undefined) continue;
    if (typeof o[k] !== 'string') errors.push(`${k} 는 문자열`);
    else if ((o[k] as string).trim()) scope[k] = (o[k] as string).trim();
  }
  if (o.difficultyMix !== undefined) {
    const m = o.difficultyMix as Record<string, unknown>;
    if (!m || typeof m !== 'object' || Array.isArray(m)) errors.push('difficultyMix 는 객체 (예: {"기초":3,"표준":5,"심화":2})');
    else {
      const bad = Object.keys(m).filter((k) => !DIFFICULTIES.includes(k as Difficulty));
      if (bad.length) errors.push(`difficultyMix 에 모르는 난이도: ${bad.join(', ')} (기초 · 표준 · 심화)`);
      else if (Object.values(m).some((x) => typeof x !== 'number' || !Number.isFinite(x) || x < 0)) errors.push('difficultyMix 값은 0 이상의 숫자');
      else if (!Object.values(m).some((x) => (x as number) > 0)) errors.push('difficultyMix 합이 0 입니다');
      else scope.difficultyMix = Object.fromEntries(DIFFICULTIES.filter((d) => d in m).map((d) => [d, m[d] as number]));
    }
  }
  return errors.length ? { scope: null, errors } : { scope, errors };
}
