import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CalculatorHeader } from '../components/CalculatorHeader';
import { NumberField } from '../components/NumberField';
import { ResultBanner } from '../components/ResultBanner';
import { SegmentedSelector } from '../components/SegmentedSelector';
import { calculateCreatinineClearance, interpretCreatinineClearance } from '../lib/cockcroftGault';

const SEX_OPTIONS = [
  { value: false, label: 'Masculino' },
  { value: true, label: 'Femenino' },
];

export function CreatinineClearanceScreen() {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [isFemale, setIsFemale] = useState(false);

  const result = useMemo(() => {
    if (!age || !weight || !creatinine) return null;

    return calculateCreatinineClearance({
      age: Number(age.replace(',', '.')),
      weightKg: Number(weight.replace(',', '.')),
      creatinineMgDl: Number(creatinine.replace(',', '.')),
      isFemale,
    });
  }, [age, weight, creatinine, isFemale]);

  const interpretation = result !== null ? interpretCreatinineClearance(result) : null;

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top', 'left', 'right']}>
      <CalculatorHeader />
      <ScrollView
        className="flex-1 px-4"
        contentContainerClassName="gap-6 pb-10"
        keyboardShouldPersistTaps="handled">
        <View>
          <Text className="text-2xl font-bold text-black dark:text-white">
            Aclaramiento de Creatinina
          </Text>
          <Text className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
            Fórmula de Cockcroft-Gault
          </Text>
        </View>

        <View className="gap-2">
          <Text className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
            Sexo
          </Text>
          <SegmentedSelector options={SEX_OPTIONS} value={isFemale} onChange={setIsFemale} />
        </View>

        <NumberField
          label="Edad"
          value={age}
          onChangeText={setAge}
          placeholder="Ej. 65"
          unit="años"
        />
        <NumberField
          label="Peso"
          value={weight}
          onChangeText={setWeight}
          placeholder="Ej. 70"
          unit="kg"
        />
        <NumberField
          label="Creatinina sérica"
          value={creatinine}
          onChangeText={setCreatinine}
          placeholder="Ej. 1.0"
          unit="mg/dL"
        />

        {result !== null && interpretation ? (
          <ResultBanner value={`${result.toFixed(1)} mL/min`} interpretation={interpretation} />
        ) : (
          <Text className="text-center text-sm text-neutral-400 dark:text-neutral-500">
            Completa edad, peso y creatinina para calcular
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
