import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Compass, Hammer, Sparkles, Users, Network, Mic } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const pathwaysIncludes = [
  {
    title: 'The 60 Human Skills framework',
    body: 'Organised in five areas: Adaptability, Cognitive, Interpersonal, Self-leadership and Digital. Each skill comes with tools and exercises you can start today.',
  },
  {
    title: 'Live workshops run by members',
    body: 'Led by people who use what they teach in their own lives and ventures.',
  },
  {
    title: 'The Townhall',
    body: 'Our open community gathering, where you meet people working on the same questions you are.',
  },
  {
    title: 'Member mentors and AI-enhanced learning',
    body: 'Fellow members who have walked the path before you, plus AI tools that help you practise, so you are never figuring it out alone.',
  },
  {
    title: 'A pathway that is yours',
    body: 'Not a course designed for "everyone". You build it around who you are becoming.',
  },
];

const builderLoop = [
  { step: 'Listen', body: 'Talk to the people or organisations you want to serve before you build anything.' },
  { step: 'Pinpoint the pain', body: 'Find the problem they would gladly pay, or give their time, to solve.' },
  { step: 'Build the smallest helpful thing', body: 'A session, a service or a simple tool. Days, not months.' },
  { step: 'Put it in real hands', body: 'Pilot users first, paying clients next.' },
  { step: 'Learn and repeat', body: 'Every round makes it sharper.' },
];

const Section = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

