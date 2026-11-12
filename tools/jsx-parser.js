// 문제 세트 · 용어집 JSX 파서 (기준 구현). v1 실행기(v1/quiz_launcher.html)의 sliceBalanced ~ parseJSX 를 그대로 떼어 냈다.
// tools/check.js 가 vm 샌드박스에서 이 파일을 실행하고, packages/core 골든 테스트가 core 파서와 결과를 비교한다.
// 이 파일만 단독으로 실행되므로 다른 전역에 기대지 않는다. 고치면 packages/core/src/parse.ts 도 같게 고친다.

function sliceBalanced(code, start, open, close) {
  let depth = 0;
  for (let i = start; i < code.length; i++) {
    const c = code[i];
    if (c === '"' || c === "'" || c === '`') {
      const quote = c;
      i++;
      while (i < code.length && code[i] !== quote) { if (code[i] === '\\') i++; i++; }
      continue;
    }
    if (c === '/' && code[i+1] === '/') { while (i < code.length && code[i] !== '\n') i++; continue; }
    if (c === '/' && code[i+1] === '*') { i = code.indexOf('*/', i + 2); if (i < 0) return null; i++; continue; }
    if (c === open) depth++;
    else if (c === close) { depth--; if (depth === 0) return code.slice(start, i + 1); }
  }
  return null;
}

function evalLiteral(raw) {
  try { return Function('"use strict"; return (' + raw + ')')(); }
  catch (e) { return null; }
}

// 코드 안의 모든 최상위 "const NAME = [ ... ]" 배열을 찾아 반환
function findArrays(code) {
  const out = [];
  const re = /(?:^|\n)[ \t]*(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*\[/g;
  let m;
  while ((m = re.exec(code))) {
    const start = m.index + m[0].length - 1;
    const raw = sliceBalanced(code, start, '[', ']');
    if (!raw) continue;
    const value = evalLiteral(raw);
    if (Array.isArray(value)) out.push({ name: m[1], value });
  }
  return out;
}

// "const META = { ... }" 객체 (선택)
function findMeta(code) {
  const m = /(?:^|\n)[ \t]*(?:export\s+)?(?:const|let|var)\s+META\s*=\s*\{/.exec(code);
  if (!m) return {};
  const raw = sliceBalanced(code, m.index + m[0].length - 1, '{', '}');
  return (raw && evalLiteral(raw)) || {};
}

function normalizeAnswer(str) {
  return String(str).trim().toLowerCase().replace(/\s+/g, ' ');
}

// 문제 하나의 유형 판별 (데이터 형태 기준)
function qType(q) {
  if (typeof q.answer === 'boolean') return 'ox';
  if (Array.isArray(q.choices) && q.choices.length > 0) return 'choice';
  return 'short';
}

function normalizeQuestion(q) {
  const out = { ...q };
  if (!out.category) out.category = '일반';
  const t = qType(out);
  if (t === 'short') {
    if (!Array.isArray(out.answers)) {
      if (Array.isArray(out.answer))           out.answers = out.answer;
      else if (typeof out.answer === 'string') out.answers = [out.answer];
      else if (out.answer != null)             out.answers = [String(out.answer)];
      else                                     out.answers = [];
    }
    if (typeof out.displayAnswer === 'string') {
      out.answers = [out.displayAnswer, ...out.answers.filter(a => normalizeAnswer(a) !== normalizeAnswer(out.displayAnswer))];
    }
  }
  if (t === 'choice') {
    // answer: 0부터 시작하는 번호 또는 보기 문구
    let idx = out.answer;
    if (typeof idx === 'string') idx = out.choices.findIndex(c => normalizeAnswer(c) === normalizeAnswer(idx));
    out.answerIndex = Number.isInteger(idx) ? idx : -1;
  }
  return out;
}

function parseJSX(filename, code, opts) {
  opts = opts || {};
  const base = filename.replace(/\.(jsx|js)$/i, '').split('/').pop();
  const meta = findMeta(code);
  const arrays = findArrays(code);

  // 문제 배열: 요소가 객체이고 question 필드를 가진 모든 배열을 합침
  let questions = [];
  arrays.forEach(a => {
    if (a.value.length && a.value.every(x => x && typeof x === 'object' && 'question' in x))
      questions = questions.concat(a.value);
  });

  // 용어 배열: TERMS / GLOSSARY / TERM_DB
  let terms = [];
  arrays.forEach(a => {
    if (/^(TERMS|GLOSSARY|TERM_DB)$/i.test(a.name))
      terms = terms.concat(a.value.filter(t => t && Array.isArray(t.terms)));
  });

  if (questions.length === 0 && terms.length === 0)
    throw new Error('문제 배열(question 필드)이나 용어 배열(TERMS)을 찾을 수 없습니다.');

  // 그룹/제목: META 우선, 없으면 파일명 "그룹_제목..." 규칙
  const tokens = base.split(/_+/).filter(Boolean);
  let group = opts.group || (meta.group ?? meta.chapter);   // 폴더 불러오기에서는 폴더 이름이 과목
  let title = meta.title;
  if (!group) group = tokens.length >= 2 ? tokens[0] : '기타';
  if (!title) {
    if (opts.group) title = (tokens.length >= 2 && tokens[0] === opts.group ? tokens.slice(1) : tokens).join(' ') || base;
    else title = tokens.length >= 2 ? tokens.slice(1).join(' ') : base;
  }

  questions = questions.map(normalizeQuestion);
  const cats = [...new Set(questions.map(q => q.category).filter(Boolean))];
  const topic = meta.topic || cats.slice(0, 4).join(' · ') || '기타';

  return {
    filename,
    kind: questions.length ? 'quiz' : 'glossary',
    group: String(group), title: String(title), topic,
    unit: meta.unit != null ? String(meta.unit).trim() : '',
    category: opts.category || '', source: opts.source || '',
    questions, terms
  };
}
