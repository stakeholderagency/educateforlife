# CLAUDE.md — Educatefor.Life

Community-of-practice site for educatefor.life. Vite + React + Tailwind + shadcn/ui SPA on Vercel, Supabase backend.
Recreated 2026-10-28 from the Lovable project `96630f1e-46ba-4a76-9889-a6154b0b1cde`.

- Supabase project ref `xrqjoivtqxkrwwwkllgc` (eu-west-1). Old Lovable Cloud ref `vramcqvugmhbxeceruiy` (reachable only via the Lovable connector).
- Migrations in `supabase/migrations/` replay the Lovable history verbatim, plus `enable_pg_cron`. Apply with `supabase db push` (DB password in `.env.local`, gitignored).
- Env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (see `.env.example`). Types: `supabase gen types typescript --project-id xrqjoivtqxkrwwwkllgc > src/integrations/supabase/types.ts`.
- SPA routing: `vercel.json` rewrites everything except `/assets/` to `index.html`.
- Auth redirects use `window.location.origin`; add each deployed origin to Supabase Auth → URL Configuration.
- Privacy model: members see other members only through `public_profiles` / `public_legacy_members` (masked views); `legacy_members.email` is never readable by non-admins.
- Legacy member avatars are rehosted in the `avatars` bucket under `legacy/<id>.<ext>` (done 2026-10-28); no Mighty Networks URLs remain.

## Video rooms (Whereby Embedded)

Same Whereby account as Sprinthero (`stakeholder-agency.whereby.com`); pattern copied from `~/sprinthero` (`whereby.server.ts`, `TeamRoom.tsx`).

- **Townhall** `/townhall`: one unlocked group room for signed-in members (jump straight in); admins get the host link. **Team rooms** `/teams/:teamId/room`: one locked room per `community_teams` row; every team member (and admins) gets the host link so they can admit guests. Teams have no UI yet: admins add rows to `community_teams` / `community_team_members` for now.
- Rooms are made lazily by the `video-room` edge function on first use (`efl-` name prefix, ~5-year end date, `roomMode: group`). `video_rooms` / `video_room_hosts` are service-role only; the browser never reads a room URL except from that function. The host link (`?roomKey=`) is a credential: never log or return it to non-hosts.
- Needs the Supabase secret `WHEREBY_API_KEY` (`supabase secrets set`), and Whereby's **Allowed domains** must list `https://educatefor.life` and `https://www.educatefor.life` (a missing domain renders the room blank; previews can never work).
- The page shows nothing until the member presses Join, so the browser does not ask for camera/microphone on arrival. Errors come back as `code`; the client owns the wording.
- Not built: recording controls, scheduled sessions, who-is-in-the-room, an admin UI for teams.
