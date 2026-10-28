import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Search, MapPin, Rocket, GraduationCap, Heart, Briefcase, Users } from 'lucide-react';
import type { Enums } from '@/integrations/supabase/types';
import Navbar from '@/components/Navbar';

type MemberType = Enums<'member_type'>;

interface UnifiedMember {
  id: string;
  display_name: string | null;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  headline: string | null;
  bio: string | null;
  avatar_url: string | null;
  location_city: string | null;
  location_country: string | null;
  member_type: MemberType[] | null;
  skills: string[] | null;
  user_id: string | null;
  join_date: string | null;
  is_legacy: boolean;
}

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

const Members = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<UnifiedMember[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  useEffect(() => {
    const fetchMembers = async () => {
      const [profilesRes, legacyRes] = await Promise.all([
        supabase
          .from('public_profiles' as any)
          .select('*')
          .eq('onboarding_completed', true)
          .order('created_at', { ascending: false }),
        supabase
          .from('public_legacy_members' as any)
          .select('id, first_name, last_name, display_name, headline, bio, avatar_url, location_city, location_country, member_type, join_date, referral_count')
          .order('join_date', { ascending: true }),
      ]);

      const profilesData = (profilesRes.data || []) as any[];

      const profileMembers: UnifiedMember[] = profilesData.map((p: any) => ({
        id: p.id,
        display_name: p.display_name,
        full_name: p.full_name,
        first_name: p.first_name,
        last_name: p.last_name,
        headline: p.headline,
        bio: p.bio,
        avatar_url: p.avatar_url,
        location_city: p.location_city,
        location_country: p.location_country,
        member_type: p.member_type as MemberType[] | null,
        skills: p.skills,
        user_id: p.user_id,
        join_date: p.join_date,
        is_legacy: false,
      }));

      const legacyMembers: UnifiedMember[] = (legacyRes.data || []).map((l: any) => ({
        id: l.id,
        display_name: l.display_name,
        full_name: null,
        first_name: l.first_name,
        last_name: l.last_name,
        headline: l.headline,
        bio: l.bio,
        avatar_url: l.avatar_url,
        location_city: l.location_city,
        location_country: l.location_country,
        member_type: null,
        skills: null,
        user_id: null,
        join_date: l.join_date,
        is_legacy: true,
      }));

      setMembers([...profileMembers, ...legacyMembers]);
      setLoading(false);
    };
    fetchMembers();
  }, []);

  const countries = Array.from(
    new Set(members.map((m) => m.location_country).filter(Boolean) as string[])
  ).sort();

  const filtered = members.filter((p) => {
    const name = p.display_name || p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim();
    const matchesSearch =
      !search ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      (p.headline || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.bio || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.skills || []).some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === 'all' || (p.member_type && p.member_type.includes(typeFilter as MemberType));
    const matchesCountry = countryFilter === 'all' || p.location_country === countryFilter;
    return matchesSearch && matchesType && matchesCountry;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-primary" />
            <h1 className="font-display text-3xl font-bold text-foreground">Community Members</h1>
          </div>
          <p className="text-muted-foreground mb-8">
            Discover and connect with {members.length} members of our global community.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, headline, or bio..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Members</SelectItem>
                {Object.entries(typeLabels).map(([val, label]) => (
                  <SelectItem key={val} value={val}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse h-48" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p>No members found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p, i) => {
                const memberTypes = p.member_type || [];
                const anonymise = p.is_legacy && !isAdmin;
                const fullName = p.display_name || p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Community Member';
                const initialsRaw = ((p.first_name?.[0] || '') + (p.last_name?.[0] || '')) || fullName.replace(/[^A-Za-z]/g, '').slice(0, 2);
                const anonInitials = initialsRaw.toUpperCase().split('').join('.') + (initialsRaw ? '.' : '');
                const name = anonymise ? (anonInitials || 'Anonymous Member') : fullName;
                const initials = (anonymise ? initialsRaw : fullName).slice(0, 2).toUpperCase();
                const avatarSrc = anonymise ? undefined : (p.avatar_url || '/default-avatar.svg');
                const cardContent = (
                  <div className="block bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-colors group">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12 border border-primary/20">
                        {avatarSrc && <AvatarImage src={avatarSrc} />}
                        <AvatarFallback className="font-display text-sm bg-primary/20 text-primary">{initials || '?'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                            {name}
                          </h3>
                          {p.is_legacy && (
                            <Badge variant="outline" className="text-[9px] shrink-0">Legacy</Badge>
                          )}
                        </div>
                        {(p.headline || p.bio) && !anonymise && (
                          <p className="text-sm text-muted-foreground truncate mt-0.5">{p.headline || p.bio}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                          {memberTypes.map((mt) => {
                            const TypeIcon = typeIcons[mt];
                            return (
                              <span key={mt} className="flex items-center gap-1">
                                <TypeIcon className="w-3 h-3" /> {typeLabels[mt]}
                              </span>
                            );
                          })}
                          {(p.location_city || p.location_country) && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {[p.location_city, p.location_country].filter(Boolean).join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {p.skills && p.skills.length > 0 && !anonymise && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {p.skills.slice(0, 4).map((s, j) => (
                          <Badge key={j} variant="secondary" className="text-[10px]">{s}</Badge>
                        ))}
                        {p.skills.length > 4 && (
                          <Badge variant="secondary" className="text-[10px]">+{p.skills.length - 4}</Badge>
                        )}
                      </div>
                    )}
                  </div>
                );

                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.5) }}
                  >
                    {p.user_id ? (
                      <Link to={`/members/${p.user_id}`}>{cardContent}</Link>
                    ) : p.is_legacy ? (
                      <Link to={`/members/legacy/${p.id}`}>{cardContent}</Link>
                    ) : (
                      cardContent
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Members;
