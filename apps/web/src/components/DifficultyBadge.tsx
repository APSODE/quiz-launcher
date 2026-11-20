// 문항 난이도 배지: 첫 풀이 정답률로 5단계(측정 전에는 출제자 예상) · 범위 밖 의심 배지
import type { Question } from '@quiz/core';
import { difficultyView, DIFFICULTY_MIN_SOLVERS } from '@quiz/core';

type DiffItem = Pick<Question, 'type' | 'difficulty' | 'stats'>;

export function DifficultyBadge({ item }: { item: DiffItem }) {
  const v = difficultyView(item);
  const title = v.level
    ? `첫 풀이 ${v.n}명 · 정답률 ${v.rate}%${v.expected ? ` · 출제 예상: ${v.expected}` : ''}`
    : `첫 풀이 ${v.n}명 — ${DIFFICULTY_MIN_SOLVERS}명 이상 풀면 정답률로 난이도를 보여 줍니다`;
  return <span class={'diff-badge ' + (v.level ? 'lv' + v.level : 'measuring')} title={title}>{v.level ? `난이도: ${v.label}` : v.label}</span>;
}

export function ScopeBadge({ reasons }: { reasons?: string[] }) {
  if (!reasons || !reasons.length) return null;
  return <span class="scope-badge" title={reasons.join('\n')}>⚠️ 범위 밖 의심</span>;
}

/** 카테고리 옆에 붙는 배지 묶음 */
export function ItemBadges({ item }: { item: DiffItem & Pick<Question, 'outOfScope'> }) {
  return <><DifficultyBadge item={item} /><ScopeBadge reasons={item.outOfScope} /></>;
}
