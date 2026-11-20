import { EXAMS, type Catalog, type CatalogEntry, type Exam, type ScopeMap } from './types.ts';
import { validateExamScope } from './scope.ts';

export function validateCatalog(v: unknown): { catalog: Catalog; errors: string[] } {
  const errors: string[] = [];
  if (!Array.isArray(v)) return { catalog: [], errors: ['과목목록.json 은 배열이어야 합니다.'] };
  const seen = new Set<string>();
  const catalog: Catalog = [];
  v.forEach((e, i) => {
    const x = e as Partial<CatalogEntry>;
    if (!x || typeof x.subject !== 'string' || !x.subject.trim()) { errors.push(`${i}번: subject 가 없습니다.`); return; }
    if (!Number.isInteger(x.grade) || (x.grade as number) < 1) { errors.push(`${x.subject}: grade 는 1 이상의 정수`); return; }
    if (x.semester !== 1 && x.semester !== 2) { errors.push(`${x.subject}: semester 는 1 또는 2`); return; }
    const s = x.subject.normalize('NFC');
    if (seen.has(s)) { errors.push(`${s}: 중복 항목`); return; }
    seen.add(s);
    const entry: CatalogEntry = { subject: s, grade: x.grade as number, semester: x.semester };
    if (x.exams !== undefined) {
      const ex: unknown = x.exams;
      if (!Array.isArray(ex)) errors.push(`${s}: exams 는 배열이어야 합니다 (무시)`);
      else if (ex.some((e) => !EXAMS.includes(e as Exam))) errors.push(`${s}: exams 에 알 수 없는 시험이 있습니다 (무시) — 중간고사 · 기말고사만`);
      else if (new Set(ex).size !== ex.length) errors.push(`${s}: exams 에 중복 시험이 있습니다 (무시)`);
      else entry.exams = EXAMS.filter((e) => ex.includes(e));
    }
    // scope: 시험별 범위. 잘못된 시험 범위는 오류를 내고 그 시험만 버린다
    if (x.scope !== undefined) {
      const sc: unknown = x.scope;
      if (!sc || typeof sc !== 'object' || Array.isArray(sc)) errors.push(`${s}: scope 는 {"시험": 범위} 객체여야 합니다 (무시)`);
      else {
        const out: ScopeMap = {};
        for (const [k, v] of Object.entries(sc)) {
          if (!EXAMS.includes(k as Exam)) { errors.push(`${s}: scope 에 알 수 없는 시험 '${k}' (무시)`); continue; }
          const r = validateExamScope(v);
          if (r.scope) out[k as Exam] = r.scope;
          else errors.push(`${s}: scope.${k} — ${r.errors.join(' · ')} (무시)`);
        }
        if (Object.keys(out).length) entry.scope = Object.fromEntries(EXAMS.filter((e) => out[e]).map((e) => [e, out[e]])) as ScopeMap;
      }
    }
    catalog.push(entry);
  });
  return { catalog, errors };
}

const SCOPE_ORDER = ['rev', 'updatedAt', 'units', 'excludedUnits', 'include', 'exclude', 'trend', 'difficultyMix', 'note'];
/** 한 줄 JSON (배열 · 객체는 ", " 로 띄움) */
const inline = (v: unknown): string => Array.isArray(v) ? `[${v.map(inline).join(', ')}]`
  : v && typeof v === 'object' ? `{ ${Object.entries(v).map(([k, x]) => `${JSON.stringify(k)}: ${inline(x)}`).join(', ')} }` : JSON.stringify(v);

/** 과목목록.json 원문. 범위가 없는 과목은 한 줄, 있는 과목은 들여쓴 JSON (git diff 를 읽기 쉽게) */
export function formatCatalog(entries: CatalogEntry[]): string {
  const blocks = entries.map((e) => {
    const head = `"subject": ${JSON.stringify(e.subject)}, "grade": ${e.grade}, "semester": ${e.semester}${e.exams ? `, "exams": [${e.exams.map((x) => JSON.stringify(x)).join(', ')}]` : ''}`;
    if (!e.scope || !Object.keys(e.scope).length) return `  { ${head} }`;
    const exams = EXAMS.filter((x) => e.scope![x]).map((x) => {
      const sc = e.scope![x]! as unknown as Record<string, unknown>;
      const fields = SCOPE_ORDER.filter((k) => sc[k] !== undefined).map((k) => `        ${JSON.stringify(k)}: ${inline(sc[k])}`);
      return `      ${JSON.stringify(x)}: {\n${fields.join(',\n')}\n      }`;
    });
    return `  { ${head},\n    "scope": {\n${exams.join(',\n')}\n    } }`;
  });
  return '[\n' + blocks.join(',\n') + '\n]\n';
}
