import { describe, it, expect } from 'vitest';
import { validateCatalog, formatCatalog } from '../src/index.ts';

const base = { subject: '컴퓨터네트워크', grade: 2, semester: 2 };

describe('validateCatalog · exams', () => {
  it('없으면 exams 필드도 없다', () => {
    const r = validateCatalog([base]);
    expect(r.errors).toEqual([]);
    expect(r.catalog[0]).toEqual(base);
    expect('exams' in r.catalog[0]).toBe(false);
  });
  it('올바른 시험 이름 배열은 EXAMS 순서로 받는다', () => {
    const r = validateCatalog([{ ...base, exams: ['기말고사', '중간고사'] }, { ...base, subject: '운영체제', exams: [] }]);
    expect(r.errors).toEqual([]);
    expect(r.catalog[0].exams).toEqual(['중간고사', '기말고사']);
    expect(r.catalog[1].exams).toEqual([]);
  });
  it('잘못된 exams 는 오류를 내고 그 필드만 버린다(항목은 남김)', () => {
    const r = validateCatalog([
      { ...base, subject: 'a', exams: '기말고사' },
      { ...base, subject: 'b', exams: ['기말고사', '학기말'] },
      { ...base, subject: 'c', exams: ['중간고사', '중간고사'] },
    ]);
    expect(r.errors).toHaveLength(3);
    expect(r.errors[0]).toMatch(/^a: exams 는 배열/);
    expect(r.errors[1]).toMatch(/^b: exams 에 알 수 없는 시험/);
    expect(r.errors[2]).toMatch(/^c: exams 에 중복/);
    expect(r.catalog.map((e) => e.subject)).toEqual(['a', 'b', 'c']);
    for (const e of r.catalog) expect(e.exams).toBeUndefined();
  });
});

describe('validateCatalog · scope', () => {
  const sc = { rev: 3, updatedAt: '2026-11-20', units: ['7장', '8장'], include: ['8장 가상 메모리'], exclude: ['Belady 증명'], trend: 'EAT 계산', difficultyMix: { 기초: 3, 표준: 5, 심화: 2 }, note: '11/18 공지' };
  it('올바른 scope 는 보존한다(rev 포함)', () => {
    const r = validateCatalog([{ ...base, scope: { 기말고사: sc } }]);
    expect(r.errors).toEqual([]);
    expect(r.catalog[0].scope).toEqual({ 기말고사: sc });
    expect(r.catalog[0].scope!.기말고사!.rev).toBe(3);
  });
  it('빠진 배열은 [] 로 채운다', () => {
    const r = validateCatalog([{ ...base, scope: { 중간고사: { rev: 1 } } }]);
    expect(r.catalog[0].scope).toEqual({ 중간고사: { rev: 1, units: [], include: [], exclude: [] } });
  });
  it('잘못된 시험 범위는 오류를 내고 그 시험만 버린다', () => {
    const r = validateCatalog([{ ...base, scope: { 기말고사: sc, 중간고사: { rev: 0 }, 학기말: { rev: 1 } } }]);
    expect(r.errors).toHaveLength(2);
    expect(r.errors[0]).toMatch(/scope\.중간고사 — rev/);
    expect(r.errors[1]).toMatch(/알 수 없는 시험 '학기말'/);
    expect(Object.keys(r.catalog[0].scope!)).toEqual(['기말고사']);
  });
  it('모르는 필드 · 잘못된 difficultyMix 는 오류', () => {
    const r = validateCatalog([
      { ...base, subject: 'a', scope: { 기말고사: { rev: 1, foo: 1 } } },
      { ...base, subject: 'b', scope: { 기말고사: { rev: 1, difficultyMix: { 쉬움: 1 } } } },
      { ...base, subject: 'c', scope: '기말고사' },
    ]);
    expect(r.errors).toHaveLength(3);
    for (const e of r.catalog) expect(e.scope).toBeUndefined();
  });
});

describe('formatCatalog', () => {
  it('scope 없으면 한 줄, 있으면 들여쓴 JSON. 다시 읽으면 같다', () => {
    const entries = validateCatalog([
      { ...base, exams: ['중간고사', '기말고사'] },
      { subject: '운영체제', grade: 2, semester: 2, scope: { 기말고사: { rev: 2, units: ['7장'], exclude: ['Belady'] } } },
    ]).catalog;
    const t = formatCatalog(entries);
    expect(t.split('\n')[1]).toBe('  { "subject": "컴퓨터네트워크", "grade": 2, "semester": 2, "exams": ["중간고사", "기말고사"] },');
    expect(t).toContain('        "units": ["7장"],');
    expect(t.endsWith('\n]\n')).toBe(true);
    expect(validateCatalog(JSON.parse(t)).catalog).toEqual(entries);
  });
});
