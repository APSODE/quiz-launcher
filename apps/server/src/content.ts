// 콘텐츠 로더 (설계 3장): 작업 사본을 읽어 매니페스트 · 세트 · 문항 색인을 메모리에 든다.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import vm from 'node:vm';
import {
  parseJSX, itemIdOf, hashString, validateCatalog, similarity, scopeIssues, EXAMS, KINDS, DIFFICULTIES,
  type Catalog, type Difficulty, type ExamScope, type Exam, type Item, type Kind, type Manifest, type ParsedSet, type PluginFile,
  type PracticeDataFile, type QuestionType, type SetDetail, type SetSummary, type SubjectNode, type Term, type Evaluate,
} from '@quiz/core';

/** node:vm 빈 컨텍스트 + 2초 제한. 다른 realm 객체를 JSON 으로 옮겨 온다(순수 데이터만) */
export const vmEvaluate: Evaluate = (raw) => {
  try {
    const v = vm.runInNewContext('(' + raw + ')', Object.create(null), { timeout: 2000 });
    return v === undefined ? null : JSON.parse(JSON.stringify(v));
  } catch { return null; }
};

export interface ItemRef {
  itemId: string; setPath: string; subject: string; exam: Exam; unit: string; category: string;
  question: string; index: number;
}
interface SetEntry { summary: Omit<SetSummary, 'uploader'> & { uploaderUsername?: string }; items: Item[]; terms: Term[] }

export interface LoadResult {
  contentVersion: string;
  catalog: Catalog;
  sets: Map<string, SetEntry>;
  items: Map<string, ItemRef>;
  plugins: PluginFile[];
  practiceData: PracticeDataFile[];
  errors: { path: string; error: string }[];
}

const SKIP = new Set(['node_modules', 'apps', 'packages', 'docs', 'tools']);
function walk(dir: string, root: string, out: string[] = []): string[] {
  for (const n of readdirSync(dir)) {
    if (n.startsWith('.') || (dir === root && SKIP.has(n))) continue;
    const p = join(dir, n);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, root, out);
    else if (/\.jsx?$/i.test(n)) out.push(p);
  }
  return out;
}

/** <과목>/난이도.json 사이드카: { "version": 1, "items": { "<문항 ID>": "기초|표준|심화" } } — .jsx 의 difficulty 가 우선 */
function loadDifficultySidecars(dir: string, errors: LoadResult['errors'], hashes: string[]): Map<string, Map<string, Difficulty>> {
  const out = new Map<string, Map<string, Difficulty>>();   // 과목 → 문항 ID → 난이도
  if (!existsSync(dir)) return out;
  for (const n of readdirSync(dir)) {
    const subject = n.normalize('NFC');
    if (n.startsWith('.') || SKIP.has(n) || subject === '플러그인') continue;
    const abs = join(dir, n, '난이도.json');
    if (!existsSync(abs) || !statSync(join(dir, n)).isDirectory()) continue;
    const at = `${subject}/난이도.json`;
    const raw = readFileSync(abs, 'utf8');
    hashes.push(at + hashString(raw));
    let d: { version?: unknown; items?: unknown };
    try { d = JSON.parse(raw.replace(/^\uFEFF/, '')); } catch (e) { errors.push({ path: at, error: 'JSON 문법 오류: ' + (e as Error).message }); continue; }
    if (!d || typeof d !== 'object' || d.version !== 1 || !d.items || typeof d.items !== 'object' || Array.isArray(d.items)) {
      errors.push({ path: at, error: '{ "version": 1, "items": { "<문항 ID>": "기초|표준|심화" } } 형식이어야 합니다' });
      continue;
    }
    const m = new Map<string, Difficulty>();
    out.set(subject, m);
    for (const [k, v] of Object.entries(d.items as Record<string, unknown>)) {
      if (!DIFFICULTIES.includes(v as Difficulty)) { errors.push({ path: at, error: `${k}: 난이도는 "기초" · "표준" · "심화" 중 하나: ${JSON.stringify(v)}` }); continue; }
      m.set(k.normalize('NFC'), v as Difficulty);
    }
  }
  return out;
}

