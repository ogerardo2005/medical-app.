import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/features/auth/AuthContext';
import { supabase } from '@/lib/supabase';
import type { NoteRow } from '@/lib/types';

export function useNotes() {
  const { session } = useAuth();
  const userId = session?.user.id;
  const [notes, setNotes] = useState<NoteRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false });
    if (!error && data) setNotes(data);
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount; setState happens after the `await`, not synchronously in the effect body
    refresh();
  }, [refresh]);

  const addNote = useCallback(
    async (title: string, content = '', templateType: string | null = null) => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('notes')
        .insert({ user_id: userId, title, content, template_type: templateType })
        .select('id')
        .single();
      await refresh();
      if (error || !data) throw error ?? new Error('Failed to create note');
      return data.id;
    },
    [userId, refresh]
  );

  const deleteNote = useCallback(
    async (id: string) => {
      await supabase.from('notes').delete().eq('id', id);
      await refresh();
    },
    [refresh]
  );

  return { notes, isLoading, addNote, deleteNote, refresh };
}
