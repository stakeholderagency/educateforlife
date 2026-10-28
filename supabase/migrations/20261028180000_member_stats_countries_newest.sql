-- Adds countries_count (distinct countries, ISO3 codes and names folded together)
-- and newest_member (latest joiner within 60 days; signed-in callers only).
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
    ),
    'countries_count', (
      SELECT count(DISTINCT code) FROM (
        SELECT COALESCE(m.code, upper(trim(c.country))) AS code
        FROM (
          SELECT location_country AS country FROM profiles WHERE onboarding_completed = true
          UNION ALL
          SELECT location_country FROM legacy_members
        ) c
        LEFT JOIN (VALUES
          ('albania','ALB'),('australia','AUS'),('belgium','BEL'),('belize','BLZ'),
          ('bosnia and herzegovina','BIH'),('brazil','BRA'),('canada','CAN'),
          ('colombia','COL'),('denmark','DNK'),('france','FRA'),('germany','DEU'),
          ('hungary','HUN'),('india','IND'),('italy','ITA'),('kenya','KEN'),
          ('mexico','MEX'),('morocco','MAR'),('norway','NOR'),('peru','PER'),
          ('romania','ROU'),('south africa','ZAF'),('spain','ESP'),('sweden','SWE'),
          ('united arab emirates','ARE'),('united kingdom','GBR'),('united states','USA')
        ) m(name, code) ON lower(trim(c.country)) = m.name
        WHERE trim(COALESCE(c.country, '')) <> ''
      ) x
    ),
    'newest_member', (
      CASE WHEN auth.uid() IS NULL THEN NULL ELSE (
        SELECT json_build_object('name', nm, 'joined_at', jd)
        FROM (
          SELECT COALESCE(NULLIF(trim(display_name), ''), NULLIF(trim(full_name), ''), NULLIF(trim(first_name), '')) AS nm,
                 COALESCE(join_date, created_at::date) AS jd, created_at AS ca
          FROM profiles WHERE onboarding_completed = true
          UNION ALL
          SELECT COALESCE(NULLIF(trim(display_name), ''), NULLIF(trim(first_name || ' ' || COALESCE(last_name, '')), '')),
                 COALESCE(join_date, created_at::date), created_at
          FROM legacy_members
        ) j
        WHERE nm IS NOT NULL AND jd >= current_date - 60
        ORDER BY jd DESC, ca DESC
        LIMIT 1
      ) END
    )
  )
$$;
