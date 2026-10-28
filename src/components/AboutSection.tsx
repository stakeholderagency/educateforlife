import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const checkpoints = [
  "Develop Your Own Pathways in Life",
  "Build Programs or Services That Help Others",
];

const AboutSection = () => {
  return (
    <section id="about" className="section-padding bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto">

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block">
              About Us
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 leading-tight">
              A truly global community and you are{" "}
              <span className="text-gradient-warm">welcome to join</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Build the next innovation to benefit Human Development in a Tech World, or
              accelerate the product or solution you already got started on.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Build a new team, bring your current team or simply come with an open mind,
              ready to team up with fellow, cool community friends.
            </p>

            <div className="space-y-4">
              {checkpoints.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>

            <Link
              to="/memorandum"
              className="inline-flex items-center gap-2 mt-8 text-sm font-medium text-primary hover:underline"
            >
              Read our Memorandum <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
