// 연습 플러그인 호환 계층 (설계 10.3).
// 기존 quiz_launcher.html 이 플러그인에 제공하던 전역을 window 에 올리고, 플러그인 원문을 classic <script> 로 실행한다.
// 플러그인이 실제로 쓰는 전역(플러그인/** grep 결과): registerPractice, escHtml, prRand, prInt, prNum, prMark,
// prClearMarks, prVec, prFact, SCHED_COLORS, currentPractice, practiceItems, practiceCats, practiceEmpty.
// 호환을 위해 currentSubject 도 함께 둔다.
import { findMeta } from '@quiz/core';
import type { Manifest } from '@quiz/core';
import { api } from '../api.ts';
import { escHtml } from '../lib/util.ts';

export interface PracticeModule {
  id: string; subject: string; icon: string; title: string; desc: string;
  mount: (root: HTMLElement) => void;
  onKey?: (act: string, e: KeyboardEvent) => void;
  onEnter?: (e: KeyboardEvent) => void;
  file?: string | null;
}
interface PdataRec { filename: string; practice: string; code: string }
interface PdataEval { code?: string; ITEMS: unknown[]; CATS: { id: unknown; name: string }[]; err: string | null }

export const PRACTICE_MODULES: PracticeModule[] = [];
let pluginLoading: string | null = null;
let pdata: PdataRec[] = [];
const pdataCache: Record<string, PdataEval> = {};
export const pluginErrors: string[] = [];

type W = Window & Record<string, unknown>;
const w = window as unknown as W;

function registerPractice(m: PracticeModule) {
  m.file = pluginLoading;
  const i = PRACTICE_MODULES.findIndex((x) => x.id === m.id);
  if (i >= 0) PRACTICE_MODULES[i] = m; else PRACTICE_MODULES.push(m);
}
function pdataEval(rec: PdataRec): PdataEval {
  const c = pdataCache[rec.filename];
  if (c && c.code === rec.code) return c;
  try {
    const r = Function(rec.code + '\n;return { ITEMS: typeof ITEMS === "undefined" ? [] : ITEMS, CATS: typeof CATS === "undefined" ? [] : CATS };')() as { ITEMS: unknown; CATS: unknown };
    if (!Array.isArray(r.ITEMS)) throw new Error('ITEMS 가 배열이 아닙니다');
    return (pdataCache[rec.filename] = { code: rec.code, ITEMS: r.ITEMS, CATS: Array.isArray(r.CATS) ? r.CATS : [], err: null });
  } catch (e) {
    console.warn('연습 데이터 오류: ' + rec.filename + ' — ' + (e as Error).message);
    return { ITEMS: [], CATS: [], err: (e as Error).message };
  }
}
function pdataFiles(id: string) { return pdata.filter((p) => p.practice === id).sort((a, b) => a.filename.localeCompare(b.filename, 'ko')); }
function practiceItems(id: string) { return pdataFiles(id).flatMap((p) => pdataEval(p).ITEMS); }
function practiceCats(id: string, items?: { cat?: unknown }[]) {
  const cats: { id: unknown; name: string }[] = [];
  pdataFiles(id).forEach((p) => pdataEval(p).CATS.forEach((c) => { if (c && !cats.some((x) => x.id === c.id)) cats.push(c); }));
  (items || []).forEach((it) => { if (it && it.cat != null && !cats.some((x) => x.id === it.cat)) cats.push({ id: it.cat, name: String(it.cat) }); });
  return cats;
}
function practiceEmpty(id: string) {
  const errs = pdataFiles(id).map((p) => [p.filename, pdataEval(p).err] as const).filter((x) => x[1]);
  return `<div class="pr-card"><h3 class="pr-h">📭 문항 데이터가 없습니다</h3><div class="pr-sub">과목 폴더의 <b>연습/</b> 아래에 <code>META.practice: '${escHtml(id)}'</code> 인 .jsx 파일이 레포에 있어야 합니다.`
    + (errs.length ? '<br><span style="color:#b91c1c">⚠️ 읽지 못한 파일<br>' + errs.map(([f, e]) => escHtml(f + ' — ' + e)).join('<br>') + '</span>' : '') + '</div></div>';
}
function prRand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function prInt(id: string) {
  const el = document.getElementById(id) as HTMLInputElement | null;
  const v = el ? el.value.trim() : '';
  return /^-?\d+$/.test(v) ? parseInt(v, 10) : null;
}
function prNum(id: string) {
  const el = document.getElementById(id) as HTMLInputElement | null;
  const v = el ? el.value.trim() : '';
  if (v === '' || isNaN(Number(v))) return null;
  return Number(v);
}
function prMark(id: string, ok: boolean) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('ok', 'ng');
  el.classList.add(ok ? 'ok' : 'ng');
}
function prClearMarks(root: ParentNode) { root.querySelectorAll('.ok,.ng').forEach((e) => e.classList.remove('ok', 'ng')); }
function prVec(v: unknown[]) { return '(' + v.join(', ') + ')'; }
function prFact(n: number) { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; }
const SCHED_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

