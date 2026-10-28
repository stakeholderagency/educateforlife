
CREATE OR REPLACE FUNCTION public.get_public_member_stats()
 RETURNS json
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  SELECT json_build_object(
    'total_count', (
      (SELECT count(*) FROM profiles WHERE onboarding_completed = true)
      + (SELECT count(*) FROM legacy_members)
    ),
    'locations', (
      SELECT json_agg(loc) FROM (
        SELECT json_build_object('city', location_city, 'country', location_country) as loc
        FROM profiles
        WHERE onboarding_completed = true
          AND (location_city IS NOT NULL OR location_country IS NOT NULL)
        UNION ALL
        SELECT json_build_object('city', location_city, 'country', location_country) as loc
        FROM legacy_members
        WHERE location_city IS NOT NULL OR location_country IS NOT NULL
      ) all_locations
    ),
    'type_counts', (
      SELECT json_object_agg(mt, cnt)
      FROM (
        SELECT mt, sum(c) as cnt FROM (
          SELECT unnest(member_type) as mt, count(*) as c
          FROM profiles
          WHERE onboarding_completed = true AND member_type IS NOT NULL
          GROUP BY mt
          UNION ALL
          SELECT unnest(member_type) as mt, count(*) as c
          FROM legacy_members
          WHERE member_type IS NOT NULL
          GROUP BY mt
        ) combined
        GROUP BY mt
      ) t
    )
  )
$$;
