import type { Catalog, CatalogEntry } from './types.ts';

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
    catalog.push({ subject: s, grade: x.grade as number, semester: x.semester });
  });
  return { catalog, errors };
}
