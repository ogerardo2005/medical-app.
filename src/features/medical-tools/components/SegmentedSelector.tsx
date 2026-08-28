import { Pressable, Text, View } from 'react-native';

interface SegmentedOption<T> {
  value: T;
  label: string;
}

interface SegmentedSelectorProps<T> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedSelector<T extends string | number | boolean>({
  options,
  value,
  onChange,
}: SegmentedSelectorProps<T>) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={String(option.value)}
            onPress={() => onChange(option.value)}
            className={`rounded-xl border px-3 py-2 active:opacity-80 ${
              selected
                ? 'border-primary bg-primary'
                : 'border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-900'
            }`}>
            <Text
              className={`text-sm font-medium ${
                selected ? 'text-white' : 'text-black dark:text-white'
              }`}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
