import { Modal, Pressable, Text, View } from 'react-native';

import { NOTE_TEMPLATES, type NoteTemplate } from '../constants/templates';

interface TemplatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (template: NoteTemplate) => void;
}

export function TemplatePickerModal({ visible, onClose, onSelect }: TemplatePickerModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        className="flex-1 justify-end bg-black/40"
        onPress={onClose}
        accessibilityLabel="Cerrar selector de plantillas">
        <Pressable
          onPress={() => {}}
          className="gap-1 rounded-t-2xl bg-white p-4 pb-8 dark:bg-neutral-900">
          <View className="mb-2 items-center">
            <Text className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
              Elegir plantilla
            </Text>
          </View>

          {NOTE_TEMPLATES.map((template) => (
            <Pressable
              key={template.id}
              onPress={() => onSelect(template)}
              className="rounded-xl border-b border-neutral-100 px-2 py-3 active:bg-neutral-100 dark:border-neutral-800 dark:active:bg-neutral-800">
              <Text className="text-center text-base text-black dark:text-white">
                {template.label}
              </Text>
            </Pressable>
          ))}

          <Pressable onPress={onClose} className="mt-2 rounded-xl px-2 py-3 active:opacity-60">
            <Text className="text-center text-base font-semibold text-red-500">Cancelar</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
