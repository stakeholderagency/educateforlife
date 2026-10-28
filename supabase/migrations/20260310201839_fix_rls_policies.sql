
-- Fix legacy_members: drop restrictive SELECT and recreate as permissive
DROP POLICY IF EXISTS "Legacy members are viewable by authenticated users" ON public.legacy_members;
CREATE POLICY "Legacy members are viewable by authenticated users"
  ON public.legacy_members FOR SELECT
  TO authenticated
  USING (true);

-- Fix profiles: drop restrictive SELECT and recreate as permissive
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Fix profiles INSERT
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Fix profiles UPDATE
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);
