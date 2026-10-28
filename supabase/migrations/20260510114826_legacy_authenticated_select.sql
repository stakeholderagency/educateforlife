
-- Allow authenticated members to view legacy member rows.
-- Column-level privacy is enforced by the public_legacy_members view.
CREATE POLICY "Authenticated can view legacy members"
  ON public.legacy_members FOR SELECT
  TO authenticated
  USING (true);
