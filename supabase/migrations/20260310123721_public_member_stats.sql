
-- Public function to get member locations and count (no auth required)
CREATE OR REPLACE FUNCTION public.get_public_member_stats()
RETURNS json
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT json_build_object(
    'total_count', (SELECT count(*) FROM profiles WHERE onboarding_completed = true),
    'locations', (
      SELECT json_agg(json_build_object(
        'city', location_city,
        'country', location_country
      ))
      FROM profiles
      WHERE onboarding_completed = true
        AND (location_city IS NOT NULL OR location_country IS NOT NULL)
    ),
    'type_counts', (
      SELECT json_object_agg(member_type, cnt)
      FROM (
        SELECT member_type, count(*) as cnt
        FROM profiles
        WHERE onboarding_completed = true AND member_type IS NOT NULL
        GROUP BY member_type
      ) t
    )
  )
$$;
