import Storage from 'expo-sqlite/kv-store';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { Platform } from 'react-native';

const GUARD_MODE_KEY = 'settings.guardMode';

interface GuardModeContextValue {
  /** Whether the red-light filter is currently on. False until the persisted value loads. */
  guardMode: boolean;
  setGuardMode: (enabled: boolean) => void;
}

const GuardModeContext = createContext<GuardModeContextValue | null>(null);

/**
 * On native, expo-sqlite/kv-store is a fine, self-contained place for this.
 * On web it is NOT self-contained: it goes through the exact same
 * openDatabaseAsync() and shared Worker as the app's main SQLiteProvider
 * (both ultimately call the same code in expo-sqlite/build/index). Reading
 * this at startup - which is exactly when GuardModeProvider mounts, right
 * before the main database opens - raced two concurrent "first open" calls
 * through wa-sqlite's OPFS VFS and broke the main database with
 * "Access Handles cannot be created if there is another open Access
 * Handle", even on a completely fresh browser profile. localStorage has no
 * relationship to expo-sqlite at all, so it can't race with it.
 */
async function readGuardModePreference(): Promise<boolean> {
  if (Platform.OS === 'web') {
    try {
      return window.localStorage.getItem(GUARD_MODE_KEY) === 'true';
    } catch {
      return false;
    }
  }
  const stored = await Storage.getItemAsync(GUARD_MODE_KEY);
  return stored === 'true';
}

function writeGuardModePreference(enabled: boolean): void {
  const value = enabled ? 'true' : 'false';
  if (Platform.OS === 'web') {
    try {
      window.localStorage.setItem(GUARD_MODE_KEY, value);
    } catch {
      // Ignore (e.g. storage disabled/full) - the in-memory state still updates.
    }
    return;
  }
  Storage.setItemAsync(GUARD_MODE_KEY, value);
}

export function GuardModeProvider({ children }: PropsWithChildren) {
  const [guardMode, setGuardModeState] = useState(false);

  useEffect(() => {
    readGuardModePreference().then(setGuardModeState);
  }, []);

  const setGuardMode = useCallback((enabled: boolean) => {
    setGuardModeState(enabled);
    writeGuardModePreference(enabled);
  }, []);

  return (
    <GuardModeContext.Provider value={{ guardMode, setGuardMode }}>
      {children}
    </GuardModeContext.Provider>
  );
}

export function useGuardMode() {
  const context = useContext(GuardModeContext);
  if (!context) {
    throw new Error('useGuardMode must be used within a GuardModeProvider');
  }
  return context;
}
