
-- 1) Lock audit fields on profiles for non-admin updates
CREATE OR REPLACE FUNCTION public.protect_profile_audit_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    NEW.referral_count := OLD.referral_count;
    NEW.join_date := OLD.join_date;
    NEW.referrer_email := OLD.referrer_email;
    NEW.referrer_name := OLD.referrer_name;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profile_audit_fields_trg ON public.profiles;
CREATE TRIGGER protect_profile_audit_fields_trg
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_audit_fields();

-- 2) Restrict has_role so callers can only check their own role (admins can check anyone)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller uuid := auth.uid();
BEGIN
  -- Allow self-checks; admins may check anyone; otherwise deny
  IF caller IS NOT NULL
     AND _user_id <> caller
     AND NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = caller AND role = 'admin'::app_role)
  THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  );
END;
$$;
