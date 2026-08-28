import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { NoteRow } from '@/db/types';

import type { NoteTemplate } from '../constants/templates';

const AUTOSAVE_DELAY_MS = 3000;

export type SaveStatus = 'idle' | 'saving' | 'saved';

/**
 * Backs both the "create" and "edit" flows for a single note behind one screen.
 * `idParam === 'new'` inserts an empty draft row immediately and swaps the route's
 * `id` param to the real row id (via router.setParams, no navigation), so every
 * other operation below can just always UPDATE by id.
 */
export function useNoteEditor(idParam: string) {
  const db = useSQLiteContext();
  const router = useRouter();

  const [isReady, setIsReady] = useState(false);
  const [title, setTitleState] = useState('');
  const [content, setContentState] = useState('');
  const [templateType, setTemplateType] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const noteIdRef = useRef<number | null>(null);
  const isNewDraftRef = useRef(false);
  const titleRef = useRef('');
  const contentRef = useRef('');
  const templateTypeRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDiscardedRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const persist = useCallback(async () => {
    if (!noteIdRef.current || isDiscardedRef.current) return;
    setSaveStatus('saving');
    await db.runAsync(
      "UPDATE notes SET title = ?, content = ?, template_type = ?, updated_at = datetime('now') WHERE id = ?",
      titleRef.current,
      contentRef.current,
      templateTypeRef.current,
      noteIdRef.current
    );
    setSaveStatus('saved');
  }, [db]);

  const scheduleAutosave = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(persist, AUTOSAVE_DELAY_MS);
  }, [clearTimer, persist]);

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      if (idParam === 'new') {
        if (noteIdRef.current) return;
        const result = await db.runAsync("INSERT INTO notes (title, content) VALUES ('', '')");
        if (cancelled) return;
        noteIdRef.current = result.lastInsertRowId;
        isNewDraftRef.current = true;
        setIsReady(true);
        router.setParams({ id: String(result.lastInsertRowId) });
        return;
      }

      const numericId = Number(idParam);
      if (noteIdRef.current === numericId) return;

      const row = await db.getFirstAsync<NoteRow>('SELECT * FROM notes WHERE id = ?', numericId);
      if (cancelled || !row) return;

      noteIdRef.current = row.id;
      titleRef.current = row.title;
      contentRef.current = row.content;
      templateTypeRef.current = row.template_type;
      setTitleState(row.title);
      setContentState(row.content);
      setTemplateType(row.template_type);
      setIsReady(true);
    }

    setup();
    return () => {
      cancelled = true;
    };
  }, [idParam, db, router]);

  const setTitle = useCallback(
    (value: string) => {
      titleRef.current = value;
      setTitleState(value);
      setSaveStatus('idle');
      scheduleAutosave();
    },
    [scheduleAutosave]
  );

  const setContent = useCallback(
    (value: string) => {
      contentRef.current = value;
      setContentState(value);
      setSaveStatus('idle');
      scheduleAutosave();
    },
    [scheduleAutosave]
  );

  const applyTemplate = useCallback(
    (template: NoteTemplate) => {
      contentRef.current = template.body;
      templateTypeRef.current = template.id;
      setContentState(template.body);
      setTemplateType(template.id);

      if (!titleRef.current.trim()) {
        titleRef.current = template.defaultTitle;
        setTitleState(template.defaultTitle);
      }

      setSaveStatus('idle');
      scheduleAutosave();
    },
    [scheduleAutosave]
  );

  /**
   * Persists pending edits before leaving the screen. The one exception: a note that
   * was freshly created via the '+' FAB (isNewDraftRef) and is still empty is deleted
   * instead of saved, so backing out of an unused draft doesn't litter the list. This
   * never applies to a pre-existing note the user cleared out — that's their call, not
   * something we silently discard for them.
   */
  const saveOnExit = useCallback(async () => {
    clearTimer();
    if (!noteIdRef.current || isDiscardedRef.current) return;

    const isEmpty = !titleRef.current.trim() && !contentRef.current.trim();
    if (isNewDraftRef.current && isEmpty) {
      isDiscardedRef.current = true;
      await db.runAsync('DELETE FROM notes WHERE id = ?', noteIdRef.current);
      return;
    }

    await persist();
  }, [clearTimer, db, persist]);

  return {
    isReady,
    title,
    content,
    templateType,
    saveStatus,
    setTitle,
    setContent,
    applyTemplate,
    saveOnExit,
  };
}
