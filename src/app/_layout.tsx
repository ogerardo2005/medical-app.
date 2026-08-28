import '@/global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Suspense } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';

import { DATABASE_NAME, migrateDatabase } from '@/db/schema';
import { DatabaseErrorBoundary } from '@/db/DatabaseErrorBoundary';
import { DatabaseUnloadHandler } from '@/db/DatabaseUnloadHandler';
import { seedDatabase } from '@/db/seed';
import { GuardModeProvider, useGuardMode } from '@/theme/GuardModeContext';
import { GuardModeOverlay } from '@/theme/GuardModeOverlay';

async function initializeDatabase(db: SQLiteDatabase) {
  await migrateDatabase(db);
  await seedDatabase(db);
}

function LoadingFallback() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black">
      <ActivityIndicator />
    </View>
  );
}

function AppShell() {
  const { guardMode } = useGuardMode();

  return (
    <>
      <StatusBar style={guardMode ? 'light' : 'auto'} />
      <DatabaseErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <SQLiteProvider databaseName={DATABASE_NAME} onInit={initializeDatabase} useSuspense>
            <DatabaseUnloadHandler />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
            </Stack>
          </SQLiteProvider>
        </Suspense>
      </DatabaseErrorBoundary>
      <GuardModeOverlay />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GuardModeProvider>
        <AppShell />
      </GuardModeProvider>
    </GestureHandlerRootView>
  );
}
