// 파싱된 세트 검사 (tools/check.js 의 문제 세트 규칙 중 핵심). 업로드 검사와 서버 로더가 쓴다.
import { normalizeAnswer } from './parse.ts';
import { questionHash } from './itemId.ts';
import type { CheckMessage, ParsedSet } from './types.ts';
import { EXAMS } from './types.ts';

export function validateParsedSet(set: ParsedSet, opts: { requireExam?: boolean } = {}): CheckMessage[] {
  const out: CheckMessage[] = [];
  const err = (where: string, message: string) => out.push({ level: 'error', where, message });
  const warn = (where: string, message: string) => out.push({ level: 'warn', where, message });

  if (opts.requireExam !== false) {
    if (!set.exam) err('META', 'exam 이 없습니다("중간고사" 또는 "기말고사").');
    else if (!EXAMS.includes(set.exam as never)) err('META', `exam 값이 잘못됐습니다: ${set.exam}`);
  }
  const seenQ = new Map<string, number>();
  const seenId = new Map<string, number>();
  let oxTrue = 0, oxAll = 0;
  set.questions.forEach((q, i) => {
    const w = `${i + 1}번`;
    if (typeof q.question !== 'string' || !q.question.trim()) err(w, 'question 이 비어 있습니다.');
    if (q.answer === 'true' || q.answer === 'false') err(w, 'OX 정답이 문자열입니다(따옴표 없이 true/false).');
    if (!q.explanation) warn(w, 'explanation 이 없습니다.');
    if (q.type === 'ox') { oxAll++; if (q.answer === true) oxTrue++; }
    if (q.type === 'choice') {
      const ch = q.choices || [];
      // tools/check.js 와 같은 규칙 (승인 커밋의 훅에서 막히지 않도록 업로드 단계에서 먼저 거른다)
      if (ch.length < 2) err(w, '보기가 2개 미만입니다.');
      if (ch.some((c) => typeof c !== 'string' || !c.trim())) err(w, '빈 보기 또는 문자열이 아닌 보기가 있습니다.');
      if (q.answerIndex == null || q.answerIndex < 0 || q.answerIndex >= ch.length) err(w, '객관식 정답 번호가 보기 범위를 벗어났거나 보기와 일치하지 않습니다.');
      const norm = ch.map((c) => normalizeAnswer(c));
      if (new Set(norm).size !== norm.length) err(w, '같은 보기가 두 번 있습니다.');
      if (ch.some((c) => /^\s*([①-⑩]|\d+[.)])/.test(String(c)))) err(w, '보기 앞에 번호를 붙이지 않습니다.');
    }
    if (q.type === 'short') {
      if (!q.answers || !q.answers.length || q.answers.every((a) => !String(a).trim())) err(w, '단답 정답(answers)이 비어 있습니다.');
    }
    const h = questionHash(q.question);
    if (seenQ.has(h)) err(w, `${seenQ.get(h)}번과 같은 문제입니다.`); else seenQ.set(h, i + 1);
    if (q.id) { if (seenId.has(q.id)) err(w, `id 가 ${seenId.get(q.id)}번과 같습니다.`); else seenId.set(q.id, i + 1); }
  });
  if (oxAll >= 10) {
    const r = oxTrue / oxAll;
    if (r < 0.3 || r > 0.7) warn('OX', `정답이 한쪽으로 치우쳤습니다(true ${oxTrue}/${oxAll}).`);
  }
  set.terms.forEach((t, i) => {
    const w = `용어 ${i + 1}번`;
    if (!Array.isArray(t.terms) || !t.terms.length) err(w, 'terms 가 비어 있습니다.');
    else if (t.terms.some((x) => String(x).replace(/\s/g, '').length < 2)) warn(w, '한 글자 표기는 넣지 않습니다.');
    if (!t.desc) warn(w, 'desc 가 없습니다(단어 암기 테스트에 쓰이지 않음).');
  });
  return out;
}

/** 콘텐츠 경로 해석: <과목>/<분류>/...  */
export function pathInfo(path: string): { subject: string; kind: string } | null {
  const p = path.normalize('NFC').split('/');
  if (p.length < 3) return null;
  return { subject: p[0], kind: p[1] };
}
