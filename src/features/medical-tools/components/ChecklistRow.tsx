import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { palette } from '@/theme/colors';

interface ChecklistRowProps {
  label: string;
  points: number;
  checked: boolean;
  onToggle: () => void;
}

export function ChecklistRow({ label, points, checked, onToggle }: ChecklistRowProps) {
  return (
    <Pressable
      onPress={onToggle}
      className="flex-row items-center justify-between rounded-xl border border-neutral-200 px-3 py-3 active:bg-neutral-50 dark:border-neutral-800 dark:active:bg-neutral-900">
      <View className="flex-1 flex-row items-center gap-3">
        <View
          className={`h-6 w-6 items-center justify-center rounded-md border-2 ${
            checked ? 'border-primary bg-primary' : 'border-neutral-300 dark:border-neutral-600'
          }`}>
          {checked ? <Ionicons name="checkmark" size={16} color={palette.white} /> : null}
        </View>
        <Text className="flex-1 text-base text-black dark:text-white">{label}</Text>
      </View>
      <Text className="text-sm font-semibold text-neutral-400 dark:text-neutral-500">
        +{points}
      </Text>
    </Pressable>
  );
}
