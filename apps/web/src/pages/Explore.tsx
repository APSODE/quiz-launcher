// 탐색 (홈): 학년 → 학기 → 시험 → 과목 (설계 10.4) + 과목(시험별) 화면
import { useEffect, useState } from 'preact/hooks';
import type { Exam, SetSummary, SubjectNode, Manifest } from '@quiz/core';
import { manifest, manifestError, hiddenSet, loadManifest } from '../state.ts';
import { navigate, qs } from '../lib/router.ts';
import { autoSkip, crumbs, explorePath, nextLevel, visibleSubjects, type NavPos, findSubject } from '../lib/nav.ts';
import { groupColor, lsGet, lsSet, unitSort } from '../lib/util.ts';
import { Page, Spinner, ErrorBox, useAsync } from '../components/common.tsx';
import { api } from '../api.ts';
import { ensureLegacyLoaded, practicesFor, type PracticeModule } from '../legacy/runtime.ts';

const LAST_KEY = 'quizV2.lastSubject';
interface LastLoc { path: string; label: string }

function Crumbs({ pos, subs }: { pos: NavPos; subs: SubjectNode[] }) {
  const list = crumbs(pos);
  return (
    <nav class="crumbs">
      {list.map((c, i) => {
        const lastOne = i === list.length - 1;
        const skips = !lastOne && i > 0 && JSON.stringify(autoSkip(subs, c.pos).pos) !== JSON.stringify(c.pos);
        return (
          <span key={i} style={{ display: 'contents' }}>
            {i > 0 && <span class="sep">›</span>}
            {lastOne ? <span class="cur">{c.label}</span> : skips ? <span class="skip" title="선택지가 하나뿐이라 건너뛴 단계">{c.label}</span> : <a href={explorePath(c.pos)}>{c.label}</a>}
          </span>
        );
      })}
    </nav>
  );
}

export function Explore({ pos }: { pos: NavPos }) {
  const m = manifest.value;
  useEffect(() => { void loadManifest(); }, [JSON.stringify(pos)]);
  if (!m) return manifestError.value ? <Page><ErrorBox error={manifestError.value} onRetry={() => loadManifest(true)} /></Page> : <Spinner />;
  if (pos.subject && pos.exam) return <Subject m={m} pos={pos} />;
  return <ExploreLevels m={m} pos={pos} />;
}

function ExploreLevels({ m, pos }: { m: Manifest; pos: NavPos }) {
  const subs = visibleSubjects(m, hiddenSet.value);
  const { pos: target } = autoSkip(subs, pos);
  const changed = JSON.stringify(target) !== JSON.stringify(pos);
  useEffect(() => { if (changed) navigate(explorePath(target), true); }, [changed, JSON.stringify(target)]);
  if (changed) return <Spinner />;
  const lv = nextLevel(subs, pos);
  const last = lsGet<LastLoc | null>(LAST_KEY, null);
  const heading = !lv ? '' : lv.kind === 'grade' ? '학년을 고르세요' : lv.kind === 'semester' ? '학기를 고르세요' : lv.kind === 'exam' ? '시험을 고르세요' : '과목을 고르세요';
  return (
    <Page>
      <Crumbs pos={pos} subs={subs} />
      {last && <a class="entry-btn dark" href={last.path}><span class="ic">▶️</span><div><h3>이어서</h3><p>{last.label}</p></div><span class="arr">→</span></a>}
      {!subs.length && <div class="banner info">보이는 과목이 없습니다. {m.subjects.length ? <>⚙️ <a href="/settings">설정</a>에서 숨긴 과목을 다시 표시할 수 있어요.</> : '아직 콘텐츠가 없습니다.'}</div>}
      {lv && lv.options.length > 0 && <>
        <h1>{heading}</h1>
        <p class="lead">선택지가 하나뿐인 단계는 자동으로 건너뜁니다.</p>
        <div class="tile-grid">
          {lv.options.map((o) => {
            const sets = o.node ? m.sets.filter((s) => s.subject === o.node!.subject && s.exam === pos.exam && s.kind !== '단어집') : [];
            const qn = sets.reduce((a, s) => a + s.questionCount, 0);
            const tn = o.node ? m.sets.filter((s) => s.subject === o.node!.subject && s.exam === pos.exam).reduce((a, s) => a + s.termCount, 0) : 0;
            return (
              <a key={o.label} class="tile" href={explorePath(o.pos)} style={{ borderTopColor: groupColor(o.label) }}>
                <h3>{o.label}</h3>
                <p>{o.node ? `${sets.length}세트 · ${qn}문제${tn ? ` · 용어 ${tn}개` : ''}` : `과목 ${o.count}개`}</p>
              </a>
            );
          })}
        </div>
      </>}
      {lv && lv.options.length === 0 && subs.length > 0 && <div class="banner warn">이 위치에는 보이는 과목이 없습니다. <a href="/">처음으로</a></div>}
    </Page>
  );
}

