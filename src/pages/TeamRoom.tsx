import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VideoRoom from '@/components/video/VideoRoom';
import { Button } from '@/components/ui/button';

/** A community team's own video room. Access is decided by the `video-room` function. */
const TeamRoom = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { user, loading } = useAuth();
  const [team, setTeam] = useState<{ name: string; description: string | null } | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!user || !teamId) return;
    supabase.from('community_teams').select('name,description').eq('id', teamId).maybeSingle()
      .then(({ data }) => { setTeam(data); setChecked(true); });
  }, [user, teamId]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-28 pb-24">
        {loading || (user && !checked) ? null : !user ? (
          <div className="rounded-2xl border border-border bg-card p-8 md:p-12 text-center glow-border">
            <p className="text-muted-foreground mb-6">Sign in to enter your team's room.</p>
            <Button variant="hero" size="lg" asChild><Link to="/auth">Sign in</Link></Button>
          </div>
        ) : !team || !teamId ? (
          <div className="text-center">
            <Users className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">We could not find a team room for you here.</p>
            <Link to="/dashboard" className="text-primary hover:underline">Back to your dashboard</Link>
          </div>
        ) : (
          <>
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              <span className="text-gradient-primary">{team.name}</span>
            </h1>
            {team.description && <p className="text-muted-foreground mb-8 max-w-2xl">{team.description}</p>}
            <VideoRoom target={{ team_id: teamId }} joinLabel="Enter the team room" />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TeamRoom;
