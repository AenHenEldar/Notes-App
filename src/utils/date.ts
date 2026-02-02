import type { Note } from '../types/database';

/** Get YYYY-MM-DD in local timezone (avoids UTC shift) */
export function toLocalDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Normalize to YYYY-MM-DD (handles Supabase date or datetime strings) */
export function toDateOnlyStr(val: string): string {
  return val.split('T')[0];
}

/**
 * Get the note's calendar date (YYYY-MM-DD) - the date shown on the calendar.
 * Uses note_date when set; otherwise the local DATE of created_at (never the time).
 */
export function getNoteCalendarDateStr(note: Note): string {
  if (note.note_date) return toDateOnlyStr(note.note_date);
  return toLocalDateStr(new Date(note.created_at));
}

/** Get timestamp for noon on a date string (YYYY-MM-DD) - for sort by date only, never time */
export function dateStrToSortKey(dateStr: string): number {
  const d = toDateOnlyStr(dateStr);
  return new Date(d + 'T12:00:00').getTime();
}
