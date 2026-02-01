export type SortOption = 'newest' | 'oldest' | 'title-asc' | 'title-desc';

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}
