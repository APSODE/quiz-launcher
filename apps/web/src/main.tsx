import { render } from 'preact';
import { useEffect } from 'preact/hooks';
import type { Exam } from '@quiz/core';
import { EXAMS } from '@quiz/core';
import './styles/base.css';
import './styles/legacy-practice.css';
import './styles/app.css';
import { api, setUnauthorizedHandler, flushPending, ApiError } from './api.ts';
import { me, booted, loadManifest, loadPrefs } from './state.ts';
import { route, navigate, segments } from './lib/router.ts';
import { parseExplore } from './lib/nav.ts';
import { Layout } from './components/Layout.tsx';
import { Page, Spinner } from './components/common.tsx';
import { Login, Join, Reset } from './pages/Auth.tsx';
import { Explore } from './pages/Explore.tsx';
import { PlaySet, PlayReview } from './pages/Play.tsx';
import { AnalysisPage } from './pages/Analysis.tsx';
import { VocabPage, TermsPage } from './pages/Vocab.tsx';
import { PracticePage } from './pages/Practice.tsx';
import { LeaderboardPage, UploadPage, MyUploadsPage, MyReportsPage } from './pages/Social.tsx';
import { SettingsPage } from './pages/Settings.tsx';
import { AdminPage } from './pages/admin/Admin.tsx';

const PUBLIC = (path: string) => path === '/login' || path.startsWith('/join/') || path.startsWith('/reset/');

function goLogin() {
  const { path } = route.value;
  if (PUBLIC(path)) return;
  me.value = null;
  navigate('/login?next=' + encodeURIComponent(location.pathname + location.search), true);
}
setUnauthorizedHandler(goLogin);

async function boot() {
  try {
    me.value = await api.me();
  } catch (e) {
    if (!(e instanceof ApiError) || e.status !== 401) console.warn('로그인 확인 실패', e);
    me.value = null;
  }
  booted.value = true;
  if (me.value) { void loadManifest(true); void loadPrefs(); void flushPending(); }
  else goLogin();
}

function NotFound() { return <Page><div class="banner warn">없는 화면입니다. <a href="/">처음으로</a></div></Page>; }

function subjExam(q: URLSearchParams): { subject: string; exam: Exam } | null {
  const subject = q.get('subject'), exam = q.get('exam') as Exam;
  return subject && EXAMS.includes(exam) ? { subject, exam } : null;
}

function Routes() {
  const { path, query } = route.value;
  const segs = segments(path);
  if (path === '/login') return <Login />;
  if (segs[0] === 'join' && segs[1]) return <Join token={segs[1]} />;
  if (segs[0] === 'reset' && segs[1]) return <Reset token={segs[1]} />;
  if (!me.value) return <Spinner />;
  switch (segs[0]) {
    case 'q': { const p = query.get('path'); return p ? <PlaySet path={p} /> : <NotFound />; }
    case 'review': { const c = subjExam(query); return c ? <PlayReview {...c} /> : <NotFound />; }
    case 'analysis': { const c = subjExam(query); return c ? <AnalysisPage {...c} /> : <NotFound />; }
    case 'vocab': { const c = subjExam(query); return c ? <VocabPage {...c} /> : <NotFound />; }
    case 'terms': { const c = subjExam(query); return c ? <TermsPage {...c} /> : <NotFound />; }
    case 'practice': { const c = subjExam(query); const id = query.get('id'); return c && id ? <PracticePage {...c} id={id} /> : <NotFound />; }
    case 'leaderboard': return <LeaderboardPage />;
    case 'upload': return <UploadPage />;
    case 'my': return segs[1] === 'uploads' ? <MyUploadsPage /> : segs[1] === 'reports' ? <MyReportsPage /> : <NotFound />;
    case 'settings': return <SettingsPage />;
    case 'admin': return <AdminPage tab={segs[1] || 'uploads'} />;
  }
  const pos = parseExplore(segs);
  return pos ? <Explore pos={pos} /> : <NotFound />;
}

function App() {
  useEffect(() => { void boot(); }, []);
  if (!booted.value) return <Spinner text="시작하는 중…" />;
  return <Layout><Routes /></Layout>;
}

render(<App />, document.getElementById('app')!);
