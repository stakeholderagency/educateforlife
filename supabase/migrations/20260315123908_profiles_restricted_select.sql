
-- Drop the blanket policy we just re-added
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

-- Restricted policies on profiles table
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Moderators can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'moderator'));

-- Make the view security definer (default) so it bypasses RLS on profiles.
-- This is intentional: the view excludes sensitive columns (phone, referrer_email)
-- and is the only way non-admin users can see other members' profiles.
ALTER VIEW public.public_profiles SET (security_invoker = off);
