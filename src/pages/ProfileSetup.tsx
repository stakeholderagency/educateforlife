import { useState, useRef } from 'react';
import { isSafeUrl } from '@/lib/url-utils';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, X, Plus, Rocket, GraduationCap, Heart, Briefcase, Camera, Loader2 } from 'lucide-react';
import type { Enums } from '@/integrations/supabase/types';
import { useEffect } from 'react';

type MemberType = Enums<'member_type'>;
type WorkType = Enums<'work_type'>;
type InterestCategory = Enums<'interest_category'>;

const STEPS = ['Identity', 'What You Do', 'Interests & Mission', 'Collaboration'];

const memberTypeConfig: Record<MemberType, { icon: typeof Rocket; label: string; description: string }> = {
  entrepreneur: { icon: Rocket, label: 'Entrepreneur / Startup Founder', description: 'Building a startup or venture' },
  academic: { icon: GraduationCap, label: 'Academic / Researcher', description: 'Working at an educational institution' },
  learner: { icon: Heart, label: 'Lifelong Learner', description: 'Exploring passion topics and personal growth' },
  professional: { icon: Briefcase, label: 'Professional / Practitioner', description: 'Working in industry or consulting' },
};

const workTypeLabels: Record<WorkType, string> = {
  startup: 'Startup',
  academic_institution: 'Academic Institution',
  organization: 'Organization / Company',
  independent: 'Independent / Freelance',
  other: 'Other',
};

