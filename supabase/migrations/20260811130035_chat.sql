CREATE TABLE public.chat_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_rooms TO authenticated;
GRANT ALL ON public.chat_rooms TO service_role;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated members can view chat rooms"
  ON public.chat_rooms FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage chat rooms"
  ON public.chat_rooms FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX chat_messages_room_created_idx ON public.chat_messages (room_id, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated members can read chat messages"
  ON public.chat_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Members can post their own chat messages"
  ON public.chat_messages FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND length(btrim(body)) BETWEEN 1 AND 2000);
CREATE POLICY "Members can delete their own chat messages"
  ON public.chat_messages FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can delete any chat message"
  ON public.chat_messages FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

INSERT INTO public.chat_rooms (slug, name, description, icon, sort_order) VALUES
  ('general', 'General', 'Open conversation for the whole community', 'MessagesSquare', 1),
  ('projects', 'Projects', 'Share progress and ask for help on your projects', 'Rocket', 2),
  ('events', 'Events', 'Meetups, gatherings and community calls', 'CalendarDays', 3),
  ('skills', 'Skills & Learning', 'Swap knowledge, resources and skills', 'GraduationCap', 4),
  ('ideas', 'Ideas', 'Half-formed thoughts welcome', 'Lightbulb', 5);

CREATE OR REPLACE FUNCTION public.purge_old_chat_messages()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.chat_messages WHERE created_at < now() - interval '30 days';
$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule(
      'purge-old-chat-messages',
      '17 3 * * *',
      $cron$SELECT public.purge_old_chat_messages();$cron$
    );
  END IF;
END $$;
