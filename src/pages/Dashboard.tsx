import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
    if (!loading && user && profile && !profile.onboarding_completed) navigate('/profile/setup');
  }, [user, profile, loading, navigate]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-64" />
            <div className="h-4 bg-muted rounded w-96" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-muted rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayName = profile.display_name || profile.full_name || 'Member';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Welcome Header */}
          <div className="mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Welcome back, {displayName}
            </h1>
            <p className="text-muted-foreground mt-2">
              Your community hub — explore, connect, and grow.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Link to="/members/directory" className="group">
              <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-colors h-full">
                <Users className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  Member Directory
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Browse and connect with community members worldwide.
                </p>
                <span className="inline-flex items-center gap-1 text-sm text-primary mt-4">
                  Explore <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            <Link to="/timeline" className="group">
              <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-colors h-full">
                <Calendar className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  Timeline
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  See what's happening in the community and upcoming events.
                </p>
                <span className="inline-flex items-center gap-1 text-sm text-primary mt-4">
                  View <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            <Link to="/library" className="group">
              <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-colors h-full">
                <BookOpen className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  Library
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Access shared resources, readings, and learning materials.
                </p>
                <span className="inline-flex items-center gap-1 text-sm text-primary mt-4">
                  Browse <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </div>

          {/* Profile Summary */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">Your Profile</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {profile.headline || 'Add a headline to let others know what you do.'}
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to={`/members/${profile.user_id}`}>View Profile</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
