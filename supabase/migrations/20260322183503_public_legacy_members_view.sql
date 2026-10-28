-- Create a public view for legacy_members that excludes sensitive fields
CREATE VIEW public.public_legacy_members
WITH (security_invoker = true)
AS
SELECT id, first_name, last_name, display_name, headline, bio,
       avatar_url, location_city, location_country, member_type,
       join_date, referral_count, referrer_name, created_at
FROM public.legacy_members;

-- Grant access to authenticated users only
GRANT SELECT ON public.public_legacy_members TO authenticated;

-- Drop the overly broad SELECT policy
DROP POLICY IF EXISTS "Legacy members are viewable by authenticated users" ON public.legacy_members;

-- Add a policy allowing users to view only their own legacy record (matched by email)
CREATE POLICY "Users can view their own legacy record"
ON public.legacy_members
FOR SELECT
TO authenticated
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));
