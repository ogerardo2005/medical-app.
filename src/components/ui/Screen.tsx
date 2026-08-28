import type { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenProps extends PropsWithChildren {
  className?: string;
  /** Set false when a child (e.g. a FlatList) manages its own horizontal padding. */
  padded?: boolean;
}

export function Screen({ children, className = '', padded = true }: ScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={['top', 'left', 'right']}>
      <View className={`flex-1 ${padded ? 'px-4' : ''} ${className}`}>{children}</View>
    </SafeAreaView>
  );
}
