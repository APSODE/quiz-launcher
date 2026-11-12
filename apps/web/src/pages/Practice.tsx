// 연습 메뉴 화면: 기존 플러그인을 호환 계층으로 실행 (설계 10.3)
import { useEffect, useRef, useState } from 'preact/hooks';
import type { Exam } from '@quiz/core';
import { manifest, loadManifest } from '../state.ts';
import { navigate } from '../lib/router.ts';
import { subjectHome } from '../lib/nav.ts';
import { keyAction, keyEventUsable, enterUsable } from '../lib/keys.ts';
import { ensureLegacyLoaded, PRACTICE_MODULES, practiceInExam, setCurrent, pluginErrors, type PracticeModule } from '../legacy/runtime.ts';
import { Page, Spinner, ErrorBox } from '../components/common.tsx';
import '../styles/legacy-practice.css';

export function PracticePage({ subject, exam, id }: { subject: string; exam: Exam; id: string }) {
  const [mod, setMod] = useState<PracticeModule | null | undefined>(undefined);
  const [err, setErr] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const back = subjectHome(manifest.value, subject, exam);

  useEffect(() => {
    let alive = true;
    (async () => {
      const m = manifest.value || (await loadManifest());
      if (!m) throw new Error('매니페스트를 불러오지 못했습니다.');
      await ensureLegacyLoaded(m);
      if (alive) setMod(PRACTICE_MODULES.find((x) => x.id === id && practiceInExam(x, exam)) || null);
    })().catch((e: Error) => { if (alive) setErr(e.message); });
    return () => { alive = false; };
  }, [id, exam]);

  useEffect(() => {
    if (!mod || !root.current) return;
    setCurrent(subject, mod);
    root.current.innerHTML = '';
    try { mod.mount(root.current); } catch (e) { setErr('연습 화면을 그리지 못했습니다: ' + (e as Error).message); }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') { if (enterUsable(e) && mod.onEnter) mod.onEnter(e); return; }
      if (!keyEventUsable(e)) return;
      const act = keyAction(e.code);
      if (act && mod.onKey) mod.onKey(act, e);
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); setCurrent(null, null); };
  }, [mod]);

  if (err) return <Page><ErrorBox error={err} /></Page>;
  if (mod === undefined) return <Spinner text="연습 메뉴를 불러오는 중…" />;
  if (mod === null) return <Page><div class="banner warn">연습 메뉴 "{id}"를 찾을 수 없습니다.{pluginErrors.length ? <><br />플러그인 오류: {pluginErrors.join(' / ')}</> : null}</div><a href={back}>← 돌아가기</a></Page>;
  return (
    <div class="legacy-practice">
      <div class="pr-topbar"><button onClick={() => navigate(back)}>← {subject} {exam}</button></div>
      <div class="pr-header">
        <div style={{ fontSize: 28 }}>{mod.icon}</div>
        <h2>{mod.title}</h2>
        <p>{mod.desc}</p>
      </div>
      <div class="pr-body" ref={root} />
    </div>
  );
}
