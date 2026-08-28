import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CalculatorHeader } from '../components/CalculatorHeader';
import { ChecklistRow } from '../components/ChecklistRow';
import { ResultBanner } from '../components/ResultBanner';
import { SegmentedSelector } from '../components/SegmentedSelector';
import { computeCha2ds2VascScore, interpretCha2ds2Vasc, type AgeBand } from '../lib/cha2ds2vasc';

const AGE_OPTIONS: { value: AgeBand; label: string }[] = [
  { value: 'under65', label: '< 65' },
  { value: '65to74', label: '65–74 (+1)' },
  { value: '75plus', label: '≥ 75 (+2)' },
];

export function Cha2ds2VascScreen() {
  const [chf, setChf] = useState(false);
  const [hypertension, setHypertension] = useState(false);
  const [ageBand, setAgeBand] = useState<AgeBand>('under65');
  const [diabetes, setDiabetes] = useState(false);
  const [strokeHistory, setStrokeHistory] = useState(false);
  const [vascularDisease, setVascularDisease] = useState(false);
  const [isFemale, setIsFemale] = useState(false);

  const score = useMemo(
    () =>
      computeCha2ds2VascScore({
        chf,
        hypertension,
        ageBand,
        diabetes,
        strokeHistory,
        vascularDisease,
        isFemale,
      }),
    [chf, hypertension, ageBand, diabetes, strokeHistory, vascularDisease, isFemale]
  );

  const interpretation = useMemo(() => interpretCha2ds2Vasc(score, isFemale), [score, isFemale]);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top', 'left', 'right']}>
      <CalculatorHeader />
      <ScrollView
        className="flex-1 px-4"
        contentContainerClassName="gap-3 pb-10"
        keyboardShouldPersistTaps="handled">
        <View className="mb-2">
          <Text className="text-2xl font-bold text-black dark:text-white">CHA₂DS₂-VASc</Text>
          <Text className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
            Riesgo de ictus en fibrilación auricular
          </Text>
        </View>

        <ChecklistRow
          label="Insuficiencia cardíaca / disfunción de VI"
          points={1}
          checked={chf}
          onToggle={() => setChf((v) => !v)}
        />
        <ChecklistRow
          label="Hipertensión arterial"
          points={1}
          checked={hypertension}
          onToggle={() => setHypertension((v) => !v)}
        />
        <ChecklistRow
          label="Diabetes mellitus"
          points={1}
          checked={diabetes}
          onToggle={() => setDiabetes((v) => !v)}
        />
        <ChecklistRow
          label="Ictus / AIT / tromboembolismo previo"
          points={2}
          checked={strokeHistory}
          onToggle={() => setStrokeHistory((v) => !v)}
        />
        <ChecklistRow
          label="Enfermedad vascular (IAM, EAP, placa aórtica)"
          points={1}
          checked={vascularDisease}
          onToggle={() => setVascularDisease((v) => !v)}
        />
        <ChecklistRow
          label="Sexo femenino"
          points={1}
          checked={isFemale}
          onToggle={() => setIsFemale((v) => !v)}
        />

        <View className="mt-2 gap-2">
          <Text className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
            Edad
          </Text>
          <SegmentedSelector options={AGE_OPTIONS} value={ageBand} onChange={setAgeBand} />
        </View>

        <View className="mt-3">
          <ResultBanner value={`${score} / 9`} interpretation={interpretation} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
