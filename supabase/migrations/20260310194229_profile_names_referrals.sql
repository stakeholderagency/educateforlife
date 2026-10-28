
ALTER TABLE public.profiles
  ADD COLUMN first_name text,
  ADD COLUMN last_name text,
  ADD COLUMN join_date date DEFAULT CURRENT_DATE,
  ADD COLUMN referrer_name text,
  ADD COLUMN referrer_email text,
  ADD COLUMN referral_count integer NOT NULL DEFAULT 0;

-- Backfill join_date for existing profiles
UPDATE public.profiles SET join_date = created_at::date WHERE join_date IS NULL;
