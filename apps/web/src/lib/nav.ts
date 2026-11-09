// 탐색 메뉴 (설계 10.4): 학년 → 학기 → 시험 → 과목. 미분류 과목은 /미분류/<시험>/<과목>.
import type { Exam, Manifest, SubjectNode } from '@quiz/core';
import { EXAMS } from '@quiz/core';

export const UNCLASSIFIED = '미분류';
export interface NavPos { grade?: number | null; semester?: 1 | 2; exam?: Exam; subject?: string }

export function gradeLabel(g: number | null): string { return g == null ? UNCLASSIFIED : `${g}학년`; }
export function semLabel(s: number): string { return `${s}학기`; }

/** 경로 세그먼트를 탐색 위치로. 탐색 경로가 아니면 null */
export function parseExplore(segs: string[]): NavPos | null {
  if (!segs.length) return {};
  const pos: NavPos = {};
  let i = 0;
  if (segs[0] === UNCLASSIFIED) { pos.grade = null; i = 1; }
  else {
    const g = /^(\d+)학년$/.exec(segs[0]); if (!g) return null;
    pos.grade = +g[1]; i = 1;
    if (segs.length > 1) {
      const s = /^([12])학기$/.exec(segs[1]); if (!s) return null;
      pos.semester = +s[1] as 1 | 2; i = 2;
    }
  }
  if (segs.length > i) {
    if (!EXAMS.includes(segs[i] as Exam)) return null;
    pos.exam = segs[i] as Exam; i++;
  }
  if (segs.length > i) { pos.subject = segs[i]; i++; }
  if (segs.length > i) return null;
  return pos;
}

export function explorePath(p: NavPos): string {
  const out: string[] = [];
  if (p.grade === undefined) return '/';
  if (p.grade === null) out.push(UNCLASSIFIED);
  else { out.push(gradeLabel(p.grade)); if (p.semester) out.push(semLabel(p.semester)); else return '/' + out.join('/'); }
  if (p.exam) { out.push(p.exam); if (p.subject) out.push(p.subject); }
  return '/' + out.map(encodeURIComponent).join('/');
}

export function subjectPath(node: SubjectNode, exam: Exam): string {
  return explorePath({ grade: node.grade, semester: node.semester ?? undefined, exam, subject: node.subject });
}

/** 보이는 과목 (숨김 제외, 세트가 있는 시험이 하나 이상) */
export function visibleSubjects(m: Manifest, hidden: Set<string>): SubjectNode[] {
  return m.subjects.filter((s) => !hidden.has(s.subject) && s.exams.length > 0);
}

export interface Level { kind: 'grade' | 'semester' | 'exam' | 'subject'; options: { label: string; pos: NavPos; node?: SubjectNode; count?: number }[] }

/** 현재 위치에서 고를 다음 단계 */
export function nextLevel(subs: SubjectNode[], p: NavPos): Level | null {
  if (p.grade === undefined) {
    const gs = [...new Set(subs.map((s) => s.grade))].sort((a, b) => (a == null ? 1 : b == null ? -1 : a - b));
    return { kind: 'grade', options: gs.map((g) => ({ label: gradeLabel(g), pos: { grade: g }, count: subs.filter((s) => s.grade === g).length })) };
  }
  const inGrade = subs.filter((s) => s.grade === p.grade);
  if (p.grade !== null && p.semester === undefined) {
    const ss = [...new Set(inGrade.map((s) => s.semester))].filter((x): x is 1 | 2 => x != null).sort();
    return { kind: 'semester', options: ss.map((s) => ({ label: semLabel(s), pos: { grade: p.grade, semester: s }, count: inGrade.filter((x) => x.semester === s).length })) };
  }
  const inSem = p.grade === null ? inGrade : inGrade.filter((s) => s.semester === p.semester);
  if (!p.exam) {
    const es = EXAMS.filter((e) => inSem.some((s) => s.exams.includes(e)));
    return { kind: 'exam', options: es.map((e) => ({ label: e, pos: { ...p, exam: e }, count: inSem.filter((s) => s.exams.includes(e)).length })) };
  }
  if (!p.subject) {
    const list = inSem.filter((s) => s.exams.includes(p.exam!)).sort((a, b) => a.subject.localeCompare(b.subject, 'ko'));
    return { kind: 'subject', options: list.map((s) => ({ label: s.subject, pos: { ...p, subject: s.subject }, node: s })) };
  }
  return null;
}

/** 선택지가 하나뿐인 단계는 건너뛴다. 건너뛴 단계 수와 최종 위치 */
export function autoSkip(subs: SubjectNode[], p: NavPos): { pos: NavPos; skipped: NavPos[] } {
  let pos = p; const skipped: NavPos[] = [];
  for (let guard = 0; guard < 4; guard++) {
    const lv = nextLevel(subs, pos);
    if (!lv || lv.kind === 'subject' || lv.options.length !== 1) break;
    skipped.push(pos);
    pos = lv.options[0].pos;
  }
  return { pos, skipped };
}

/** 브레드크럼 항목 */
export function crumbs(p: NavPos): { label: string; pos: NavPos }[] {
  const out: { label: string; pos: NavPos }[] = [{ label: '홈', pos: {} }];
  if (p.grade === undefined) return out;
  out.push({ label: gradeLabel(p.grade), pos: { grade: p.grade } });
  if (p.grade !== null && p.semester) out.push({ label: semLabel(p.semester), pos: { grade: p.grade, semester: p.semester } });
  if (p.exam) out.push({ label: p.exam, pos: { grade: p.grade, semester: p.semester, exam: p.exam } });
  if (p.subject) out.push({ label: p.subject, pos: { ...p } });
  return out;
}

export function findSubject(m: Manifest | null, subject: string): SubjectNode | undefined {
  return m?.subjects.find((s) => s.subject === subject);
}
/** 과목 · 시험 화면으로 돌아가는 경로 */
export function subjectHome(m: Manifest | null, subject: string, exam: Exam): string {
  const n = findSubject(m, subject);
  return n ? subjectPath(n, exam) : '/';
}
