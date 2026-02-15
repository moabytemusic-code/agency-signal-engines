
-- Add display_name to profiles (Minimal safe script)

-- 1. Add column if missing
alter table public.profiles
add column if not exists display_name text;

-- 2. Set default display_name to 'Ken' for existing users
update public.profiles
set display_name = 'Ken'
where display_name is null;

-- 3. Just in case RLS is blocking updates (though service role bypasses, SQL editor bypasses)
-- We don't touch policies here to avoid errors if columns differ.
-- The app logic will handle reading/writing if column exists.
