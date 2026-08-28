import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';

import type { VademecumRow } from '@/db/types';

/**
 * Loads the whole vademecum once (it's a small local reference table, not a
 * growing user dataset) so the search screen can filter it in memory on
 * every keystroke with zero DB round-trips - genuinely instant search.
 */
export function useVademecum() {
  const db = useSQLiteContext();
  const [drugs, setDrugs] = useState<VademecumRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const rows = await db.getAllAsync<VademecumRow>(
      'SELECT * FROM vademecum ORDER BY nombre_generico ASC'
    );
    setDrugs(rows);
    setIsLoading(false);
  }, [db]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount; setState happens after the `await`, not synchronously in the effect body
    refresh();
  }, [refresh]);

  return { drugs, isLoading, refresh };
}
