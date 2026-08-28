import { Text, View } from 'react-native';

interface EmptyStateProps {
  title: string;
  hint?: string;
}

export function EmptyState({ title, hint }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-1 px-8">
      <Text className="text-center text-base font-semibold text-neutral-500 dark:text-neutral-400">
        {title}
      </Text>
      {hint ? (
        <Text className="text-center text-sm text-neutral-400 dark:text-neutral-500">{hint}</Text>
      ) : null}
    </View>
  );
}
