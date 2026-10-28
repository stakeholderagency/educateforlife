import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VideoRoom from '@/components/video/VideoRoom';

const Townhall = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // The Townhall is for signed-in members only.
  useEffect(() => {
    if (!loading && !user) navigate('/auth', { replace: true });
  }, [user, loading, navigate]);

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

        {user && <VideoRoom target={{ room: 'townhall' }} joinLabel="Join the Townhall" />}
      </div>
      <Footer />
    </div>
  );
};

export default Townhall;
