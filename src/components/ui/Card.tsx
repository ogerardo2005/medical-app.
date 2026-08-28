import type { PropsWithChildren } from 'react';
import { Pressable, View, type PressableProps } from 'react-native';

interface CardProps extends PropsWithChildren {
  className?: string;
  onPress?: PressableProps['onPress'];
}

export function Card({ children, className = '', onPress }: CardProps) {
  const content = (
    <View
      className={`rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900 ${className}`}>
      {children}
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable onPress={onPress} className="active:opacity-70">
      {content}
    </Pressable>
  );
}
