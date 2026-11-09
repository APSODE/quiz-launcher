import { useEffect, useState, useCallback } from 'preact/hooks';
import type { ComponentChildren } from 'preact';

/** 비동기 데이터 훅: deps 가 바뀌면 다시 불러온다 */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]): { data: T | null; error: string | null; loading: boolean; reload: () => void; setData: (v: T) => void } {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let alive = true;
    setLoading(true); setError(null);
    fn().then((d) => { if (alive) { setData(d); setLoading(false); } }, (e: Error) => { if (alive) { setError(e.message); setLoading(false); } });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);
  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { data, error, loading, reload, setData };
}

export function Spinner({ text }: { text?: string }) { return <div class="spinner">{text || '불러오는 중…'}</div>; }
export function ErrorBox({ error, onRetry }: { error: string; onRetry?: () => void }) {
  return <div class="banner err">⚠️ {error} {onRetry && <button class="btn sm ghost" style={{ marginLeft: 8 }} onClick={onRetry}>다시 시도</button>}</div>;
}
export function Page({ children, narrow }: { children: ComponentChildren; narrow?: boolean }) {
  return <div class={'page' + (narrow ? ' narrow' : '')}>{children}</div>;
}
export function Pill({ tone, children }: { tone?: 'ok' | 'warn' | 'err' | 'blue'; children: ComponentChildren }) {
  return <span class={'pill' + (tone ? ' ' + tone : '')}>{children}</span>;
}
/** 경로 가능한 절대 URL 로 */
export function absUrl(u: string): string { return u.startsWith('/') ? location.origin + u : u; }
export async function copyText(t: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(t); return true; } catch { return false; }
}
