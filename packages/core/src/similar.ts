// 비슷한 문제 판정: 글자 2-gram 다이스 유사도 (check.js --dup 과 같은 방식의 간이판)
export function bigrams(s: string): Map<string, number> {
  const t = String(s).replace(/\s+/g, '').toLowerCase();
  const m = new Map<string, number>();
  for (let i = 0; i < t.length - 1; i++) { const g = t.slice(i, i + 2); m.set(g, (m.get(g) || 0) + 1); }
  return m;
}
export function similarity(a: string, b: string): number {
  const A = bigrams(a), B = bigrams(b);
  let inter = 0, na = 0, nb = 0;
  A.forEach((v, k) => { na += v; const w = B.get(k); if (w) inter += Math.min(v, w); });
  B.forEach((v) => { nb += v; });
  return na + nb === 0 ? (a === b ? 1 : 0) : (2 * inter) / (na + nb);
}
