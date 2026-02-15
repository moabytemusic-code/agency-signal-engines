-- Create stripe_events table for idempotency
create table if not exists public.stripe_events (
  event_id text primary key,
  type text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for faster lookups
create index if not exists idx_stripe_events_type on public.stripe_events(type);

-- Enable RLS (Service role access only effectively)
alter table public.stripe_events enable row level security;
