
-- Re-add the blanket SELECT policy (the view handles column filtering)
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Drop the more specific policies since the blanket one covers them
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Moderators can view all profiles" ON public.profiles;
