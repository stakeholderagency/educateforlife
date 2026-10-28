DELETE FROM public.legacy_members WHERE lower(email) IN (SELECT lower(email) FROM public.legacy_members GROUP BY lower(email) HAVING count(*) > 1);
