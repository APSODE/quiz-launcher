import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { validateCatalog } from '@quiz/core';
import { makeTestApp, login, memberClient } from './helpers.ts';
import { git } from '../src/git.ts';

let t: Awaited<ReturnType<typeof makeTestApp>>;
beforeAll(async () => { t = await makeTestApp(); }, 60000);
afterAll(() => { if (t) rmSync(t.base, { recursive: true, force: true }); });

const scope = { units: ['1장', '2장'], include: ['1장 개요', '2장 하드웨어'], exclude: ['교착'], trend: 'OX 위주', difficultyMix: { 기초: 3, 표준: 5, 심화: 2 }, note: '테스트 공지' };
const catalogFile = () => validateCatalog(JSON.parse(readFileSync(join(t.sandbox.content, '과목목록.json'), 'utf8')));

function uploadForm(files: { name: string; data: unknown }[]) {
  const fd = new FormData();
  for (const f of files) fd.append('files', new File([JSON.stringify(f.data)], f.name, { type: 'application/json' }));
  return fd;
}

describe('시험 범위 미리보기 · 저장', () => {
  it('member 는 403 · 형식 오류는 400', async () => {
    const m = await memberClient(t, 'scopem', '범위멤버');
    expect((await m.post('/admin/scope/preview', { subject: '운영체제', exam: '중간고사', scope })).status).toBe(403);
    expect((await m.put('/admin/scope', { subject: '운영체제', exam: '중간고사', scope, baseRev: 0 })).status).toBe(403);
    const a = await login(t.app);
    expect((await a.post('/admin/scope/preview', { subject: '운영체제', exam: '시험', scope })).status).toBe(400);
    expect((await a.put('/admin/scope', { subject: '운영체제', exam: '중간고사', scope: { units: [1] }, baseRev: 0 })).status).toBe(400);
  });

  it('미리보기: 커밋 없이 의심 문항 계산', async () => {
    const a = await login(t.app);
    const before = (await git(t.sandbox.content, ['rev-parse', 'HEAD'])).stdout.trim();
    const r = await a.post('/admin/scope/preview', { subject: '운영체제', exam: '중간고사', scope });
    expect(r.status).toBe(200);
    expect(r.json.suspectCount).toBeGreaterThan(0);
    expect(r.json.suspectCount).toBe(r.json.sets.reduce((n: number, s: any) => n + s.suspects.length, 0));
    const s3 = r.json.sets.find((s: any) => s.path.includes('3장'));
    expect(s3.suspects[0].reasons[0]).toMatch(/단원 '3장'/);
    expect(r.json.sets.some((s: any) => s.suspects.some((q: any) => q.reasons.some((x: string) => x.includes("'교착'"))))).toBe(true);
    expect((await git(t.sandbox.content, ['rev-parse', 'HEAD'])).stdout.trim()).toBe(before);
    expect(t.ctx.content.data.catalog.find((c) => c.subject === '운영체제')!.scope).toBeUndefined();
  });

  it('저장 → 커밋(훅) · push → 매니페스트 scope · rev · 의심 표시', async () => {
    const a = await login(t.app);
    const r = await a.put('/admin/scope', { subject: '운영체제', exam: '중간고사', scope: { ...scope, rev: 99 }, baseRev: 0 });
    expect(r.status).toBe(200);
    expect(r.json).toMatchObject({ ok: true, rev: 1 });
    expect(r.json.hookOutput).toMatch(/검사 통과/);
    expect(r.json.suspectCount).toBeGreaterThan(0);
    expect((await git(t.sandbox.remote, ['rev-parse', 'main'])).stdout.trim()).toBe(r.json.commitSha);
    expect((await git(t.sandbox.content, ['log', '-1', '--format=%s'])).stdout.trim()).toBe('범위: 운영체제 중간고사 rev 1 (운영자)');
    const cat = catalogFile();
    expect(cat.errors).toEqual([]);
    expect(cat.catalog.find((c) => c.subject === '운영체제')!.scope!.중간고사).toMatchObject({ rev: 1, units: ['1장', '2장'], exclude: ['교착'], note: '테스트 공지' });
    expect(cat.catalog.find((c) => c.subject === '운영체제')!.scope!.중간고사!.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    const m = (await a.get('/content/manifest')).json;
    expect(m.subjects.find((s: any) => s.subject === '운영체제').scope.중간고사).toMatchObject({ rev: 1, trend: 'OX 위주' });
    expect(m.subjects.find((s: any) => s.subject === '웹프로그래밍').scope).toBeUndefined();
    const s3 = m.sets.find((s: any) => s.subject === '운영체제' && s.unit === '3장' && s.kind === '일반문제');
    expect(s3.suspectCount).toBe(s3.questionCount);
    const s1 = m.sets.find((s: any) => s.subject === '운영체제' && s.unit === '1장' && s.kind === '일반문제');
    expect(s1.suspectCount).toBe(0);
    expect(m.sets.find((s: any) => s.subject === '웹프로그래밍').suspectCount).toBeUndefined();
    const total = m.sets.filter((s: any) => s.subject === '운영체제' && s.exam === '중간고사').reduce((n: number, s: any) => n + (s.suspectCount ?? 0), 0);
    expect(total).toBe(r.json.suspectCount);
    const d = (await a.get('/content/set?path=' + encodeURIComponent(s3.path))).json;
    expect(d.items[0].outOfScope[0]).toMatch(/단원 '3장'/);
  }, 60000);

  it('baseRev 가 다르면 409 · 맞으면 rev + 1', async () => {
    const a = await login(t.app);
    const head = (await git(t.sandbox.content, ['rev-parse', 'HEAD'])).stdout.trim();
    const c = await a.put('/admin/scope', { subject: '운영체제', exam: '중간고사', scope, baseRev: 0 });
    expect(c.status).toBe(409);
    expect(c.json.ok).toBe(false);
    expect((await git(t.sandbox.content, ['rev-parse', 'HEAD'])).stdout.trim()).toBe(head);
    const nf = await a.put('/admin/scope', { subject: '없는과목', exam: '중간고사', scope, baseRev: 0 });
    expect(nf.json.ok).toBe(false);
    const r = await a.put('/admin/scope', { subject: '운영체제', exam: '중간고사', scope: { ...scope, units: [], exclude: [] }, baseRev: 1 });
    expect(r.json).toMatchObject({ ok: true, rev: 2, suspectCount: 0 });
    const m = (await a.get('/content/manifest')).json;
    expect(m.sets.filter((s: any) => s.subject === '운영체제' && s.exam === '중간고사').every((s: any) => s.suspectCount === 0)).toBe(true);
  }, 60000);

  it('범위가 있는 상태에서 새 과목 업로드 승인해도 scope 유지 (회귀)', async () => {
    const c = await memberClient(t, 'scopeup', '범위업');
    const data = {
      meta: { subject: '자료구조', grade: 2, semester: 1, exam: '기말고사', kind: '일반문제', title: '스택 테스트', unit: '3장' },
      questions: [
        { category: '스택', question: '스택은 후입선출(LIFO) 구조다.', answer: true, explanation: 'LIFO.', difficulty: '심화', source: '3장 p.1' },
        { category: '스택', question: '큐는 후입선출 구조다.', answer: false, explanation: '큐는 FIFO.', difficulty: '기초', source: '3장 p.2' },
      ],
    };
    const up = await c.raw('POST', '/uploads', uploadForm([{ name: 'ds.json', data }]));
    expect(up.status).toBe(200);
    const a = await login(t.app);
    const d = await a.post(`/admin/uploads/${up.json.upload.id}/decide`, { files: [{ id: up.json.upload.files[0].id, approve: true }] });
    expect(d.json.ok).toBe(true);
    const cat = catalogFile();
    expect(cat.errors).toEqual([]);
    expect(cat.catalog.find((x) => x.subject === '운영체제')!.scope!.중간고사!.rev).toBe(2);
    expect(cat.catalog.find((x) => x.subject === '자료구조')).toMatchObject({ grade: 2, semester: 1 });
    expect(t.ctx.content.subjects.find((s) => s.subject === '운영체제')!.scope!.중간고사!.rev).toBe(2);
  }, 60000);

  it('excludedUnits 왕복: 저장 → 과목목록 · 매니페스트 유지 · units 와 겹치면 400', async () => {
    const a = await login(t.app);
    expect((await a.put('/admin/scope', { subject: '운영체제', exam: '중간고사', scope: { ...scope, excludedUnits: ['1장'] }, baseRev: 2 })).status).toBe(400);
    const r = await a.put('/admin/scope', { subject: '운영체제', exam: '중간고사', scope: { ...scope, excludedUnits: ['모의고사'] }, baseRev: 2 });
    expect(r.json).toMatchObject({ ok: true, rev: 3 });
    expect(r.json.hookOutput).toMatch(/검사 통과/);
    const cat = catalogFile();
    expect(cat.errors).toEqual([]);
    expect(cat.catalog.find((c) => c.subject === '운영체제')!.scope!.중간고사).toMatchObject({ rev: 3, units: ['1장', '2장'], excludedUnits: ['모의고사'] });
    const m = (await a.get('/content/manifest')).json;
    expect(m.subjects.find((s: any) => s.subject === '운영체제').scope.중간고사.excludedUnits).toEqual(['모의고사']);
  }, 60000);

  it('난이도.json 사이드카: 병합(.jsx 우선) · 해시 포함 · 고아 경고', async () => {
    const dir = t.sandbox.content;
    const set = [...t.ctx.content.data.sets.values()].find((s) => s.summary.subject === '운영체제' && s.items.length >= 2 && s.items.every((i) => !i.difficulty))!;
    const ds = [...t.ctx.content.data.sets.values()].find((s) => s.summary.subject === '자료구조')!;
    const hard = ds.items.find((i) => i.difficulty === '심화')!;
    writeFileSync(join(dir, '운영체제/난이도.json'), JSON.stringify({ version: 1, items: { [set.items[0].itemId]: '심화', '운영체제/없는/세트.jsx#zzz': '기초', [hard.itemId]: '기초' } }));
    writeFileSync(join(dir, '자료구조/난이도.json'), JSON.stringify({ version: 1, items: { [hard.itemId]: '기초' } }));
    const v0 = t.ctx.content.data.contentVersion;
    t.ctx.reloadNow();
    expect(t.ctx.content.data.contentVersion).not.toBe(v0);
    expect(t.ctx.content.item(set.items[0].itemId)!.difficulty).toBe('심화');
    expect(t.ctx.content.item(set.items[1].itemId)!.difficulty).toBeUndefined();
    expect(t.ctx.content.item(hard.itemId)!.difficulty).toBe('심화');   // .jsx 값 우선
    const errs = t.ctx.status().loadErrors.filter((e) => e.path === '운영체제/난이도.json');
    expect(errs.some((e) => e.error.includes('운영체제/없는/세트.jsx#zzz'))).toBe(true);
    expect(errs.some((e) => e.error.includes(hard.itemId))).toBe(true);   // 다른 과목 문항 ID 도 고아
    expect(t.ctx.status().loadErrors.some((e) => e.path === '자료구조/난이도.json')).toBe(false);

    writeFileSync(join(dir, '운영체제/난이도.json'), JSON.stringify({ version: 1, items: { [set.items[0].itemId]: '어려움' } }));
    t.ctx.reloadNow();
    expect(t.ctx.content.item(set.items[0].itemId)!.difficulty).toBeUndefined();
    expect(t.ctx.status().loadErrors.some((e) => e.path === '운영체제/난이도.json' && e.error.includes('어려움'))).toBe(true);
  });
});
