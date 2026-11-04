-- Members see each other only through the masked views, never the base tables.
-- The views run as their owner so they can show every member's masked row;
-- the masking and `WHERE auth.uid() IS NOT NULL` inside them are the protection,
-- and anon has no SELECT on either view.
ALTER VIEW public.public_profiles SET (security_invoker = off);
ALTER VIEW public.public_legacy_members SET (security_invoker = off);

-- This policy opened every legacy row (email, full last name, referrer_email)
-- to any signed-in account. Admins keep "Admins can manage legacy members";
-- a member claiming their old record keeps "Users can view their own legacy record".
DROP POLICY IF EXISTS "Authenticated can view legacy members" ON public.legacy_members;

-- The own-record policies read auth.users, which `authenticated` cannot select,
-- so with the blanket policy gone every member query on legacy_members failed.
-- Match on the email in the caller's JWT instead.
DROP POLICY IF EXISTS "Users can view their own legacy record" ON public.legacy_members;
CREATE POLICY "Users can view their own legacy record"
  ON public.legacy_members FOR SELECT TO authenticated
  USING (lower(email) = lower(auth.jwt() ->> 'email'));

DROP POLICY IF EXISTS "Users can delete legacy member matching their email" ON public.legacy_members;
CREATE POLICY "Users can delete legacy member matching their email"
  ON public.legacy_members FOR DELETE TO authenticated
  USING (lower(email) = lower(auth.jwt() ->> 'email'));

REVOKE SELECT ON public.public_profiles FROM anon;
REVOKE SELECT ON public.public_legacy_members FROM anon;
