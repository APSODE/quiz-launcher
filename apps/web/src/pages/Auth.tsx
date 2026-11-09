// 로그인 · 초대 가입 · 비밀번호 재설정 (설계 11장)
import { useState } from 'preact/hooks';
import { api } from '../api.ts';
import { me, loadManifest, loadPrefs } from '../state.ts';
import { navigate, route } from '../lib/router.ts';
import { useAsync, Spinner } from '../components/common.tsx';

function afterLogin() {
  void loadManifest(true); void loadPrefs();
  const next = route.value.query.get('next');
  navigate(next && next.startsWith('/') && !next.startsWith('//') ? next : '/', true);
}

export function Login() {
  const [u, setU] = useState(''); const [p, setP] = useState('');
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async (e: Event) => {
    e.preventDefault(); setBusy(true); setErr('');
    // 자동완성은 input 이벤트 없이 값을 채우기도 하므로 제출 순간의 입력칸 값을 읽는다
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const user = String(fd.get('username') ?? u).trim(), pass = String(fd.get('password') ?? p);
    try { me.value = await api.login(user, pass); afterLogin(); }
    catch (x) { setErr((x as Error).message); } finally { setBusy(false); }
  };
  return (
    <form class="login-box" onSubmit={submit}>
      <div class="center" style={{ fontSize: 36 }}>📚</div>
      <h1>문제 실행기</h1>
      <p class="lead">친구 초대로 가입한 계정으로 로그인하세요.</p>
      <label class="field"><span>아이디</span><input class="input" name="username" autoComplete="username" value={u} onInput={(e) => setU((e.target as HTMLInputElement).value)} /></label>
      <label class="field"><span>비밀번호</span><input class="input" name="password" type="password" autoComplete="current-password" value={p} onInput={(e) => setP((e.target as HTMLInputElement).value)} /></label>
      {err && <p class="err-text" style={{ marginBottom: 8 }}>{err}</p>}
      <button class="primary-btn" disabled={busy}>로그인</button>
      <p class="muted center" style={{ marginTop: 12 }}>계정이 없으면 운영자에게 초대 링크를 받으세요. 비밀번호를 잊으면 운영자가 재설정 링크를 만들어 줍니다.</p>
    </form>
  );
}

const USER_RE = /^[a-z0-9_]{3,20}$/;
export function Join({ token }: { token: string }) {
  const inv = useAsync(() => api.invite(token), [token]);
  const [f, setF] = useState({ username: '', nickname: '', password: '', password2: '' });
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: Event) => setF({ ...f, [k]: (e.target as HTMLInputElement).value });
  const submit = async (e: Event) => {
    e.preventDefault(); setErr('');
    if (!USER_RE.test(f.username)) return setErr('아이디는 영문 소문자 · 숫자 · _ 로 3~20자입니다.');
    const nick = f.nickname.trim();
    if (nick.length < 2 || nick.length > 16) return setErr('닉네임은 2~16자입니다.');
    if (f.password.length < 8) return setErr('비밀번호는 8자 이상입니다.');
    if (f.password !== f.password2) return setErr('비밀번호 확인이 다릅니다.');
    setBusy(true);
    try { me.value = await api.register({ token, username: f.username, nickname: nick, password: f.password }); afterLogin(); }
    catch (x) { setErr((x as Error).message); } finally { setBusy(false); }
  };
  if (inv.loading) return <Spinner />;
  if (inv.error || !inv.data?.valid) return <div class="login-box"><h1>초대 링크</h1><p class="lead">⚠️ 사용할 수 없는 초대 링크입니다(만료 · 폐기 · 사용 횟수 초과).</p><a class="btn ghost" href="/login">로그인으로</a></div>;
  return (
    <form class="login-box" onSubmit={submit}>
      <h1>가입하기</h1>
      <p class="lead">초대 링크로 계정을 만듭니다.</p>
      <label class="field"><span>아이디 (영문 소문자 · 숫자 · _, 3~20자, 바꿀 수 없음)</span><input class="input" autoComplete="username" value={f.username} onInput={set('username')} /></label>
      <label class="field"><span>닉네임 (2~16자, 리더보드에 표시)</span><input class="input" value={f.nickname} onInput={set('nickname')} /></label>
      <label class="field"><span>비밀번호 (8자 이상)</span><input class="input" type="password" autoComplete="new-password" value={f.password} onInput={set('password')} /></label>
      <label class="field"><span>비밀번호 확인</span><input class="input" type="password" autoComplete="new-password" value={f.password2} onInput={set('password2')} /></label>
      {err && <p class="err-text" style={{ marginBottom: 8 }}>{err}</p>}
      <button class="primary-btn" disabled={busy}>가입하고 시작하기</button>
    </form>
  );
}

export function Reset({ token }: { token: string }) {
  const [p, setP] = useState(''); const [p2, setP2] = useState('');
  const [err, setErr] = useState(''); const [done, setDone] = useState(false); const [busy, setBusy] = useState(false);
  const submit = async (e: Event) => {
    e.preventDefault(); setErr('');
    if (p.length < 8) return setErr('비밀번호는 8자 이상입니다.');
    if (p !== p2) return setErr('비밀번호 확인이 다릅니다.');
    setBusy(true);
    try { await api.reset(token, p); setDone(true); } catch (x) { setErr((x as Error).message); } finally { setBusy(false); }
  };
  if (done) return <div class="login-box"><h1>완료</h1><p class="lead">비밀번호를 바꿨습니다. 새 비밀번호로 로그인하세요.</p><a class="primary-btn" style={{ display: 'block', textAlign: 'center' }} href="/login">로그인</a></div>;
  return (
    <form class="login-box" onSubmit={submit}>
      <h1>비밀번호 재설정</h1>
      <p class="lead">새 비밀번호를 정하세요. 링크는 한 번만 쓸 수 있습니다.</p>
      <label class="field"><span>새 비밀번호 (8자 이상)</span><input class="input" type="password" autoComplete="new-password" value={p} onInput={(e) => setP((e.target as HTMLInputElement).value)} /></label>
      <label class="field"><span>비밀번호 확인</span><input class="input" type="password" autoComplete="new-password" value={p2} onInput={(e) => setP2((e.target as HTMLInputElement).value)} /></label>
      {err && <p class="err-text" style={{ marginBottom: 8 }}>{err}</p>}
      <button class="primary-btn" disabled={busy}>바꾸기</button>
    </form>
  );
}
