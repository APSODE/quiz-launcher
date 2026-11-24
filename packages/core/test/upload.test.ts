import { describe, it, expect } from 'vitest';
import { checkUploadFile, uploadToJsx, parseJSX, validateCatalog, type UploadJson } from '../src/index.ts';

const catalog = validateCatalog([
  { subject: '운영체제', grade: 2, semester: 2, scope: { 기말고사: { rev: 3, units: ['8장'], include: [], exclude: ['Belady'], difficultyMix: { 기초: 3, 표준: 5, 심화: 2 } } } },
  { subject: '컴퓨터네트워크', grade: 2, semester: 2 },
]).catalog;
const ctx = { catalog, existing: [] };
const q = (i: number, extra: Record<string, unknown> = {}) => ({ category: '페이지 교체', question: `문제 ${i} 번 페이지 교체 설명 ${'가나다라마바사'.slice(0, i % 7)}${i}`, answer: i % 2 === 0, explanation: '해설', source: '8장 p.3', difficulty: '표준', ...extra });
const file = (questions: Record<string, unknown>[], meta: Record<string, unknown> = {}) => ({ meta: { subject: '운영체제', exam: '기말고사', kind: '일반문제', title: 't', unit: '8장', scopeRev: 3, ...meta }, questions });
const msgs = (r: { messages: { level: string; where: string; message: string }[] }) => r.messages.map((m) => `${m.level} ${m.where} ${m.message}`);

describe('업로드 · source · difficulty · scopeRev', () => {
  it('모두 맞으면 경고 없음 (10문항 미만이면 비율 검사 안 함)', () => {
    const r = checkUploadFile('a.json', file([q(1), q(2, { difficulty: '기초' })]), ctx);
    expect(r.ok).toBe(true);
    expect(msgs(r)).toEqual([]);
  });
  it('잘못된 difficulty · source · scopeRev 는 오류', () => {
    const r = checkUploadFile('a.json', file([q(1, { difficulty: '어려움' }), q(2, { source: 3 })], { scopeRev: 0 }), ctx);
    expect(r.ok).toBe(false);
    const m = msgs(r);
    expect(m.some((x) => x.startsWith('error 1번 difficulty'))).toBe(true);
    expect(m.some((x) => x.startsWith('error 2번 source'))).toBe(true);
    expect(m.some((x) => x.startsWith('error meta scopeRev'))).toBe(true);
  });
  it('누락은 파일당 한 번 개수 요약 경고, scopeRev 없음 · 다름 경고', () => {
    const { source, difficulty, ...bare } = q(1);
    let r = checkUploadFile('a.json', file([bare, { ...bare, question: '다른 문제입니다 정말로' }], { scopeRev: undefined }), ctx);
    expect(r.ok).toBe(true);
    const m = msgs(r);
    expect(m.filter((x) => x.includes('difficulty 가 없는 문항 2개'))).toHaveLength(1);
    expect(m.filter((x) => x.includes('source(출처)가 없는 문항 2개'))).toHaveLength(1);
    expect(m.some((x) => x.startsWith('warn meta scopeRev 가 없습니다'))).toBe(true);
    r = checkUploadFile('a.json', file([q(1)], { scopeRev: 2 }), ctx);
    expect(msgs(r)).toEqual([expect.stringMatching(/^warn meta scopeRev 2 가 지금 기말고사 범위\(rev 3\)와 다릅니다/)]);
  });
  it('범위 밖 의심 (단원 · 제외 키워드) 은 문항별 경고', () => {
    const r = checkUploadFile('a.json', file([q(1, { question: 'Belady 의 이상 현상은 FIFO 에서 생긴다.' })], { unit: '7장' }), ctx);
    expect(r.ok).toBe(true);
    const m = msgs(r).filter((x) => x.includes('범위 밖 의심'));
    expect(m).toHaveLength(1);
    expect(m[0]).toMatch(/^warn 1번 범위 밖 의심: 단원 '7장'.*제외 항목 'Belady'/);
  });
  it('범위 없는 과목에 scopeRev 를 적으면 경고', () => {
    const r = checkUploadFile('a.json', file([q(1)], { subject: '컴퓨터네트워크' }), ctx);
    expect(msgs(r)).toEqual([expect.stringMatching(/등록된 범위가 없습니다/)]);
  });
  it('난이도 있는 문항 10개 이상이고 비율이 15%p 넘게 다르면 경고', () => {
    const many = Array.from({ length: 10 }, (_, i) => q(i, { difficulty: i < 7 ? '심화' : '표준' }));
    let r = checkUploadFile('a.json', file(many), ctx);
    expect(msgs(r).filter((x) => x.includes('난이도 비율'))).toHaveLength(1);
    const ok = Array.from({ length: 10 }, (_, i) => q(i, { difficulty: i < 3 ? '기초' : i < 8 ? '표준' : '심화' }));
    r = checkUploadFile('a.json', file(ok), ctx);
    expect(msgs(r).filter((x) => x.includes('난이도 비율'))).toEqual([]);
  });
  it('JSX 출력: META.scopeRev · 문항 source · difficulty 를 쓰고 파서가 다시 읽는다', () => {
    const data = file([q(1)]) as unknown as UploadJson;
    const code = uploadToJsx(data, { uploaderUsername: 'u', uploaderNickname: 'n', date: '2026-11-20', assignIds: false });
    expect(code).toContain('"scopeRev":3');
    const p = parseJSX('운영체제/일반문제/x.jsx', code, { group: '운영체제' });
    expect(p.scopeRev).toBe(3);
    expect(p.questions[0].difficulty).toBe('표준');
    expect(p.questions[0].source).toBe('8장 p.3');
  });
});

describe('업로드 · rulesRev', () => {
  const rctx = { ...ctx, rules: { rev: 2, avoid: ['단축키'] } };
  it('잘못된 rulesRev 는 오류', () => {
    const r = checkUploadFile('a.json', file([q(1)], { rulesRev: 0 }), rctx);
    expect(msgs(r).some((x) => x.startsWith('error meta rulesRev'))).toBe(true);
    expect(checkUploadFile('a.json', file([q(1)], { rulesRev: '2' }), rctx).ok).toBe(false);
  });
  it('지금보다 낮을 때만 경고 · 없으면 경고 없음 · JSX 에는 안 남김', () => {
    expect(msgs(checkUploadFile('a.json', file([q(1)], { rulesRev: 1 }), rctx))).toEqual(['warn meta 옛 출제 규칙(rev 1) 기준 — 지금 rev 2. 바뀐 출제 규칙(내지 말 것)을 확인하세요.']);
    expect(msgs(checkUploadFile('a.json', file([q(1)], { rulesRev: 2 }), rctx))).toEqual([]);
    expect(msgs(checkUploadFile('a.json', file([q(1)]), rctx))).toEqual([]);
    expect(msgs(checkUploadFile('a.json', file([q(1)], { rulesRev: 1 }), ctx))).toEqual([]);
    const jsx = uploadToJsx(file([q(1)], { rulesRev: 2 }) as UploadJson, { uploaderUsername: 'u', uploaderNickname: 'n', date: 'd' });
    expect(jsx).not.toContain('rulesRev');
  });
});
