-- Run this SQL in your Supabase SQL Editor to create the notes table
-- https://supabase.com/dashboard/project/_/sql

-- Create notes table with RLS
create table public.notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text default 'Untitled Note',
  content text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table public.notes enable row level security;

-- Users can only read their own notes
create policy "Users can read own notes"
  on public.notes for select
  using (auth.uid() = user_id);

-- Users can insert their own notes
create policy "Users can insert own notes"
  on public.notes for insert
  with check (auth.uid() = user_id);

-- Users can update their own notes
create policy "Users can update own notes"
  on public.notes for update
  using (auth.uid() = user_id);

-- Users can delete their own notes
create policy "Users can delete own notes"
  on public.notes for delete
  using (auth.uid() = user_id);

-- Enable realtime for notes
alter publication supabase_realtime add table public.notes;
