import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, ExternalLink, Lightbulb, Target, Wrench } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSkillBySlug, skills, categoryDescriptions } from "@/data/skills";

const SkillDetail = () => {
  const { slug = "" } = useParams();
  const skill = getSkillBySlug(slug);

  if (!skill) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 section-padding text-center">
          <h1 className="text-3xl font-display font-bold mb-4">Skill not found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find that skill. Browse the full framework instead.
          </p>
          <Button variant="hero" asChild>
            <Link to="/skills">Back to all skills</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const related = skills
    .filter((s) => s.subCategory === skill.subCategory && s.slug !== skill.slug)
    .slice(0, 6);

  const meta = categoryDescriptions[skill.category];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 md:pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <Link
            to="/skills"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            All skills
          </Link>

          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-display tracking-widest uppercase">
            <Link to="/skills" className="text-primary hover:underline">
              {skill.category}
            </Link>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-muted-foreground">{skill.subCategory}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
            {skill.name}
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl">{meta.tagline}</p>

          {skill.articleUrl && (
            <Card className="p-6 mb-10 bg-gradient-card border-primary/30">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/15 text-primary shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-lg mb-1">Deep dive article</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Read the full piece on this skill — what it is, why it matters and how to develop it.
                  </p>
                  <Button variant="hero" size="sm" asChild>
                    <a href={skill.articleUrl} target="_blank" rel="noopener noreferrer">
                      Read the article
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <section className="grid md:grid-cols-3 gap-4 mb-12">
            <Card className="p-6 bg-gradient-card border-border/60">
              <Lightbulb className="w-6 h-6 text-accent mb-3" />
              <h3 className="font-display font-semibold mb-1">Why it matters</h3>
              <p className="text-sm text-muted-foreground">
                {skill.name} is one of the {skill.category.toLowerCase()} capabilities that helps
                you stay uniquely human in a tech-driven world.
              </p>
            </Card>
            <Card className="p-6 bg-gradient-card border-border/60">
              <Wrench className="w-6 h-6 text-primary mb-3" />
              <h3 className="font-display font-semibold mb-1">Tools</h3>
              <p className="text-sm text-muted-foreground">
                Curated tools and frameworks for {skill.name.toLowerCase()} are coming soon to the
                community library.
              </p>
            </Card>
            <Card className="p-6 bg-gradient-card border-border/60">
              <Target className="w-6 h-6 text-accent mb-3" />
              <h3 className="font-display font-semibold mb-1">Exercises</h3>
              <p className="text-sm text-muted-foreground">
                Practice prompts and exercises will be added as the community grows. Join to be the
                first to access them.
              </p>
            </Card>
          </section>

          {related.length > 0 && (
            <section>
              <h2 className="text-xs font-display font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
                Related skills in {skill.subCategory}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {related.map((s) => (
                  <Link
                    key={s.slug}
                    to={`/skills/${s.slug}`}
                    className="group block p-4 rounded-lg border border-border/60 bg-card hover:border-primary/50 transition-all"
                  >
                    <span className="font-display font-medium text-sm group-hover:text-primary transition-colors">
                      {s.name}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SkillDetail;
