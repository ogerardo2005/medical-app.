import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';

import type { NoteRow } from '@/db/types';

export function useNotes() {
  const db = useSQLiteContext();
  const [notes, setNotes] = useState<NoteRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const rows = await db.getAllAsync<NoteRow>('SELECT * FROM notes ORDER BY updated_at DESC');
    setNotes(rows);
    setIsLoading(false);
  }, [db]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- setState happens after the `await`, not synchronously in the effect body
    refresh();
  }, [refresh]);

  const addNote = useCallback(
    async (title: string, content = '', templateType: string | null = null) => {
      const result = await db.runAsync(
        'INSERT INTO notes (title, content, template_type) VALUES (?, ?, ?)',
        title,
        content,
        templateType
      );
      await refresh();
      return result.lastInsertRowId;
    },
    [db, refresh]
  );

  const deleteNote = useCallback(
    async (id: number) => {
      await db.runAsync('DELETE FROM notes WHERE id = ?', id);
      await refresh();
    },
    [db, refresh]
  );

  return { notes, isLoading, addNote, deleteNote, refresh };
}
