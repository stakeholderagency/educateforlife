import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileWarning } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// DRAFT, not adopted. Items in [square brackets] are decisions still to make.
// Review with a lawyer (children's data, safeguarding, Danish/EU law) before this goes live.

type Section = { title: string; intro?: string; items?: string[]; after?: string };

const sections: Section[] = [
  {
    title: 'Why we have this',
    intro:
      'Educatefor.Life is a global community where people of every age and background learn, build and grow together. Many of us join from our kitchen tables, with children, parents and grandparents nearby. This Code of Conduct reminds us how to make every call, chat and gathering a safe and fun place for everyone. It is a promise we make to each other, not a list of traps.',
  },
  {
    title: 'Our values',
    items: [
      'Respect: we treat every person as someone worth listening to.',
      'Inclusion: we welcome every culture, language, ability, age, gender, belief and level of experience.',
      'Curiosity: we ask questions, share what we know and assume good intent.',
      'Generosity: "No one can help everyone, but everyone can help someone." When we are helped, we help someone else.',
    ],
  },
  {
    title: 'Where this applies',
    intro:
      'Everywhere the community meets: the Townhall and team video rooms, chat rooms, the member directory and profiles, messages and connection requests, events and sprints, and any space we run on other platforms. It applies to members, guests, hosts and staff alike.',
  },
  {
    title: 'How we show up',
    items: [
      'Be kind and constructive. Disagree with ideas, never attack people.',
      'Use the name and pronouns people give, and let people speak for themselves.',
      'Make room for others. Listen as much as you talk, and welcome newcomers.',
      'Keep it welcoming for all ages. Assume children may be listening, even if you cannot see them.',
      'Respect time and focus: stay on topic in team rooms, and mute when you are not speaking.',
      'Camera and microphone are your choice. No one has to be on camera to take part.',
    ],
  },
  {
    title: 'What we do not accept',
    items: [
      'Harassment, bullying, intimidation or threats, in any form and at any volume.',
      'Hate speech or discrimination based on race, ethnicity, nationality, religion, gender, sexual orientation, age, disability or any other personal characteristic.',
      'Sexual, graphic, violent or otherwise disturbing content or language, and unwelcome romantic or sexual attention.',
      'Sharing other people\'s private information (addresses, contact details, photos, screenshots, recordings) without their permission.',
      'Impersonation, spam, selling or recruiting for outside causes, and anything illegal.',
      'Disrupting calls on purpose, including repeated interruptions, intrusive screen-sharing or noise.',
      'Pressuring anyone to keep a conversation secret or to move it to a private channel.',
    ],
  },
  {
    title: 'Families and children',
    intro:
      'Families are part of this community and children are welcome to join in, with a parent or guardian. These rules exist to keep children safe and to help every adult do the right thing.',
    items: [
      'Accounts are for adults ([18+]). Children take part through a parent or guardian\'s account and only while that adult is present.',
      'A parent or guardian stays with their child, in the room or within earshot, for the whole call or activity. Guardians decide whether their child is on camera, speaks, or uses chat.',
      'Children use a first name or nickname only. Never share a child\'s surname, school, address, phone number or other identifying details in a call, chat or profile.',
      'No one may take, share or record photos, video or audio of a child without the guardian\'s clear permission.',
      'Adults never contact a child privately: no direct messages, no private rooms, no asking a child for contact details or to meet outside the community. If a child needs to be reached, go through their guardian.',
      'Sessions can be marked "family-friendly" or "adults only". Anything marked family-friendly must suit all ages in language, topics and content.',
      'Hosts may ask anyone to leave a call, or remove them, if they think a child\'s safety or comfort is at risk. Hosts do not need to wait for proof.',
      'If a child may be in danger, contact your local emergency number first ([112] in Denmark and across the EU), then tell us.',
    ],
  },
  {
    title: 'Calls and recordings',
    items: [
      'We announce before we record, and only record with the host\'s clear notice to everyone present. Anyone may leave or switch off their camera if they would rather not be recorded.',
      'Do not record, screenshot or stream a call yourself without everyone\'s permission.',
      'Share your screen with care. Close private windows and notifications first.',
      'Be mindful of your background, and of other people in the room with you.',
    ],
  },
  {
    title: 'Hosts and team leads',
    intro:
      'Hosts look after the room. They welcome people, admit guests to locked rooms, say if a session is family-friendly, announce recordings and step in early and kindly when something is not right. Hosts can mute, remove or block disruptive participants and should tell us about it afterwards. Hosts follow this Code like everyone else.',
  },
  {
    title: 'Speaking up',
    intro:
      'If something makes you or someone else uncomfortable, you can leave a call at any time, tell the host, or contact us:',
    items: [
      'Email [conduct@educatefor.life] with what happened, where and when. Include a screenshot if you have one.',
      'Reports are read by [named people] and kept confidential. We share only what is needed to act.',
      'We never punish someone for reporting in good faith.',
    ],
  },
  {
    title: 'What happens next',
    intro:
      'We look at every report fairly and hear from the people involved. Depending on what happened, we may: remind, give a private warning, remove someone from a call, suspend them for a time, or end their membership. We act immediately and may involve the authorities for anything that puts a child or anyone else at risk. If you disagree with a decision, you can ask us to review it.',
  },
  {
    title: 'Keeping this Code alive',
    intro:
      'This Code grows with the community. We will review it [once a year] and tell members when it changes. Questions or ideas are always welcome.',
  },
];

const CodeOfConductDraft = () => {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex';
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <article className="pt-28 pb-24 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>

          <div role="note" className="flex gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 mb-8 text-sm">
            <FileWarning className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p>
              <strong>Draft for review, not yet adopted.</strong> Text in [square brackets] is still to be decided. This
              page is not linked from the site.
            </p>
          </div>

          <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <span className="text-sm font-medium text-primary tracking-widest uppercase mb-3 block">Our promise to each other</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight">
              <span className="text-gradient-primary">Community</span>{' '}
              <span className="text-foreground">Code of Conduct</span>
            </h1>
          </motion.header>

          <div className="space-y-6">
            {sections.map((s, i) => (
              <motion.section
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                className="bg-card border border-border rounded-2xl p-6 md:p-8"
              >
                <h2 className="text-xl md:text-2xl font-display font-bold mb-3">
                  <span className="text-primary mr-2">{i + 1}.</span>{s.title}
                </h2>
                {s.intro && <p className="text-foreground/90 leading-relaxed">{s.intro}</p>}
                {s.items && (
                  <ul className={`space-y-2.5 ${s.intro ? 'mt-4' : ''}`}>
                    {s.items.map((item) => (
                      <li key={item} className="flex gap-3 text-foreground/90 leading-relaxed">
                        <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.section>
            ))}
          </div>
        </div>
      </article>
      <Footer />
    </div>
  );
};

export default CodeOfConductDraft;
