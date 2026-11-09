// FSRS 래퍼 (설계 7장). 맞음 = Good, 틀림 = Again.
import { createEmptyCard, fsrs, Rating, type Card, type Grade } from 'ts-fsrs';

export interface SrsCardState {
  due: number; stability: number; difficulty: number; elapsed_days: number; scheduled_days: number;
  reps: number; lapses: number; state: number; last_review: number | null; learning_steps: number;
}
const scheduler = fsrs({ enable_fuzz: false });

function toCard(s: SrsCardState): Card {
  return {
    due: new Date(s.due), stability: s.stability, difficulty: s.difficulty, elapsed_days: s.elapsed_days,
    scheduled_days: s.scheduled_days, reps: s.reps, lapses: s.lapses, state: s.state,
    last_review: s.last_review == null ? undefined : new Date(s.last_review), learning_steps: s.learning_steps,
  } as Card;
}
function fromCard(c: Card): SrsCardState {
  return {
    due: c.due.getTime(), stability: c.stability, difficulty: c.difficulty, elapsed_days: c.elapsed_days,
    scheduled_days: c.scheduled_days, reps: c.reps, lapses: c.lapses, state: c.state,
    last_review: c.last_review ? c.last_review.getTime() : null, learning_steps: (c as Card & { learning_steps?: number }).learning_steps ?? 0,
  };
}
export function newCardState(now: number): SrsCardState { return fromCard(createEmptyCard(new Date(now))); }
export function reviewCard(state: SrsCardState, correct: boolean, at: number): SrsCardState {
  const rating: Grade = correct ? Rating.Good : Rating.Again;
  return fromCard(scheduler.next(toCard(state), new Date(at), rating).card);
}
