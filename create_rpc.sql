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
