import { useState } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import { me, toasts } from '../state.ts';
import { api } from '../api.ts';
import { route, navigate } from '../lib/router.ts';

export function Layout({ children }: { children: ComponentChildren }) {
  const [open, setOpen] = useState(false);
  const user = me.value;
  const path = route.value.path;
  const link = (href: string, label: string, match?: string) => (
    <a class={'nav' + (path.startsWith(match ?? href) && (href !== '/' || path === '/') ? ' on' : '')} href={href} onClick={() => setOpen(false)}>{label}</a>
  );
  const logout = async () => { try { await api.logout(); } catch { /* 무시 */ } me.value = null; navigate('/login'); };
  return (
    <>
      <header class="topbar">
        <div class="topbar-in">
          <a class="brand" href="/">📚 문제 실행기</a>
          {user && <button class="menu-btn" onClick={() => setOpen(!open)}>☰</button>}
          {user && (
            <nav class={'topbar-links' + (open ? ' open' : '')}>
              {link('/', '홈')}
              {link('/leaderboard', '🏆 리더보드')}
              {link('/upload', '⬆️ 업로드')}
              {link('/my/uploads', '내 제출')}
              {link('/my/reports', '내 신고')}
              {link('/settings', '⚙️ 설정')}
              {user.role === 'admin' && link('/admin', '🛠 관리자')}
              <span class="who">{user.nickname}</span>
              <a class="nav" href="#" onClick={(e) => { e.preventDefault(); void logout(); }}>로그아웃</a>
            </nav>
          )}
        </div>
      </header>
      <main>{children}</main>
      <div class="toasts">{toasts.value.map((t) => <div key={t.id} class={'toast ' + t.tone}>{t.text}</div>)}</div>
    </>
  );
}