function setKindLabel(s: SetSummary) {
  const t = s.typeCounts, kinds = (['ox', 'choice', 'short'] as const).filter((k) => t[k] > 0);
  if (kinds.length > 1) return { emoji: '🧩', label: '혼합', bg: '#f0fdf4', color: '#15803d', bd: '#bbf7d0' };
  if (kinds[0] === 'ox') return { emoji: '⭕', label: 'OX', bg: '#eff6ff', color: '#1d4ed8', bd: '#bfdbfe' };
  if (kinds[0] === 'choice') return { emoji: '🔢', label: '객관식', bg: '#fff7ed', color: '#c2410c', bd: '#fed7aa' };
  return { emoji: '✏️', label: '단답형', bg: '#f5f3ff', color: '#6d28d9', bd: '#ddd6fe' };
}

function SetCard({ s }: { s: SetSummary }) {
  const k = setKindLabel(s);
  const color = groupColor(s.subject);
  return (
    <a class="quiz-card card-link" href={'/q' + qs({ path: s.path })} style={{ borderTopColor: color }}>
      <div class="card-top"><span class="card-emoji">{k.emoji}</span><span class="type-badge" style={{ background: k.bg, color: k.color, borderColor: k.bd }}>{k.label}</span></div>
      <h3>{s.title}</h3>
      <div class="topic">{s.topic}</div>
      <div class="card-footer"><span class="q-count">{s.questionCount}문제</span><span class="start-arrow" style={{ color }}>시작 →</span></div>
      {s.uploader && <div class="uploader">⬆️ {s.uploader.nickname ?? s.uploader.username}</div>}
    </a>
  );
}

const KIND_ORDER = ['일반문제', '모의고사', '기출'] as const;

