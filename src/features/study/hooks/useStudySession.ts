import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';

import type { FlashcardRow } from '@/db/types';

import { reviewCard, toSqliteDatetime, type ReviewGrade } from '../lib/sm2';

/**
 * Drives one study session: loads every card due right now (next_review <= now),
 * hands them out one at a time, and applies the SM-2 scheduler on each grade.
 * A card graded during the session is simply dropped from the local queue -
 * SM-2 never schedules a card back into "due" the same day it was just reviewed,
 * so there's no need to re-query SQLite between cards.
 */
export function useStudySession() {
  const db = useSQLiteContext();
  const [queue, setQueue] = useState<FlashcardRow[]>([]);
  const [totalDue, setTotalDue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadDueCards = useCallback(async () => {
    setIsLoading(true);
    const rows = await db.getAllAsync<FlashcardRow>(
      "SELECT * FROM flashcards WHERE next_review <= datetime('now') ORDER BY next_review ASC"
    );
    setQueue(rows);
    setTotalDue(rows.length);
    setIsLoading(false);
  }, [db]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount; setState happens after the `await`, not synchronously in the effect body
    loadDueCards();
  }, [loadDueCards]);

  const currentCard = queue[0] ?? null;
  const remaining = queue.length;
  const reviewedCount = totalDue - remaining;

  const grade = useCallback(
    async (reviewGrade: ReviewGrade) => {
      if (!currentCard) return;

      const result = reviewCard(
        {
          interval: currentCard.interval,
          easeFactor: currentCard.ease_factor,
          repetitions: currentCard.repetitions,
        },
        reviewGrade
      );

      await db.runAsync(
        'UPDATE flashcards SET interval = ?, ease_factor = ?, repetitions = ?, next_review = ? WHERE id = ?',
        result.interval,
        result.easeFactor,
        result.repetitions,
        toSqliteDatetime(result.nextReview),
        currentCard.id
      );

      setQueue((prev) => prev.slice(1));
    },
    [currentCard, db]
  );

  return {
    currentCard,
    remaining,
    totalDue,
    reviewedCount,
    isLoading,
    grade,
    restart: loadDueCards,
  };
}
