import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeIconColors, palette } from '@/theme/colors';

import { DrugSection } from '../components/DrugSection';
import { useVademecumEntry } from '../hooks/useVademecumEntry';

export function VademecumDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { drug, isLoading } = useVademecumEntry(id);
  const colors = useThemeIconColors();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top', 'left', 'right']}>
      <View className="flex-row items-center px-2 py-3">
        <Pressable onPress={() => router.back()} hitSlop={8} className="flex-row items-center gap-0.5 py-1 pr-2 active:opacity-60">
          <Ionicons name="chevron-back" size={22} color={colors.accent} />
          <Text className="text-base text-primary">Vademécum</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : !drug ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-center text-base text-neutral-400 dark:text-neutral-500">
            No se encontró este fármaco.
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-4" contentContainerClassName="gap-6 pb-10">
          <View>
            <Text className="text-3xl font-bold text-black dark:text-white">
              {drug.nombre_generico}
            </Text>
            <Text className="mt-1 text-sm font-semibold uppercase tracking-wide text-primary">
              {drug.categoria}
            </Text>
          </View>

          <View className="rounded-2xl border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
            <View className="flex-row items-center gap-2">
              <Ionicons name="warning" size={18} color={palette.danger600} />
              <Text className="text-xs font-bold uppercase tracking-wide text-red-700 dark:text-red-400">
                Contraindicaciones
              </Text>
            </View>
            <Text className="mt-2 text-base leading-6 text-red-900 dark:text-red-200">
              {drug.contraindicaciones}
            </Text>
          </View>

          <DrugSection icon="body-outline" label="Dosis adultos">
            {drug.dosis_adultos}
          </DrugSection>

          <DrugSection icon="accessibility-outline" label="Dosis pediátrica">
            {drug.dosis_pediatrica}
          </DrugSection>

          <DrugSection icon="flask-outline" label="Mecanismo de acción">
            {drug.mecanismo_accion}
          </DrugSection>

          <Text className="text-xs text-neutral-400 dark:text-neutral-500">
            Ficha de referencia rápida. Verifica siempre dosis y contraindicaciones con fuentes
            oficiales antes de prescribir.
          </Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
