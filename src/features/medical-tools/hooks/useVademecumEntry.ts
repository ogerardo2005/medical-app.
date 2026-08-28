import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';

import type { VademecumRow } from '@/db/types';

export function useVademecumEntry(id: string) {
  const db = useSQLiteContext();
  const [drug, setDrug] = useState<VademecumRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const row = await db.getFirstAsync<VademecumRow>(
        'SELECT * FROM vademecum WHERE id = ?',
        Number(id)
      );
      if (cancelled) return;
      setDrug(row);
      setIsLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [db, id]);

  return { drug, isLoading };
}
