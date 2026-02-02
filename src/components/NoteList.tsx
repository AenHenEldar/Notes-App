import type { Note, SortOption, DateFilterOption } from '../types/database';
import { toLocalDateStr, getNoteCalendarDateStr } from '../utils/date';

interface NoteListProps {
  notes: Note[];
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
  isCreating: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  dateFilter: DateFilterOption;
  onDateFilterChange: (value: DateFilterOption) => void;
  specificFilterDate?: string;
  onSpecificFilterDateChange?: (value: string) => void;
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
  dateFilter,
  onDateFilterChange,
  specificFilterDate = toLocalDateStr(new Date()),
  onSpecificFilterDateChange,
}: NoteListProps) {
  function formatDate(note: Note) {
    const dateStr = getNoteCalendarDateStr(note);
    const date = new Date(dateStr + 'T12:00:00');
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
    const isToday = date >= todayStart && date < new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
    const isYesterday = date >= yesterdayStart && date < todayStart;
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';
    if (days < 7 && days >= 0) return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    if (days > -7 && days < 0) return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
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
          value={dateFilter}
          onChange={(e) => onDateFilterChange(e.target.value as DateFilterOption)}
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
        {dateFilter === 'specific' && onSpecificFilterDateChange && (
          <input
            type="date"
            value={specificFilterDate}
            onChange={(e) => onSpecificFilterDateChange(e.target.value)}
            className="note-date-input"
            aria-label="Pick date"
          />
        )}
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
          {searchQuery.trim() || dateFilter !== 'all'
            ? 'No notes match your filters'
            : 'No notes yet'}
        </p>
      ) : (
        notes.map((note) => (
          <button
            key={note.id}
            className={`note-list-item ${selectedNote?.id === note.id ? 'selected' : ''}`}
            onClick={() => onSelectNote(note)}
          >
            <span className="note-list-title">{note.title || 'Untitled'}</span>
            <span className="note-list-date">{formatDate(note)}</span>
          </button>
        ))
      )}
      </div>
    </div>
  );
}
