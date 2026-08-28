import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, PropsWithChildren } from 'react';
import { Text, View } from 'react-native';

import { useThemeIconColors } from '@/theme/colors';

interface DrugSectionProps extends PropsWithChildren {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
}

export function DrugSection({ icon, label, children }: DrugSectionProps) {
  const colors = useThemeIconColors();

  return (
    <View className="gap-1.5">
      <View className="flex-row items-center gap-2">
        <Ionicons name={icon} size={16} color={colors.accent} />
        <Text className="text-xs font-bold uppercase tracking-wide text-primary">{label}</Text>
      </View>
      <Text className="text-base leading-6 text-black dark:text-white">{children}</Text>
    </View>
  );
}
