import type { Note } from '../types/database';

interface NoteListProps {
  notes: Note[];
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
  isCreating: boolean;
}

export function NoteList({ notes, selectedNote, onSelectNote, isCreating }: NoteListProps) {
  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (days === 1) return 'Yesterday';
    if (days < 7) return date.toLocaleDateString([], { weekday: 'short' });
    return date.toLocaleDateString();
  }

  return (
    <div className="note-list">
      {notes.length === 0 && !isCreating ? (
        <p className="note-list-empty">No notes yet</p>
      ) : (
        notes.map((note) => (
          <button
            key={note.id}
            className={`note-list-item ${selectedNote?.id === note.id ? 'selected' : ''}`}
            onClick={() => onSelectNote(note)}
          >
            <span className="note-list-title">{note.title || 'Untitled'}</span>
            <span className="note-list-date">{formatDate(note.updated_at)}</span>
          </button>
        ))
      )}
    </div>
  );
}
