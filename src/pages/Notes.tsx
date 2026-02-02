import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotes } from '../hooks/useNotes';
import { toLocalDateStr, dateStrToSortKey, getNoteCalendarDateStr } from '../utils/date';
import { NoteEditor } from '../components/NoteEditor';
import { NoteList } from '../components/NoteList';
import { NotesCalendar } from '../components/NotesCalendar';
import type { Note, SortOption, DateFilterOption } from '../types/database';

export function Notes() {
  const { signOut } = useAuth();
  const { notes, loading, error, createNote, updateNote, deleteNote } = useNotes();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('all');
  const [specificFilterDate, setSpecificFilterDate] = useState<string>(() =>
    toLocalDateStr(new Date())
  );
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  async function handleSave(title: string, content: string) {
    if (isCreating) {
      await createNote(title, content, selectedDate ?? undefined);
      setIsCreating(false);
      setSelectedNote(null);
      setSelectedDate(null);
    } else if (selectedNote) {
      await updateNote(selectedNote.id, title, content);
      setSelectedNote({ ...selectedNote, title, content, updated_at: new Date().toISOString() });
    }
  }

  async function handleDelete() {
    if (selectedNote) {
      await deleteNote(selectedNote.id);
      setSelectedNote(null);
    }
  }

  function handleNewNote() {
    setIsCreating(true);
    setSelectedNote(null);
    setSelectedDate(null);
  }

  function handleSelectDate(date: Date) {
    setSelectedDate(date);
    setIsCreating(true);
    setSelectedNote(null);
  }

  function handleSelectNote(note: Note) {
    setIsCreating(false);
    setSelectedNote(note);
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading notes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notes-layout">
        <header className="notes-header">
          <h1>Notes</h1>
          <button onClick={signOut} className="btn btn-ghost">
            Sign out
          </button>
        </header>
        <div className="notes-error">
          <p>Error loading notes: {error}</p>
          <p className="notes-error-hint">
            Make sure you've set up Supabase and created the notes table. See README for setup.
          </p>
        </div>
      </div>
    );
  }

  const showEditor = isCreating || !!selectedNote;

  function getNoteCalendarDate(note: Note): Date {
    if (note.note_date) {
      return new Date(note.note_date + 'T12:00:00');
    }
    return new Date(note.created_at);
  }

  function isNoteInDateRange(note: Note): boolean {
    if (dateFilter === 'all') return true;
    const noteDate = getNoteCalendarDate(note);
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1);
    const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);

    switch (dateFilter) {
      case 'today':
        return noteDate >= todayStart && noteDate <= todayEnd;
      case 'yesterday':
        return noteDate >= yesterdayStart && noteDate < todayStart;
      case 'last7':
        return noteDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'last30':
        return noteDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case 'thisMonth':
        return noteDate.getMonth() === now.getMonth() && noteDate.getFullYear() === now.getFullYear();
      case 'specific': {
        const target = new Date(specificFilterDate);
        const targetStart = new Date(target.getFullYear(), target.getMonth(), target.getDate());
        const targetEnd = new Date(targetStart.getTime() + 24 * 60 * 60 * 1000 - 1);
        return noteDate >= targetStart && noteDate <= targetEnd;
      }
      default:
        return true;
    }
  }

  const dateFilteredNotes = notes.filter(isNoteInDateRange);

  const filteredNotes = dateFilteredNotes
    .filter((note) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        (note.title || '').toLowerCase().includes(q) ||
        (note.content || '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest': {
          const keyA = dateStrToSortKey(getNoteCalendarDateStr(a));
          const keyB = dateStrToSortKey(getNoteCalendarDateStr(b));
          return keyA - keyB;
        }
        case 'oldest': {
          const keyA = dateStrToSortKey(getNoteCalendarDateStr(a));
          const keyB = dateStrToSortKey(getNoteCalendarDateStr(b));
          return keyB - keyA;
        }
        case 'title-asc':
          return (a.title || 'Untitled').localeCompare(b.title || 'Untitled', undefined, { sensitivity: 'base' });
        case 'title-desc':
          return (b.title || 'Untitled').localeCompare(a.title || 'Untitled', undefined, { sensitivity: 'base' });
        default:
          return 0;
      }
    });

  function handleBackToList() {
    setIsCreating(false);
    setSelectedNote(null);
    setSelectedDate(null);
  }

  return (
    <div className="notes-layout">
      <header className="notes-header">
        {showEditor && (
          <button
            onClick={handleBackToList}
            className="notes-back-btn mobile-only"
            aria-label="Back to notes list"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <h1>Notes</h1>
        <div className="header-actions">
          <div className="view-toggle">
            <button
              type="button"
              className={`btn btn-ghost btn-sm ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
            >
              List
            </button>
            <button
              type="button"
              className={`btn btn-ghost btn-sm ${view === 'calendar' ? 'active' : ''}`}
              onClick={() => setView('calendar')}
            >
              Calendar
            </button>
          </div>
          <button onClick={handleNewNote} className="btn btn-primary">
            + New note
          </button>
          <button onClick={signOut} className="btn btn-ghost">
            Sign out
          </button>
        </div>
      </header>

      <div className={`notes-content ${showEditor ? 'show-editor' : ''}`}>
        <aside className="notes-sidebar">
          {view === 'calendar' ? (
            <>
              <div className="calendar-filter-bar">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as DateFilterOption)}
                  className="note-sort-select"
                  aria-label="Filter by date"
                >
                  <option value="all">All dates</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="last7">Last 7 days</option>
                  <option value="last30">Last 30 days</option>
                  <option value="thisMonth">This month</option>
                  <option value="specific">Specific date</option>
                </select>
                {dateFilter === 'specific' && (
                  <input
                    type="date"
                    value={specificFilterDate}
                    onChange={(e) => setSpecificFilterDate(e.target.value)}
                    className="note-date-input"
                    aria-label="Pick date"
                  />
                )}
              </div>
              <NotesCalendar notes={dateFilteredNotes} onSelectDate={handleSelectDate} />
            </>
          ) : (
            <NoteList
            notes={filteredNotes}
            selectedNote={selectedNote}
            onSelectNote={handleSelectNote}
            isCreating={isCreating}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            specificFilterDate={specificFilterDate}
            onSpecificFilterDateChange={setSpecificFilterDate}
          />
          )}
        </aside>

        <main className="notes-main">
          {isCreating ? (
            <>
              {selectedDate && (
                <p className="note-date-hint">
                  Creating note for {selectedDate.toLocaleDateString()}
                </p>
              )}
              <NoteEditor
                title=""
                content=""
                onSave={handleSave}
                onDelete={handleDelete}
                onCancel={() => {
                  setIsCreating(false);
                  setSelectedDate(null);
                }}
                isNew
              />
            </>
          ) : selectedNote ? (
            <NoteEditor
              key={selectedNote.id}
              title={selectedNote.title}
              content={selectedNote.content}
              onSave={handleSave}
              onDelete={handleDelete}
            />
          ) : (
            <div className="notes-empty">
              <p>
                {selectedDate
                  ? `Create note for ${selectedDate.toLocaleDateString()}`
                  : 'Select a note or create a new one'}
              </p>
              {selectedDate && (
                <p className="notes-empty-hint">Fill in the editor above and click Save</p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
