import { Text, TextInput, View } from 'react-native';

import { useThemeIconColors } from '@/theme/colors';

interface NumberFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  unit: string;
}

export function NumberField({ label, value, onChangeText, placeholder, unit }: NumberFieldProps) {
  const colors = useThemeIconColors();

  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">{label}</Text>
      <View className="flex-row items-center rounded-xl border border-neutral-300 px-3 dark:border-neutral-700">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          keyboardType="decimal-pad"
          className="flex-1 py-3 text-base text-black dark:text-white"
        />
        <Text className="text-sm text-neutral-400 dark:text-neutral-500">{unit}</Text>
      </View>
    </View>
  );
}