const ProfileSetup = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [legacyId, setLegacyId] = useState<string | null>(null);
  const [legacyLoaded, setLegacyLoaded] = useState(false);

  // Step 1: Identity
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [locationCity, setLocationCity] = useState('');
  const [locationCountry, setLocationCountry] = useState('');
  const [memberTypes, setMemberTypes] = useState<MemberType[]>([]);
  const [referrerName, setReferrerName] = useState('');

  // Step 2: Work
  const [workType, setWorkType] = useState<WorkType>('startup');
  const [orgName, setOrgName] = useState('');
  const [orgDomain, setOrgDomain] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [workDescription, setWorkDescription] = useState('');

  // Step 3: Interests & Mission
  const [interests, setInterests] = useState<{ interest: string; category: InterestCategory }[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [interestCategory, setInterestCategory] = useState<InterestCategory>('passion');
  const [missionStatement, setMissionStatement] = useState('');

  // Step 4: Collaboration
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [offering, setOffering] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  // Check for legacy member data to pre-fill
  useEffect(() => {
    if (!user || legacyLoaded) return;
    const checkLegacy = async () => {
      const email = user.email;
      if (!email) { setLegacyLoaded(true); return; }
      const { data } = await supabase
        .from('legacy_members')
        .select('id, first_name, last_name, display_name, headline, bio, avatar_url, location_city, location_country, member_type, referrer_name')
        .eq('email', email)
        .limit(1);
      if (data && data.length > 0) {
        const l = data[0] as any;
        setLegacyId(l.id);
        setFirstName(l.first_name || '');
        setLastName(l.last_name || '');
        setDisplayName(l.display_name || '');
        setBio(l.bio || '');
        setLocationCity(l.location_city || '');
        setLocationCountry(l.location_country || '');
        setReferrerName(l.referrer_name || '');
        setHeadline(l.headline || '');
        toast({
          title: 'Welcome back!',
          description: 'We found your existing membership data. Please review and complete your profile.',
        });
      }
      setLegacyLoaded(true);
    };
    checkLegacy();
  }, [user, legacyLoaded, toast]);

  // Redirect if onboarding already completed; load existing data if editing
  useEffect(() => {
    if (!user) navigate('/auth');
    if (profile && profile.onboarding_completed) {
      navigate('/dashboard');
    }
  }, [user, profile, navigate]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file', description: 'Please upload an image file.', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Please upload an image under 5MB.', variant: 'destructive' });
      return;
    }
    setUploadingAvatar(true);
    const ext = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({ title: 'Upload failed', description: uploadError.message, variant: 'destructive' });
      setUploadingAvatar(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const urlWithCacheBust = `${publicUrl}?t=${Date.now()}`;
    setAvatarUrl(urlWithCacheBust);

    await supabase.from('profiles').update({ avatar_url: urlWithCacheBust }).eq('user_id', user.id);
    setUploadingAvatar(false);
    toast({ title: 'Photo uploaded!' });
  };

  const addInterest = () => {
    if (newInterest.trim()) {
      setInterests([...interests, { interest: newInterest.trim(), category: interestCategory }]);
      setNewInterest('');
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    // If claiming a legacy profile, fetch extra fields (join_date, referrer_email, referral_count)
    let legacyExtras: Record<string, any> = {};
    if (legacyId) {
      const { data: legacyData } = await supabase
        .from('legacy_members')
        .select('join_date, referrer_email, referral_count')
        .eq('id', legacyId)
        .single();
      if (legacyData) {
        legacyExtras = {
          join_date: (legacyData as any).join_date,
          referrer_email: (legacyData as any).referrer_email,
          referral_count: (legacyData as any).referral_count,
        };
      }
    }

    // Validate URLs before saving
    if (linkedinUrl && !isSafeUrl(linkedinUrl)) {
      toast({ title: 'Invalid URL', description: 'LinkedIn URL must start with http:// or https://', variant: 'destructive' });
      setSaving(false);
      return;
    }
    if (websiteUrl && !isSafeUrl(websiteUrl)) {
      toast({ title: 'Invalid URL', description: 'Website URL must start with http:// or https://', variant: 'destructive' });
      setSaving(false);
      return;
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        display_name: displayName,
        headline,
        bio,
        location_city: locationCity,
        location_country: locationCountry,
        member_type: memberTypes.length > 0 ? memberTypes : null,
        mission_statement: missionStatement,
        skills,
        looking_for: lookingFor,
        offering,
        linkedin_url: linkedinUrl || null,
        website_url: websiteUrl || null,
        referrer_name: referrerName || null,
        onboarding_completed: true,
        ...legacyExtras,
      } as any)
      .eq('user_id', user.id);

    if (profileError) {
      toast({ title: 'Error', description: profileError.message, variant: 'destructive' });
      setSaving(false);
      return;
    }

    if (orgName.trim()) {
      await supabase.from('member_work').insert({
        user_id: user.id,
        work_type: workType,
        organization_name: orgName,
        organization_domain: orgDomain || null,
        role_title: roleTitle || null,
        description: workDescription || null,
      });
    }

    if (interests.length > 0) {
      await supabase.from('member_interests').insert(
        interests.map((i) => ({ user_id: user.id, interest: i.interest, category: i.category }))
      );
    }

    // Remove the legacy record after successful claim
    if (legacyId) {
      await supabase.from('legacy_members').delete().eq('id', legacyId);
    }

    await refreshProfile();
    setSaving(false);
    toast({ title: 'Profile complete!', description: legacyId ? 'Your membership has been claimed. Welcome back!' : 'Welcome to the community.' });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <a href="/" className="font-display font-bold text-2xl tracking-tight inline-block mb-2">
            <img src="/logo.png" alt="Educatefor.Life" className="w-16 h-16 mx-auto" />
          </a>
          <h1 className="font-display text-2xl font-bold text-foreground mt-4">Set Up Your Profile</h1>
          <p className="text-muted-foreground mt-1">Tell us about yourself so we can match you with the right people.</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  i <= step ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                }`}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-0.5 ${i < step ? 'bg-primary' : 'bg-secondary'}`} />
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mb-6">{STEPS[step]}</p>

        <div className="bg-card border border-border rounded-xl p-8 glow-border">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {step === 0 && (
                <div className="space-y-4">
                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative group">
                      <Avatar className="w-24 h-24 border-2 border-primary/30">
                        <AvatarImage src={avatarUrl || '/default-avatar.svg'} />
                        <AvatarFallback className="text-2xl font-display bg-primary/20 text-primary">
                          {(displayName || firstName || '?').slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingAvatar}
                        className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        {uploadingAvatar ? (
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                        ) : (
                          <Camera className="w-6 h-6 text-white" />
                        )}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-sm text-primary hover:underline"
                    >
                      {avatarUrl ? 'Change photo' : 'Upload photo'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Your first name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Your last name" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Display Name</Label>
                    <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="How you'd like to be known" />
                  </div>
                  <div className="space-y-2">
                    <Label>Headline</Label>
                    <Input value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="e.g. Social Entrepreneur | Education Innovator" />
                  </div>
                  <div className="space-y-2">
                    <Label>Short Bio</Label>
                    <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself in a few sentences..." rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input value={locationCity} onChange={(e) => setLocationCity(e.target.value)} placeholder="Your city" />
                    </div>
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Input value={locationCountry} onChange={(e) => setLocationCountry(e.target.value)} placeholder="Your country" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Who referred you? (optional)</Label>
                    <Input value={referrerName} onChange={(e) => setReferrerName(e.target.value)} placeholder="Name of the person who referred you" />
                  </div>
                  <div className="space-y-3">
                    <Label>I am a...</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(Object.entries(memberTypeConfig) as [MemberType, typeof memberTypeConfig[MemberType]][]).map(([type, cfg]) => {
                        const Icon = cfg.icon;
                        const isSelected = memberTypes.includes(type);
                        return (
                          <button
                            key={type}
                            onClick={() => {
                              setMemberTypes(prev =>
                                prev.includes(type)
                                  ? prev.filter(t => t !== type)
                                  : [...prev, type]
                              );
                            }}
                            className={`p-4 rounded-lg border text-left transition-all ${
                              isSelected
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:border-primary/40 bg-secondary/30'
                            }`}
                          >
                            <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                            <div className="font-display text-sm font-semibold text-foreground">{cfg.label}</div>
                            <div className="text-xs text-muted-foreground mt-1">{cfg.description}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Tell us what you're currently working on.</p>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={workType} onValueChange={(v) => setWorkType(v as WorkType)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(workTypeLabels).map(([val, label]) => (
                          <SelectItem key={val} value={val}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{workType === 'startup' ? 'Startup Name' : workType === 'academic_institution' ? 'Institution Name' : 'Organization Name'}</Label>
                    <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Name of your organization" />
                  </div>
                  <div className="space-y-2">
                    <Label>Website / Domain (optional)</Label>
                    <Input value={orgDomain} onChange={(e) => setOrgDomain(e.target.value)} placeholder="https://..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Your Role / Title</Label>
                    <Input value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} placeholder="e.g. Co-Founder, Professor, Student" />
                  </div>
                  <div className="space-y-2">
                    <Label>Brief Description</Label>
                    <Textarea value={workDescription} onChange={(e) => setWorkDescription(e.target.value)} placeholder="What are you working on?" rows={3} />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label>Your Interests & Passions</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        placeholder="Add an interest..."
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                        className="flex-1"
                      />
                      <Select value={interestCategory} onValueChange={(v) => setInterestCategory(v as InterestCategory)}>
                        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="passion">Passion</SelectItem>
                          <SelectItem value="learning">Learning</SelectItem>
                          <SelectItem value="expertise">Expertise</SelectItem>
                          <SelectItem value="seeking">Seeking</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button type="button" size="icon" onClick={addInterest}><Plus className="w-4 h-4" /></Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {interests.map((item, i) => (
                        <Badge key={i} variant="secondary" className="gap-1 pr-1">
                          <span className="text-xs opacity-60">{item.category}:</span> {item.interest}
                          <button onClick={() => setInterests(interests.filter((_, j) => j !== i))} className="ml-1 hover:text-destructive">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Mission / Purpose Statement</Label>
                    <Textarea
                      value={missionStatement}
                      onChange={(e) => setMissionStatement(e.target.value)}
                      placeholder="What drives you? What change do you want to see in the world?"
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label>Skills You Bring</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a skill..."
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        className="flex-1"
                      />
                      <Button type="button" size="icon" onClick={addSkill}><Plus className="w-4 h-4" /></Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, i) => (
                        <Badge key={i} variant="secondary" className="gap-1 pr-1">
                          {skill}
                          <button onClick={() => setSkills(skills.filter((_, j) => j !== i))} className="ml-1 hover:text-destructive">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>What Are You Looking For?</Label>
                    <Textarea value={lookingFor} onChange={(e) => setLookingFor(e.target.value)} placeholder="Mentors, co-founders, collaborators, feedback..." rows={2} />
                  </div>
                  <div className="space-y-2">
                    <Label>What Can You Offer?</Label>
                    <Textarea value={offering} onChange={(e) => setOffering(e.target.value)} placeholder="Expertise, mentoring, resources, connections..." rows={2} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>LinkedIn (optional)</Label>
                      <Input value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Website (optional)</Label>
                      <Input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://..." />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 0}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button variant="hero" onClick={() => setStep(step + 1)}>
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button variant="hero" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Complete Profile'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
