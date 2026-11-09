// 화면 공통 유틸 (기존 실행기의 색 규칙을 그대로 옮김)
export function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}
const GROUP_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16'];
export function groupColor(g: string): string { return GROUP_COLORS[hashStr(String(g)) % GROUP_COLORS.length]; }
const CAT_PALETTE = [
  { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  { bg: '#f5f3ff', color: '#6d28d9', border: '#ddd6fe' },
  { bg: '#ecfdf5', color: '#065f46', border: '#a7f3d0' },
  { bg: '#fff7ed', color: '#92400e', border: '#fed7aa' },
  { bg: '#fdf2f8', color: '#86198f', border: '#f0abfc' },
];
export function catStyle(cat: string): Record<string, string> {
  const c = CAT_PALETTE[hashStr(String(cat)) % CAT_PALETTE.length];
  return { background: c.bg, color: c.color, borderColor: c.border };
}
export function shuffle<T>(a: T[]): T[] {
  const r = a.slice();
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
  return r;
}
export function fmtDate(ms: number | null | undefined): string {
  if (!ms) return '-';
  const d = new Date(ms), p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
export function escHtml(str: unknown): string {
  if (str === undefined || str === null) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
export function unitSort(a: string, b: string): number {
  if (a === '기타' && b !== '기타') return 1;
  if (b === '기타' && a !== '기타') return -1;
  return a.localeCompare(b, 'ko', { numeric: true });
}
export function lsGet<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v == null ? fallback : (JSON.parse(v) as T); } catch { return fallback; }
}
export function lsSet(key: string, v: unknown): void {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* 저장 불가 환경 */ }
}
export function pct(n: number, d: number): number { return d ? Math.round((n / d) * 100) : 0; }
