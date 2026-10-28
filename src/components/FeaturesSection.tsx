import { motion } from "framer-motion";
import { Users, Lightbulb, Sparkles } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Mentoring & Coaching",
    description:
      "Through online Innovation Sprints, connect with experienced mentors who guide your learning journey and help you build real-world impact.",
  },
  {
    icon: Lightbulb,
    title: "Peer Workgroups",
    description:
      "Get matched with like-minded peers across the globe. Form teams, collaborate on projects, and learn from diverse perspectives.",
  },
  {
    icon: Sparkles,
    title: "Innovation Methods & Tools",
    description:
      "Access proven methods with transformative impact. From design thinking to systems change — practical tools for real-world challenges.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const FeaturesSection = () => {
  return (
    <section id="features" className="section-padding bg-background relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block">
            Our Features
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            The unique benefits our members{" "}
            <span className="text-gradient-warm">highlight</span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group bg-gradient-card glow-border rounded-2xl p-8 hover:border-primary/40 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
