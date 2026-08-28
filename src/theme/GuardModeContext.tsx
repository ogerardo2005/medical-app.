import Storage from 'expo-sqlite/kv-store';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';

const GUARD_MODE_KEY = 'settings.guardMode';

interface GuardModeContextValue {
  /** Whether the red-light filter is currently on. False until the persisted value loads. */
  guardMode: boolean;
  setGuardMode: (enabled: boolean) => void;
}

const GuardModeContext = createContext<GuardModeContextValue | null>(null);

/**
 * Persists the "Modo Guardia" (red-light) preference via expo-sqlite's
 * built-in key-value store - a separate, self-contained SQLite file, so this
 * works independently of the app's own SQLiteProvider/database.
 */
export function GuardModeProvider({ children }: PropsWithChildren) {
  const [guardMode, setGuardModeState] = useState(false);

  useEffect(() => {
    Storage.getItemAsync(GUARD_MODE_KEY).then((stored) => {
      if (stored === 'true') setGuardModeState(true);
    });
  }, []);

  const setGuardMode = useCallback((enabled: boolean) => {
    setGuardModeState(enabled);
    Storage.setItemAsync(GUARD_MODE_KEY, enabled ? 'true' : 'false');
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
