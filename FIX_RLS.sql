
-- FIX_RLS.sql
-- Run this in Supabase SQL Editor to fix "new row violates row-level security policy"

-- 1. Enable RLS (just in case)
alter table public.profiles enable row level security;

-- 2. Create INSERT policy
-- This allows a user to insert a row IF the user_id column matches their auth uid.
create policy "Users can insert their own profile"
on public.profiles
for insert
with check ( auth.uid() = user_id );

-- 3. Create UPDATE policy (if not exists)
drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles
for update
using ( auth.uid() = user_id );

-- 4. Create SELECT policy (if not exists)
drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
on public.profiles
for select
using ( auth.uid() = user_id );

-- 5. Grant usage to authenticated role
grant all on public.profiles to authenticated;
grant all on public.profiles to service_role;
