// 출제 규칙: 전역 "내지 말 것"(콘텐츠 루트 출제규칙.json) + 시험 범위 + 난이도 기준 + 양식 → AI 출제 에이전트용 md 한 장.
// 웹 "🤖 출제 규칙 받기"(GET /api/rules)와 CLI 도구가 같은 buildWritingRules 를 쓴다.
import { DIFFICULTIES, type Catalog, type Exam, type WritingRules } from './types.ts';
import { DEFAULT_DIFFICULTY_MIX } from './difficulty.ts';

const RULES_KEYS = new Set(['rev', 'updatedAt', 'avoid', 'note']);

/** 출제규칙.json 검사 · 정규화. 잘못되면 rules = null + 오류. requireRev = false 면 관리자 입력처럼 rev 없이도 받는다(rev = 0) */
export function validateWritingRules(v: unknown, opts: { requireRev?: boolean } = {}): { rules: WritingRules | null; errors: string[] } {
  const errors: string[] = [];
  if (!v || typeof v !== 'object' || Array.isArray(v)) return { rules: null, errors: ['객체여야 합니다'] };
  const o = v as Record<string, unknown>;
  for (const k of Object.keys(o)) if (!RULES_KEYS.has(k)) errors.push(`모르는 필드: ${k}`);
  if (opts.requireRev !== false || o.rev !== undefined) {
    if (!Number.isInteger(o.rev) || (o.rev as number) < 1) errors.push('rev 는 1 이상의 정수');
  }
  if (o.updatedAt !== undefined && (typeof o.updatedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(o.updatedAt))) errors.push('updatedAt 은 "YYYY-MM-DD"');
  let avoid: string[] = [];
  if (o.avoid !== undefined) {
    if (!Array.isArray(o.avoid) || o.avoid.some((s) => typeof s !== 'string' || !s.trim())) errors.push('avoid 는 비어 있지 않은 문자열 배열');
    else avoid = [...new Set(o.avoid.map((s: string) => s.normalize('NFC').trim()))];
  }
  const rules: WritingRules = { rev: (o.rev as number | undefined) ?? 0, avoid };
  if (typeof o.updatedAt === 'string') rules.updatedAt = o.updatedAt;
  if (o.note !== undefined) {
    if (typeof o.note !== 'string') errors.push('note 는 문자열');
    else if (o.note.trim()) rules.note = o.note.trim();
  }
  return errors.length ? { rules: null, errors } : { rules, errors };
}

/** 출제규칙.json 원문 (키 순서 고정 · 끝 줄바꿈) */
export function formatWritingRules(r: WritingRules): string {
  const o: Record<string, unknown> = { rev: r.rev };
  if (r.updatedAt) o.updatedAt = r.updatedAt;
  o.avoid = r.avoid;
  if (r.note) o.note = r.note;
  return JSON.stringify(o, null, 2) + '\n';
}

/** 난이도 3단계 기준표 (출제 · 난이도 판정 공용) */
export const DIFFICULTY_RUBRIC_MD = `# 난이도 3단계 기준표 (기초 · 표준 · 심화)

## 기준
- **기초**: 정의·용어·사실 하나를 그대로 떠올리면 풀린다(단순 회상, 원천의 한 줄).
  - 예) 용어 이름 대기, 교재 문장 그대로인 OX, 약어 풀네임.
- **표준**: 개념을 상황에 적용하거나 비슷한 개념 둘 이상을 연결·구분해야 한다, 흔한 오해(대표적인 함정)를 가려내야 한다, 또는 공식 한 번으로 끝나는 정형 계산 1회.
  - 예) 예방·회피 기법 구분, "불안전 상태 = 교착상태" 같은 대표 오개념 OX, Need = Max − Allocated 한 번 계산.
- **심화**: 여러 개념을 결합해야 한다, 여러 단계 계산(중간값을 다시 써야 함), 또는 정의를 살짝 비튼 함정·예외·경계 조건을 알아채야 한다.
  - 예) 은행가 알고리즘 안전 순서 전체 구하기, 조건 하나만 바꾼 상황에서 결과 판단.

## 판정 규칙
- 문제·정답·해설에 실제로 드러난 풀이 과정만 본다. 주제가 어렵게 들려도 답이 용어 하나 회상이면 기초.
- 유형 자체로 가산·감산하지 않는다(OX도 비튼 함정이면 심화, 단답도 계산이 여러 단계면 심화).
- 애매하면 낮은 쪽이 아니라 기준에 더 가까운 쪽을 고른다. 세 단계 모두 실제로 쓰일 수 있다.
`;

