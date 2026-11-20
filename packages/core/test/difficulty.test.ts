import { describe, it, expect } from 'vitest';
import { measuredLevel, difficultyView, effective3, difficultyMixGap, DIFFICULTY_MIN_SOLVERS } from '../src/index.ts';

describe('measuredLevel', () => {
  it('사람 수가 모자라면 null (n=4), 5 명부터 측정', () => {
    expect(DIFFICULTY_MIN_SOLVERS).toBe(5);
    expect(measuredLevel('choice', 4, 4)).toBeNull();
    expect(measuredLevel('choice', 5, 5)).toBe(1);
  });
  it('객관식 · 단답 경계 90 / 89.9', () => {
    expect(measuredLevel('choice', 10, 9)).toBe(1);        // 90%
    expect(measuredLevel('short', 1000, 899)).toBe(2);     // 89.9%
    expect(measuredLevel('choice', 100, 75)).toBe(2);
    expect(measuredLevel('choice', 100, 55)).toBe(3);
    expect(measuredLevel('choice', 100, 35)).toBe(4);
    expect(measuredLevel('choice', 100, 34)).toBe(5);
  });
  it('OX 는 95 · 85 · 72 · 60', () => {
    expect(measuredLevel('ox', 20, 19)).toBe(1);           // 95%
    expect(measuredLevel('ox', 10, 9)).toBe(2);            // 90%
    expect(measuredLevel('ox', 100, 72)).toBe(3);
    expect(measuredLevel('ox', 100, 60)).toBe(4);
    expect(measuredLevel('ox', 100, 59)).toBe(5);
  });
});

describe('difficultyView · effective3', () => {
  it('미측정 + AI 값 → "측정 중 (예상: 표준)"', () => {
    const v = difficultyView({ type: 'ox', difficulty: '표준', stats: { n: 4, correct: 1 } });
    expect(v).toEqual({ level: null, label: '난이도 측정 중 (예상: 표준)', expected: '표준', n: 4 });
    expect(difficultyView({ type: 'ox' }).label).toBe('난이도 측정 중');
  });
  it('측정되면 5단계 라벨 · 정답률', () => {
    const v = difficultyView({ type: 'choice', difficulty: '기초', stats: { n: 10, correct: 3 } });
    expect(v.level).toBe(5); expect(v.label).toBe('매우 어려움'); expect(v.rate).toBe(30);
  });
  it('effective3: 측정 1-2 기초, 3 표준, 4-5 심화, 미측정이면 AI 값', () => {
    expect(effective3({ type: 'choice', difficulty: '심화', stats: { n: 10, correct: 8 } })).toBe('기초');
    expect(effective3({ type: 'choice', stats: { n: 10, correct: 6 } })).toBe('표준');
    expect(effective3({ type: 'choice', difficulty: '기초', stats: { n: 10, correct: 4 } })).toBe('심화');
    expect(effective3({ type: 'choice', difficulty: '심화', stats: { n: 3, correct: 3 } })).toBe('심화');
    expect(effective3({ type: 'choice' })).toBeNull();
  });
});

describe('difficultyMixGap', () => {
  it('가장 많이 어긋난 난이도', () => {
    const g = difficultyMixGap({ 기초: 10 }, { 기초: 3, 표준: 5, 심화: 2 })!;
    expect(g.difficulty).toBe('기초'); expect(Math.round(g.gap)).toBe(70);
    expect(difficultyMixGap({ 기초: 3, 표준: 5, 심화: 2 }, { 기초: 3, 표준: 5, 심화: 2 })!.gap).toBe(0);
  });
});
