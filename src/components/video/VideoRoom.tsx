import { createElement, useEffect, useState } from 'react';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { Loader2, PhoneOff, Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

type RoomTarget = { room: 'townhall' } | { team_id: string };

type Problem = 'not_configured' | 'forbidden' | 'not_found' | 'unavailable';

const PROBLEM_TEXT: Record<Problem, string> = {
  not_configured: 'The video room is not switched on yet. Please check back soon.',
  forbidden: 'You are not on this team, so you cannot enter its room.',
  not_found: 'We could not find this room.',
  unavailable: 'The video room could not be opened. Please try again in a moment.',
};

/** The function answers with a machine-readable code; the wording is ours. */
async function problemFrom(error: unknown): Promise<Problem> {
  if (error instanceof FunctionsHttpError) {
    try {
      const body = await error.context.json();
      if (body?.code === 'not_configured' || body?.code === 'forbidden' || body?.code === 'not_found') return body.code;
    } catch { /* fall through */ }
  }
  return 'unavailable';
}

/** "First L." like the chat, falling back to the display name. */
const nameInRoom = (p: { first_name?: string | null; last_name?: string | null; display_name?: string | null } | null) => {
  if (p?.first_name) return `${p.first_name}${p.last_name ? ` ${p.last_name[0]}.` : ''}`;
  return p?.display_name || 'Community member';
};

/**
 * A Whereby room inside the page, for signed-in members. Nothing starts until
 * the member presses the button, so the browser does not ask for camera and
 * microphone on arrival. The room link comes from the `video-room` function,
 * which checks who may enter; it never reaches the address bar.
 */
const VideoRoom = ({ target, joinLabel = 'Join the call' }: { target: RoomTarget; joinLabel?: string }) => {
  const { profile } = useAuth();
  const [state, setState] = useState<'idle' | 'loading' | 'live'>('idle');
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);
  const targetKey = JSON.stringify(target);

  // Leaving one room for another (or the page) ends the call.
  useEffect(() => () => { setState('idle'); setRoomUrl(null); }, [targetKey]);

  const join = async () => {
    setProblem(null);
    setState('loading');
    try {
      const [{ data, error }] = await Promise.all([
        supabase.functions.invoke('video-room', { body: target }),
        // <whereby-embed> registers itself on import and needs the browser.
        import('@whereby.com/browser-sdk/embed'),
      ]);
      if (error || !data?.roomUrl) {
        setProblem(await problemFrom(error));
        setState('idle');
        return;
      }
      setRoomUrl(data.roomUrl);
      setState('live');
    } catch {
      setProblem('unavailable');
      setState('idle');
    }
  };

  const leave = () => { setState('idle'); setRoomUrl(null); };

  if (state === 'live' && roomUrl) {
    return (
      <div className="space-y-3">
        <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-card" style={{ height: 'min(75vh, 700px)' }}>
          {createElement('whereby-embed', {
            room: roomUrl,
            displayName: nameInRoom(profile),
            logo: 'off',
            background: 'off',
            chat: 'on',
            people: 'on',
            screenshare: 'on',
            leaveButton: 'on',
            style: { display: 'block', position: 'absolute', inset: 0 },
            ref: (el: HTMLElement | null) => {
              if (!el) return;
              el.addEventListener('leave', leave, { once: true });
              el.addEventListener('meeting_end', leave, { once: true });
            },
          })}
        </div>
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={leave} className="gap-2">
            <PhoneOff className="h-4 w-4" /> Leave
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-8 md:p-12 text-center glow-border">
      <Video className="mx-auto mb-4 h-10 w-10 text-primary" />
      <Button variant="hero" size="lg" onClick={join} disabled={state === 'loading'} className="gap-2">
        {state === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
        {state === 'loading' ? 'Opening the room…' : joinLabel}
      </Button>
      <p className="mt-4 text-sm text-muted-foreground">
        Your browser will ask to use your camera and microphone. You can switch both off inside the call.
      </p>
      {problem && <p role="alert" className="mt-4 text-sm text-destructive">{PROBLEM_TEXT[problem]}</p>}
    </div>
  );
};

export default VideoRoom;
