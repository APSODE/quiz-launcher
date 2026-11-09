// 아주 작은 라우터: 경로(디코딩) + 쿼리를 signal 로 들고, <a href> 클릭을 가로챈다.
import { signal } from '@preact/signals';

function current() {
  return { path: decodeURIComponent(location.pathname), query: new URLSearchParams(location.search) };
}
export const route = signal(current());

export function navigate(to: string, replace = false) {
  const url = new URL(to, location.origin);
  const target = url.pathname + url.search + url.hash;
  if (target === location.pathname + location.search + location.hash && !replace) return;
  if (replace) history.replaceState(null, '', target); else history.pushState(null, '', target);
  route.value = current();
  if (!replace) window.scrollTo(0, 0);
}
window.addEventListener('popstate', () => { route.value = current(); });
document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = (e.target as HTMLElement | null)?.closest?.('a');
  if (!a || a.target || a.hasAttribute('download')) return;
  const href = a.getAttribute('href');
  if (!href || !href.startsWith('/') || href.startsWith('//') || href.startsWith('/api/')) return;
  e.preventDefault();
  navigate(href);
});

/** 경로를 세그먼트로 (빈 것 제거) */
export function segments(path: string): string[] { return path.split('/').filter(Boolean); }
/** 쿼리 문자열 만들기 */
export function qs(params: Record<string, string | number | undefined | null>): string {
  const u = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v != null && v !== '') u.set(k, String(v)); });
  const s = u.toString();
  return s ? '?' + s : '';
}
