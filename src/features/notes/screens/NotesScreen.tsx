import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, Text, TextInput, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import type { NoteRow } from '@/db/types';
import { palette, useThemeIconColors } from '@/theme/colors';

import { useNotes } from '../hooks/useNotes';
import { formatUpdatedAt } from '../utils/formatUpdatedAt';

export function NotesScreen() {
  const router = useRouter();
  const { notes, deleteNote } = useNotes();
  const [query, setQuery] = useState('');
  const colors = useThemeIconColors();

  const filteredNotes = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return notes;
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(normalized) ||
        note.content.toLowerCase().includes(normalized)
    );
  }, [notes, query]);

  const handleDelete = (note: NoteRow) => {
    Alert.alert('Eliminar nota', `¿Eliminar "${note.title}"? Esta acción no se puede deshacer.`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => deleteNote(note.id) },
    ]);
  };

  return (
    <Screen padded={false}>
      <View className="px-4">
        <Text className="mb-4 mt-2 text-2xl font-bold text-black dark:text-white">Notas</Text>

        <View className="mb-4 flex-row items-center gap-2 rounded-xl border border-neutral-300 px-3 dark:border-neutral-700">
          <Ionicons name="search-outline" size={18} color={colors.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar por título o contenido"
            placeholderTextColor={colors.muted}
            className="flex-1 py-2 text-black dark:text-white"
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => String(item.id)}
        contentContainerClassName="gap-3 px-4 pb-24"
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          query ? (
            <EmptyState
              title="Sin resultados"
              hint={`No hay notas que coincidan con "${query}"`}
            />
          ) : (
            <EmptyState
              title="Todavía no tienes notas"
              hint="Pulsa el botón + para crear la primera"
            />
          )
        }
        renderItem={({ item }) => (
          <Card onPress={() => router.push(`/notes/${item.id}`)}>
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1">
                <Text className="text-base font-semibold text-black dark:text-white">
                  {item.title}
                </Text>
                {item.content ? (
                  <Text
                    className="mt-1 text-sm text-neutral-500 dark:text-neutral-400"
                    numberOfLines={2}>
                    {item.content}
                  </Text>
                ) : null}
                <Text className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">
                  {formatUpdatedAt(item.updated_at)}
                </Text>
              </View>

              <Pressable
                onPress={() => handleDelete(item)}
                hitSlop={8}
                className="rounded-full p-1 active:opacity-60">
                <Ionicons name="trash-outline" size={18} color={palette.danger500} />
              </Pressable>
            </View>
          </Card>
        )}
      />

      <Pressable
        onPress={() => router.push('/notes/new')}
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg active:opacity-80">
        <Ionicons name="add" size={28} color={palette.white} />
      </Pressable>
    </Screen>
  );
}
