
-- Create prospects table
create table if not exists public.prospects (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  company text,
  linkedin_url text,
  email text,
  website text,
  niche text,
  status text not null default 'new'
    check (status in ('new','connected','messaged','replied','demo_booked','closed','not_interested')),
  source text check (source in ('linkedin','cold_email')),
  last_contacted_at timestamptz,
  followup_due_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.prospects enable row level security;

-- Policies
create policy "prospects_select_own"
on public.prospects for select
using (auth.uid() = owner_user_id);

create policy "prospects_insert_own"
on public.prospects for insert
with check (auth.uid() = owner_user_id);

create policy "prospects_update_own"
on public.prospects for update
using (auth.uid() = owner_user_id);

create policy "prospects_delete_own"
on public.prospects for delete
using (auth.uid() = owner_user_id);
