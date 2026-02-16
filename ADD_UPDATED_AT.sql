
-- ADD_UPDATED_AT.sql
-- Run this in Supabase SQL Editor to fix the schema error

alter table public.profiles
add column if not exists updated_at timestamp with time zone default now();

-- Optional: Add trigger to auto-update it
-- create extension if not exists moddatetime schema extensions;
-- create trigger handle_updated_at before update on public.profiles
--   for each row execute procedure moddatetime (updated_at);
