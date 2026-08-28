import { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';

import { Flashcard } from '../components/Flashcard';
import { GradeButtons } from '../components/GradeButtons';
import { useStudySession } from '../hooks/useStudySession';
import type { ReviewGrade } from '../lib/sm2';

export function StudyScreen() {
  const { currentCard, remaining, totalDue, reviewedCount, isLoading, grade } = useStudySession();
  const [isFlipped, setIsFlipped] = useState(false);

  const handleGrade = async (reviewGrade: ReviewGrade) => {
    await grade(reviewGrade);
    setIsFlipped(false);
  };

  return (
    <Screen>
      <View className="mb-4 mt-2">
        <Text className="text-2xl font-bold text-black dark:text-white">Estudio</Text>
        {totalDue > 0 ? (
          <Text className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {reviewedCount}/{totalDue} repasadas · {remaining} pendiente
            {remaining === 1 ? '' : 's'}
          </Text>
        ) : null}
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : currentCard ? (
        <Flashcard
          key={currentCard.id}
          question={currentCard.question}
          answer={currentCard.answer}
          deckName={currentCard.deck_name}
          isFlipped={isFlipped}
          onPressFront={() => setIsFlipped(true)}>
          <GradeButtons onGrade={handleGrade} />
        </Flashcard>
      ) : (
        <EmptyState
          title="¡Estás al día!"
          hint="No hay tarjetas pendientes de repaso por ahora"
        />
      )}
    </Screen>
  );
}
