
-- 1. Add column to usage_monthly_v2
alter table public.usage_monthly_v2
add column if not exists outbound_email_used int not null default 0;

-- 2. Update increment function
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
  -- Ensure row exists (UPSERT pattern)
  insert into public.usage_monthly_v2 (user_id, period, profit, script, seo, outbound_email_used)
  values (p_user_id, p_period, 0, 0, 0, 0)
  on conflict (user_id, period) do nothing;

  -- Increment the specific module
  update public.usage_monthly_v2
  set 
    profit = case when p_module = 'profit' then profit + 1 else profit end,
    script = case when p_module = 'script' then script + 1 else script end,
    seo = case when p_module = 'seo' then seo + 1 else seo end,
    outbound_email_used = case when p_module = 'outbound_email' then outbound_email_used + 1 else outbound_email_used end
  where user_id = p_user_id and period = p_period;
end;
$$;
