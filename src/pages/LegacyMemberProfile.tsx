import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Rocket, GraduationCap, Heart, Briefcase, Archive } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import InviteToConnectDialog from '@/components/InviteToConnectDialog';
import type { Enums } from '@/integrations/supabase/types';

type MemberType = Enums<'member_type'>;

const typeIcons: Record<MemberType, typeof Rocket> = {
  entrepreneur: Rocket,
  academic: GraduationCap,
  learner: Heart,
  professional: Briefcase,
};
const typeLabels: Record<MemberType, string> = {
  entrepreneur: 'Entrepreneur',
  academic: 'Academic',
  learner: 'Lifelong Learner',
  professional: 'Professional',
};

const LegacyMemberProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [legacy, setLegacy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    supabase.from('user_roles').select('role').eq('user_id', user.id).eq('role', 'admin').maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  useEffect(() => {
    if (!id) return;
    const run = async () => {
      // Admins read full row from base table; others read masked view
      const q = isAdmin
        ? supabase.from('legacy_members').select('*').eq('id', id).maybeSingle()
        : supabase.from('public_legacy_members' as any).select('*').eq('id', id).maybeSingle();
      const { data } = await q;
      setLegacy(data);
      setLoading(false);
    };
    run();
  }, [id, isAdmin]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 pt-28 pb-16 text-center">
          <p className="text-muted-foreground">Sign in to view member profiles.</p>
          <Link to="/auth?mode=login" className="text-primary underline">Sign in</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading profile…</div>
      </div>
    );
  }
  if (!legacy) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Profile not found.</p>
      </div>
    );
  }

  const memberTypes = (legacy.member_type as MemberType[] | null) || [];
  const initialsRaw = ((legacy.first_name?.[0] || '') + (legacy.last_name?.[0] || '')) || (legacy.display_name || '?').replace(/[^A-Za-z]/g, '').slice(0, 2);
  const fullName = legacy.display_name || `${legacy.first_name || ''} ${legacy.last_name || ''}`.trim() || 'Community Member';
  const anonName = (initialsRaw.toUpperCase().split('').join('.') + (initialsRaw ? '.' : '')) || 'Anonymous Member';
  const name = isAdmin ? fullName : anonName;
  const initials = (isAdmin ? fullName : initialsRaw).slice(0, 2).toUpperCase() || '?';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
        <Link to="/members/directory" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Members
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-card border border-border rounded-xl p-8 mb-6">
            <div className="flex items-start gap-6">
              <Avatar className="w-20 h-20 border-2 border-primary/30">
                {isAdmin && legacy.avatar_url && <AvatarImage src={legacy.avatar_url} />}
                <AvatarFallback className="text-xl font-display bg-primary/20 text-primary">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h1 className="font-display text-2xl font-bold text-foreground">{name}</h1>
                  <Badge variant="outline" className="text-[10px]">
                    <Archive className="w-3 h-3 mr-1" /> Legacy member
                  </Badge>
                </div>
                {isAdmin && legacy.headline && <p className="text-primary font-medium mb-2">{legacy.headline}</p>}
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  {memberTypes.map((mt) => {
                    const TypeIcon = typeIcons[mt];
                    return (
                      <span key={mt} className="flex items-center gap-1">
                        <TypeIcon className="w-4 h-4" /> {typeLabels[mt]}
                      </span>
                    );
                  })}
                  {(legacy.location_city || legacy.location_country) && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {[legacy.location_city, legacy.location_country].filter(Boolean).join(', ')}
                    </span>
                  )}
                  {legacy.join_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Joined {new Date(legacy.join_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <InviteToConnectDialog recipientName={name} toLegacyId={legacy.id} />
                </div>
              </div>
            </div>
            {isAdmin && legacy.bio && <p className="text-foreground/80 mt-6 leading-relaxed">{legacy.bio}</p>}
            {!isAdmin && (
              <p className="text-sm text-muted-foreground mt-6 italic">
                This is a legacy member from our previous community platform. They haven't claimed their profile yet, so identifying details are anonymised. Send an invite to connect — if they join, they'll see it.
              </p>
            )}
            {isAdmin && (legacy.email || legacy.referrer_email || legacy.referrer_name) && (
              <div className="mt-6 pt-4 border-t border-border/50 text-sm text-muted-foreground space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-foreground/70">Admin-only details</p>
                {legacy.email && <p>Email: {legacy.email}</p>}
                {legacy.referrer_name && <p>Referred by: {legacy.referrer_name}</p>}
                {legacy.referrer_email && <p>Referrer email: {legacy.referrer_email}</p>}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LegacyMemberProfile;
