// ⚙️ 설정: 닉네임 · 비밀번호, 과목 표시(10.4), 단축키
import { useEffect, useState } from 'preact/hooks';
import type { SubjectNode } from '@quiz/core';
import { api } from '../api.ts';
import { me, manifest, prefs, hiddenSet, loadManifest, toast } from '../state.ts';
import { gradeLabel, semLabel } from '../lib/nav.ts';
import { KEY_ACTIONS, KEY_BLOCKED, KEY_DEFAULT, keyMap, keyName, saveKeys, type KeyAct } from '../lib/keys.ts';
import { Page, Spinner } from '../components/common.tsx';

export function SettingsPage() {
  useEffect(() => { void loadManifest(); }, []);
  return (
    <Page narrow>
      <h1>⚙️ 설정</h1>
      <p class="lead">계정 · 과목 표시는 서버에 저장되고, 단축키는 이 기기에만 저장됩니다.</p>
      <Profile />
      <SubjectPrefs />
      <KeySettings />
    </Page>
  );
}

function Profile() {
  const u = me.value!;
  const [nick, setNick] = useState(u.nickname);
  const [cur, setCur] = useState(''); const [pw, setPw] = useState(''); const [pw2, setPw2] = useState('');
  const saveNick = async () => {
    const n = nick.trim();
    if (n.length < 2 || n.length > 16) return toast('닉네임은 2~16자입니다.', 'err');
    try { me.value = await api.updateMe({ nickname: n }); toast('닉네임을 바꿨습니다.', 'ok'); } catch (e) { toast((e as Error).message, 'err'); }
  };
  const savePw = async () => {
    if (pw.length < 8) return toast('비밀번호는 8자 이상입니다.', 'err');
    if (pw !== pw2) return toast('비밀번호 확인이 다릅니다.', 'err');
    try { me.value = await api.updateMe({ password: pw, currentPassword: cur }); setCur(''); setPw(''); setPw2(''); toast('비밀번호를 바꿨습니다.', 'ok'); } catch (e) { toast((e as Error).message, 'err'); }
  };
  return (
    <div class="panel">
      <h3>계정</h3>
      <div class="muted" style={{ marginBottom: 10 }}>아이디 <b>{u.username}</b> · {u.role === 'admin' ? '관리자' : '멤버'}</div>
      <label class="field"><span>닉네임</span>
        <div class="btn-row"><input class="input" style={{ flex: 1, width: 'auto' }} value={nick} onInput={(e) => setNick((e.target as HTMLInputElement).value)} /><button class="btn" onClick={saveNick}>저장</button></div></label>
      <label class="field"><span>현재 비밀번호</span><input class="input" type="password" autoComplete="current-password" value={cur} onInput={(e) => setCur((e.target as HTMLInputElement).value)} /></label>
      <label class="field"><span>새 비밀번호 (8자 이상)</span><input class="input" type="password" autoComplete="new-password" value={pw} onInput={(e) => setPw((e.target as HTMLInputElement).value)} /></label>
      <label class="field"><span>새 비밀번호 확인</span><input class="input" type="password" autoComplete="new-password" value={pw2} onInput={(e) => setPw2((e.target as HTMLInputElement).value)} /></label>
      <button class="btn" onClick={savePw}>비밀번호 바꾸기</button>
    </div>
  );
}

