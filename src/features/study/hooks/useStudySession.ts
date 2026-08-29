import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/features/auth/AuthContext';
import { supabase } from '@/lib/supabase';
import type { FlashcardRow } from '@/lib/types';

import { reviewCard, type ReviewGrade } from '../lib/sm2';

/**
 * Drives one study session: loads every card due right now (next_review <= now),
 * hands them out one at a time, and applies the SM-2 scheduler on each grade.
 * A card graded during the session is simply dropped from the local queue -
 * SM-2 never schedules a card back into "due" the same day it was just reviewed,
 * so there's no need to re-query between cards.
 */
export function useStudySession() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const [queue, setQueue] = useState<FlashcardRow[]>([]);
  const [totalDue, setTotalDue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadDueCards = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    const { data } = await supabase
      .from('flashcards')
      .select('*')
      .lte('next_review', new Date().toISOString())
      .order('next_review', { ascending: true });
    setQueue(data ?? []);
    setTotalDue(data?.length ?? 0);
    setIsLoading(false);
  }, [userId]);

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

      await supabase
        .from('flashcards')
        .update({
          interval: result.interval,
          ease_factor: result.easeFactor,
          repetitions: result.repetitions,
          next_review: result.nextReview.toISOString(),
        })
        .eq('id', currentCard.id);

      setQueue((prev) => prev.slice(1));
    },
    [currentCard]
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
