import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const principles = [
  'Empower individuals to take control of their learning journey through personalized, coach-supported and AI-enhanced education',
  'Utilize community spaces and expertise to create rich, contextual learning environments',
  'Reduce the financial burden on public systems while improving educational outcomes',
  'Foster creativity, innovation, and problem-solving skills essential for the future workforce',
  'Create inclusive learning opportunities that transcend traditional socioeconomic barriers',
];

const Memorandum = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    <article className="pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/timeline"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to our journey
        </Link>

        <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block">
            2024 · Community Memorandum
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight">
            <span className="text-gradient-primary">Memorandum</span>{' '}
            <span className="text-foreground">&amp; Vision Refresh</span>
          </h1>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-6 md:p-10 glow-border space-y-6 text-foreground/90 text-base md:text-lg leading-relaxed"
        >
          <p>
            As we stand at the crossroads of technological advancement and educational transformation, the need for a
            global, dynamic, community-driven learning ecosystem has never been more critical. The acceleration of
            change in our world has not only continued but intensified, demanding an entirely new approach to education
            and learning.
          </p>
          <p>
            The traditional educational model, designed for the Industrial Age, has proven increasingly inadequate in
            meeting the needs of our rapidly evolving digital society. Our vision for community-driven education has
            emerged as a viable and necessary alternative, offering personalized learning pathways that adapt to
            individual needs while leveraging community assets and expertise.
          </p>
          <p>
            We recognize that the future of education lies not in centralized institutions but in decentralized,
            adaptable learning networks that:
          </p>
          <ul className="space-y-3 pl-1">
            {principles.map((p) => (
              <li key={p} className="flex gap-3">
                <span className="mt-3 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <p>
            Our growing global community has demonstrated that collaborative, community-driven education can deliver
            profound impact without centralized control. This approach not only enhances life long learning outcomes
            but also strengthens social fabric and peaceful and mutually inspiring global cocreation across generations
            and cultures.
          </p>
          <p>
            As we move forward, we commit to leveraging emerging technologies, fostering global partnerships, and
            building inclusive learning pathways that prepare individuals for the challenges and opportunities of
            tomorrow. The future of education is not just about transferring knowledge; it&apos;s about creating
            empowered, adaptable global citizens, who can thrive in an ever-changing world.
          </p>
          <p className="font-display text-xl md:text-2xl text-foreground">
            Together, we are building an educational ecosystem that is accessible, personalized, and responsive to the
            needs of all learners, anywhere and at any time.
          </p>
        </motion.div>
      </div>
    </article>

    <Footer />
  </div>
);

export default Memorandum;
