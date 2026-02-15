
-- 1. Create prospects table
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

-- Enable RLS for prospects
alter table public.prospects enable row level security;

-- Policies for prospects
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

-- 2. Create outbound_logs table
create table if not exists public.outbound_logs (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.prospects(id) on delete cascade,
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('email_initial','email_followup')),
  subject text not null,
  body text not null,
  brevo_message_id text,
  sent_at timestamptz not null default now()
);

-- Enable RLS for logs
alter table public.outbound_logs enable row level security;

-- Policies for logs
create policy "outbound_logs_select_own"
on public.outbound_logs for select
using (auth.uid() = owner_user_id);

create policy "outbound_logs_insert_own"
on public.outbound_logs for insert
with check (auth.uid() = owner_user_id);
