-- Force schema cache reload
NOTIFY pgrst, 'reload schema';

-- Ensure period column exists (idempotent)
ALTER TABLE public.usage_monthly 
ADD COLUMN IF NOT EXISTS period text not null default '2025-01'; 
-- (Default to avoid error on existing rows if any, though we assume empty)

-- Verify unique constraint
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'usage_monthly_user_id_period_key') THEN
        ALTER TABLE public.usage_monthly ADD CONSTRAINT usage_monthly_user_id_period_key UNIQUE (user_id, period);
    END IF;
END $$;
