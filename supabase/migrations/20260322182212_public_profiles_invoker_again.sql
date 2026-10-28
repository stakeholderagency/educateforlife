-- Recreate view with security_invoker = true so RLS on profiles is enforced
CREATE OR REPLACE VIEW public.public_profiles
WITH (security_invoker = true)
AS
SELECT id, user_id, display_name, full_name, first_name, last_name,
       headline, bio, avatar_url, location_city, location_country,
       member_type, onboarding_completed, join_date, referral_count,
       timezone, languages, skills, mission_statement, looking_for,
       offering, linkedin_url, website_url, created_at, updated_at
FROM profiles;

-- Revoke anon access
REVOKE SELECT ON public.public_profiles FROM anon;

-- Ensure authenticated access remains
GRANT SELECT ON public.public_profiles TO authenticated;
