
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT
  id,
  user_id,
  CASE
    WHEN public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator') THEN display_name
    WHEN auth.uid() IS NOT NULL THEN display_name
    ELSE NULL
  END AS display_name,
  CASE
    WHEN public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator') THEN full_name
    WHEN auth.uid() IS NOT NULL THEN
      COALESCE(first_name, '') ||
      CASE WHEN last_name IS NOT NULL AND last_name <> '' THEN ' ' || left(last_name, 1) || '.' ELSE '' END
    ELSE NULL
  END AS full_name,
  CASE
    WHEN auth.uid() IS NOT NULL THEN first_name
    ELSE NULL
  END AS first_name,
  CASE
    WHEN public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator') THEN last_name
    WHEN auth.uid() IS NOT NULL AND last_name IS NOT NULL AND last_name <> '' THEN left(last_name, 1) || '.'
    ELSE NULL
  END AS last_name,
  headline,
  bio,
  avatar_url,
  location_city,
  location_country,
  member_type,
  onboarding_completed,
  join_date,
  referral_count,
  timezone,
  languages,
  skills,
  mission_statement,
  looking_for,
  offering,
  linkedin_url,
  website_url,
  created_at,
  updated_at
FROM profiles
WHERE auth.uid() IS NOT NULL;

CREATE OR REPLACE VIEW public.public_legacy_members AS
SELECT
  id,
  CASE
    WHEN auth.uid() IS NOT NULL THEN first_name
    ELSE NULL
  END AS first_name,
  CASE
    WHEN public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator') THEN last_name
    WHEN auth.uid() IS NOT NULL AND last_name IS NOT NULL AND last_name <> '' THEN left(last_name, 1) || '.'
    ELSE NULL
  END AS last_name,
  CASE
    WHEN public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator') THEN display_name
    WHEN auth.uid() IS NOT NULL THEN display_name
    ELSE NULL
  END AS display_name,
  headline,
  bio,
  avatar_url,
  location_city,
  location_country,
  member_type,
  join_date,
  referral_count,
  referrer_name,
  created_at
FROM legacy_members
WHERE auth.uid() IS NOT NULL;
