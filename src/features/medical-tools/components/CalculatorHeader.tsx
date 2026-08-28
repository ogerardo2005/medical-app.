import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { useThemeIconColors } from '@/theme/colors';

export function CalculatorHeader() {
  const router = useRouter();
  const colors = useThemeIconColors();

  return (
    <View className="flex-row items-center px-2 py-3">
      <Pressable
        onPress={() => router.back()}
        hitSlop={8}
        className="flex-row items-center gap-0.5 py-1 pr-2 active:opacity-60">
        <Ionicons name="chevron-back" size={22} color={colors.accent} />
        <Text className="text-base text-primary">Calculadoras</Text>
      </Pressable>
    </View>
  );
}
