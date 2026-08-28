export type ReviewGrade = 1 | 2 | 3 | 4;

export interface SM2CardState {
  interval: number;
  easeFactor: number;
  repetitions: number;
}

export interface SM2Result extends SM2CardState {
  nextReview: Date;
}

const MIN_EASE_FACTOR = 1.3;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Maps the 4 review buttons onto SuperMemo's original 0-5 quality scale, the same
 * mapping Anki uses for its 4-button UI: Again -> 2 (fail), Hard -> 3, Good -> 4,
 * Easy -> 5. This keeps the canonical SM-2 formula below untouched while exposing
 * the simpler 4-grade interface the UI asks for.
 */
function gradeToQuality(grade: ReviewGrade): number {
  return grade + 1;
}

/**
 * SM-2 (SuperMemo 2) scheduler: given a card's current state and a review grade,
 * returns the new interval (in days), ease factor, repetition count, and the next
 * review date.
 */
export function reviewCard(
  state: SM2CardState,
  grade: ReviewGrade,
  now: Date = new Date()
): SM2Result {
  const quality = gradeToQuality(grade);
  let { interval, repetitions } = state;

  if (quality < 3) {
    // Failed recall: restart the repetition streak, review again tomorrow.
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * state.easeFactor);
    }
  }

  const easeFactor = Math.max(
    MIN_EASE_FACTOR,
    state.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  const nextReview = new Date(now.getTime() + interval * MS_PER_DAY);

  return { interval, easeFactor, repetitions, nextReview };
}

/** Formats a Date as the "YYYY-MM-DD HH:MM:SS" UTC string SQLite's datetime() produces. */
export function toSqliteDatetime(date: Date): string {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}