const Programs = () => {
  const { user } = useAuth();
  const joinHref = user ? '/dashboard' : '/auth';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-28 pb-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Intro */}
          <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 text-center">
            <span className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block">Our Programs</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight mb-6">
              Two ways to grow. <span className="text-gradient-warm">Move freely between them.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Start with yourself. When you are ready, build something that helps others. You can step back to rethink
              your direction whenever you need to. That isn't failing, it's part of finding your path.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="heroOutline" asChild>
                <a href="#pathways">Pathways · Free</a>
              </Button>
              <Button variant="heroOutline" asChild>
                <a href="#builders">Builders · By application</a>
              </Button>
            </div>
          </motion.header>

          {/* Tier 1: Pathways */}
          <section id="pathways" className="scroll-mt-28 mb-20">
            <Section>
              <div className="bg-card border border-border rounded-2xl p-6 md:p-10 glow-border">
                <div className="flex items-center gap-3 mb-4">
                  <Compass className="w-6 h-6 text-primary" />
                  <span className="text-sm font-medium text-primary tracking-widest uppercase">Tier 1 · Pathways · Free</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold leading-tight mb-4">
                  Develop Your Own Pathways in Life
                </h2>
                <p className="text-lg md:text-xl font-medium text-foreground/90 mb-6">
                  Grow the human skills no machine can replace, at your own pace, with a global community beside you.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  The world is changing faster than any school curriculum can keep up. Pathways is where you take
                  control of your own learning. You choose the skills that matter to you now and grow them through
                  workshops, practice and conversations with people from every generation and culture. No entry test,
                  no fee and no fixed route, just the next step that fits you.
                </p>

                <h3 className="text-lg font-display font-semibold mb-4">What you get</h3>
                <ul className="space-y-4 mb-8">
                  {pathwaysIncludes.map((item) => (
                    <li key={item.title} className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground/90">
                        <span className="font-semibold">{item.title}.</span>{' '}
                        <span className="text-muted-foreground">
                          {item.title === 'The 60 Human Skills framework' ? (
                            <>
                              {item.body}{' '}
                              <Link to="/skills" className="text-primary hover:underline">
                                Explore the skills
                              </Link>
                            </>
                          ) : (
                            item.body
                          )}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="text-muted-foreground leading-relaxed mb-8">
                  <span className="font-semibold text-foreground">Already building something?</span> You are welcome
                  back here anytime. The best builders return to the basics: purpose, resilience, the courage to
                  unlearn.
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <Button variant="hero" size="lg" asChild>
                    <Link to={joinHref}>
                      {user ? 'Go to your dashboard' : 'Join Pathways free'}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Free forever. No card needed. Your membership stays active as long as you keep developing yourself.
                  </p>
                </div>
              </div>
            </Section>
          </section>

          {/* Tier 2: Builders */}
          <section id="builders" className="scroll-mt-28">
            <Section>
              <div className="bg-card border border-border rounded-2xl p-6 md:p-10 glow-border">
                <div className="flex items-center gap-3 mb-4">
                  <Hammer className="w-6 h-6 text-warm" />
                  <span className="text-sm font-medium text-warm tracking-widest uppercase">
                    Tier 2 · Builders · By application
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold leading-tight mb-4">
                  Build a Microbusiness with Programs or Services That Help Others
                </h2>
                <p className="text-lg md:text-xl font-medium text-foreground/90 mb-10">
                  Start with real people and their real problems. Put something useful in their hands fast. Build it
                  with a Crew that completes you, woven into a global network of partners from day one.
                </p>

                <div className="space-y-10">
                  <div>
                    <h3 className="text-xl font-display font-semibold mb-3">We start outside-in</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Most new businesses start with an idea and then go looking for someone who wants it. We do it the
                      other way round. You start with the people or types of organisations you want to help, and the
                      problem they struggle with every day. Then you build the smallest thing that helps, put it in front
                      of them and learn. Then you do it again, and again, fast.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-display font-semibold mb-4">The Builder loop</h3>
                    <ol className="space-y-3">
                      {builderLoop.map((s, i) => (
                        <li key={s.step} className="flex gap-4">
                          <span className="w-8 h-8 rounded-full bg-primary/15 text-primary font-display font-bold flex items-center justify-center shrink-0">
                            {i + 1}
                          </span>
                          <span className="pt-1">
                            <span className="font-semibold">{s.step}.</span>{' '}
                            <span className="text-muted-foreground">{s.body}</span>
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <h3 className="text-xl font-display font-semibold">Find your Constellation, form your Crew</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      We match you with fellow Educatefor.Life members, in Pathways and Builders alike, whose strengths
                      complete yours and whose dreams point the same way. Different ages, backgrounds, cultures and
                      skills: that's the point. Like stars in a constellation, each of you brings something no one else
                      in the group has, and together you make a shape none of you could make alone. That Constellation
                      becomes your Crew, the people you build your microbusiness with.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Network className="w-5 h-5 text-primary" />
                      <h3 className="text-xl font-display font-semibold">Part of the Weave from day one</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Every microbusiness is woven into the global Educatefor.Life ecosystem: many different threads
                      making one strong fabric. The other members and partners are your allies, not your competitors.
                      Where there's a fit, they can become your first pilot users or even your first clients.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-5 h-5 text-primary" />
                      <h3 className="text-xl font-display font-semibold">Tools for builders, included</h3>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">
                          <a
                            href="https://sprinthero.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-foreground hover:text-primary"
                          >
                            Sprinthero.com
                          </a>{' '}
                          gives your Crew guided innovation sprints and a shared team space to go from a problem to a
                          working offer quickly.
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">
                          <a
                            href="https://stakeholderagency.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-foreground hover:text-primary"
                          >
                            Stakeholderagency.com
                          </a>{' '}
                          helps you search for the investors, grants and partners beyond our community who can help your
                          microbusiness grow, so you know whom to contact.
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Mic className="w-5 h-5 text-primary" />
                      <h3 className="text-xl font-display font-semibold">Teach what you know</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Builders run many of our community workshops. It's how you share your expertise, test your offer
                      and meet your first users, all while helping the next person find their path.
                    </p>
                  </div>

                  <div className="rounded-xl border border-warm/30 bg-warm/5 p-6">
                    <h3 className="text-xl font-display font-semibold mb-3">No cash cost. We grow when you grow.</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Builders pay no membership fee. Instead, you share a portion of the revenue your microbusiness
                      earns, only for as long as you are a Builder. If you have not earned anything yet, you pay nothing.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-display font-semibold mb-3">How to join</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Builders is open by application to Pathways members. Start in Pathways, grow your skills and get
                      to know the community. When you are ready to build, apply.
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <Button variant="hero" size="lg" disabled aria-disabled="true">
                        Applications coming soon
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        {user ? (
                          'Keep growing in Pathways meanwhile.'
                        ) : (
                          <>
                            Meanwhile,{' '}
                            <Link to="/auth" className="text-primary hover:underline">
                              join Pathways free
                            </Link>
                            .
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Section>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Programs;
