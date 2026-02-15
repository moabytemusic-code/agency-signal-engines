-- Add Stripe tracking columns to subscriptions table
alter table public.subscriptions
add column if not exists stripe_customer_id text,
add column if not exists stripe_subscription_id text,
add column if not exists stripe_status text,
add column if not exists stripe_price_id text,
add column if not exists current_period_end timestamp with time zone;

-- Index for faster webhook lookups (optional)
create index if not exists idx_subs_stripe_cust_id on public.subscriptions(stripe_customer_id);
create index if not exists idx_subs_stripe_sub_id on public.subscriptions(stripe_subscription_id);
