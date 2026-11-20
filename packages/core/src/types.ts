// 콘텐츠 · API 공통 타입. 서버와 웹은 이 파일을 계약으로 삼는다(docs/설계_v2.md 13 · 14장).

export type QuestionType = 'ox' | 'choice' | 'short';
export type Exam = '중간고사' | '기말고사';
export const EXAMS: Exam[] = ['중간고사', '기말고사'];
export type Kind = '일반문제' | '모의고사' | '기출' | '단어집';
export const KINDS: Kind[] = ['일반문제', '모의고사', '기출', '단어집'];
/** 문항 출제 난이도(출제자 예상, 3단계). 표시는 풀이 통계로 5단계(difficulty.ts) */
export type Difficulty = '기초' | '표준' | '심화';
export const DIFFICULTIES: Difficulty[] = ['기초', '표준', '심화'];

export interface Question {
  type: QuestionType;
  question: string;
  category: string;
  explanation?: string;
  hint?: string;
  id?: string;               // 고정 ID (선택)
  answer?: boolean | number | string;
  choices?: string[];
  answerIndex?: number;      // 객관식: 0-기반 정답 번호(-1 = 잘못된 정답)
  answers?: string[];        // 단답: 인정 표기(첫 번째가 대표)
  displayAnswer?: string;
  source?: string;           // 출처(예: "7장 p.12") — 답 공개 후 표시
  difficulty?: Difficulty;   // 출제자 예상 난이도
  stats?: { n: number; correct: number };   // 서버: 첫 풀이 통계(사용자별 첫 시도만)
  outOfScope?: string[];     // 서버: 현재 시험 범위 밖 의심 이유(scopeIssues)
}

/** 브라우저로 보내는 문항: 문항 ID 포함 */
export interface Item extends Question { itemId: string }

export interface Term { terms: string[]; group?: string; chapter?: string; desc?: string }

export interface ParsedSet {
  filename: string;
  kind: 'quiz' | 'glossary';
  group: string;
  title: string;
  topic: string;
  unit: string;
  exam?: string;
  uploader?: string;
  scopeRev?: number;         // META.scopeRev: 출제 때 기준으로 삼은 범위 rev
  questions: Question[];
  terms: Term[];
}

// ── 과목 목록 (과목목록.json) ──
/** 시험 범위 (과목목록 항목의 scope[시험]). rev · updatedAt 은 서버가 저장할 때 정한다 */
export interface ExamScope {
  rev: number;               // 1부터, 저장할 때마다 +1
  updatedAt?: string;        // YYYY-MM-DD
  units: string[];           // META.unit 값과 정확히 일치. 비면 단원 판정 안 함
  excludedUnits?: string[];  // 관리자가 수동 분류에서 '제외'로 고른 장 외 단원 (기록용 · 판정은 units 기준). units 와 겹치면 안 됨
  include: string[];         // 표시용
  exclude: string[];         // 키워드: 공백 제거 · 소문자 후 category · topic · question 에 들어 있으면 범위 밖 의심
  trend?: string;            // 출제 경향 (표시용)
  difficultyMix?: Partial<Record<Difficulty, number>>;   // 기본 3:5:2
  note?: string;
}
/** 관리자가 보내는 범위 (rev · updatedAt 제외) */
export type ExamScopeInput = Omit<ExamScope, 'rev' | 'updatedAt'>;
export type ScopeMap = Partial<Record<Exam, ExamScope>>;
export interface CatalogEntry {
  subject: string; grade: number; semester: 1 | 2;
  exams?: Exam[];            // 세트가 없어도 메뉴에 둘 시험(선택)
  scope?: ScopeMap;          // 시험별 범위(선택)
}
export type Catalog = CatalogEntry[];

// ── 매니페스트 (GET /api/content/manifest) ──
export interface SetSummary {
  path: string;              // 콘텐츠 루트 기준 상대 경로 (NFC), 예: 운영체제/일반문제/x.jsx
  subject: string;
  exam: Exam;
  kind: Kind;                // 분류 폴더
  title: string;
  topic: string;
  unit: string;
  questionCount: number;
  typeCounts: Record<QuestionType, number>;
  termCount: number;
  uploader?: { username: string; nickname: string | null };
  hash: string;
  scopeRev?: number;         // META.scopeRev
  suspectCount?: number;     // 범위 밖 의심 문항 수 (현재 범위 기준, 로드 때 계산)
}
export interface SubjectNode {
  subject: string;
  grade: number | null;      // null = 미분류
  semester: 1 | 2 | null;
  exams: Exam[];             // 세트(또는 용어)가 있는 시험
  scope?: ScopeMap;          // 과목목록의 시험 범위
}
export interface PluginFile { path: string; subject: string; hash: string }   // 플러그인/<과목>/N_이름.js · hash = 원문 해시(바뀌면 새로고침 안내)
export interface PracticeDataFile { path: string; subject: string } // <과목>/연습/**.jsx
export interface Manifest {
  contentVersion: string;
  subjects: SubjectNode[];
  sets: SetSummary[];
  plugins: PluginFile[];
  practiceData: PracticeDataFile[];
  /** 서버가 내보내는 웹 앱 빌드(index.html 의 /assets/index-*.js). 개발 서버 · 테스트는 null. 다르면 새로고침 안내 */
  appVersion?: string | null;
}

export interface SetDetail extends SetSummary { items: Item[]; terms: Term[] }

// ── 계정 ──
export type Role = 'admin' | 'member';
export interface Me { id: number; username: string; nickname: string; role: Role }

