import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotes } from '../hooks/useNotes';
import { NoteEditor } from '../components/NoteEditor';
import { NoteList } from '../components/NoteList';
import { AndroidDownload } from '../components/AndroidDownload';
import type { Note, SortOption } from '../types/database';

export function Notes() {
  const { signOut } = useAuth();
  const { notes, loading, error, createNote, updateNote, deleteNote } = useNotes();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  async function handleSave(title: string, content: string) {
    if (isCreating) {
      await createNote(title, content);
      setIsCreating(false);
      setSelectedNote(null);
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

  const filteredNotes = notes
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
        case 'newest':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        case 'oldest':
          return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
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
          <AndroidDownload />
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
          <NoteList
            notes={filteredNotes}
            selectedNote={selectedNote}
            onSelectNote={handleSelectNote}
            isCreating={isCreating}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </aside>

        <main className="notes-main">
          {isCreating ? (
            <NoteEditor
              title=""
              content=""
              onSave={handleSave}
              onDelete={handleDelete}
              onCancel={() => setIsCreating(false)}
              isNew
            />
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
              <p>Select a note or create a new one</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
