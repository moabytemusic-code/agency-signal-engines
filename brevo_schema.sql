
-- Create outbound_logs table
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

-- Enable RLS
alter table public.outbound_logs enable row level security;

-- Policies
create policy "outbound_logs_select_own"
on public.outbound_logs for select
using (auth.uid() = owner_user_id);

create policy "outbound_logs_insert_own"
on public.outbound_logs for insert
with check (auth.uid() = owner_user_id);