export function loadContent(dir: string): LoadResult {
  const errors: { path: string; error: string }[] = [];
  let catalog: Catalog = [];
  const catPath = join(dir, '과목목록.json');
  let catRaw = '';
  if (existsSync(catPath)) {
    catRaw = readFileSync(catPath, 'utf8');
    try {
      const r = validateCatalog(JSON.parse(catRaw));
      catalog = r.catalog;
      r.errors.forEach((e) => errors.push({ path: '과목목록.json', error: e }));
    } catch (e) { errors.push({ path: '과목목록.json', error: (e as Error).message }); }
  }
  const sets = new Map<string, SetEntry>();
  const items = new Map<string, ItemRef>();
  const plugins: PluginFile[] = [], practiceData: PracticeDataFile[] = [];
  const hashes: string[] = [catRaw];
  const sidecar = loadDifficultySidecars(dir, errors, hashes);
  const scopeOf = (subject: string, exam: Exam): ExamScope | undefined => catalog.find((c) => c.subject === subject)?.scope?.[exam];
  const files = existsSync(dir) ? walk(dir, dir) : [];
  for (const abs of files) {
    const path = relative(dir, abs).split('\\').join('/').normalize('NFC');
    const parts = path.split('/');
    if (parts.length < 2) continue;
    if (parts[0] === '플러그인') {
      if (parts.length >= 3 && /\.js$/i.test(path)) { const h = hashString(readFileSync(abs, 'utf8')); plugins.push({ path, subject: parts[1], hash: h }); hashes.push(path + h); }
      continue;
    }
    if (parts[1] === '연습') {
      if (parts.length >= 3 && /\.jsx$/i.test(path)) { practiceData.push({ path, subject: parts[0] }); hashes.push(path + hashString(readFileSync(abs, 'utf8'))); }
      continue;
    }
    if (parts.length < 3 || !KINDS.includes(parts[1] as Kind)) continue;
    const code = readFileSync(abs, 'utf8');
    const hash = hashString(code);
    hashes.push(path + hash);
    let parsed: ParsedSet;
    try { parsed = parseJSX(path, code, { group: parts[0], evaluate: vmEvaluate }); }
    catch (e) { errors.push({ path, error: (e as Error).message }); continue; }
    if (!parsed.exam || !EXAMS.includes(parsed.exam as Exam)) { errors.push({ path, error: 'META.exam 이 없거나 잘못됐습니다.' }); continue; }
    const exam = parsed.exam as Exam;
    const typeCounts: Record<QuestionType, number> = { ox: 0, choice: 0, short: 0 };
    const its: Item[] = [];
    const seen = new Set<string>();
    const scope = scopeOf(parts[0], exam);
    let suspectCount = 0;
    parsed.questions.forEach((q, index) => {
      typeCounts[q.type]++;
      // 같은 세트에 질문 글이 같은 문항이 있으면 core ID 가 겹친다 → 두 번째부터 ~2, ~3 을 붙인다(문항을 버리지 않음)
      const base = itemIdOf(path, q);
      let itemId = base;
      for (let n = 2; seen.has(itemId); n++) itemId = `${base}~${n}`;
      if (itemId !== base) errors.push({ path, error: `경고: ${index + 1}번 질문 글이 앞 문항과 같아 ID 를 ${itemId.slice(itemId.lastIndexOf('#'))} 로 구분` });
      seen.add(itemId);
      const it: Item = { ...q, itemId };
      if (!it.difficulty) { const sd = sidecar.get(parts[0])?.get(itemId); if (sd) it.difficulty = sd; }
      // 범위 밖 의심: 로드할 때마다 현재 범위로 다시 계산(데이터는 바꾸지 않음)
      const issues = scopeIssues(scope, { unit: parsed.unit, category: q.category, topic: parsed.topic, question: q.question });
      if (issues.length) { it.outOfScope = issues; suspectCount++; }
      its.push(it);
      items.set(itemId, { itemId, setPath: path, subject: parts[0], exam, unit: parsed.unit, category: q.category, question: q.question, index });
    });
    sets.set(path, {
      summary: {
        path, subject: parts[0], exam, kind: parts[1] as Kind, title: parsed.title, topic: parsed.topic, unit: parsed.unit,
        questionCount: its.length, typeCounts, termCount: parsed.terms.length, hash, uploaderUsername: parsed.uploader,
        ...(parsed.scopeRev != null ? { scopeRev: parsed.scopeRev } : {}),
        ...(scope ? { suspectCount } : {}),
      },
      items: its, terms: parsed.terms,
    });
  }
  // 사이드카 고아 키: 이 과목에 없는 문항 ID (경고만)
  for (const [subject, m] of sidecar) {
    for (const k of m.keys()) {
      const ref = items.get(k);
      if (!ref || ref.subject !== subject) errors.push({ path: `${subject}/난이도.json`, error: `경고: ${k}: 이 과목에 없는 문항 ID 입니다 (문항이 바뀌었거나 지워졌음)` });
    }
  }
  plugins.sort((a, b) => a.path.localeCompare(b.path));
  practiceData.sort((a, b) => a.path.localeCompare(b.path));
  return { contentVersion: hashString(hashes.sort().join('\n')), catalog, sets, items, plugins, practiceData, errors };
}

