// 🤖 출제 규칙 받기: GET /api/rules → md 파일 저장 (로그인 사용자만). AI 출제 에이전트에게 그대로 넘기는 지시서
import { useState } from 'preact/hooks';
import { EXAMS, type Exam } from '@quiz/core';
import { api } from '../api.ts';
import { manifest, me, toast } from '../state.ts';

async function download(subject: string, exam: Exam) {
  const md = await api.rulesMd(subject, exam);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([md], { type: 'text/markdown;charset=utf-8' }));
  a.download = `출제규칙_${subject}_${exam}.md`;
  a.click(); URL.revokeObjectURL(a.href);
}

/** 과목 · 시험이 정해져 있으면 버튼만, 아니면(업로드 화면) 과목 · 시험 고르기 + 버튼 */
export function RulesDownload({ subject, exam }: { subject?: string; exam?: Exam }) {
  const subs = manifest.value?.subjects ?? [];
  const [s, setS] = useState(subject ?? subs[0]?.subject ?? '');
  const [e, setE] = useState<Exam>(exam ?? (subs.find((x) => x.subject === s)?.exams[0] ?? EXAMS[0]));
  const [busy, setBusy] = useState(false);
  const title = '이 과목 · 시험의 출제 규칙(내지 말 것 · 시험 범위 · 난이도 기준 · 업로드 양식)을 md 로 받습니다. AI 에게 그대로 넘겨 문제를 만들게 하세요.';
  if (!me.value) return <span class="muted" style={{ fontSize: 12 }}>🤖 출제 규칙은 로그인하면 받을 수 있어요</span>;
  const go = async () => {
    setBusy(true);
    try { await download(subject ?? s, exam ?? e); } catch (err) { toast((err as Error).message, 'err'); } finally { setBusy(false); }
  };
  const btn = <button class="btn ghost sm" title={title} disabled={busy || !(subject ?? s)} onClick={go}>🤖 출제 규칙 받기</button>;
  if (subject && exam) return btn;
  return (
    <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
      <select class="input" style={{ width: 'auto' }} value={s} onChange={(x) => setS((x.target as HTMLSelectElement).value)}>
        {subs.map((x) => <option key={x.subject} value={x.subject}>{x.subject}</option>)}
      </select>
      <select class="input" style={{ width: 'auto' }} value={e} onChange={(x) => setE((x.target as HTMLSelectElement).value as Exam)}>
        {EXAMS.map((x) => <option key={x} value={x}>{x}</option>)}
      </select>
      {btn}
    </span>
  );
}
