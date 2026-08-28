import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface FlashcardProps extends PropsWithChildren {
  question: string;
  answer: string;
  deckName?: string;
  isFlipped: boolean;
  onPressFront: () => void;
}

const FLIP_DURATION = 350;

export function Flashcard({
  question,
  answer,
  deckName,
  isFlipped,
  onPressFront,
  children,
}: FlashcardProps) {
  const flip = useSharedValue(0);

  useEffect(() => {
    flip.value = withTiming(isFlipped ? 1 : 0, { duration: FLIP_DURATION });
  }, [isFlipped, flip]);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1200 },
      { rotateY: `${interpolate(flip.value, [0, 1], [0, 180])}deg` },
    ],
    opacity: interpolate(flip.value, [0, 0.5, 0.5001, 1], [1, 1, 0, 0]),
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1200 },
      { rotateY: `${interpolate(flip.value, [0, 1], [180, 360])}deg` },
    ],
    opacity: interpolate(flip.value, [0, 0.4999, 0.5, 1], [0, 0, 1, 1]),
  }));

  return (
    <View className="flex-1">
      <Pressable
        onPress={onPressFront}
        disabled={isFlipped}
        className="flex-1"
        accessibilityRole="button"
        accessibilityLabel="Voltear tarjeta para ver la respuesta">
        <Animated.View
          style={[{ backfaceVisibility: 'hidden' }, frontStyle]}
          className="absolute inset-0 items-center justify-center rounded-3xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900">
          {deckName ? (
            <Text className="mb-3 text-xs font-medium uppercase text-primary">{deckName}</Text>
          ) : null}
          <Text className="text-center text-xl font-semibold text-black dark:text-white">
            {question}
          </Text>
          <Text className="mt-6 text-sm text-neutral-400 dark:text-neutral-500">
            Toca para ver la respuesta
          </Text>
        </Animated.View>

        <Animated.View
          style={[{ backfaceVisibility: 'hidden' }, backStyle]}
          className="absolute inset-0 rounded-3xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <Text className="text-sm text-neutral-400 dark:text-neutral-500">{question}</Text>
          <View className="flex-1 items-center justify-center">
            <Text className="text-center text-xl font-semibold text-black dark:text-white">
              {answer}
            </Text>
          </View>
        </Animated.View>
      </Pressable>

      {isFlipped ? <View className="mt-4">{children}</View> : null}
    </View>
  );
}