// ── 세션 (POST /api/sessions) ──
export type SessionKind = 'set' | 'review' | 'partial';
/** 원래 답: OX = boolean, 객관식 = 보기 번호(0-기반), 단답 = 문자열 */
export type RawAnswer = boolean | number | string | null;
export interface SessionSubmit {
  clientSessionId: string;
  kind: SessionKind;
  subject: string;
  exam: Exam;
  setPath?: string;          // kind = set
  reviewBatchId?: number;    // kind = review
  startedAt: number;
  finishedAt: number;
  answers: { itemId: string; raw: RawAnswer; elapsedMs?: number }[];
}
export interface SessionResult {
  sessionId: number;
  duplicate: boolean;        // 이미 저장된 clientSessionId
  counted: boolean;          // 리더보드 · SRS 반영 여부
  score: number;
  total: number;
  results: { itemId: string; correct: boolean }[];
}

// ── 오답 분석 (GET /api/me/analysis?subject=&exam=) ──
export interface AnalysisItemStat { itemId: string; setPath: string; category: string; unit: string; n: number; wrong: number; lastOk: boolean; at: number }
export interface Analysis {
  subject: string;
  exam: Exam;
  units: { unit: string; n: number; wrong: number }[];
  categories: { category: string; unit: string; n: number; wrong: number }[];
  items: AnalysisItemStat[];
  sets: { setPath: string; title: string; runs: { at: number; score: number; total: number }[] }[];
  pinned: string[];
}

// ── 복습 ──
export interface ReviewSummary { subject: string; exam: Exam; due: number }
export interface ReviewBatch { batchId: number; subject: string; exam: Exam; items: (Item & { setPath: string })[] }

// ── 리더보드 ──
export interface LeaderboardRow { nickname: string; solved: number; accuracy: number; attempts: number; correct: number }

// ── 과목 표시 설정 ──
export interface SubjectPref { subject: string; hidden: boolean }

// ── 업로드 ──
export interface UploadMeta {
  subject: string; exam: Exam; kind: Kind; title: string;
  unit?: string; topic?: string; grade?: number; semester?: 1 | 2;
  scopeRev?: number;         // 출제 기준 범위 rev (현재 rev 와 다르면 경고)
}
export interface UploadJson { meta: UploadMeta; questions?: Record<string, unknown>[]; terms?: Term[] }
export interface CheckMessage { level: 'error' | 'warn'; where: string; message: string }
export interface FileCheckResult {
  name: string;
  ok: boolean;               // 오류 없음
  messages: CheckMessage[];
  subject?: string; exam?: Exam; kind?: Kind; title?: string;
  newSubject?: { grade: number; semester: 1 | 2 } | null;
  questionCount?: number; termCount?: number;
}
export type UploadFileStatus = 'pending' | 'approved' | 'rejected';
export interface UploadFileView extends FileCheckResult { id: number; status: UploadFileStatus; rejectReason: string | null; targetPath: string | null }
export interface UploadView {
  id: number; status: 'pending' | 'done' | 'cancelled';
  createdAt: number; decidedAt: number | null; commitSha: string | null;
  user: { username: string; nickname: string };
  files: UploadFileView[];
}

// ── 신고 · 댓글 ──
export type ReportType = '정답 오류' | '해설 오류' | '오타' | '중복' | '범위 밖' | '출제 방향 다름' | '기타';
export const REPORT_TYPES: ReportType[] = ['정답 오류', '해설 오류', '오타', '중복', '범위 밖', '출제 방향 다름', '기타'];
export interface ReportView {
  id: number; itemId: string; type: ReportType; body: string;
  snapshot: { question: string; answer: unknown; explanation?: string; setPath: string };
  status: 'open' | 'resolved' | 'dismissed'; adminNote: string | null;
  createdAt: number; resolvedAt: number | null; reporter: string;
}
export interface CommentView { id: number; itemId: string; nickname: string; mine: boolean; body: string; createdAt: number; updatedAt: number | null }

// ── 관리자 ──
export interface InviteView { id: number; url: string | null; expiresAt: number; maxUses: number; usedCount: number; revoked: boolean; createdAt: number }
export interface AdminUserView { id: number; username: string; nickname: string; role: Role; status: 'active' | 'suspended'; createdAt: number }
export interface AliasCandidateView { id: number; oldId: string; newId: string; similarity: number; setPath: string; oldQuestion: string; newQuestion: string; status: 'open' | 'confirmed' | 'dismissed' }
/** 범위 미리보기 (POST /api/admin/scope/preview {subject, exam, scope}) — 커밋 없이 의심 문항 계산 */
export interface ScopePreviewRequest { subject: string; exam: Exam; scope: ExamScopeInput }
export interface ScopePreview {
  subject: string; exam: Exam;
  suspectCount: number;
  sets: { path: string; title: string; suspects: { itemId: string; question: string; reasons: string[] }[] }[];   // 의심 문항이 있는 세트만
}
/** 범위 저장 (PUT /api/admin/scope {subject, exam, scope, baseRev}) — baseRev = 편집을 시작한 rev(없으면 0). 다르면 409 */
export interface ScopeSaveRequest extends ScopePreviewRequest { baseRev: number }
export interface ScopeSaveResult { ok: boolean; rev?: number; commitSha?: string; hookOutput?: string; suspectCount?: number; error?: string }
export interface ContentStatus { head: string; contentVersion: string; lastWebhook: { at: number; delivery: string; result: string } | null; pullWarning: { at: number; output: string } | null; loadErrors: { path: string; error: string }[] }

/** API 오류 응답 본문 */
export interface ApiError { error: string; details?: unknown }
