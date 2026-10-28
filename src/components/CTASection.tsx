import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";

const CTASection = () => {
  return (
    <section id="join" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-warm/5" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-8">
          <Heart className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Open to everyone</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 leading-tight">
          We collaborate with families, institutions,{" "}
          <span className="text-gradient-warm">NGO's & governments</span>
        </h2>

        <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
          Apply today to get your own personal membership and join our community app.
          Be part of 8 years of global cocreation.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" size="lg" asChild>
            <Link to="/auth">
              Join Educatefor.Life
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;
