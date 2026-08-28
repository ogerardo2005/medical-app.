import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CalculatorHeader } from '../components/CalculatorHeader';
import { ResultBanner } from '../components/ResultBanner';
import { SegmentedSelector } from '../components/SegmentedSelector';
import {
  EYE_OPENING_OPTIONS,
  MOTOR_RESPONSE_OPTIONS,
  VERBAL_RESPONSE_OPTIONS,
  interpretGlasgow,
} from '../lib/glasgow';

function pointOptions(options: { points: number; label: string }[]) {
  return options.map((option) => ({
    value: option.points,
    label: `${option.points} · ${option.label}`,
  }));
}

export function GlasgowScreen() {
  const [eye, setEye] = useState(EYE_OPENING_OPTIONS[0].points);
  const [verbal, setVerbal] = useState(VERBAL_RESPONSE_OPTIONS[0].points);
  const [motor, setMotor] = useState(MOTOR_RESPONSE_OPTIONS[0].points);

  const total = eye + verbal + motor;
  const interpretation = useMemo(() => interpretGlasgow(total), [total]);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top', 'left', 'right']}>
      <CalculatorHeader />
      <ScrollView
        className="flex-1 px-4"
        contentContainerClassName="gap-6 pb-10"
        keyboardShouldPersistTaps="handled">
        <Text className="text-2xl font-bold text-black dark:text-white">
          Escala de Coma de Glasgow
        </Text>

        <View className="gap-2">
          <Text className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
            Apertura ocular (E)
          </Text>
          <SegmentedSelector
            options={pointOptions(EYE_OPENING_OPTIONS)}
            value={eye}
            onChange={setEye}
          />
        </View>

        <View className="gap-2">
          <Text className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
            Respuesta verbal (V)
          </Text>
          <SegmentedSelector
            options={pointOptions(VERBAL_RESPONSE_OPTIONS)}
            value={verbal}
            onChange={setVerbal}
          />
        </View>

        <View className="gap-2">
          <Text className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
            Respuesta motora (M)
          </Text>
          <SegmentedSelector
            options={pointOptions(MOTOR_RESPONSE_OPTIONS)}
            value={motor}
            onChange={setMotor}
          />
        </View>

        <ResultBanner value={`${total} / 15`} interpretation={interpretation} />
      </ScrollView>
    </SafeAreaView>
  );
}
