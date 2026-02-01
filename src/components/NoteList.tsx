import type { Note, SortOption } from '../types/database';

interface NoteListProps {
  notes: Note[];
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
  isCreating: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
}

export function NoteList({
  notes,
  selectedNote,
  onSelectNote,
  isCreating,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}: NoteListProps) {
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
      <div className="note-list-toolbar">
        <div className="note-search-wrap">
          <svg
            className="note-search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="note-search-input"
            aria-label="Search notes"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="note-sort-select"
          aria-label="Sort notes"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="title-asc">Title A–Z</option>
          <option value="title-desc">Title Z–A</option>
        </select>
      </div>
      <div className="note-list-content">
      {notes.length === 0 && !isCreating ? (
        <p className="note-list-empty">
          {searchQuery.trim() ? 'No notes match your search' : 'No notes yet'}
        </p>
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
    </div>
  );
}
