// 콘텐츠 · API 공통 타입. 서버와 웹은 이 파일을 계약으로 삼는다(docs/설계_v2.md 13 · 14장).

export type QuestionType = 'ox' | 'choice' | 'short';
export type Exam = '중간고사' | '기말고사';
export const EXAMS: Exam[] = ['중간고사', '기말고사'];
export type Kind = '일반문제' | '모의고사' | '기출' | '단어집';
export const KINDS: Kind[] = ['일반문제', '모의고사', '기출', '단어집'];

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
  questions: Question[];
  terms: Term[];
}

// ── 과목 목록 (과목목록.json) ──
export interface CatalogEntry { subject: string; grade: number; semester: 1 | 2 }
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
}
export interface SubjectNode {
  subject: string;
  grade: number | null;      // null = 미분류
  semester: 1 | 2 | null;
  exams: Exam[];             // 세트(또는 용어)가 있는 시험
}
export interface PluginFile { path: string; subject: string }       // 플러그인/<과목>/N_이름.js
export interface PracticeDataFile { path: string; subject: string } // <과목>/연습/**.jsx
export interface Manifest {
  contentVersion: string;
  subjects: SubjectNode[];
  sets: SetSummary[];
  plugins: PluginFile[];
  practiceData: PracticeDataFile[];
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
export type ReportType = '정답 오류' | '해설 오류' | '오타' | '중복' | '기타';
export const REPORT_TYPES: ReportType[] = ['정답 오류', '해설 오류', '오타', '중복', '기타'];
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
export interface ContentStatus { head: string; contentVersion: string; lastWebhook: { at: number; delivery: string; result: string } | null; pullWarning: { at: number; output: string } | null; loadErrors: { path: string; error: string }[] }

/** API 오류 응답 본문 */
export interface ApiError { error: string; details?: unknown }
