-- Create new table V2
create table if not exists public.usage_monthly_v2 (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  period text not null, -- Format 'YYYY-MM'
  profit int default 0,
  script int default 0,
  seo int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, period)
);

-- Enable RLS
alter table public.usage_monthly_v2 enable row level security;
create policy "Users can view own usage v2" on public.usage_monthly_v2 for select using (auth.uid() = user_id);

-- Clean up old table (optional but good idea to prevent confusion)
-- drop table if exists public.usage_monthly;
