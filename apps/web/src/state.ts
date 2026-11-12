// 앱 전역 상태 (로그인 사용자 · 매니페스트 · 과목 표시 설정 · 알림)
import { signal, computed } from '@preact/signals';
import type { Me, Manifest, SubjectPref } from '@quiz/core';
import { api } from './api.ts';
import { pluginsChanged } from './legacy/runtime.ts';

export const me = signal<Me | null>(null);
export const booted = signal(false);
export const manifest = signal<Manifest | null>(null);
export const manifestError = signal<string | null>(null);
export const prefs = signal<SubjectPref[]>([]);
let manifestAt = 0;

/** 새로고침이 필요한 변경(앱 배포 · 연습 메뉴 플러그인 변경). 있으면 화면 위에 배너 */
export const updateNotice = signal<string | null>(null);
// 이 페이지가 실행 중인 앱 빌드 (서버 appVersion 과 같은 형식: /assets/index-*.js). 개발 서버에서는 비교하지 않는다
const myAppVersion = (document.querySelector('script[type="module"][src*="/assets/"]') as HTMLScriptElement | null)?.getAttribute('src') ?? null;
function checkUpdate(m: Manifest) {
  if (m.appVersion && myAppVersion && m.appVersion !== myAppVersion) updateNotice.value = '앱이 새로 배포되었습니다.';
  else if (pluginsChanged(m)) updateNotice.value = '연습 메뉴가 바뀌었습니다.';
}

export const hiddenSet = computed(() => new Set(prefs.value.filter((p) => p.hidden).map((p) => p.subject)));

/** 매니페스트: 5분이 지났거나 force 면 다시 받는다 */
export async function loadManifest(force = false): Promise<Manifest | null> {
  if (!force && manifest.value && Date.now() - manifestAt < 5 * 60 * 1000) return manifest.value;
  try {
    const m = await api.manifest();
    manifestAt = Date.now();
    checkUpdate(m);
    if (!manifest.value || manifest.value.contentVersion !== m.contentVersion) manifest.value = m;
    manifestError.value = null;
    return m;
  } catch (e) {
    manifestError.value = (e as Error).message;
    return manifest.value;
  }
}
export async function loadPrefs() {
  try { prefs.value = await api.prefs(); } catch { /* 없으면 전부 표시 */ }
}

// 알림 (짧은 토스트)
export const toasts = signal<{ id: number; text: string; tone: 'ok' | 'err' | 'info' }[]>([]);
let toastId = 0;
export function toast(text: string, tone: 'ok' | 'err' | 'info' = 'info') {
  const id = ++toastId;
  toasts.value = [...toasts.value, { id, text, tone }];
  setTimeout(() => { toasts.value = toasts.value.filter((t) => t.id !== id); }, 3500);
}

// 변경 감지: 3분마다, 그리고 탭으로 돌아왔을 때(1분 이상 지났으면) 매니페스트를 다시 받는다. 로그인 전에는 하지 않는다
let watching = false;
export function watchUpdates() {
  if (watching) return;
  watching = true;
  setInterval(() => { if (me.value && !updateNotice.value) void loadManifest(true); }, 3 * 60 * 1000);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && me.value && !updateNotice.value && Date.now() - manifestAt > 60 * 1000) void loadManifest(true);
  });
}
