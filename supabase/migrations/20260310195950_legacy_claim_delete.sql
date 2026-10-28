
-- Allow authenticated users to delete a legacy member record matching their email (for claiming)
CREATE POLICY "Users can delete legacy member matching their email"
  ON public.legacy_members FOR DELETE
  TO authenticated
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));