/** 문항 양식 · 좋은 문제 기준 · 업로드 JSON (docs/업로드_양식.md 4~6장 요약. 콘텐츠 샌드박스엔 docs/ 가 없어 코드에 둔다) */
export const QUESTION_GUIDE_MD = `### 업로드 JSON 형식

파일 하나 = 세트 하나. 최상위에는 \`meta\` · \`questions\` · \`terms\` 만 둔다(\`questions\` · \`terms\` 중 하나는 비어 있지 않아야 함).

| meta 필드 | 필수 | 값 |
|---|---|---|
| \`subject\` | ✅ | 과목명 (기존 과목과 한 글자도 다르지 않게) |
| \`exam\` | ✅ | \`"중간고사"\` 또는 \`"기말고사"\` |
| \`kind\` | ✅ | \`"일반문제"\` · \`"모의고사"\` · \`"기출"\` · \`"단어집"\` (단어집이면 terms 필수) |
| \`title\` | ✅ | 세트 제목 (예: \`"7장 메모리 관리 혼합 30문제"\`) |
| \`unit\` | | 장 · 단원 (시험 범위의 단원 표기와 똑같이, 예 \`"7장"\`) |
| \`topic\` | | 부제 |
| \`grade\` · \`semester\` | 새 과목만 | 학년(1 이상 정수) · 학기(1 또는 2). 기존 과목이면 빼기 |
| \`scopeRev\` | | 기준으로 삼은 시험 범위 rev (아래 머리말의 범위 rev) |
| \`rulesRev\` | | 기준으로 삼은 출제 규칙 rev (아래 머리말의 규칙 rev) |

\`\`\`json
{
  "meta": { "subject": "운영체제", "exam": "기말고사", "kind": "일반문제", "title": "7장 페이징 4문제", "unit": "7장", "scopeRev": 3, "rulesRev": 1 },
  "questions": [
    { "category": "페이징", "question": "페이징은 외부 단편화가 생기지 않는다.", "answer": true, "explanation": "고정 크기 프레임에 나눠 담아 외부 단편화가 없다(내부 단편화는 생길 수 있다).", "source": "7장 p.12", "difficulty": "기초" },
    { "category": "페이지 교체", "question": "Belady의 이상 현상이 생길 수 있는 교체 알고리즘은?", "choices": ["LRU", "FIFO", "OPT", "LFU"], "answer": 1, "explanation": "FIFO는 프레임을 늘려도 페이지 부재가 늘 수 있다.", "source": "8장 p.20", "difficulty": "표준" },
    { "category": "주소 변환", "question": "페이지 크기 4KB, 논리 주소 0x3A7F 의 페이지 번호는? (10진수 숫자만)", "answers": ["3"], "explanation": "0x3A7F ÷ 0x1000 = 3 (나머지 0xA7F 가 오프셋).", "source": "7장 p.15", "difficulty": "표준" }
  ],
  "terms": [
    { "terms": ["TLB", "변환 색인 버퍼", "Translation Lookaside Buffer"], "group": "7장", "desc": "페이지 테이블 항목을 캐시해 주소 변환을 빠르게 하는 하드웨어" }
  ]
}
\`\`\`

### 문항 유형 (따로 적지 않는다 — 모양으로 자동 판별)

- **OX**: \`answer\` 가 따옴표 없는 \`true\` / \`false\`. 한 문장에 판단할 사실은 하나. 참 · 거짓 비율 40~60%.
- **객관식**: \`choices\` 배열(보기 4개) + \`answer\` 는 **0부터 세는 번호**. 보기 앞에 \`①\` · \`1.\` 같은 번호 금지, 같은 보기 두 번 금지. 정답 위치(0~3)를 고르게. 오답은 같은 범주의 그럴듯한 것, 사실 맞는 오답 금지, "모두 옳다" · "정답 없음" 금지.
- **단답**: \`answers\` 에 인정할 표기를 전부(띄어쓰기 유무 · 약어 · 풀네임 · 한영, 숫자면 단위 유무 · 분수 · 소수). 채점은 대소문자 · 앞뒤 공백만 무시하고 띄어쓰기는 구분. 답이 용어 하나나 숫자 하나로 딱 정해지는 질문만(서술형 금지), 숫자 답이면 질문에 \`(숫자만)\` 같은 입력 형식. \`displayAnswer\` 는 대표 정답(선택).
- **용어**(\`terms\`): \`terms\` 첫 번째가 대표 표기(한 글자 표기 금지), \`desc\` 는 그 용어 하나로 답이 정해지는 한 줄 정의(정답 용어를 그대로 쓰지 않기), \`group\` 은 \`meta.unit\` 과 같은 표기.
- 모든 문항에 쓸 수 있는 필드: \`category\` · \`question\`(필수) · \`explanation\` · \`hint\` · \`source\` · \`difficulty\` (+ 유형별 \`answer\` · \`choices\` · \`answers\` · \`displayAnswer\`). 용어는 \`terms\` · \`group\` · \`desc\` 만.

### 넣으면 안 되는 것

- 위에 없는 필드(\`type\` · \`number\` · \`score\` 등), 서버가 붙이는 \`id\` · \`uploader\` · \`practice\` · \`stats\` · \`outOfScope\` — 오류.
- \`registerPractice(\` 라는 글자(어디든), HTML 태그(줄바꿈은 \`\\n\`), 한 파일 안 같은 질문 두 번(띄어쓰기만 달라도 같음).
- JSON 문법: 큰따옴표 문자열, 마지막 항목 뒤 쉼표 금지, 주석 금지.

### 좋은 문제 기준

- 모든 문항에 \`category\`, 1~2문장 \`explanation\`(정답인 이유), \`source\`(근거 위치, 예 \`"7장 p.12"\`), \`difficulty\`(\`"기초"\` · \`"표준"\` · \`"심화"\`).
- 수업 자료에 있는 사실만 쓴다. 모르는 건 지어내지 않는다. 수업과 다른 일반 지식으로 답이 갈리는 문제는 피한다.
- 질문이 정답을 알려 주지 않게, 한 파일 안에서 한 문항이 다른 문항의 답을 알려 주지 않게(같은 개념을 객관식 · 단답으로 동시에 내지 않기).
- 이미 있는 문제와 80% 넘게 비슷하면 경고 — 같은 사실을 참 · 거짓만 뒤집은 것도 비슷한 문제다.
- 결과는 설명 없이 JSON 만, 코드 블록 하나에 담아 출력한다. 문항이 많으면 세트를 여러 파일로 나눈다.
`;

