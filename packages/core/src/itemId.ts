// 문항 ID (설계 4장). 기본 = <세트 경로>#<djb2(질문 글 공백 제거), 36진수> — 기존 weakQKey 와 같은 해시.
import type { Question } from './types.ts';

export function questionHash(question: unknown): string {
  const t = String(question).replace(/\s+/g, '');
  let h = 5381;
  for (let i = 0; i < t.length; i++) h = ((h * 33) ^ t.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

export function itemIdOf(setPath: string, q: Pick<Question, 'question' | 'id'>): string {
  if (typeof q.id === 'string' && q.id) return 'id:' + q.id;
  return setPath.normalize('NFC') + '#' + questionHash(q.question);
}

/** 업로드 문항 고정 ID: u<base36 시각><랜덤 4자> */
export function newFixedId(now = Date.now()): string {
  return 'u' + now.toString(36) + Math.random().toString(36).slice(2, 6).padEnd(4, '0');
}

/** 문자열 해시 (매니페스트 버전 등) */
export function hashString(s: string): string {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761); h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}
