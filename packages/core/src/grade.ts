// 채점: 브라우저(즉시 표시)와 서버(저장용 재채점)가 같은 함수를 쓴다. 규칙은 기존 실행기와 같다.
import { normalizeAnswer } from './parse.ts';
import type { Question, RawAnswer, Term } from './types.ts';

export function checkShortAnswer(input: unknown, q: Pick<Question, 'answers'>): boolean {
  const norm = normalizeAnswer(input ?? '');
  if (!norm) return false;
  return (q.answers || []).some((a) => normalizeAnswer(a) === norm);
}

/** 원래 답(raw)을 채점한다. raw 형식이 문항 유형과 맞지 않으면 오답. */
export function gradeAnswer(q: Question, raw: RawAnswer): boolean {
  if (raw === null || raw === undefined) return false;
  if (q.type === 'ox') return typeof raw === 'boolean' && raw === q.answer;
  if (q.type === 'choice') return typeof raw === 'number' && Number.isInteger(raw) && raw === q.answerIndex && raw >= 0;
  return typeof raw === 'string' && checkShortAnswer(raw, q);
}

/** 단어 암기 테스트: 공백 · . · , · - · _ 제거 + 소문자 */
export function normalizeTerm(s: unknown): string {
  return String(s ?? '').toLowerCase().replace(/[\s.,\-_]/g, '');
}
export function checkTermAnswer(input: unknown, t: Term): boolean {
  const n = normalizeTerm(input);
  return !!n && t.terms.some((x) => normalizeTerm(x) === n);
}
