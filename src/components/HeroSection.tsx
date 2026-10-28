import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-community.jpg";
import { ArrowRight, Globe, Play } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

const HeroSection = () => {
  const [watching, setWatching] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Global community connected across the world"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary tracking-widest uppercase">
              Global Virtual Community-of-Practice
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold leading-[1.1] mb-6">
            Personalized learning{" "}
            <span className="text-gradient-primary">pathways</span> woven by
            community
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-4 leading-relaxed">
            Build the next innovation to benefit Human Development in a Tech World.
            Join 8 years of cocreation with educators, innovators, and changemakers worldwide.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mt-8"
          >
            <Button variant="hero" size="lg" asChild>
              <Link to="/auth">
                Join the Community
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <a href="#about">
                Learn More
              </a>
            </Button>
            <Button variant="heroOutline" size="lg" onClick={() => setWatching(true)}>
              <Play className="mr-2 w-4 h-4" />
              Watch
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating stat */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute right-12 bottom-32 hidden lg:block"
        >
          <div className="glow-border rounded-2xl bg-card/80 backdrop-blur-md p-8 text-center">
            <span className="text-5xl font-display font-bold text-gradient-primary">8</span>
            <p className="text-sm text-muted-foreground mt-1">Years of<br />Cocreation</p>
          </div>
        </motion.div>
      </div>

      {/* The video only exists while the dialog is open, so closing it stops playback. */}
      <Dialog open={watching} onOpenChange={setWatching}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden border-border bg-black">
          <DialogTitle className="sr-only">Educatefor.Life jingle</DialogTitle>
          <DialogDescription className="sr-only">Watch the Educatefor.Life jingle video.</DialogDescription>
          <div className="aspect-video w-full">
            <iframe
              src="https://www.youtube-nocookie.com/embed/tF8KkbaFS8Q?autoplay=1&rel=0"
              title="EducateforLife jingle"
              className="h-full w-full"
              allow="autoplay; encrypted-media; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default HeroSection;
