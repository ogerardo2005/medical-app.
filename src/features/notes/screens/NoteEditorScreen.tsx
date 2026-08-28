import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeIconColors } from '@/theme/colors';

import { TemplatePickerModal } from '../components/TemplatePickerModal';
import type { NoteTemplate } from '../constants/templates';
import { useNoteEditor } from '../hooks/useNoteEditor';

export function NoteEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const colors = useThemeIconColors();

  const { isReady, title, content, saveStatus, setTitle, setContent, applyTemplate, saveOnExit } =
    useNoteEditor(id);

  const [isTemplatePickerVisible, setIsTemplatePickerVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      saveOnExit();
    });
    return unsubscribe;
  }, [navigation, saveOnExit]);

  const handleSelectTemplate = (template: NoteTemplate) => {
    setIsTemplatePickerVisible(false);

    if (content.trim().length > 0) {
      Alert.alert(
        'Reemplazar contenido',
        `Esto reemplazará el contenido actual con la plantilla "${template.label}". ¿Continuar?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Reemplazar', style: 'destructive', onPress: () => applyTemplate(template) },
        ]
      );
      return;
    }

    applyTemplate(template);
  };

  if (!isReady) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="flex-row items-center justify-between px-2 py-3">
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            className="flex-row items-center gap-0.5 px-2 active:opacity-60">
            <Ionicons name="chevron-back" size={22} color={colors.accent} />
            <Text className="text-base text-primary">Notas</Text>
          </Pressable>

          <Text className="text-xs text-neutral-400 dark:text-neutral-500">
            {saveStatus === 'saving' ? 'Guardando…' : saveStatus === 'saved' ? 'Guardado' : ''}
          </Text>

          <Pressable
            onPress={() => setIsTemplatePickerVisible(true)}
            hitSlop={8}
            className="flex-row items-center gap-1 px-2 active:opacity-60">
            <Ionicons name="document-text-outline" size={18} color={colors.accent} />
            <Text className="text-base text-primary">Plantilla</Text>
          </Pressable>
        </View>

        <View className="flex-1 gap-3 px-4 pt-2">
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Título"
            placeholderTextColor={colors.muted}
            className="text-xl font-semibold text-black dark:text-white"
            returnKeyType="next"
          />
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="Escribe el contenido de la nota…"
            placeholderTextColor={colors.muted}
            className="flex-1 text-base leading-6 text-black dark:text-white"
            multiline
            textAlignVertical="top"
          />
        </View>
      </KeyboardAvoidingView>

      <TemplatePickerModal
        visible={isTemplatePickerVisible}
        onClose={() => setIsTemplatePickerVisible(false)}
        onSelect={handleSelectTemplate}
      />
    </SafeAreaView>
  );
}
