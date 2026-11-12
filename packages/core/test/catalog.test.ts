import { describe, it, expect } from 'vitest';
import { validateCatalog } from '../src/index.ts';

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
