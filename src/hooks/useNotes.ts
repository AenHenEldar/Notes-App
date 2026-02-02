import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Note } from '../types/database';
import { useAuth } from '../contexts/AuthContext';
import { toLocalDateStr } from '../utils/date';

export function useNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchNotes() {
    if (!user) return;
    const { data, error: err } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (err) {
      setError(err.message);
      setNotes([]);
    } else {
      setNotes((data as Note[]) ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    const userId = user.id;

    fetchNotes();

    const channel = supabase
      .channel(`notes-changes-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notes',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchNotes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  async function createNote(title: string, content: string, noteDate?: Date) {
    if (!user) return { error: new Error('Not authenticated') };

    const now = new Date().toISOString();
    const noteDateStr = noteDate ? toLocalDateStr(noteDate) : null;

    const { error: err } = await supabase.from('notes').insert({
      user_id: user.id,
      title: title || 'Untitled Note',
      content: content || '',
      note_date: noteDateStr,
      created_at: now,
      updated_at: now,
    });

    if (!err) fetchNotes();
    return { error: err as Error | null };
  }

  async function updateNote(id: string, title: string, content: string) {
    const { error: err } = await supabase
      .from('notes')
      .update({
        title: title || 'Untitled Note',
        content: content || '',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user!.id);

    if (!err) fetchNotes();
    return { error: err as Error | null };
  }

  async function deleteNote(id: string) {
    const { error: err } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
      .eq('user_id', user!.id);

    if (!err) fetchNotes();
    return { error: err as Error | null };
  }

  return { notes, loading, error, createNote, updateNote, deleteNote };
}
