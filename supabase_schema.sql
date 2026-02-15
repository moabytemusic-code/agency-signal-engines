-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Subscriptions Table
create table if not exists public.subscriptions (
  user_id uuid references auth.users not null primary key,
  plan text not null default 'FREE' check (plan in ('FREE', 'STARTER', 'GROWTH', 'WHITELABEL')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.subscriptions enable row level security;
-- Policy: Service role bypasses RLS, but if we want dashboard to read it via server client (user context):
create policy "Users can view own subscription" on public.subscriptions for select using (auth.uid() = user_id);

-- Usage Monthly Table (V2 to fix schema cache issue)
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
alter table public.usage_monthly_v2 enable row level security;
create policy "Users can view own usage v2" on public.usage_monthly_v2 for select using (auth.uid() = user_id);

-- Trigger to create FREE subscription on signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.subscriptions (user_id, plan)
  values (new.id, 'FREE');
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to avoid error on recreation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
