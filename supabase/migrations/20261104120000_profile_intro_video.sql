-- Members can link a video that introduces them (hosted elsewhere: YouTube, Vimeo, ...).
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS intro_video_url text
  CHECK (intro_video_url IS NULL OR (intro_video_url ~* '^https://' AND length(intro_video_url) <= 500));

-- Re-emit the live public_profiles definition unchanged, with intro_video_url added at the end.
-- Keep security_invoker = true (CREATE OR REPLACE without WITH would reset it).
CREATE OR REPLACE VIEW public.public_profiles
WITH (security_invoker = true)
AS
SELECT id,
    user_id,
    CASE
        WHEN has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role) THEN display_name
        WHEN auth.uid() IS NOT NULL THEN display_name
        ELSE NULL::text
    END AS display_name,
    CASE
        WHEN has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role) THEN full_name
        WHEN auth.uid() IS NOT NULL THEN COALESCE(first_name, ''::text) ||
        CASE
            WHEN last_name IS NOT NULL AND last_name <> ''::text THEN (' '::text || "left"(last_name, 1)) || '.'::text
            ELSE ''::text
        END
        ELSE NULL::text
    END AS full_name,
    CASE
        WHEN auth.uid() IS NOT NULL THEN first_name
        ELSE NULL::text
    END AS first_name,
    CASE
        WHEN has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role) THEN last_name
        WHEN auth.uid() IS NOT NULL AND last_name IS NOT NULL AND last_name <> ''::text THEN "left"(last_name, 1) || '.'::text
        ELSE NULL::text
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
    updated_at,
    intro_video_url
   FROM profiles
  WHERE auth.uid() IS NOT NULL;
