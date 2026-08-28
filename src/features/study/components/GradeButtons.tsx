import { Pressable, Text, View } from 'react-native';

import type { ReviewGrade } from '../lib/sm2';

interface GradeButtonsProps {
  onGrade: (grade: ReviewGrade) => void;
}

const GRADE_OPTIONS: { grade: ReviewGrade; label: string; className: string }[] = [
  { grade: 1, label: 'Otra vez', className: 'bg-red-500' },
  { grade: 2, label: 'Difícil', className: 'bg-orange-500' },
  { grade: 3, label: 'Bueno', className: 'bg-primary-600' },
  { grade: 4, label: 'Fácil', className: 'bg-medical-600' },
];

export function GradeButtons({ onGrade }: GradeButtonsProps) {
  return (
    <View className="flex-row gap-2">
      {GRADE_OPTIONS.map((option) => (
        <Pressable
          key={option.grade}
          onPress={() => onGrade(option.grade)}
          className={`flex-1 items-center rounded-xl py-3 active:opacity-80 ${option.className}`}>
          <Text className="text-sm font-semibold text-white">{option.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
