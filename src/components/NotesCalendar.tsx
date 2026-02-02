import { useState } from 'react';
import type { Note } from '../types/database';
import { toLocalDateStr, getNoteCalendarDateStr } from '../utils/date';

interface NotesCalendarProps {
  notes: Note[];
  onSelectDate: (date: Date) => void;
}

export function NotesCalendar({ notes, onSelectDate }: NotesCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPadding = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1));
  };

  function getNotesForDate(date: Date): Note[] {
    const dateStr = toLocalDateStr(date);
    return notes.filter((note) => getNoteCalendarDateStr(note) === dateStr);
  }

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days: (number | null)[] = [];
  for (let i = 0; i < startPadding; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  return (
    <div className="notes-calendar">
      <div className="calendar-header">
        <button type="button" onClick={prevMonth} className="calendar-nav" aria-label="Previous month">
          ‹
        </button>
        <h3 className="calendar-title">{monthName}</h3>
        <button type="button" onClick={nextMonth} className="calendar-nav" aria-label="Next month">
          ›
        </button>
      </div>

      <div className="calendar-weekdays">
        {weekDays.map((day) => (
          <span key={day} className="calendar-weekday">
            {day}
          </span>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="calendar-day calendar-day-empty" />;
          }

          const date = new Date(year, month, day);
          const dayNotes = getNotesForDate(date);
          const isToday =
            date.toDateString() === new Date().toDateString();

          return (
            <button
              key={day}
              type="button"
              className={`calendar-day ${dayNotes.length > 0 ? 'calendar-day-has-notes' : ''} ${isToday ? 'calendar-day-today' : ''}`}
              onClick={() => onSelectDate(date)}
            >
              <span className="calendar-day-number">{day}</span>
              {dayNotes.length > 0 && (
                <span className="calendar-day-dots" title={`${dayNotes.length} note(s)`}>
                  {dayNotes.length <= 3
                    ? '•'.repeat(dayNotes.length)
                    : '•••'}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
