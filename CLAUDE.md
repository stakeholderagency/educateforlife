# CLAUDE.md — Educatefor.Life

Community-of-practice site for educatefor.life. Vite + React + Tailwind + shadcn/ui SPA on Vercel, Supabase backend.
Recreated 2026-10-28 from the Lovable project `96630f1e-46ba-4a76-9889-a6154b0b1cde`.

- Supabase project ref `xrqjoivtqxkrwwwkllgc` (eu-west-1). Old Lovable Cloud ref `vramcqvugmhbxeceruiy` (reachable only via the Lovable connector).
- Migrations in `supabase/migrations/` replay the Lovable history verbatim, plus `enable_pg_cron`. Apply with `supabase db push` (DB password in `.env.local`, gitignored).
- Env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (see `.env.example`). Types: `supabase gen types typescript --project-id xrqjoivtqxkrwwwkllgc > src/integrations/supabase/types.ts`.
- SPA routing: `vercel.json` rewrites everything except `/assets/` to `index.html`.
- Auth redirects use `window.location.origin`; add each deployed origin to Supabase Auth → URL Configuration.
- Privacy model: members see other members only through `public_profiles` / `public_legacy_members` (masked views); `legacy_members.email` is never readable by non-admins.
- Legacy member avatars still point at Mighty Networks' imgix host; rehost them before that account is closed.
