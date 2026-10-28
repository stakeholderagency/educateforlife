import { useEffect, useState } from 'react';
import { isSafeUrl } from '@/lib/url-utils';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import {
  MapPin, Globe, Linkedin, Rocket, GraduationCap, Heart, Briefcase,
  ArrowLeft, Edit, Calendar, UserPlus, Users
} from 'lucide-react';
import type { Enums, Tables } from '@/integrations/supabase/types';
import Navbar from '@/components/Navbar';
import InviteToConnectDialog from '@/components/InviteToConnectDialog';

type MemberType = Enums<'member_type'>;
type Profile = Tables<'profiles'>;
type MemberWork = Tables<'member_work'>;
type MemberInterest = Tables<'member_interests'>;
type MemberActivity = Tables<'member_activities'>;

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

const MemberProfile = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [work, setWork] = useState<MemberWork[]>([]);
  const [interests, setInterests] = useState<MemberInterest[]>([]);
  const [activities, setActivities] = useState<MemberActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdminOrMod, setIsAdminOrMod] = useState(false);

  const isOwnProfile = user?.id === userId;

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      // Use the full profiles table for own profile (includes sensitive fields),
      // use public_profiles view for other users (excludes phone, referrer_email)
      const profileQuery = isOwnProfile
        ? supabase.from('profiles').select('*').eq('user_id', userId).single()
        : supabase.from('public_profiles' as any).select('*').eq('user_id', userId).single();

      const [profileRes, workRes, interestsRes, activitiesRes] = await Promise.all([
        profileQuery,
        supabase.from('member_work').select('*').eq('user_id', userId).order('is_current', { ascending: false }),
        supabase.from('member_interests').select('*').eq('user_id', userId),
        supabase.from('member_activities').select('*').eq('user_id', userId).order('completed_at', { ascending: false }),
      ]);
      setProfile(profileRes.data as any);

      setWork(workRes.data || []);
      setInterests(interestsRes.data || []);
      setActivities(activitiesRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    if (!user) return;
    const checkRole = async () => {
      const { data } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' });
      if (data) { setIsAdminOrMod(true); return; }
      const { data: modData } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'moderator' });
      if (modData) setIsAdminOrMod(true);
    };
    checkRole();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Profile not found.</p>
      </div>
    );
  }

  const memberTypes = (profile.member_type as MemberType[] | null) || [];
  const initials = (profile.display_name || profile.full_name || '?').slice(0, 2).toUpperCase();
  const p = profile as any;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-28 pb-16">
        <Link to="/members" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Members
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-card border border-border rounded-xl p-8 glow-border mb-6">
            <div className="flex items-start gap-6">
              <Avatar className="w-20 h-20 border-2 border-primary/30">
                <AvatarImage src={profile.avatar_url || '/default-avatar.svg'} />
                <AvatarFallback className="text-xl font-display bg-primary/20 text-primary">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="font-display text-2xl font-bold text-foreground">
                    {p.first_name || p.last_name
                      ? `${p.first_name || ''} ${p.last_name || ''}`.trim()
                      : profile.display_name || profile.full_name}
                  </h1>
                  {isOwnProfile && (
                    <Link to="/profile/setup">
                      <Button variant="ghost" size="sm"><Edit className="w-4 h-4 mr-1" /> Edit</Button>
                    </Link>
                  )}
                </div>
                {profile.display_name && (p.first_name || p.last_name) && (
                  <p className="text-sm text-muted-foreground mb-1">aka {profile.display_name}</p>
                )}
                {profile.headline && <p className="text-primary font-medium mb-2">{profile.headline}</p>}
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  {memberTypes.map((mt) => {
                    const TypeIcon = typeIcons[mt];
                    return (
                      <span key={mt} className="flex items-center gap-1">
                        <TypeIcon className="w-4 h-4" /> {typeLabels[mt]}
                      </span>
                    );
                  })}
                  {(profile.location_city || profile.location_country) && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {[profile.location_city, profile.location_country].filter(Boolean).join(', ')}
                    </span>
                  )}
                  {p.join_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Joined {new Date(p.join_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                  {p.referrer_name && (
                    <span className="flex items-center gap-1">
                      <UserPlus className="w-4 h-4" /> Referred by {p.referrer_name}
                    </span>
                  )}
                  {isAdminOrMod && p.referrer_email && (
                    <span className="flex items-center gap-1 text-xs bg-secondary/50 px-2 py-0.5 rounded">
                      Referrer email: {p.referrer_email}
                    </span>
                  )}
                  {p.referral_count > 0 && (
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" /> {p.referral_count} referral{p.referral_count !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-3 items-center">
                  {isSafeUrl(profile.linkedin_url) && (
                    <a href={profile.linkedin_url!} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm"><Linkedin className="w-4 h-4" /></Button>
                    </a>
                  )}
                  {isSafeUrl(profile.website_url) && (
                    <a href={profile.website_url!} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm"><Globe className="w-4 h-4" /></Button>
                    </a>
                  )}
                  {!isOwnProfile && userId && (
                    <InviteToConnectDialog
                      recipientName={
                        (p.first_name || p.last_name)
                          ? `${p.first_name || ''} ${p.last_name || ''}`.trim()
                          : (profile.display_name || profile.full_name || 'this member')
                      }
                      toUserId={userId}
                    />
                  )}
                </div>
              </div>
            </div>
            {profile.bio && <p className="text-foreground/80 mt-6 leading-relaxed">{profile.bio}</p>}
          </div>

          {/* Community Introduction Video */}
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">Our Community</h2>
            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/T08UZOCWM8I"
                title="EducateforLife Community"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {profile.mission_statement && (
              <div className="bg-card border border-border rounded-xl p-6 md:col-span-2">
                <h2 className="font-display text-lg font-semibold text-foreground mb-3">Mission & Purpose</h2>
                <p className="text-foreground/80 leading-relaxed italic">"{profile.mission_statement}"</p>
              </div>
            )}

            {work.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">Current Work</h2>
                <div className="space-y-4">
                  {work.map((w) => (
                    <div key={w.id} className="border-l-2 border-primary/40 pl-4">
                      <div className="font-semibold text-foreground">{w.organization_name}</div>
                      {w.role_title && <div className="text-sm text-primary">{w.role_title}</div>}
                      {w.description && <p className="text-sm text-muted-foreground mt-1">{w.description}</p>}
                      {isSafeUrl(w.organization_domain) && (
                        <a href={w.organization_domain!} target="_blank" rel="noopener noreferrer" className="text-xs text-primary/70 hover:text-primary">
                          {w.organization_domain}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">Collaboration</h2>
              {profile.skills && profile.skills.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.map((s, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {profile.looking_for && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Looking For</p>
                  <p className="text-sm text-foreground/80">{profile.looking_for}</p>
                </div>
              )}
              {profile.offering && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Can Offer</p>
                  <p className="text-sm text-foreground/80">{profile.offering}</p>
                </div>
              )}
            </div>

            {interests.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {interests.map((item) => (
                    <Badge key={item.id} variant="outline" className="text-xs">
                      <span className="opacity-60 mr-1">{item.category}:</span> {item.interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {activities.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">Community Activity</h2>
                <div className="space-y-3">
                  {activities.map((a) => (
                    <div key={a.id} className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-primary mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-foreground">{a.title}</div>
                        <div className="text-xs text-muted-foreground">{a.activity_type} · {new Date(a.completed_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MemberProfile;