export function buildSubjects(r: LoadResult): SubjectNode[] {
  const by = new Map<string, Set<Exam>>();
  const add = (subject: string, exam: Exam) => {
    if (!by.has(subject)) by.set(subject, new Set());
    by.get(subject)!.add(exam);
  };
  for (const s of r.sets.values()) add(s.summary.subject, s.summary.exam);
  // 과목목록의 exams: 세트가 없어도 그 시험 메뉴를 둔다(세트가 하나도 없는 과목도 나온다)
  for (const c of r.catalog) for (const e of c.exams ?? []) add(c.subject, e);
  return [...by.entries()].map(([subject, ex]) => {
    const c = r.catalog.find((x) => x.subject === subject);
    return { subject, grade: c ? c.grade : null, semester: c ? c.semester : null, exams: EXAMS.filter((e) => ex.has(e)), ...(c?.scope ? { scope: c.scope } : {}) };
  }).sort((a, b) => (a.grade ?? 99) - (b.grade ?? 99) || (a.semester ?? 9) - (b.semester ?? 9) || a.subject.localeCompare(b.subject));
}

export class ContentStore {
  dir: string;
  data: LoadResult;
  subjects: SubjectNode[];
  constructor(dir: string) { this.dir = dir; this.data = loadContent(dir); this.subjects = buildSubjects(this.data); }

  /** 다시 읽고, 같은 세트에서 사라진 문항 ↔ 새 문항의 별칭 후보를 돌려준다(설계 4장) */
  reload(): { oldId: string; newId: string; similarity: number; setPath: string; oldQuestion: string; newQuestion: string }[] {
    const prev = this.data;
    this.data = loadContent(this.dir);
    this.subjects = buildSubjects(this.data);
    const out: { oldId: string; newId: string; similarity: number; setPath: string; oldQuestion: string; newQuestion: string }[] = [];
    for (const [path, ps] of prev.sets) {
      const ns = this.data.sets.get(path);
      if (!ns) continue;
      const newIds = new Set(ns.items.map((i) => i.itemId));
      const oldIds = new Set(ps.items.map((i) => i.itemId));
      const removed = ps.items.filter((i) => !newIds.has(i.itemId));
      const added = ns.items.filter((i) => !oldIds.has(i.itemId));
      for (const o of removed) {
        let best: Item | null = null, bs = 0;
        for (const a of added) { const s = similarity(o.question, a.question); if (s > bs) { bs = s; best = a; } }
        if (best && bs >= 0.6) out.push({ oldId: o.itemId, newId: best.itemId, similarity: bs, setPath: path, oldQuestion: o.question, newQuestion: best.question });
      }
    }
    return out;
  }

  manifest(nicknames: Map<string, string>): Manifest {
    const sets: SetSummary[] = [...this.data.sets.values()].map((s) => this.summary(s, nicknames))
      .sort((a, b) => a.path.localeCompare(b.path));
    return { contentVersion: this.data.contentVersion, subjects: this.subjects, sets, plugins: this.data.plugins, practiceData: this.data.practiceData };
  }
  summary(s: SetEntry, nicknames: Map<string, string>): SetSummary {
    const { uploaderUsername, ...rest } = s.summary;
    return { ...rest, ...(uploaderUsername ? { uploader: { username: uploaderUsername, nickname: nicknames.get(uploaderUsername) ?? null } } : {}) };
  }
  setDetail(path: string, nicknames: Map<string, string>): SetDetail | null {
    const s = this.data.sets.get(path.normalize('NFC'));
    if (!s) return null;
    return { ...this.summary(s, nicknames), items: s.items, terms: s.terms };
  }
  terms(subject?: string, exam?: string): Term[] {
    const out: Term[] = [];
    for (const s of this.data.sets.values()) {
      if (subject && s.summary.subject !== subject) continue;
      if (exam && s.summary.exam !== exam) continue;
      out.push(...s.terms);
    }
    return out;
  }
  item(id: string): Item | null {
    const r = this.data.items.get(id);
    if (!r) return null;
    return this.data.sets.get(r.setPath)!.items.find((i) => i.itemId === id) ?? null;
  }
  rawAllowed(path: string): boolean {
    const p = path.normalize('NFC');
    return this.data.plugins.some((x) => x.path === p) || this.data.practiceData.some((x) => x.path === p);
  }
  readRaw(path: string): string { return readFileSync(join(this.dir, path.normalize('NFC')), 'utf8'); }
  existingQuestions(): { subject: string; path: string; question: string }[] {
    return [...this.data.items.values()].map((i) => ({ subject: i.subject, path: i.setPath, question: i.question }));
  }
}
