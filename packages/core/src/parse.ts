// 문제 세트 · 용어집 JSX 파서. v1 실행기(v1/quiz_launcher.html)의 sliceBalanced ~ parseJSX 를 그대로 옮겼다(동작 동일, 기준 사본: tools/jsx-parser.js).
// 차이: 리터럴 평가 함수를 바꿔 끼울 수 있다(서버는 node:vm + 시간 제한을 넘긴다).
import type { Question, QuestionType, Term, ParsedSet } from './types.ts';

export type Evaluate = (raw: string) => unknown;

export const defaultEvaluate: Evaluate = (raw) => {
  try { return Function('"use strict"; return (' + raw + ')')(); }
  catch { return null; }
};

// start 위치의 여는 괄호부터 짝이 맞는 닫는 괄호까지 추출 (문자열/주석 내부는 무시)
export function sliceBalanced(code: string, start: number, open: string, close: string): string | null {
  let depth = 0;
  for (let i = start; i < code.length; i++) {
    const c = code[i];
    if (c === '"' || c === "'" || c === '`') {
      const quote = c;
      i++;
      while (i < code.length && code[i] !== quote) { if (code[i] === '\\') i++; i++; }
      continue;
    }
    if (c === '/' && code[i + 1] === '/') { while (i < code.length && code[i] !== '\n') i++; continue; }
    if (c === '/' && code[i + 1] === '*') { i = code.indexOf('*/', i + 2); if (i < 0) return null; i++; continue; }
    if (c === open) depth++;
    else if (c === close) { depth--; if (depth === 0) return code.slice(start, i + 1); }
  }
  return null;
}

export function findArrays(code: string, evaluate: Evaluate = defaultEvaluate): { name: string; value: unknown[] }[] {
  const out: { name: string; value: unknown[] }[] = [];
  const re = /(?:^|\n)[ \t]*(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*\[/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(code))) {
    const start = m.index + m[0].length - 1;
    const raw = sliceBalanced(code, start, '[', ']');
    if (!raw) continue;
    const value = evaluate(raw);
    if (Array.isArray(value)) out.push({ name: m[1], value });
  }
  return out;
}

export function findMeta(code: string, evaluate: Evaluate = defaultEvaluate): Record<string, unknown> {
  const m = /(?:^|\n)[ \t]*(?:export\s+)?(?:const|let|var)\s+META\s*=\s*\{/.exec(code);
  if (!m) return {};
  const raw = sliceBalanced(code, m.index + m[0].length - 1, '{', '}');
  const v = raw ? evaluate(raw) : null;
  return v && typeof v === 'object' ? (v as Record<string, unknown>) : {};
}

export function normalizeAnswer(str: unknown): string {
  return String(str).trim().toLowerCase().replace(/\s+/g, ' ');
}

export function qType(q: { answer?: unknown; choices?: unknown }): QuestionType {
  if (typeof q.answer === 'boolean') return 'ox';
  if (Array.isArray(q.choices) && q.choices.length > 0) return 'choice';
  return 'short';
}

export function normalizeQuestion(q: Record<string, unknown>): Question {
  const out: Record<string, unknown> = { ...q };
  if (!out.category) out.category = '일반';
  const t = qType(out);
  if (t === 'short') {
    if (!Array.isArray(out.answers)) {
      if (Array.isArray(out.answer)) out.answers = out.answer;
      else if (typeof out.answer === 'string') out.answers = [out.answer];
      else if (out.answer != null) out.answers = [String(out.answer)];
      else out.answers = [];
    }
    if (typeof out.displayAnswer === 'string') {
      const d = out.displayAnswer;
      out.answers = [d, ...(out.answers as unknown[]).filter((a) => normalizeAnswer(a) !== normalizeAnswer(d))];
    }
  }
  if (t === 'choice') {
    let idx = out.answer;
    if (typeof idx === 'string') { const s = idx; idx = (out.choices as unknown[]).findIndex((c) => normalizeAnswer(c) === normalizeAnswer(s)); }
    out.answerIndex = Number.isInteger(idx) ? idx : -1;
  }
  out.type = t;
  return out as unknown as Question;
}

export interface ParseOptions { group?: string; evaluate?: Evaluate }

/** 실행기 parseJSX 와 같은 결과 + exam · uploader 메타. 문항 ID 는 붙이지 않는다(content.ts). */
export function parseJSX(filename: string, code: string, opts: ParseOptions = {}): ParsedSet {
  const evaluate = opts.evaluate ?? defaultEvaluate;
  const base = filename.replace(/\.(jsx|js)$/i, '').split('/').pop() ?? filename;
  const meta = findMeta(code, evaluate);
  const arrays = findArrays(code, evaluate);

  let questions: Record<string, unknown>[] = [];
  arrays.forEach((a) => {
    if (a.value.length && a.value.every((x) => x && typeof x === 'object' && 'question' in (x as object)))
      questions = questions.concat(a.value as Record<string, unknown>[]);
  });
  let terms: Term[] = [];
  arrays.forEach((a) => {
    if (/^(TERMS|GLOSSARY|TERM_DB)$/i.test(a.name))
      terms = terms.concat(a.value.filter((t) => t && Array.isArray((t as Term).terms)) as Term[]);
  });
  if (questions.length === 0 && terms.length === 0)
    throw new Error('문제 배열(question 필드)이나 용어 배열(TERMS)을 찾을 수 없습니다.');

  const tokens = base.split(/_+/).filter(Boolean);
  let group = opts.group || ((meta.group ?? meta.chapter) as string | undefined);
  let title = meta.title as string | undefined;
  if (!group) group = tokens.length >= 2 ? tokens[0] : '기타';
  if (!title) {
    if (opts.group) title = (tokens.length >= 2 && tokens[0] === opts.group ? tokens.slice(1) : tokens).join(' ') || base;
    else title = tokens.length >= 2 ? tokens.slice(1).join(' ') : base;
  }
  const qs = questions.map(normalizeQuestion);
  const cats = [...new Set(qs.map((q) => q.category).filter(Boolean))];
  const topic = (meta.topic as string) || cats.slice(0, 4).join(' · ') || '기타';
  return {
    filename,
    kind: qs.length ? 'quiz' : 'glossary',
    group: String(group), title: String(title), topic,
    unit: meta.unit != null ? String(meta.unit).trim() : '',
    exam: typeof meta.exam === 'string' ? meta.exam : undefined,
    uploader: typeof meta.uploader === 'string' ? meta.uploader : undefined,
    questions: qs, terms,
  };
}
