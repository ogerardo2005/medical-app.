import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useAuth } from '@/features/auth/AuthContext';
import { supabase } from '@/lib/supabase';
import type { NoteRow } from '@/lib/types';

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
  const { session } = useAuth();
  const userId = session?.user.id;
  const router = useRouter();

  const [isReady, setIsReady] = useState(false);
  const [title, setTitleState] = useState('');
  const [content, setContentState] = useState('');
  const [templateType, setTemplateType] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const noteIdRef = useRef<string | null>(null);
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
    await supabase
      .from('notes')
      .update({
        title: titleRef.current,
        content: contentRef.current,
        template_type: templateTypeRef.current,
        updated_at: new Date().toISOString(),
      })
      .eq('id', noteIdRef.current);
    setSaveStatus('saved');
  }, []);

  const scheduleAutosave = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(persist, AUTOSAVE_DELAY_MS);
  }, [clearTimer, persist]);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    async function setup() {
      if (idParam === 'new') {
        if (noteIdRef.current) return;
        const { data, error } = await supabase
          .from('notes')
          .insert({ user_id: userId, title: '', content: '' })
          .select('id')
          .single();
        if (cancelled || error || !data) return;
        noteIdRef.current = data.id;
        isNewDraftRef.current = true;
        setIsReady(true);
        router.setParams({ id: data.id });
        return;
      }

      if (noteIdRef.current === idParam) return;

      const { data: row } = await supabase
        .from('notes')
        .select('*')
        .eq('id', idParam)
        .single<NoteRow>();
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
  }, [idParam, userId, router]);

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
   * never applies to a pre-existing note the user cleared out - that's their call, not
   * something we silently discard for them.
   */
  const saveOnExit = useCallback(async () => {
    clearTimer();
    if (!noteIdRef.current || isDiscardedRef.current) return;

    const isEmpty = !titleRef.current.trim() && !contentRef.current.trim();
    if (isNewDraftRef.current && isEmpty) {
      isDiscardedRef.current = true;
      await supabase.from('notes').delete().eq('id', noteIdRef.current);
      return;
    }

    await persist();
  }, [clearTimer, persist]);

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
