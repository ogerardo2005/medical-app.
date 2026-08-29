import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';

import { useAuth } from '@/features/auth/AuthContext';
import { supabase } from '@/lib/supabase';

interface GuardModeContextValue {
  /** Whether the red-light filter is currently on. False until it loads from Supabase. */
  guardMode: boolean;
  setGuardMode: (enabled: boolean) => void;
}

const GuardModeContext = createContext<GuardModeContextValue | null>(null);

/**
 * Persists the "Modo Guardia" (red-light) preference in the `user_settings`
 * table, keyed by the signed-in user - so it now follows the user across
 * every device they log into, same as their notes and flashcards.
 */
export function GuardModeProvider({ children }: PropsWithChildren) {
  const { session } = useAuth();
  const userId = session?.user.id;
  const [guardMode, setGuardModeState] = useState(false);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    supabase
      .from('user_settings')
      .select('guard_mode')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled && data) setGuardModeState(data.guard_mode);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const setGuardMode = useCallback(
    (enabled: boolean) => {
      setGuardModeState(enabled);
      if (!userId) return;
      supabase.from('user_settings').upsert({ user_id: userId, guard_mode: enabled });
    },
    [userId]
  );

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
