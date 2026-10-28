import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PresentMember {
  userId: string;
  name: string;
  avatarUrl: string | null;
  room: string | null;
}

/**
 * Tracks which members are currently connected to the community chat,
 * using Supabase Realtime presence. One shared channel for the whole app so
 * the online list is consistent across rooms.
 */
export const useChatPresence = (
  me: { userId: string; name: string; avatarUrl: string | null } | null,
  room: string | null,
) => {
  const [online, setOnline] = useState<PresentMember[]>([]);

  useEffect(() => {
    if (!me) {
      setOnline([]);
      return;
    }

    const channel = supabase.channel('community-presence', {
      config: { presence: { key: me.userId } },
    });

    const sync = () => {
      const state = channel.presenceState<PresentMember>();
      const members = Object.values(state)
        .map((entries) => entries[0])
        .filter(Boolean)
        .sort((a, b) => a.name.localeCompare(b.name));
      setOnline(members);
    };

    channel
      .on('presence', { event: 'sync' }, sync)
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            userId: me.userId,
            name: me.name,
            avatarUrl: me.avatarUrl,
            room,
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me?.userId, me?.name, me?.avatarUrl, room]);

  return online;
};
