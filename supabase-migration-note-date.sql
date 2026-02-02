-- Run this in Supabase SQL Editor if you already have the notes table
-- Adds note_date column for calendar date filtering

alter table public.notes add column if not exists note_date date;
