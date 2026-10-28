// Hands a signed-in member the Whereby room they may enter: the Townhall or
// their team's room. Creates the room at Whereby on first use. The API key and
// every host link stay on the server; nothing here is ever logged.
//
//   POST { "room": "townhall" }  or  { "team_id": "<uuid>" }
//   200  { roomUrl, host, name }
//   4xx  { error, code }  code: not_authenticated | forbidden | not_found |
//                               not_configured | whereby_error | bad_request

import { createClient } from "npm:@supabase/supabase-js@2";

const WHEREBY_API = "https://api.whereby.dev/v1";
const ROOM_LIFETIME_DAYS = 5 * 365; // rooms need an end date; the existing EFL room used ~5 years
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });
const fail = (status: number, code: string, error: string) => json(status, { error, code });

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Meeting = { meetingId: string; roomUrl: string; hostRoomUrl: string; endDate: string };

async function whereby(path: string, init: RequestInit): Promise<Response> {
  const key = Deno.env.get("WHEREBY_API_KEY");
  if (!key) throw new Error("not_configured");
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 10_000);
  try {
    return await fetch(`${WHEREBY_API}${path}`, {
      ...init,
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      signal: ctl.signal,
    });
  } finally {
    clearTimeout(t);
  }
}

async function createMeeting(locked: boolean): Promise<Meeting> {
  const res = await whereby("/meetings", {
    method: "POST",
    body: JSON.stringify({
      endDate: new Date(Date.now() + ROOM_LIFETIME_DAYS * 86_400_000).toISOString(),
      roomMode: "group",
      isLocked: locked,
      roomNamePrefix: "efl",
      fields: ["hostRoomUrl"],
    }),
  });
  if (!res.ok) throw new Error(`whereby_${res.status}`);
  return await res.json() as Meeting;
}

async function deleteMeeting(id: string) {
  await whereby(`/meetings/${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => undefined);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return fail(405, "bad_request", "POST only");

  const url = Deno.env.get("SUPABASE_URL")!;
  const authHeader = req.headers.get("Authorization") ?? "";
  const caller = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });
  const { data: u } = await caller.auth.getUser();
  const userId = u?.user?.id;
  if (!userId) return fail(401, "not_authenticated", "Sign in first");

  let input: { room?: string; team_id?: string };
  try { input = await req.json(); } catch { return fail(400, "bad_request", "Invalid JSON"); }

  const db = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: adminRole } = await db.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  const isAdmin = Boolean(adminRole);

  // Who may enter, and as what.
  let kind: "townhall" | "team";
  let teamId: string | null = null;
  let name: string;
  let host: boolean;
  if (input.room === "townhall") {
    kind = "townhall";
    name = "Townhall";
    host = isAdmin; // members drop in as participants; admins can admit, remove and record
  } else if (input.team_id && UUID.test(input.team_id)) {
    kind = "team";
    teamId = input.team_id;
    const [{ data: team }, { data: membership }] = await Promise.all([
      db.from("community_teams").select("name,archived_at").eq("id", teamId).maybeSingle(),
      db.from("community_team_members").select("role").eq("team_id", teamId).eq("user_id", userId).maybeSingle(),
    ]);
    if (!team) return fail(404, "not_found", "Team not found");
    if (!membership && !isAdmin) return fail(403, "forbidden", "Not on this team");
    name = team.name;
    // Team rooms are locked: team members enter with the host link, so they can
    // admit guests; anyone else cannot get in at all.
    host = true;
  } else {
    return fail(400, "bad_request", "Say which room");
  }

  const find = () => {
    const q = db.from("video_rooms").select("id,room_url").eq("kind", kind);
    return (teamId ? q.eq("team_id", teamId) : q).maybeSingle();
  };

  let { data: room } = await find();
  if (!room) {
    let meeting: Meeting;
    try {
      meeting = await createMeeting(kind === "team");
    } catch (e) {
      const code = (e as Error).message === "not_configured" ? "not_configured" : "whereby_error";
      console.error("video-room: could not create room:", (e as Error).message);
      return fail(code === "not_configured" ? 503 : 502, code, "The video room is not available yet");
    }
    const { data: inserted, error } = await db.from("video_rooms").insert({
      kind, team_id: teamId, whereby_meeting_id: meeting.meetingId, room_url: meeting.roomUrl, ends_at: meeting.endDate,
    }).select("id,room_url").single();
    if (error) {
      // Lost a race with a parallel first visit: use theirs, drop ours.
      await deleteMeeting(meeting.meetingId);
      ({ data: room } = await find());
      if (!room) return fail(500, "whereby_error", "Room could not be saved");
    } else {
      room = inserted;
      await db.from("video_room_hosts").insert({ room_id: inserted.id, host_room_url: meeting.hostRoomUrl });
    }
  }

  let roomUrl = room.room_url as string;
  if (host) {
    const { data: h } = await db.from("video_room_hosts").select("host_room_url").eq("room_id", room.id).maybeSingle();
    if (h?.host_room_url) roomUrl = h.host_room_url;
    else if (kind === "team") return fail(500, "whereby_error", "Host link missing for this room");
  }
  return json(200, { roomUrl, host, name });
});
