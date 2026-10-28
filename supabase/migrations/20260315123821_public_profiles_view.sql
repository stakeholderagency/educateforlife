
-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;

-- Users can view their own profile (full access including sensitive fields)
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can view all profiles (full access)
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Moderators can view all profiles (full access)
CREATE POLICY "Moderators can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'moderator'));

-- Create a public view excluding sensitive columns for member listings
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT
  id, user_id, display_name, full_name, first_name, last_name,
  headline, bio, avatar_url, location_city, location_country,
  member_type, onboarding_completed, join_date, referral_count,
  timezone, languages, skills, mission_statement, looking_for,
  offering, linkedin_url, website_url, created_at, updated_at
FROM public.profiles;

-- Grant access to the view for authenticated users
GRANT SELECT ON public.public_profiles TO authenticated;
GRANT SELECT ON public.public_profiles TO anon;
