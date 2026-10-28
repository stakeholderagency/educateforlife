import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Video } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VideoRoom from '@/components/video/VideoRoom';
import { Button } from '@/components/ui/button';

const Townhall = () => {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-28 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Video className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-display font-bold">
              <span className="text-gradient-primary">Townhall</span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our always-open meeting place. Step in to talk with whoever else is here, or wait for company —
            members are welcome to arrange a time to meet here.
          </p>
        </motion.div>

        {loading ? null : user ? (
          <VideoRoom target={{ room: 'townhall' }} joinLabel="Join the Townhall" />
        ) : (
          <div className="rounded-2xl border border-border bg-card p-8 md:p-12 text-center glow-border">
            <Users className="mx-auto mb-4 h-10 w-10 text-primary" />
            <p className="text-muted-foreground mb-6">The Townhall is for registered members. Sign in to join the call.</p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/auth">Sign in or join the community</Link>
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Townhall;
