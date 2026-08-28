import { Switch, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { palette } from '@/theme/colors';
import { useGuardMode } from '@/theme/GuardModeContext';

export function SettingsScreen() {
  const { guardMode, setGuardMode } = useGuardMode();

  return (
    <Screen>
      <Text className="mb-4 mt-2 text-2xl font-bold text-black dark:text-white">Ajustes</Text>

      <Card>
        <View className="flex-row items-center gap-3">
          <View className="flex-1">
            <Text className="text-base font-semibold text-black dark:text-white">
              Modo Guardia (Luz Roja)
            </Text>
            <Text className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Aplica un filtro rojo sobre toda la app para reducir el cansancio visual y
              preservar la visión nocturna durante guardias con poca luz.
            </Text>
          </View>
          <Switch
            value={guardMode}
            onValueChange={setGuardMode}
            trackColor={{ false: '#CBD5E1', true: palette.danger600 }}
            thumbColor={palette.white}
          />
        </View>
      </Card>
    </Screen>
  );
}
