CREATE TABLE public.legacy_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text,
  last_name text,
  location_city text,
  location_country text,
  referral_count integer NOT NULL DEFAULT 0,
  email text,
  bio text,
  join_date date,
  referrer_email text,
  referrer_name text,
  display_name text,
  avatar_url text,
  headline text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.legacy_members ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view legacy members in the directory
CREATE POLICY "Legacy members are viewable by authenticated users"
  ON public.legacy_members FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can manage legacy members
CREATE POLICY "Admins can manage legacy members"
  ON public.legacy_members FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
