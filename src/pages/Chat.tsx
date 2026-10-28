import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MessagesSquare, Rocket, CalendarDays, GraduationCap, Lightbulb,
  Send, Trash2, Users, Lock, Circle,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useChatPresence } from '@/hooks/useChatPresence';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import CodeOfConductNotice from '@/components/CodeOfConductNotice';
import { toast } from 'sonner';

const ICONS: Record<string, typeof MessagesSquare> = {
  MessagesSquare, Rocket, CalendarDays, GraduationCap, Lightbulb,
};

interface Room {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
}

interface Message {
  id: string;
  room_id: string;
  user_id: string;
  body: string;
  created_at: string;
}

interface AuthorInfo {
  name: string;
  avatarUrl: string | null;
}

/** Privacy rule: show First Name + Last Initial to authenticated members. */
const shortName = (first?: string | null, last?: string | null, display?: string | null) => {
  if (first) return `${first}${last ? ` ${last[0]}.` : ''}`;
  return display || 'Community Member';
};

const initialsOf = (name: string) =>
  name.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean).slice(0, 2)
    .map((w) => w[0].toUpperCase()).join('') || '?';

const timeLabel = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const dayLabel = (iso: string) => {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(Date.now() - 86400000);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
};

const Chat = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [authors, setAuthors] = useState<Record<string, AuthorInfo>>({});
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const me = useMemo(() => {
    if (!user) return null;
    return {
      userId: user.id,
      name: shortName(profile?.first_name, profile?.last_name, profile?.display_name || profile?.full_name),
      avatarUrl: profile?.avatar_url ?? null,
    };
  }, [user, profile]);

  const activeRoom = useMemo(
    () => rooms.find((r) => r.slug === slug) ?? rooms[0] ?? null,
    [rooms, slug],
  );
  const online = useChatPresence(me, activeRoom?.slug ?? null);

  /* ---- rooms + admin flag ---- */
  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: roomData }, { data: roleData }] = await Promise.all([
        supabase.from('chat_rooms').select('id, slug, name, description, icon').order('sort_order'),
        supabase.from('user_roles').select('role').eq('user_id', user.id),
      ]);
      setRooms(roomData ?? []);
      setIsAdmin((roleData ?? []).some((r) => r.role === 'admin'));
    })();
  }, [user]);

  /* ---- redirect bare /chat to the first room ---- */
  useEffect(() => {
    if (!slug && rooms.length) navigate(`/chat/${rooms[0].slug}`, { replace: true });
  }, [slug, rooms, navigate]);

  /* ---- resolve author names ---- */
  const hydrateAuthors = async (ids: string[]) => {
    const missing = ids.filter((id) => id && !authors[id]);
    if (!missing.length) return;
    const { data } = await supabase
      .from('profiles')
      .select('user_id, first_name, last_name, display_name, full_name, avatar_url')
      .in('user_id', Array.from(new Set(missing)));
    if (!data) return;
    setAuthors((prev) => {
      const next = { ...prev };
      data.forEach((p) => {
        next[p.user_id] = {
          name: shortName(p.first_name, p.last_name, p.display_name || p.full_name),
          avatarUrl: p.avatar_url,
        };
      });
      return next;
    });
  };

  /* ---- messages + realtime ---- */
  useEffect(() => {
    if (!activeRoom || !user) return;
    let cancelled = false;
    setLoadingMessages(true);

    (async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', activeRoom.id)
        .order('created_at', { ascending: true })
        .limit(200);
      if (cancelled) return;
      if (error) toast.error('Could not load messages');
      const list = data ?? [];
      setMessages(list);
      setLoadingMessages(false);
      hydrateAuthors(list.map((m) => m.user_id));
    })();

    const channel = supabase
      .channel(`chat-room-${activeRoom.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `room_id=eq.${activeRoom.id}` },
        (payload) => {
          const msg = payload.new as Message;
          setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
          hydrateAuthors([msg.user_id]);
        },
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'chat_messages' },
        (payload) => {
          const gone = payload.old as Message;
          setMessages((prev) => prev.filter((m) => m.id !== gone.id));
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRoom?.id, user?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, activeRoom?.id]);

  const send = async () => {
    const body = input.trim();
    if (!body || !activeRoom || !user || sending) return;
    setSending(true);
    setInput('');
    const { error } = await supabase
      .from('chat_messages')
      .insert({ room_id: activeRoom.id, user_id: user.id, body });
    if (error) {
      toast.error('Message failed to send');
      setInput(body);
    }
    setSending(false);
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from('chat_messages').delete().eq('id', id);
    if (error) toast.error('Could not delete message');
    else setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  /* ---- gate ---- */
  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-3xl mx-auto px-6 pt-40 pb-32 text-center">
          <Lock className="w-10 h-10 mx-auto text-primary mb-6" />
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Members only</h1>
          <p className="text-muted-foreground mb-8">
            The live community chat is open to signed-in Educatefor.Life members.
          </p>
          <Button asChild size="lg"><Link to="/auth">Sign in to join the conversation</Link></Button>
        </main>
        <Footer />
      </div>
    );
  }

  let lastDay = '';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 pt-24 md:pt-28 pb-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="font-display text-3xl md:text-4xl font-bold">
            <span className="text-gradient-primary">Live</span> commUnity chat
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Real-time rooms for members. Messages are kept for 30 days.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_220px] gap-4 lg:gap-6">
          {/* Rooms */}
          <aside className="lg:sticky lg:top-28 self-start w-full">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 px-1">Rooms</p>
            <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
              {rooms.map((room) => {
                const Icon = ICONS[room.icon ?? ''] ?? MessagesSquare;
                const active = activeRoom?.id === room.id;
                const count = online.filter((o) => o.room === room.slug).length;
                return (
                  <button
                    key={room.id}
                    onClick={() => navigate(`/chat/${room.slug}`)}
                    className={`flex items-center gap-2.5 shrink-0 lg:w-full text-left rounded-xl px-3 py-2.5 border transition-colors ${
                      active
                        ? 'bg-primary/10 border-primary/40 text-foreground'
                        : 'bg-card/40 border-border/50 text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-primary' : ''}`} />
                    <span className="text-sm font-medium truncate">{room.name}</span>
                    {count > 0 && (
                      <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0">{count}</Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Transcript */}
          <section className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur flex flex-col min-h-[60vh] h-[68vh]">
            <header className="px-5 py-4 border-b border-border/50">
              <h2 className="font-display font-semibold">{activeRoom?.name ?? 'Loading…'}</h2>
              {activeRoom?.description && (
                <p className="text-xs text-muted-foreground mt-0.5">{activeRoom.description}</p>
              )}
            </header>

            <ScrollArea className="flex-1 px-5">
              <div className="py-5 space-y-4">
                {loadingMessages && (
                  <p className="text-sm text-muted-foreground">Loading messages…</p>
                )}
                {!loadingMessages && !messages.length && (
                  <div className="text-center py-16">
                    <MessagesSquare className="w-8 h-8 mx-auto text-primary/50 mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No messages yet — be the first to say hello.
                    </p>
                  </div>
                )}
                {messages.map((m) => {
                  const author = authors[m.user_id];
                  const name = m.user_id === user?.id ? 'You' : author?.name ?? 'Community Member';
                  const day = dayLabel(m.created_at);
                  const showDay = day !== lastDay;
                  lastDay = day;
                  const canDelete = m.user_id === user?.id || isAdmin;
                  return (
                    <div key={m.id}>
                      {showDay && (
                        <div className="flex items-center gap-3 my-5">
                          <div className="h-px flex-1 bg-border/60" />
                          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{day}</span>
                          <div className="h-px flex-1 bg-border/60" />
                        </div>
                      )}
                      <div className="group flex gap-3">
                        <Avatar className="w-8 h-8 border border-primary/25 shrink-0">
                          <AvatarImage src={author?.avatarUrl || undefined} />
                          <AvatarFallback className="text-[11px] bg-primary/20 text-primary">
                            {initialsOf(author?.name ?? name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-medium">{name}</span>
                            <span className="text-[11px] text-muted-foreground">{timeLabel(m.created_at)}</span>
                            {canDelete && (
                              <button
                                onClick={() => remove(m.id)}
                                aria-label="Delete message"
                                className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <p className="text-sm text-foreground/90 whitespace-pre-wrap break-words">{m.body}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            <div className="px-4 pt-3 border-t border-border/50">
              <CodeOfConductNotice />
            </div>
            <div className="p-4 pt-2 flex items-end gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder={`Message ${activeRoom?.name ?? ''}…`}
                rows={1}
                maxLength={2000}
                className="min-h-[44px] max-h-32 resize-none bg-background/60"
              />
              <Button size="icon" onClick={send} disabled={!input.trim() || sending} aria-label="Send message">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </section>

          {/* Online */}
          <aside className="lg:sticky lg:top-28 self-start w-full">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 px-1 flex items-center gap-2">
              <Users className="w-3.5 h-3.5" /> Online · {online.length}
            </p>
            <div className="space-y-1.5">
              {online.map((m) => (
                <div key={m.userId} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 bg-card/40 border border-border/40">
                  <Avatar className="w-7 h-7 border border-primary/25">
                    <AvatarImage src={m.avatarUrl || undefined} />
                    <AvatarFallback className="text-[10px] bg-primary/20 text-primary">{initialsOf(m.name)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm truncate">{m.userId === user?.id ? 'You' : m.name}</span>
                  <Circle className="w-2 h-2 ml-auto fill-primary text-primary shrink-0" />
                </div>
              ))}
              {!online.length && <p className="text-sm text-muted-foreground px-1">Nobody else here yet.</p>}
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Chat;
