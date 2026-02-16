
-- OUTBOUND_PROFILE_V2.sql
-- Run this in Supabase SQL Editor

-- 1. Add profile fields (safe, idempotent)
alter table public.profiles
add column if not exists display_name text,
add column if not exists company_name text,
add column if not exists primary_platform text; -- 'META', 'GOOGLE', 'TIKTOK', 'MIXED'

-- 2. Backfill existing users with sane defaults
update public.profiles
set display_name = coalesce(display_name, 'User'),
    company_name = coalesce(company_name, 'Your Agency'),
    primary_platform = coalesce(primary_platform, 'MIXED')
where display_name is null 
   or company_name is null 
   or primary_platform is null;
