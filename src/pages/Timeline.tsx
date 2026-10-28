import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Users, Globe, Rocket, Award, Heart, Lightbulb, Handshake } from 'lucide-react';
import communityImg from '@/assets/community-moments.jpg';
import sprint2019Img from '@/assets/timeline/2019-sprint.jpg';
import sprint2020Img from '@/assets/timeline/2020-sprint.jpg';
import events2021Img from '@/assets/timeline/2021-events.jpg';
import festival2022Img from '@/assets/timeline/2022-festival.jpg';
import tribe2023Img from '@/assets/timeline/2023-tribe.png';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const timelineEvents = [
  {
    year: '2018',
    title: 'The Seed Is Planted',
    description: 'Educatefor.Life is founded on the belief that personalized, community-driven learning can transform human development. The first conversations begin between educators, entrepreneurs, and lifelong learners across borders.',
    icon: Lightbulb,
    highlight: 'origin',
  },
  {
    year: '2019',
    title: 'First Innovation Sprints',
    description: 'The community launches its first online Innovation Sprints — bringing together multidisciplinary teams to co-create solutions for real-world educational challenges. Mentoring and coaching become core pillars.',
    icon: Rocket,
    highlight: 'milestone',
    image: sprint2019Img,
    imageAlt: 'Welcome to the Educatefor.Life Sprint — 2019 Innovation Sprint Course',
  },
  {
    year: '2020',
    title: 'Going Fully Global & Virtual',
    description: 'As the world shifts online, our virtual Community-of-Practice model proves its resilience. Members from every continent join, forming workgroups matched by shared passions and complementary expertise.',
    icon: Globe,
    highlight: 'growth',
    image: sprint2020Img,
    imageAlt: '2020 EducateforLife Sprint Timeline — 121 Meetings, 24,282 Meeting Minutes, 444 Participants & Supporters',
    imageContain: true,
  },
  {
    year: '2021',
    title: 'Partnerships With Institutions & NGOs',
    description: 'We begin collaborating with families, educational institutions, NGOs, and governments — expanding our reach and validating the community-driven education model at scale.',
    icon: Handshake,
    highlight: 'milestone',
    image: events2021Img,
    imageAlt: 'EducateforLife 2021 Sprint — Kickoff Event and Weekly Team Calls',
    imageContain: true,
  },
  {
    year: '2022',
    title: 'Proven Methods & Transformative Impact',
    description: 'Our innovation methods and tools demonstrate transformative impact. Community members develop programs and services that help others build their own pathways in life.',
    icon: Award,
    highlight: 'growth',
    image: festival2022Img,
    imageAlt: 'Educatefor.Life Festival 2022 (48 hours LIVE) — November 17-19',
  },
  {
    year: '2023',
    title: 'Decentralized Learning Networks',
    description: 'The community embraces decentralized, adaptable learning networks — empowering individuals to take control of their learning journey through personalized, coach-supported, and AI-enhanced education.',
    icon: Users,
    highlight: 'milestone',
    image: tribe2023Img,
    imageAlt: 'Become part of a cocreation tribe — Community collaboration and learning',
  },
  {
    year: '2024',
    title: 'Memorandum & Vision Refresh',
    description: 'A renewed community memorandum affirms our commitment: leveraging emerging technologies, fostering global partnerships, and building inclusive learning pathways that prepare individuals for tomorrow\'s challenges.',
    icon: Heart,
    highlight: 'growth',
    href: '/memorandum',
  },
  {
    year: '2025–26',
    title: '8 Years of Cocreation & Beyond',
    description: 'Celebrating 8 years of cocreation, we launch our digital community platform — connecting members worldwide through a shared mission of raising human consciousness and shifting mindsets from scarcity towards abundance.',
    icon: Calendar,
    highlight: 'current',
  },
];

const CardWrapper = ({ href, children }: { href?: string; children: React.ReactNode }) => {
  const cls = 'block bg-card border border-border rounded-xl overflow-hidden glow-border hover:border-primary/30 transition-colors duration-300';
  return href ? <Link to={href} className={cls}>{children}</Link> : <div className={cls}>{children}</div>;
};

const Timeline = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-12 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block"
          >
            Our Journey
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold mb-4 leading-tight"
          >
            <span className="text-gradient-primary">8 Years</span>{' '}
            <span className="text-foreground">of Cocreation</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            From a small seed of an idea to a truly global virtual Community-of-Practice
            — here is how we grew together.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 rounded-2xl overflow-hidden glow-border max-w-2xl mx-auto"
          >
            <img
              src={communityImg}
              alt="Educatefor.Life community moments"
              className="w-full h-auto object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="pb-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

          {timelineEvents.map((event, index) => {
            const isLeft = index % 2 === 0;
            const Icon = event.icon;

            return (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className={`relative flex items-start mb-12 md:mb-16 ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Dot on the line */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      event.highlight === 'current'
                        ? 'bg-primary border-primary text-primary-foreground'
                        : event.highlight === 'origin'
                        ? 'bg-accent border-accent text-accent-foreground'
                        : 'bg-card border-border text-primary'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Card */}
                <div
                  className={`ml-20 md:ml-0 md:w-[calc(50%-3rem)] ${
                    isLeft ? 'md:pr-0 md:mr-auto' : 'md:pl-0 md:ml-auto'
                  }`}
                >
                  <CardWrapper href={'href' in event ? (event.href as string) : undefined}>
                    {/* Milestone image */}
                    {event.image && (
                      <motion.div
                        initial={{ opacity: 0, scale: 1.05 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative group"
                      >
                        <img
                          src={event.image}
                          alt={event.imageAlt || event.title}
                          className={`w-full transition-transform duration-700 group-hover:scale-105 ${
                            event.imageContain
                              ? 'object-contain p-2 bg-white'
                              : 'h-44 object-cover object-top'
                          }`}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                      </motion.div>
                    )}

                    <div className="p-6">
                      <span className="text-xs font-display font-semibold text-primary tracking-wider uppercase">
                        {event.year}
                      </span>
                      <h3 className="text-lg font-display font-bold mt-1 mb-2 text-foreground">
                        {event.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {event.description}
                      </p>
                      {'href' in event && (
                        <span className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-primary">
                          Read the Memorandum <ArrowRight className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                  </CardWrapper>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Quote */}
      <section className="pb-24 px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <blockquote className="bg-card border border-border rounded-2xl p-8 md:p-12 glow-border">
            <p className="text-lg md:text-xl font-display italic text-foreground leading-relaxed mb-4">
              "'Raising level of human consciousness', shifting human mindset away from
              that of scarcity — towards abundance, in support of sustainability and
              establishing scaffolding and empowerment for every human to leverage in
              their own lives."
            </p>
            <cite className="text-sm text-muted-foreground not-italic">
              — How we define "Education" at Educatefor.Life
            </cite>
          </blockquote>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Timeline;
