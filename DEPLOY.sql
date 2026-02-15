-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. SUBSCRIPTIONS TABLE (Base)
create table if not exists public.subscriptions (
  user_id uuid references auth.users not null primary key,
  plan text not null default 'FREE',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
alter table public.subscriptions enable row level security;
create policy "Users can view own subscription" on public.subscriptions for select using (auth.uid() = user_id);

-- 3. STRIPE COLUMNS (Migration)
alter table public.subscriptions
add column if not exists stripe_customer_id text,
add column if not exists stripe_subscription_id text,
add column if not exists stripe_status text,
add column if not exists stripe_price_id text,
add column if not exists current_period_end timestamptz;

create index if not exists idx_subs_stripe_cust_id on public.subscriptions(stripe_customer_id);

-- 4. USAGE MONTHLY V2 (Fix for schema cache)
create table if not exists public.usage_monthly_v2 (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  period text not null,
  profit int default 0,
  script int default 0,
  seo int default 0,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique (user_id, period)
);
alter table public.usage_monthly_v2 enable row level security;
create policy "Users can view own usage v2" on public.usage_monthly_v2 for select using (auth.uid() = user_id);

-- 5. RPC FUNCTION (Atomic Increment)
create or replace function increment_usage_monthly(
  p_user_id uuid,
  p_period text,
  p_module text
)
returns void
language plpgsql
security definer
as $$
begin
  update public.usage_monthly_v2
  set 
    profit = case when p_module = 'profit' then profit + 1 else profit end,
    script = case when p_module = 'script' then script + 1 else script end,
    seo = case when p_module = 'seo' then seo + 1 else seo end
  where user_id = p_user_id and period = p_period;
end;
$$;

-- 6. STRIPE EVENTS (Idempotency)
create table if not exists public.stripe_events (
  event_id text primary key,
  type text not null,
  created_at timestamptz default now() not null
);
alter table public.stripe_events enable row level security;

-- 7. TRIGGER FOR NEW USERS
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.subscriptions (user_id, plan)
  values (new.id, 'FREE')
  on conflict (user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Re-create trigger safely
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
