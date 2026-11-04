import { useState } from 'react';
import { ExternalLink, Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { videoEmbedUrl } from '@/lib/video-embed';

type Props = {
  userId: string;
  firstName: string;
  url: string | null;
  isOwnProfile: boolean;
  onSaved: (url: string | null) => void;
};

/** A member's own intro video, hosted elsewhere (YouTube, Vimeo, ...). */
const IntroVideoCard = ({ userId, firstName, url, isOwnProfile, onSaved }: Props) => {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(url || '');
  const [saving, setSaving] = useState(false);

  if (!url && !isOwnProfile) return null;

  const embed = videoEmbedUrl(url);

  const save = async (value: string | null) => {
    if (value && !/^https:\/\//i.test(value)) {
      toast({ title: 'Check the link', description: 'Paste the full link, starting with https://', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ intro_video_url: value } as any)
      .eq('user_id', userId);
    setSaving(false);
    if (error) {
      toast({ title: 'Could not save your video link', description: 'Please try again in a moment.', variant: 'destructive' });
      return;
    }
    onSaved(value);
    setEditing(false);
    toast({ title: value ? 'Intro video saved' : 'Intro video removed' });
  };

  const form = (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Upload a short video introducing yourself to YouTube, Vimeo or another video site, then paste the link here.
        YouTube and Vimeo links play right on your profile; other links open in a new tab. On YouTube, choose
        "Unlisted" if you only want people with the link to find it.
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          inputMode="url"
          aria-label="Intro video link"
        />
        <div className="flex gap-2">
          <Button onClick={() => save(draft.trim() || null)} disabled={saving || !draft.trim()}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
          {url && (
            <Button variant="ghost" onClick={() => { setDraft(url); setEditing(false); }} disabled={saving}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
          <Video className="w-5 h-5 text-primary" />
          {isOwnProfile ? 'Your intro video' : `Meet ${firstName}`}
        </h2>
        {isOwnProfile && url && !editing && (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => { setDraft(url); setEditing(true); }}>Change</Button>
            <Button variant="ghost" size="sm" onClick={() => save(null)} disabled={saving}>Remove</Button>
          </div>
        )}
      </div>

      {!url || editing ? (
        form
      ) : embed ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
          <iframe
            src={embed}
            title={`Intro video: ${firstName}`}
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      ) : (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <Button variant="outline">
            <ExternalLink className="w-4 h-4" /> Watch the intro video
          </Button>
        </a>
      )}
    </div>
  );
};

export default IntroVideoCard;
