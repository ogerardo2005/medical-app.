import '@/global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthProvider, useAuth } from '@/features/auth/AuthContext';
import { AuthScreen } from '@/features/auth/screens/AuthScreen';
import { GuardModeProvider, useGuardMode } from '@/theme/GuardModeContext';
import { GuardModeOverlay } from '@/theme/GuardModeOverlay';

function LoadingFallback() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black">
      <ActivityIndicator />
    </View>
  );
}

function AppShell() {
  const { guardMode } = useGuardMode();
  const { session, isLoading } = useAuth();

  return (
    <>
      <StatusBar style={guardMode ? 'light' : 'auto'} />
      {isLoading ? (
        <LoadingFallback />
      ) : !session ? (
        <AuthScreen />
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      )}
      <GuardModeOverlay />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <GuardModeProvider>
          <AppShell />
        </GuardModeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
