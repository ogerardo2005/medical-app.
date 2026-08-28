import { Text, View } from 'react-native';

import type { ClinicalInterpretation, ResultSeverity } from '../lib/types';

interface ResultBannerProps {
  value: string;
  interpretation: ClinicalInterpretation;
}

const SEVERITY_STYLES: Record<ResultSeverity, { container: string; label: string }> = {
  good: {
    container: 'border-medical-300 bg-medical-50 dark:border-medical-800 dark:bg-medical-950',
    label: 'text-medical-700 dark:text-medical-400',
  },
  caution: {
    container: 'border-yellow-300 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950',
    label: 'text-yellow-700 dark:text-yellow-400',
  },
  warning: {
    container: 'border-orange-300 bg-orange-50 dark:border-orange-800 dark:bg-orange-950',
    label: 'text-orange-700 dark:text-orange-400',
  },
  danger: {
    container: 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950',
    label: 'text-red-700 dark:text-red-400',
  },
};

export function ResultBanner({ value, interpretation }: ResultBannerProps) {
  const styles = SEVERITY_STYLES[interpretation.severity];

  return (
    <View className={`rounded-2xl border p-4 ${styles.container}`}>
      <Text className="text-3xl font-bold text-black dark:text-white">{value}</Text>
      <Text className={`mt-1 text-sm font-semibold ${styles.label}`}>{interpretation.label}</Text>
      <Text className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
        {interpretation.message}
      </Text>
    </View>
  );
}
