export type SortOption = 'newest' | 'oldest' | 'title-asc' | 'title-desc';

export type DateFilterOption = 'all' | 'today' | 'yesterday' | 'last7' | 'last30' | 'thisMonth' | 'specific';

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  note_date?: string | null;
  created_at: string;
  updated_at: string;
}
