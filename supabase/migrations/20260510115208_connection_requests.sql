
CREATE TYPE public.connection_request_status AS ENUM ('pending', 'accepted', 'declined');

CREATE TABLE public.connection_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID NOT NULL,
  to_user_id UUID,
  to_legacy_id UUID REFERENCES public.legacy_members(id) ON DELETE CASCADE,
  message TEXT,
  status public.connection_request_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT one_recipient CHECK (
    (to_user_id IS NOT NULL AND to_legacy_id IS NULL)
    OR (to_user_id IS NULL AND to_legacy_id IS NOT NULL)
  ),
  CONSTRAINT not_self CHECK (to_user_id IS NULL OR to_user_id <> from_user_id)
);

CREATE INDEX connection_requests_from_idx ON public.connection_requests(from_user_id);
CREATE INDEX connection_requests_to_user_idx ON public.connection_requests(to_user_id);
CREATE INDEX connection_requests_to_legacy_idx ON public.connection_requests(to_legacy_id);

-- Prevent spamming the same recipient with multiple pending requests
CREATE UNIQUE INDEX connection_requests_unique_pending_user
  ON public.connection_requests(from_user_id, to_user_id)
  WHERE to_user_id IS NOT NULL AND status = 'pending';
CREATE UNIQUE INDEX connection_requests_unique_pending_legacy
  ON public.connection_requests(from_user_id, to_legacy_id)
  WHERE to_legacy_id IS NOT NULL AND status = 'pending';

ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Senders can view their requests"
  ON public.connection_requests FOR SELECT TO authenticated
  USING (from_user_id = auth.uid());

CREATE POLICY "Recipients can view requests sent to them"
  ON public.connection_requests FOR SELECT TO authenticated
  USING (to_user_id = auth.uid());

CREATE POLICY "Admins can view all requests"
  ON public.connection_requests FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Members can create requests as themselves"
  ON public.connection_requests FOR INSERT TO authenticated
  WITH CHECK (from_user_id = auth.uid());

CREATE POLICY "Recipients can update status of received requests"
  ON public.connection_requests FOR UPDATE TO authenticated
  USING (to_user_id = auth.uid())
  WITH CHECK (to_user_id = auth.uid());

CREATE POLICY "Senders can delete their pending requests"
  ON public.connection_requests FOR DELETE TO authenticated
  USING (from_user_id = auth.uid());

CREATE POLICY "Admins can manage all requests"
  ON public.connection_requests FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_connection_requests_updated_at
  BEFORE UPDATE ON public.connection_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