function SubjectPrefs() {
  const m = manifest.value;
  if (!m) return <Spinner />;
  const hidden = hiddenSet.value;
  const groups = new Map<string, { label: string; list: SubjectNode[]; order: number }>();
  m.subjects.forEach((s) => {
    const key = s.grade == null ? 'x' : `${s.grade}-${s.semester}`;
    const label = s.grade == null ? '미분류' : `${gradeLabel(s.grade)} ${semLabel(s.semester ?? 1)}`;
    if (!groups.has(key)) groups.set(key, { label, list: [], order: s.grade == null ? 999 : s.grade * 10 + (s.semester ?? 0) });
    groups.get(key)!.list.push(s);
  });
  const save = async (changes: { subject: string; hidden: boolean }[]) => {
    const old = prefs.value;
    const map = new Map(old.map((p) => [p.subject, p.hidden]));
    changes.forEach((c) => map.set(c.subject, c.hidden));
    prefs.value = [...map].map(([subject, h]) => ({ subject, hidden: h }));
    try {
      // 응답이 전체 목록이든 바뀐 것만이든 합쳐서 반영
      const res = await api.setPrefs(changes);
      const merged = new Map(prefs.value.map((p) => [p.subject, p.hidden]));
      res.forEach((p) => merged.set(p.subject, p.hidden));
      prefs.value = [...merged].map(([subject, h]) => ({ subject, hidden: h }));
    } catch (e) { prefs.value = old; toast((e as Error).message, 'err'); }
  };
  return (
    <div class="panel">
      <h3>과목 표시</h3>
      <p class="muted" style={{ marginBottom: 8 }}>끈 과목은 탐색 메뉴에서 빠집니다. 리더보드와 기록에는 영향이 없습니다. 새 과목은 처음에 표시됩니다.</p>
      {[...groups.values()].sort((a, b) => a.order - b.order).map((g) => (
        <div key={g.label} style={{ marginTop: 10 }}>
          <div class="btn-row" style={{ justifyContent: 'space-between' }}>
            <b style={{ fontSize: 13 }}>{g.label}</b>
            <span class="btn-row">
              <button class="mini" onClick={() => save(g.list.map((s) => ({ subject: s.subject, hidden: false })))}>전부 표시</button>
              <button class="mini" onClick={() => save(g.list.map((s) => ({ subject: s.subject, hidden: true })))}>전부 숨김</button>
            </span>
          </div>
          {g.list.sort((a, b) => a.subject.localeCompare(b.subject, 'ko')).map((s) => (
            <div key={s.subject} class="pref-row">
              <span>{s.subject} <span class="muted">{s.exams.join(' · ')}</span></span>
              <label class="switch"><input type="checkbox" checked={!hidden.has(s.subject)} onChange={(e) => save([{ subject: s.subject, hidden: !(e.target as HTMLInputElement).checked }])} /></label>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function KeySettings() {
  const [draft, setDraft] = useState<Record<KeyAct, string[]>>(() => JSON.parse(JSON.stringify(keyMap.value)));
  const [wait, setWait] = useState<KeyAct | null>(null);
  const [warn, setWarn] = useState('');
  useEffect(() => {
    if (!wait) return;
    const onKey = (e: KeyboardEvent) => {
      e.preventDefault(); e.stopPropagation();
      if (e.code === 'Escape') { setWait(null); return; }
      const code = e.code;
      if (!code || KEY_BLOCKED.includes(code)) { setWarn(keyName(code || e.key) + ' 키는 지정할 수 없습니다. (Enter는 다음 문제 진행 전용)'); return; }
      const other = KEY_ACTIONS.find((a) => a.id !== wait && (draft[a.id] || []).includes(code));
      if (other) { setWarn(`${keyName(code)} 키는 이미 "${other.label}"에 지정되어 있습니다. 먼저 거기서 지우세요.`); setWait(null); return; }
      const n = { ...draft, [wait]: draft[wait].includes(code) ? draft[wait] : [...draft[wait], code] };
      setDraft(n); setWait(null); setWarn('');
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [wait, draft]);
  return (
    <div class="panel">
      <h3>⌨️ 정답 선택 단축키</h3>
      <p class="muted">키 위치 기준이라 한/영 상태와 무관합니다. Enter는 다음 단계 진행 전용입니다.</p>
      <div class="legacy-practice" style={{ marginTop: 8 }}>
        {KEY_ACTIONS.map((a) => (
          <div key={a.id} class="key-row">
            <span class="lbl">{a.label}</span>
            {draft[a.id].map((c, i) => <span key={c} class="key-chip">{keyName(c)}<button onClick={() => setDraft({ ...draft, [a.id]: draft[a.id].filter((_, j) => j !== i) })}>✕</button></span>)}
            <button class={'key-add' + (wait === a.id ? ' wait' : '')} onClick={() => setWait(wait === a.id ? null : a.id)}>{wait === a.id ? '키를 누르세요…' : '+ 추가'}</button>
          </div>
        ))}
        <div class="key-warn">{warn}</div>
      </div>
      <div class="btn-row" style={{ marginTop: 8 }}>
        <button class="btn" onClick={() => { saveKeys(draft); toast('단축키를 저장했습니다.', 'ok'); }}>저장</button>
        <button class="btn ghost" onClick={() => setDraft(JSON.parse(JSON.stringify(KEY_DEFAULT)))}>기본값으로</button>
      </div>
    </div>
  );
}
