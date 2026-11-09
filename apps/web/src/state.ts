// 앱 전역 상태 (로그인 사용자 · 매니페스트 · 과목 표시 설정 · 알림)
import { signal, computed } from '@preact/signals';
import type { Me, Manifest, SubjectPref } from '@quiz/core';
import { api } from './api.ts';

export const me = signal<Me | null>(null);
export const booted = signal(false);
export const manifest = signal<Manifest | null>(null);
export const manifestError = signal<string | null>(null);
export const prefs = signal<SubjectPref[]>([]);
let manifestAt = 0;

export const hiddenSet = computed(() => new Set(prefs.value.filter((p) => p.hidden).map((p) => p.subject)));

/** 매니페스트: 5분이 지났거나 force 면 다시 받는다 */
export async function loadManifest(force = false): Promise<Manifest | null> {
  if (!force && manifest.value && Date.now() - manifestAt < 5 * 60 * 1000) return manifest.value;
  try {
    const m = await api.manifest();
    manifestAt = Date.now();
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
