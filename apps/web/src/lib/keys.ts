// 정답 선택 단축키 (기존 실행기와 같은 규칙: e.code 기준, localStorage 저장)
import { signal } from '@preact/signals';
import { lsGet, lsSet } from './util.ts';

export type KeyAct = 'o' | 'x' | 'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6';
export const KEY_ACTIONS: { id: KeyAct; label: string }[] = [
  { id: 'o', label: 'O 선택' }, { id: 'x', label: 'X 선택' },
  { id: 'c1', label: '객관식 1번' }, { id: 'c2', label: '객관식 2번' }, { id: 'c3', label: '객관식 3번' },
  { id: 'c4', label: '객관식 4번' }, { id: 'c5', label: '객관식 5번' }, { id: 'c6', label: '객관식 6번' },
];
export const KEY_DEFAULT: Record<KeyAct, string[]> = {
  o: ['KeyO', 'ArrowLeft'], x: ['KeyX', 'ArrowRight'],
  c1: ['Digit1', 'Numpad1'], c2: ['Digit2', 'Numpad2'], c3: ['Digit3', 'Numpad3'],
  c4: ['Digit4', 'Numpad4'], c5: ['Digit5', 'Numpad5'], c6: ['Digit6', 'Numpad6'],
};
export const KEY_BLOCKED = ['Enter', 'NumpadEnter', 'Tab', 'Escape', 'ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight', 'AltLeft', 'AltRight', 'MetaLeft', 'MetaRight', 'CapsLock', 'Lang1', 'Lang2', 'HangulMode', 'Hanja'];
const KEY_SAVE = 'quizLauncher.keys';

function load(): Record<KeyAct, string[]> {
  const v = lsGet<Record<string, unknown> | null>(KEY_SAVE, null);
  const m = {} as Record<KeyAct, string[]>;
  KEY_ACTIONS.forEach((a) => { m[a.id] = v && Array.isArray(v[a.id]) ? (v[a.id] as string[]) : KEY_DEFAULT[a.id].slice(); });
  return m;
}
export const keyMap = signal(load());
export function saveKeys(m: Record<KeyAct, string[]>) { keyMap.value = m; lsSet(KEY_SAVE, m); }

export function keyName(code: string): string {
  const m = code.match(/^Key([A-Z])$/); if (m) return m[1];
  const d = code.match(/^Digit(\d)$/); if (d) return d[1];
  const n = code.match(/^Numpad(\d)$/); if (n) return '숫자패드 ' + n[1];
  return ({ ArrowLeft: '←', ArrowRight: '→', ArrowUp: '↑', ArrowDown: '↓', Space: 'Space', Backspace: 'Backspace',
    Minus: '-', Equal: '=', BracketLeft: '[', BracketRight: ']', Semicolon: ';', Quote: "'", Comma: ',', Period: '.', Slash: '/', Backslash: '\\', Backquote: '`' } as Record<string, string>)[code] || code;
}
export function keyHintText(act: KeyAct): string { const ks = keyMap.value[act] || []; return ks.length ? keyName(ks[0]) : ''; }
export function keyAction(code: string): KeyAct | null {
  return KEY_ACTIONS.map((a) => a.id).find((id) => (keyMap.value[id] || []).includes(code)) || null;
}
/** 단축키를 받아도 되는 상황인가 (입력창 · 조합키 제외) */
export function keyEventUsable(e: KeyboardEvent): boolean {
  if (e.defaultPrevented || e.repeat || e.isComposing || e.ctrlKey || e.altKey || e.metaKey) return false;
  const tag = (e.target as HTMLElement | null)?.tagName;
  return !(tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT');
}
/** Enter 진행을 받아도 되는 상황인가 (버튼 · 입력창 포커스 제외) */
export function enterUsable(e: KeyboardEvent): boolean {
  if (e.key !== 'Enter' || e.defaultPrevented || e.repeat || e.isComposing) return false;
  const tag = (e.target as HTMLElement | null)?.tagName;
  return !(tag === 'BUTTON' || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'A');
}
