import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotes } from '../hooks/useNotes';
import { NoteEditor } from '../components/NoteEditor';
import { NoteList } from '../components/NoteList';
import type { Note } from '../types/database';

export function Notes() {
  const { signOut } = useAuth();
  const { notes, loading, error, createNote, updateNote, deleteNote } = useNotes();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);

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

  return (
    <div className="notes-layout">
      <header className="notes-header">
        <h1>Notes</h1>
        <div className="header-actions">
          <button onClick={handleNewNote} className="btn btn-primary">
            + New note
          </button>
          <button onClick={signOut} className="btn btn-ghost">
            Sign out
          </button>
        </div>
      </header>

      <div className="notes-content">
        <aside className="notes-sidebar">
          <NoteList
            notes={notes}
            selectedNote={selectedNote}
            onSelectNote={handleSelectNote}
            isCreating={isCreating}
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
