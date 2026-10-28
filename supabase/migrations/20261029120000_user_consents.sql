-- Records what each member agreed to and when. The Code of Conduct is accepted
-- with the sign-up tick-box; the sign-up trigger writes the row, so the date is
-- the server's and it works whether or not the sign-up returns a session.

CREATE TABLE public.user_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type text NOT NULL,              -- e.g. 'code_of_conduct'
  version text NOT NULL,                   -- the text agreed to, e.g. 'v1.0'
  accepted_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, consent_type, version)
);
CREATE INDEX user_consents_user_idx ON public.user_consents (user_id);

GRANT SELECT ON public.user_consents TO authenticated;
GRANT ALL ON public.user_consents TO service_role;
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members read their own consents" ON public.user_consents FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'member');
  IF COALESCE(NEW.raw_user_meta_data ->> 'coc_accepted', '') = 'true' THEN
    INSERT INTO public.user_consents (user_id, consent_type, version)
    VALUES (NEW.id, 'code_of_conduct', COALESCE(NULLIF(NEW.raw_user_meta_data ->> 'coc_version', ''), 'v1.0'))
    ON CONFLICT (user_id, consent_type, version) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