export interface BuildWritingRulesInput { catalog: Catalog; rules: WritingRules | null | undefined; subject: string; exam: Exam; date: string }

/** AI 출제 에이전트용 출제 규칙 md (머리말 · 내지 말 것 · 시험 범위 · 난이도 기준 · 좋은 문제 기준 · 업로드 양식) */
export function buildWritingRules({ catalog, rules, subject, exam, date }: BuildWritingRulesInput): string {
  const subj = subject.normalize('NFC').trim();
  const entry = catalog.find((c) => c.subject === subj);
  const scope = entry?.scope?.[exam];
  const rulesRev = rules && rules.rev > 0 ? rules.rev : 0;
  const L: string[] = [];
  L.push(`# 출제 규칙 — ${subj} ${exam}`, '');
  L.push('> 이 문서는 문제를 만드는 AI 에이전트의 **작업 지시서**다. 아래 규칙을 모두 지켜 문제 세트 JSON 을 만든다.');
  L.push(`> - 규칙 rev: ${rulesRev ? `${rulesRev}${rules!.updatedAt ? ` (${rules!.updatedAt})` : ''}` : '없음 (전역 출제 규칙 미등록)'}`);
  L.push(`> - 범위 rev: ${scope ? `${scope.rev}${scope.updatedAt ? ` (${scope.updatedAt})` : ''}` : '없음 (이 시험 범위 미등록)'}`);
  L.push(`> - 생성일: ${date}`);
  const set = [scope ? `\`meta.scopeRev\` 에 ${scope.rev}` : '', rulesRev ? `\`meta.rulesRev\` 에 ${rulesRev}` : ''].filter(Boolean);
  L.push(`> - 업로드 JSON 의 ${set.length ? `${set.join(', ')} 를 적는다` : '`meta.scopeRev` · `meta.rulesRev` 는 지금 rev 가 없으니 빼도 된다'}${entry ? '' : ` (과목 '${subj}' 은 아직 과목목록에 없다 — 새 과목이면 grade · semester 필요)`}.`, '');

  L.push('## 내지 말 것', '');
  L.push('핵심 개념 · 원리 · 비교 · 계산을 묻는다. 아래에 해당하는 문제는 **절대 내지 않는다**(지엽적 문제로 신고된다).', '');
  const g = rules?.avoid ?? [], s = scope?.avoid ?? [];
  if (g.length) for (const x of g) L.push(`- ${x}`);
  if (s.length) { L.push('', `이 시험(${subj} ${exam})에서 추가 · 예외:`, ''); for (const x of s) L.push(`- ${x}`); }
  if (!g.length && !s.length) L.push('- (등록된 항목 없음 — 수업의 핵심 개념이 아닌 도구 조작법 · 수업 운영 정보 같은 지엽적인 내용은 피한다)');
  if (rules?.note) L.push('', rules.note);
  L.push('');

  L.push('## 시험 범위', '');
  if (!scope) L.push(`등록된 범위가 없다. 받은 수업 자료 안에서 고르게 출제하고 \`meta.scopeRev\` 는 뺀다.`, '');
  else {
    if (scope.units.length) L.push(`- 단원: ${scope.units.join(', ')} — \`meta.unit\` 은 이 표기 그대로 쓴다. 밖의 단원은 범위 밖.`);
    if (scope.include.length) L.push(`- 포함: ${scope.include.join(' · ')}`);
    if (scope.exclude.length) L.push(`- 제외: ${scope.exclude.join(' · ')} — 이 키워드가 category · topic · question 에 들어가면(띄어쓰기 · 대소문자 무시) 범위 밖으로 경고된다. 이 내용은 내지 말고, 다른 개념을 설명하다 이 단어를 쓰지도 않게 한다.`);
    if (scope.trend) L.push(`- 출제 경향: ${scope.trend}`);
    if (scope.note) L.push(`- 메모: ${scope.note}`);
    L.push('');
  }
  const mix = scope?.difficultyMix ?? DEFAULT_DIFFICULTY_MIX;
  L.push(`난이도 비율(기초 : 표준 : 심화): ${DIFFICULTIES.map((d) => mix[d] ?? 0).join(' : ')}${scope?.difficultyMix ? '' : ' (기본값)'} — 10문항 이상이면 15%p 넘게 어긋날 때 경고.`, '');

  L.push('## 난이도 기준', '');
  L.push(DIFFICULTY_RUBRIC_MD.replace(/^# .*\n\n/, '').replace(/^## /gm, '### ').trimEnd(), '');

  L.push('## 좋은 문제 기준 · 업로드 양식', '');
  L.push(QUESTION_GUIDE_MD.trimEnd(), '');
  return L.join('\n');
}
