import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';

const CALCULATORS = [
  {
    key: 'glasgow',
    title: 'Escala de Coma de Glasgow',
    subtitle: 'Evaluación neurológica: ocular, verbal y motor',
  },
  {
    key: 'creatinine-clearance',
    title: 'Aclaramiento de Creatinina',
    subtitle: 'Cockcroft-Gault · función renal estimada',
  },
  {
    key: 'cha2ds2-vasc',
    title: 'CHA₂DS₂-VASc',
    subtitle: 'Riesgo de ictus en fibrilación auricular',
  },
] as const;

export function CalculatorsMenuScreen() {
  const router = useRouter();

  return (
    <Screen>
      <Text className="mb-4 mt-2 text-2xl font-bold text-black dark:text-white">
        Calculadoras
      </Text>

      <View className="gap-3">
        {CALCULATORS.map((calculator) => (
          <Card key={calculator.key} onPress={() => router.push(`/calculators/${calculator.key}`)}>
            <Text className="text-base font-semibold text-black dark:text-white">
              {calculator.title}
            </Text>
            <Text className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {calculator.subtitle}
            </Text>
          </Card>
        ))}
      </View>
    </Screen>
  );
}
