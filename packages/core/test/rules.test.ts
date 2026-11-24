import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { validateWritingRules, formatWritingRules, buildWritingRules, validateCatalog, DIFFICULTY_RUBRIC_MD, QUESTION_GUIDE_MD } from '../src/index.ts';

const catalog = validateCatalog([
  { subject: '운영체제', grade: 2, semester: 2, scope: { 기말고사: { rev: 3, updatedAt: '2026-11-20', units: ['7장', '8장'], include: ['페이지 교체'], exclude: ['Belady'], avoid: ['리눅스 명령어 옵션'], trend: '계산 비중 큼', difficultyMix: { 기초: 2, 표준: 5, 심화: 3 } } } },
  { subject: '컴퓨터네트워크', grade: 2, semester: 2 },
]).catalog;
const rules = { rev: 2, updatedAt: '2026-11-25', avoid: ['단축키 · 메뉴 위치 등 도구 조작법', '수업 운영 정보'] };

describe('validateWritingRules', () => {
  it('정상 · 정규화(중복 제거 · trim · 빈 note 버림)', () => {
    const r = validateWritingRules({ rev: 1, avoid: [' a ', 'a', 'b'], note: '  ' });
    expect(r.errors).toEqual([]);
    expect(r.rules).toEqual({ rev: 1, avoid: ['a', 'b'] });
  });
  it('rev 필수(기본) · 관리자 입력은 rev 없이', () => {
    expect(validateWritingRules({ avoid: [] }).errors[0]).toMatch(/rev/);
    expect(validateWritingRules({ avoid: ['x'] }, { requireRev: false }).rules).toEqual({ rev: 0, avoid: ['x'] });
  });
  it('잘못된 모양은 오류', () => {
    expect(validateWritingRules([]).rules).toBeNull();
    expect(validateWritingRules({ rev: 1, avoid: [''] }).errors[0]).toMatch(/avoid/);
    expect(validateWritingRules({ rev: 1, avoid: [], foo: 1 }).errors[0]).toMatch(/모르는 필드: foo/);
    expect(validateWritingRules({ rev: 1, updatedAt: '11/25' }).errors[0]).toMatch(/updatedAt/);
  });
  it('저장소 출제규칙.json 은 통과하고 formatWritingRules 로 그대로 돌아온다', () => {
    const raw = readFileSync(new URL('../../../출제규칙.json', import.meta.url), 'utf8');
    const r = validateWritingRules(JSON.parse(raw));
    expect(r.errors).toEqual([]);
    expect(formatWritingRules(r.rules!)).toBe(raw);
  });
});

describe('buildWritingRules', () => {
  it('범위 · 규칙이 있으면 모든 절과 rev', () => {
    const md = buildWritingRules({ catalog, rules, subject: '운영체제', exam: '기말고사', date: '2026-11-25' });
    expect(md.startsWith('# 출제 규칙 — 운영체제 기말고사\n')).toBe(true);
    for (const h of ['## 내지 말 것', '## 시험 범위', '## 난이도 기준', '## 좋은 문제 기준 · 업로드 양식']) expect(md).toContain('\n' + h + '\n');
    expect(md).toContain('규칙 rev: 2 (2026-11-25)');
    expect(md).toContain('범위 rev: 3 (2026-11-20)');
    expect(md).toContain('`meta.scopeRev` 에 3, `meta.rulesRev` 에 2');
    expect(md).toContain('- 단축키 · 메뉴 위치 등 도구 조작법');
    expect(md).toMatch(/추가 · 예외:\n\n- 리눅스 명령어 옵션/);
    expect(md).toContain('- 단원: 7장, 8장');
    expect(md).toContain('- 제외: Belady');
    expect(md).toContain('2 : 5 : 3');
    expect(md).toContain('**심화**');
    expect(md).toContain('"rulesRev": 1');
    expect(md.indexOf('## 내지 말 것')).toBeLessThan(md.indexOf('## 시험 범위'));
  });
  it('범위 · 규칙이 없어도 만든다', () => {
    const md = buildWritingRules({ catalog, rules: null, subject: '컴퓨터네트워크', exam: '중간고사', date: '2026-11-25' });
    expect(md).toContain('규칙 rev: 없음');
    expect(md).toContain('범위 rev: 없음');
    expect(md).toContain('등록된 범위가 없다');
    expect(md).toContain('3 : 5 : 2 (기본값)');
    expect(md).toContain('등록된 항목 없음');
    expect(buildWritingRules({ catalog, rules: { rev: 0, avoid: [] }, subject: '새과목', exam: '중간고사', date: 'x' })).toContain('과목목록에 없다');
  });
  it('기준표 · 양식 상수', () => {
    expect(DIFFICULTY_RUBRIC_MD).toMatch(/^# 난이도 3단계 기준표/);
    expect(QUESTION_GUIDE_MD).toContain('0부터 세는 번호');
  });
});
