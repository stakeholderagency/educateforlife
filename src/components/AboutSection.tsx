import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const checkpoints = [
  { label: "Develop Your Own Pathways in Life", tag: "Pathways · Free", href: "/programs#pathways" },
  { label: "Build a Microbusiness with Programs or Services That Help Others", tag: "Builders · By application", href: "/programs#builders" },
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
                <Link key={item.label} to={item.href} className="flex items-start gap-3 group">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>
                    <span className="font-medium group-hover:text-primary transition-colors">{item.label}</span>
                    <span className="block text-sm text-muted-foreground">{item.tag}</span>
                  </span>
                </Link>
              ))}
            </div>

            <Link
              to="/programs"
              className="inline-flex items-center gap-2 mt-8 mr-6 text-sm font-medium text-primary hover:underline"
            >
              Explore our programs <ArrowRight className="w-4 h-4" />
            </Link>

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
