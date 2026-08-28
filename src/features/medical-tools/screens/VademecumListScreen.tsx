import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { useThemeIconColors } from '@/theme/colors';

import { useVademecum } from '../hooks/useVademecum';

export function VademecumListScreen() {
  const router = useRouter();
  const { drugs } = useVademecum();
  const [query, setQuery] = useState('');
  const colors = useThemeIconColors();

  const filteredDrugs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return drugs;
    return drugs.filter(
      (drug) =>
        drug.nombre_generico.toLowerCase().includes(normalized) ||
        drug.categoria.toLowerCase().includes(normalized)
    );
  }, [drugs, query]);

  return (
    <Screen padded={false}>
      <View className="px-4">
        <Text className="mb-4 mt-2 text-2xl font-bold text-black dark:text-white">
          Vademécum
        </Text>

        <View className="mb-4 flex-row items-center gap-2 rounded-xl border border-neutral-300 px-3 dark:border-neutral-700">
          <Ionicons name="search-outline" size={18} color={colors.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar por fármaco o categoría"
            placeholderTextColor={colors.muted}
            className="flex-1 py-2 text-black dark:text-white"
            returnKeyType="search"
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      <FlatList
        data={filteredDrugs}
        keyExtractor={(item) => String(item.id)}
        contentContainerClassName="gap-3 px-4 pb-6"
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          query ? (
            <EmptyState
              title="Sin resultados"
              hint={`No hay fármacos que coincidan con "${query}"`}
            />
          ) : (
            <EmptyState title="Vademécum vacío" hint="No hay fármacos cargados todavía" />
          )
        }
        renderItem={({ item }) => (
          <Card onPress={() => router.push(`/vademecum/${item.id}`)}>
            <Text className="text-base font-semibold text-black dark:text-white">
              {item.nombre_generico}
            </Text>
            <Text className="mt-1 text-xs font-medium uppercase text-primary">
              {item.categoria}
            </Text>
          </Card>
        )}
      />
    </Screen>
  );
}
