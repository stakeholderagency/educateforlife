import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import {
  categoryDescriptions,
  skillsByCategory,
  type SkillCategory,
} from "@/data/skills";

const categoryAccent: Record<SkillCategory, string> = {
  Adaptability: "from-primary/30 to-primary/5",
  Cognitive: "from-accent/30 to-accent/5",
  Interpersonal: "from-primary/25 to-accent/10",
  "Self-leadership": "from-accent/25 to-primary/10",
  Digital: "from-primary/20 to-primary/5",
};

const Skills = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 md:pt-32">
        {/* Hero */}
        <section className="section-padding pb-12 md:pb-16">
          <div className="max-w-5xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-display tracking-widest uppercase text-primary mb-4"
            >
              The Framework
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6"
            >
              <span className="text-gradient-primary">60 Human Skills</span>
              <br />
              <span className="text-foreground">for a #Tech World</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              The uniquely human capabilities that machines can't replace — organised across
              five categories. Pick a skill to explore tools and exercises that help you grow it.
            </motion.p>
          </div>
        </section>

        {/* Categories */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24 space-y-20 md:space-y-28">
          {skillsByCategory.map(({ category, subCategories }, idx) => {
            const meta = categoryDescriptions[category];
            return (
              <section key={category} id={category.toLowerCase()}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  className={`rounded-2xl p-8 md:p-12 bg-gradient-to-br ${categoryAccent[category]} border border-border/50 mb-10`}
                >
                  <div className="flex items-baseline gap-4 mb-3">
                    <span className="text-5xl md:text-6xl font-display font-bold text-primary/40">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">
                      {category}
                    </h2>
                  </div>
                  <p className="text-base md:text-lg text-foreground/90 font-medium mb-2">
                    {meta.tagline}
                  </p>
                  <p className="text-sm md:text-base text-muted-foreground max-w-3xl">
                    {meta.description}
                  </p>
                </motion.div>

                <div className="space-y-12">
                  {subCategories.map(({ subCategory, skills }) => (
                    <div key={subCategory}>
                      <h3 className="text-xs md:text-sm font-display font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4 pl-1">
                        {subCategory}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {skills.map((skill) => (
                          <Link
                            key={skill.slug}
                            to={`/skills/${skill.slug}`}
                            className="group block"
                          >
                            <Card className="h-full p-5 bg-gradient-card border-border/60 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_-8px_hsl(var(--primary)/0.3)]">
                              <div className="flex flex-col h-full">
                                <h4 className="font-display font-semibold text-base text-foreground group-hover:text-primary transition-colors mb-3 leading-snug">
                                  {skill.name}
                                </h4>
                                <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                                  <span className="inline-flex items-center gap-1">
                                    {skill.articleUrl ? (
                                      <>
                                        <ExternalLink className="w-3 h-3 text-primary/70" />
                                        Article available
                                      </>
                                    ) : (
                                      <span className="opacity-60">Explore</span>
                                    )}
                                  </span>
                                  <ArrowRight className="w-4 h-4 text-primary opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </div>
                              </div>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Skills;
