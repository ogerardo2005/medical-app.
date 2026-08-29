import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/features/auth/AuthContext';
import { supabase } from '@/lib/supabase';
import type { VademecumRow } from '@/lib/types';

/**
 * Loads the whole vademecum once (it's a small shared reference table, not a
 * growing per-user dataset) so the search screen can filter it in memory on
 * every keystroke with zero round-trips - genuinely instant search.
 */
export function useVademecum() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const [drugs, setDrugs] = useState<VademecumRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from('vademecum')
      .select('*')
      .order('nombre_generico', { ascending: true });
    setDrugs(data ?? []);
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount; setState happens after the `await`, not synchronously in the effect body
    refresh();
  }, [refresh]);

  return { drugs, isLoading, refresh };
}
