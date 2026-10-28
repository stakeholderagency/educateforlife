-- Video rooms (Whereby Embedded): the members' Townhall and one room per
-- community team. Teams are new here and are created by admins for now; the
-- rooms are made lazily by the `video-room` edge function on first use.

CREATE TABLE public.community_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  kind text NOT NULL DEFAULT 'team',        -- e.g. 'sprint', 'workgroup'
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.community_team_members (
  team_id uuid NOT NULL REFERENCES public.community_teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'lead')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (team_id, user_id)
);
CREATE INDEX community_team_members_user_idx ON public.community_team_members (user_id);

CREATE OR REPLACE FUNCTION public.is_community_team_member(_team_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.community_team_members WHERE team_id = _team_id AND user_id = _user_id)
$$;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_teams, public.community_team_members TO authenticated;
GRANT ALL ON public.community_teams, public.community_team_members TO service_role;
ALTER TABLE public.community_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members see their teams" ON public.community_teams FOR SELECT TO authenticated
  USING (public.is_community_team_member(id, auth.uid()) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage teams" ON public.community_teams FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Members see their team's roster" ON public.community_team_members FOR SELECT TO authenticated
  USING (public.is_community_team_member(team_id, auth.uid()) OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage team members" ON public.community_team_members FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- One Whereby room per team, plus the single Townhall room. Never readable
-- from the browser: the edge function checks who may enter and hands out the URL.
CREATE TABLE public.video_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN ('townhall', 'team')),
  team_id uuid UNIQUE REFERENCES public.community_teams(id) ON DELETE CASCADE,
  whereby_meeting_id text NOT NULL,
  room_url text NOT NULL,
  -- Whereby rooms always have an end date and are removed shortly after it.
  ends_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((kind = 'townhall' AND team_id IS NULL) OR (kind = 'team' AND team_id IS NOT NULL))
);
CREATE UNIQUE INDEX video_rooms_one_townhall ON public.video_rooms ((kind)) WHERE kind = 'townhall';

-- The host link carries ?roomKey= and is a credential (enter locked rooms,
-- admit and remove people, record). Service role only.
CREATE TABLE public.video_room_hosts (
  room_id uuid PRIMARY KEY REFERENCES public.video_rooms(id) ON DELETE CASCADE,
  host_room_url text NOT NULL
);

REVOKE ALL ON public.video_rooms, public.video_room_hosts FROM anon, authenticated;
GRANT ALL ON public.video_rooms, public.video_room_hosts TO service_role;
ALTER TABLE public.video_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_room_hosts ENABLE ROW LEVEL SECURITY;
