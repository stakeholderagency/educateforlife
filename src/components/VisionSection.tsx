import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Quote } from "lucide-react";

const VisionSection = () => {
  return (
    <section id="vision" className="section-padding relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block">
            Our Vision
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            How we define{" "}
            <span className="text-gradient-primary">"Education"</span>
          </h2>
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-gradient-card glow-border rounded-3xl p-10 md:p-14 relative"
        >
          <Quote className="w-10 h-10 text-primary/30 absolute top-8 left-8" />
          <p className="text-xl md:text-2xl font-display font-medium leading-relaxed text-center italic text-foreground/90">
            "Raising level of human consciousness, shifting human mindset away from that of
            scarcity — towards abundance, in support of sustainability and establishing
            scaffolding and empowerment for every human to leverage in their own lives."
          </p>
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 space-y-6 text-muted-foreground leading-relaxed max-w-3xl mx-auto"
        >
          <p>
            The future of education lies not in centralized institutions but in decentralized,
            adaptable learning networks that empower individuals to take control of their
            learning journey through personalized, coach-supported and AI-enhanced education.
          </p>
          <p>
            Together, we are building an educational ecosystem that is accessible, personalized,
            and responsive to the needs of all learners, anywhere and at any time.
          </p>
          <Link
            to="/memorandum"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Read our Memorandum <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default VisionSection;