function Subject({ m, pos }: { m: Manifest; pos: NavPos }) {
  const subject = pos.subject!, exam = pos.exam as Exam;
  const node = findSubject(m, subject);
  const hidden = hiddenSet.value.has(subject);
  const sets = m.sets.filter((s) => s.subject === subject && s.exam === exam);
  const quizSets = sets.filter((s) => s.kind !== '단어집' && s.questionCount > 0);
  const termN = sets.reduce((a, s) => a + s.termCount, 0);
  const label = `${node?.grade == null ? '미분류' : `${node.grade}학년 ${node.semester}학기`} ${exam} ${subject}`;
  useEffect(() => { if (node) lsSet(LAST_KEY, { path: explorePath(pos), label } satisfies LastLoc); }, [subject, exam]);
  const review = useAsync(() => api.reviewSummary(subject, exam), [subject, exam]);
  const [practices, setPractices] = useState<PracticeModule[] | null>(null);
  useEffect(() => {
    let alive = true;
    ensureLegacyLoaded(m).then(() => { if (alive) setPractices(practicesFor(subject, exam)); }, () => { if (alive) setPractices([]); });
    return () => { alive = false; };
  }, [subject, exam, m.contentVersion]);
  const subs = visibleSubjects(m, hiddenSet.value);
  const ctx = qs({ subject, exam });

  return (
    <Page>
      <Crumbs pos={pos} subs={subs} />
      {!node && <div class="banner warn">이 과목을 찾을 수 없습니다. <a href="/">처음으로</a></div>}
      {hidden && <div class="banner warn">🙈 숨긴 과목입니다. 탐색 메뉴에는 보이지 않습니다. <a href="/settings">설정에서 표시</a></div>}
      <h1>{subject} <span class="muted" style={{ fontSize: 14 }}>{exam}</span></h1>
      <p class="lead">{quizSets.length}세트 · {quizSets.reduce((a, s) => a + s.questionCount, 0)}문제{termN ? ` · 용어 ${termN}개` : ''}</p>

      <div class="entry-grid">
        <a class="entry-btn dark" href={'/review' + ctx}><span class="ic">🔁</span><div><h3>오늘의 복습 {review.data ? `(${review.data.due}문항)` : ''}</h3><p>{review.error ? '복습 정보를 불러오지 못했습니다' : '복습할 때가 된 문항을 골라 줍니다'}</p></div><span class="arr">→</span></a>
        <a class="entry-btn" href={'/analysis' + ctx}><span class="ic">📊</span><div><h3>오답 분석</h3><p>장별 · 범위별 오답률, 자주 틀린 문제, 📌 다시 풀 목록</p></div><span class="arr">→</span></a>
        <a class="entry-btn" href={'/vocab' + ctx}><span class="ic">📝</span><div><h3>단어 암기 테스트</h3><p>이 시험 용어집으로 객관식 · 주관식 · 나열하기</p></div><span class="arr">→</span></a>
        <a class="entry-btn" href={'/terms' + ctx}><span class="ic">🔎</span><div><h3>용어 확인</h3><p>용어가 이 시험 용어집에 있는지 확인합니다</p></div><span class="arr">→</span></a>
        {practices?.map((p) => (
          <a key={p.id} class="entry-btn" href={'/practice' + qs({ subject, exam, id: p.id })}><span class="ic">{p.icon}</span><div><h3>{p.title}</h3><p>{p.desc}</p></div><span class="arr">→</span></a>
        ))}
      </div>

      {KIND_ORDER.map((kind) => {
        const list = quizSets.filter((s) => s.kind === kind);
        if (!list.length) return null;
        const units = [...new Set(list.map((s) => s.unit || '기타'))].sort(unitSort);
        const showUnits = !(units.length === 1 && units[0] === '기타');
        return (
          <section key={kind} class="cat-section" style={{ marginTop: 24 }}>
            <div class="section-title">{kind === '일반문제' ? '📘 일반 문제' : kind === '모의고사' ? '📝 모의고사' : '📜 기출'} <span class="muted">{list.length}세트</span></div>
            {units.map((u) => (
              <div key={u} class="chapter-group">
                {showUnits && <div class="chapter-label"><div class="chapter-bar" style={{ background: groupColor(u) }} /><h2>{u}</h2><span class="count">{list.filter((s) => (s.unit || '기타') === u).length}세트</span></div>}
                <div class="card-grid">
                  {list.filter((s) => (s.unit || '기타') === u).sort((a, b) => a.title.localeCompare(b.title, 'ko', { numeric: true })).map((s) => <SetCard key={s.path} s={s} />)}
                </div>
              </div>
            ))}
          </section>
        );
      })}
      {!quizSets.length && <div class="banner info">이 시험에는 아직 문제 세트가 없습니다. ⬆️ <a href="/upload">업로드</a>로 올릴 수 있어요.</div>}
      {sets.some((s) => s.kind === '단어집') && (
        <section style={{ marginTop: 18 }}>
          <div class="section-title">📒 용어집</div>
          {sets.filter((s) => s.kind === '단어집').map((s) => (
            <div key={s.path} class="glossary-item"><span>{s.title} <span class="muted">· 용어 {s.termCount}개{s.uploader ? ` · ⬆️ ${s.uploader.nickname ?? s.uploader.username}` : ''}</span></span></div>
          ))}
        </section>
      )}
    </Page>
  );
}
