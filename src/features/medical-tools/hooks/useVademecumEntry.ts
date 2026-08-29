import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';
import type { VademecumRow } from '@/lib/types';

export function useVademecumEntry(id: string) {
  const [drug, setDrug] = useState<VademecumRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data } = await supabase.from('vademecum').select('*').eq('id', id).single();
      if (cancelled) return;
      setDrug(data ?? null);
      setIsLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { drug, isLoading };
}
