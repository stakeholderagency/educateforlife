-- Explicit deny: only admins can insert/update/delete roles
-- RLS defaults to deny; handle_new_user (SECURITY DEFINER) is the only non-admin insert path.
SELECT 1;
