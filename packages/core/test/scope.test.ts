import { describe, it, expect } from 'vitest';
import { scopeIssues, normalizeKw, validateExamScope, type ExamScope } from '../src/index.ts';

const scope: ExamScope = { rev: 3, units: ['7장', '8장'], include: [], exclude: ['세그멘테이션 하드웨어', 'Belady'] };

describe('scopeIssues', () => {
  it('범위가 없으면 []', () => expect(scopeIssues(undefined, { unit: '1장', question: 'x' })).toEqual([]));
  it('범위 안이면 []', () => expect(scopeIssues(scope, { unit: '8장', category: '페이지 교체', question: 'LRU 는?' })).toEqual([]));
  it('units 에 없는 단원', () => {
    const r = scopeIssues(scope, { unit: '3장', question: 'x' });
    expect(r).toHaveLength(1);
    expect(r[0]).toMatch(/단원 '3장'/);
  });
  it('units 가 비었거나 세트 unit 이 없으면 단원 판정 안 함', () => {
    expect(scopeIssues({ ...scope, units: [] }, { unit: '3장', question: 'x' })).toEqual([]);
    expect(scopeIssues(scope, { unit: '', question: 'x' })).toEqual([]);
  });
  it('exclude 키워드: 공백 · 대소문자 무시, category · topic · question 모두 본다', () => {
    expect(scopeIssues(scope, { unit: '8장', question: 'belady의 이상 현상은?' })).toEqual([`제외 항목 'Belady' 에 해당합니다`]);
    expect(scopeIssues(scope, { unit: '8장', category: '세그멘테이션하드웨어', question: 'x' })).toHaveLength(1);
    expect(scopeIssues(scope, { unit: '8장', topic: '세그멘테이션  하드웨어 구조', question: 'x' })).toHaveLength(1);
    expect(scopeIssues(scope, { unit: '3장', question: 'Belady' })).toHaveLength(2);
  });
  it('normalizeKw', () => expect(normalizeKw(' Page  Fault ')).toBe('pagefault'));
});

describe('validateExamScope', () => {
  it('관리자 입력(rev 없음) 허용', () => {
    const r = validateExamScope({ units: ['7장'] }, { requireRev: false });
    expect(r.errors).toEqual([]);
    expect(r.scope).toEqual({ rev: 0, units: ['7장'], include: [], exclude: [] });
  });
  it('rev 필수(기본)', () => expect(validateExamScope({ units: [] }).scope).toBeNull());
  it('빈 문자열 · 문자열 아닌 항목은 오류', () => {
    expect(validateExamScope({ rev: 1, exclude: [''] }).errors[0]).toMatch(/exclude/);
    expect(validateExamScope({ rev: 1, units: '7장' }).errors[0]).toMatch(/units/);
    expect(validateExamScope({ rev: 1, updatedAt: '11/20' }).errors[0]).toMatch(/updatedAt/);
  });
  it('excludedUnits: 보존 · units 와 겹치면 오류 · 판정에는 안 씀', () => {
    const r = validateExamScope({ rev: 1, units: ['1장'], excludedUnits: ['모의고사'] });
    expect(r.scope).toMatchObject({ units: ['1장'], excludedUnits: ['모의고사'] });
    expect(scopeIssues(r.scope, { unit: '모의고사' })[0]).toMatch(/모의고사/);
    expect(validateExamScope({ rev: 1, units: ['기출'], excludedUnits: ['기출'] }).errors[0]).toMatch(/excludedUnits/);
    expect(validateExamScope({ rev: 1, units: [], excludedUnits: [] }).scope).not.toHaveProperty('excludedUnits');
  });
});
