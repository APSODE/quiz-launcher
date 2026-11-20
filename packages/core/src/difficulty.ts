// 난이도: 출제 때는 3단계(기초 · 표준 · 심화, 출제자 예상), 표시는 첫 풀이 정답률로 5단계.
import { DIFFICULTIES, type Difficulty, type Question, type QuestionType } from './types.ts';

/** 측정 난이도를 보이기 시작하는 첫 풀이 사람 수 (나중에 10) */
export const DIFFICULTY_MIN_SOLVERS = 5;
/** 정답률(%) 임계값: 첫 값 이상 → 1(매우 쉬움) … 마지막 값 미만 → 5(매우 어려움). OX 는 찍어도 50% 라 높게 */
export const DIFFICULTY_THRESHOLDS: Record<'ox' | 'other', [number, number, number, number]> = {
  other: [90, 75, 55, 35],
  ox: [95, 85, 72, 60],
};
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;
export const DIFFICULTY_LEVEL_LABELS: Record<DifficultyLevel, string> = { 1: '매우 쉬움', 2: '쉬움', 3: '보통', 4: '어려움', 5: '매우 어려움' };
/** 업로드 비율 검사 기본값 (범위에 difficultyMix 가 없을 때) */
export const DEFAULT_DIFFICULTY_MIX: Record<Difficulty, number> = { 기초: 3, 표준: 5, 심화: 2 };

/** 첫 풀이 n 명 중 correct 명 정답 → 1~5. 사람 수가 모자라면 null */
export function measuredLevel(type: QuestionType, n: number, correct: number): DifficultyLevel | null {
  if (!(n >= DIFFICULTY_MIN_SOLVERS)) return null;
  const rate = (correct / n) * 100;
  const t = DIFFICULTY_THRESHOLDS[type === 'ox' ? 'ox' : 'other'];
  const i = t.findIndex((x) => rate >= x);
  return (i < 0 ? 5 : i + 1) as DifficultyLevel;
}

export interface DifficultyView {
  level: DifficultyLevel | null;   // null = 측정 중
  label: string;                   // "어려움" · "난이도 측정 중 (예상: 표준)" · "난이도 측정 중"
  expected?: Difficulty;           // 출제자 예상
  n: number;                       // 첫 풀이 사람 수
  rate?: number;                   // 정답률(%, 정수) — 측정됐을 때만
}

type DiffItem = Pick<Question, 'type' | 'difficulty' | 'stats'>;

export function difficultyView(item: DiffItem): DifficultyView {
  const n = item.stats?.n ?? 0, correct = item.stats?.correct ?? 0;
  const level = measuredLevel(item.type, n, correct);
  const v: DifficultyView = { level, label: '', n };
  if (item.difficulty) v.expected = item.difficulty;
  if (level) { v.label = DIFFICULTY_LEVEL_LABELS[level]; v.rate = Math.round((correct / n) * 100); }
  else v.label = item.difficulty ? `난이도 측정 중 (예상: ${item.difficulty})` : '난이도 측정 중';
  return v;
}

/** 필터용 3단계: 측정됐으면 1-2 → 기초, 3 → 표준, 4-5 → 심화, 아니면 출제자 예상(없으면 null) */
export function effective3(item: DiffItem): Difficulty | null {
  const level = measuredLevel(item.type, item.stats?.n ?? 0, item.stats?.correct ?? 0);
  if (level) return level <= 2 ? '기초' : level === 3 ? '표준' : '심화';
  return item.difficulty ?? null;
}

/** 난이도 비율 차이: 목표 비율(합 1로 정규화)과 실제 비율의 차이가 가장 큰 난이도. 차이는 %p */
export function difficultyMixGap(counts: Partial<Record<Difficulty, number>>, mix: Partial<Record<Difficulty, number>>): { difficulty: Difficulty; actual: number; target: number; gap: number } | null {
  const total = Object.values(counts).reduce((a, b) => a + (b ?? 0), 0);
  const mt = Object.values(mix).reduce((a, b) => a + (b ?? 0), 0);
  if (!total || !mt) return null;
  let worst: { difficulty: Difficulty; actual: number; target: number; gap: number } | null = null;
  for (const d of DIFFICULTIES) {
    const actual = ((counts[d] ?? 0) / total) * 100, target = ((mix[d] ?? 0) / mt) * 100;
    const gap = Math.abs(actual - target);
    if (!worst || gap > worst.gap) worst = { difficulty: d, actual, target, gap };
  }
  return worst;
}