/** 플러그인이 쓰는 전역 이름 목록 (점검용) */
export const LEGACY_GLOBALS = ['registerPractice', 'escHtml', 'prRand', 'prInt', 'prNum', 'prMark', 'prClearMarks', 'prVec', 'prFact',
  'SCHED_COLORS', 'currentPractice', 'currentSubject', 'practiceItems', 'practiceCats', 'practiceEmpty'];

export function installGlobals() {
  Object.assign(w, { registerPractice, escHtml, prRand, prInt, prNum, prMark, prClearMarks, prVec, prFact, SCHED_COLORS, practiceItems, practiceCats, practiceEmpty });
  if (!('currentPractice' in w)) w.currentPractice = null;
  if (!('currentSubject' in w)) w.currentSubject = null;
}
export function setCurrent(subject: string | null, m: PracticeModule | null) {
  w.currentSubject = subject;
  w.currentPractice = m;
}

function runPlugin(filename: string, code: string): string | null {
  let err: string | null = null;
  const onErr = (ev: ErrorEvent) => { if (!err) err = ev.message; };
  window.addEventListener('error', onErr);
  pluginLoading = filename;
  const s = document.createElement('script');
  s.textContent = code + '\n//# sourceURL=' + encodeURI(filename);
  try { document.head.appendChild(s); } finally {
    pluginLoading = null;
    window.removeEventListener('error', onErr);
  }
  return err;
}

let loaded: Promise<void> | null = null;
let loadedVersion = '';
/** 매니페스트의 플러그인 · 연습 데이터를 한 번만 불러온다. 콘텐츠 버전이 바뀌면 연습 데이터만 다시 읽는다(플러그인은 새로고침 필요). */
export function ensureLegacyLoaded(m: Manifest): Promise<void> {
  if (loaded && loadedVersion === m.contentVersion) return loaded;
  const first = !loaded;
  loadedVersion = m.contentVersion;
  loaded = (async () => {
    installGlobals();
    const pd = await Promise.all(m.practiceData.map(async (f) => {
      try {
        const code = await api.raw(f.path);
        const meta = findMeta(code);
        return meta.practice ? { filename: f.path, practice: String(meta.practice), code } : null;
      } catch (e) { pluginErrors.push(f.path + ' — ' + (e as Error).message); return null; }
    }));
    pdata = pd.filter((x): x is PdataRec => !!x);
    if (!first) return;
    const sorted = [...m.plugins].sort((a, b) => a.path.localeCompare(b.path, 'ko'));
    const codes = await Promise.all(sorted.map((p) => api.raw(p.path).catch((e: Error) => { pluginErrors.push(p.path + ' — ' + e.message); return null; })));
    sorted.forEach((p, i) => {
      const code = codes[i];
      if (code == null) return;
      const e = runPlugin(p.path, code);
      if (e) pluginErrors.push(p.path + ' — ' + e);
    });
  })();
  return loaded;
}

/** 과목의 연습 메뉴 (내장 '*' 메뉴는 앱이 따로 그린다) */
export function practicesFor(subject: string): PracticeModule[] {
  return PRACTICE_MODULES.filter((x) => x.subject === subject || (x.subject === '*' && x.file));
}
