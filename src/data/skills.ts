export type Skill = {
  slug: string;
  name: string;
  category: SkillCategory;
  subCategory: string;
  articleUrl?: string;
};

export type SkillCategory =
  | "Adaptability"
  | "Cognitive"
  | "Interpersonal"
  | "Self-leadership"
  | "Digital";

export const categoryDescriptions: Record<SkillCategory, { tagline: string; description: string }> = {
  Adaptability: {
    tagline: "Mindset, ability and environment to thrive in change",
    description:
      "The capacity to adjust to new conditions — through mindset, character traits and a supportive environment that lets you grow, recover, and unlearn.",
  },
  Cognitive: {
    tagline: "How you think, learn and solve problems",
    description:
      "Critical thinking, planning, communication, pattern recognition and creativity — the mental skills that turn information into insight and action.",
  },
  Interpersonal: {
    tagline: "Mobilising others and building relationships",
    description:
      "How you connect, collaborate, lead and develop people. From empathy and trust to coaching, conflict resolution and team effectiveness.",
  },
  "Self-leadership": {
    tagline: "Leading yourself with awareness and purpose",
    description:
      "Self-awareness, self-management, entrepreneurship and the drive to set and achieve meaningful goals — leadership starts with you.",
  },
  Digital: {
    tagline: "Fluency, software, data and AI in a tech world",
    description:
      "Digital citizenship, software and data skills, and an understanding of digital systems including AI and cybersecurity.",
  },
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const raw: Omit<Skill, "slug">[] = [
  // Adaptability — Ability
  { name: "Mindset", category: "Adaptability", subCategory: "Ability" },
  { name: "Mental Flexibility", category: "Adaptability", subCategory: "Ability" },
  { name: "Grit", category: "Adaptability", subCategory: "Ability" },
  {
    name: "Resilience",
    category: "Adaptability",
    subCategory: "Ability",
    articleUrl:
      "https://educatefor.life/en/human-development-in-a-tech-world/from-rigidity-to-resilience-the-transformation-power-of-adaptability",
  },
  {
    name: "Unlearn",
    category: "Adaptability",
    subCategory: "Ability",
    articleUrl:
      "https://www.linkedin.com/pulse/paradox-expertise-why-unlearning-new-skill-you-need-lars-lin-villebæk-10cyf/",
  },
  // Adaptability — Character
  { name: "Extraversion", category: "Adaptability", subCategory: "Character" },
  { name: "Hope", category: "Adaptability", subCategory: "Character" },
  { name: "Motivation Style", category: "Adaptability", subCategory: "Character" },
  { name: "Thinking Style", category: "Adaptability", subCategory: "Character" },
  { name: "Emotional Range", category: "Adaptability", subCategory: "Character" },
  // Adaptability — Environment
  { name: "Company Support", category: "Adaptability", subCategory: "Environment" },
  { name: "Emotional Health", category: "Adaptability", subCategory: "Environment" },
  { name: "Team Support", category: "Adaptability", subCategory: "Environment" },
  { name: "Work Environment", category: "Adaptability", subCategory: "Environment" },
  { name: "Work Stress", category: "Adaptability", subCategory: "Environment" },

  // Cognitive — Critical Thinking
  { name: "Structured Problem Solving", category: "Cognitive", subCategory: "Critical Thinking" },
  { name: "Logical Reasoning", category: "Cognitive", subCategory: "Critical Thinking" },
  { name: "Understanding Biases", category: "Cognitive", subCategory: "Critical Thinking" },
  {
    name: "Seeking relevant information, researching in the age of AI",
    category: "Cognitive",
    subCategory: "Critical Thinking",
    articleUrl:
      "https://www.linkedin.com/pulse/how-unearthing-trends-reveal-new-transformational-lars-lin-villebæk-g55vf/",
  },
  // Cognitive — Planning and Ways of Working
  { name: "Work-plan Development", category: "Cognitive", subCategory: "Planning and Ways of Working" },
  { name: "Time management and prioritization", category: "Cognitive", subCategory: "Planning and Ways of Working" },
  { name: "Agile, Thinking and Acting", category: "Cognitive", subCategory: "Planning and Ways of Working" },
  // Cognitive — Communication
  { name: "Storytelling and public speaking", category: "Cognitive", subCategory: "Communication" },
  { name: "Asking the right questions", category: "Cognitive", subCategory: "Communication" },
  { name: "Synthesizing messages", category: "Cognitive", subCategory: "Communication" },
  { name: "Active Listening", category: "Cognitive", subCategory: "Communication" },
  // Cognitive — Pattern Recognition
  {
    name: "Recognize patterns",
    category: "Cognitive",
    subCategory: "Pattern Recognition",
    articleUrl:
      "https://www.linkedin.com/pulse/your-human-power-pattern-recognition-key-skill-desired-villebæk-lt5rf/",
  },
  { name: "Use Patterns", category: "Cognitive", subCategory: "Pattern Recognition" },
  { name: "Create New Patterns (Habits)", category: "Cognitive", subCategory: "Pattern Recognition" },
  // Cognitive — Creativity & Imagination
  { name: "Translating knowledge to different contexts", category: "Cognitive", subCategory: "Creativity & Imagination" },
  { name: "Adopting a different perspective", category: "Cognitive", subCategory: "Creativity & Imagination" },
  { name: "Ability to Learn", category: "Cognitive", subCategory: "Creativity & Imagination" },

  // Interpersonal — Mobilising Systems
  { name: "Role modelling", category: "Interpersonal", subCategory: "Mobilising Systems" },
  { name: "Win-win Negotiations", category: "Interpersonal", subCategory: "Mobilising Systems" },
  { name: "Creating an Inspiring Vision/Purpose", category: "Interpersonal", subCategory: "Mobilising Systems" },
  { name: "Organisational Awareness", category: "Interpersonal", subCategory: "Mobilising Systems" },
  // Interpersonal — Developing Relationships
  { name: "Empathy", category: "Interpersonal", subCategory: "Developing Relationships" },
  { name: "Inspiring Trust", category: "Interpersonal", subCategory: "Developing Relationships" },
  { name: "Humility", category: "Interpersonal", subCategory: "Developing Relationships" },
  { name: "Sociability", category: "Interpersonal", subCategory: "Developing Relationships" },
  // Interpersonal — Teamwork Effectiveness
  { name: "Fostering Inclusiveness", category: "Interpersonal", subCategory: "Teamwork Effectiveness" },
  { name: "Motivating Different Personalities", category: "Interpersonal", subCategory: "Teamwork Effectiveness" },
  { name: "Resolving Conflicts", category: "Interpersonal", subCategory: "Teamwork Effectiveness" },
  {
    name: "Collaboration",
    category: "Interpersonal",
    subCategory: "Teamwork Effectiveness",
    articleUrl:
      "https://www.linkedin.com/pulse/mastering-teamwork-comprehensive-guide-effective-lars-lin-villebæk-ri5rf/",
  },
  {
    name: "Coaching",
    category: "Interpersonal",
    subCategory: "Teamwork Effectiveness",
    articleUrl:
      "https://www.linkedin.com/pulse/significance-adopting-coaching-mindset-organizations-age-villebæk-9ad4f/",
  },
  { name: "Empowering", category: "Interpersonal", subCategory: "Teamwork Effectiveness" },

  // Self-leadership — Self-awareness & Self-management
  {
    name: "Purpose Driven (Becoming)",
    category: "Self-leadership",
    subCategory: "Self-awareness & Self-management",
    articleUrl:
      "https://www.linkedin.com/pulse/from-struggle-success-crafting-your-next-pathway-life-villebæk-yincc/",
  },
  { name: "Understanding Own Emotions & Triggers", category: "Self-leadership", subCategory: "Self-awareness & Self-management" },
  {
    name: "Self-control & Regulation",
    category: "Self-leadership",
    subCategory: "Self-awareness & Self-management",
    articleUrl:
      "https://www.linkedin.com/pulse/role-self-control-regulation-your-self-leadership-lars-lin-villebæk-pspwf/",
  },
  { name: "Understanding Own Strengths", category: "Self-leadership", subCategory: "Self-awareness & Self-management" },
  { name: "Integrity", category: "Self-leadership", subCategory: "Self-awareness & Self-management" },
  { name: "Self-motivation & Wellness", category: "Self-leadership", subCategory: "Self-awareness & Self-management" },
  { name: "Self-confidence", category: "Self-leadership", subCategory: "Self-awareness & Self-management" },
  // Self-leadership — Entrepreneurship
  { name: "Courage & Risk-taking", category: "Self-leadership", subCategory: "Entrepreneurship" },
  { name: "Driving Change & Innovation", category: "Self-leadership", subCategory: "Entrepreneurship" },
  { name: "Passion & Optimism", category: "Self-leadership", subCategory: "Entrepreneurship" },
  {
    name: "Breaking Orthodoxies",
    category: "Self-leadership",
    subCategory: "Entrepreneurship",
    articleUrl:
      "https://www.linkedin.com/pulse/3-technological-orthodoxies-crumbling-face-generative-villebæk-kqiyf/",
  },
  // Self-leadership — Goals Achievement
  { name: "Ownership & Decisiveness", category: "Self-leadership", subCategory: "Goals Achievement" },
  { name: "Achievement Orientation", category: "Self-leadership", subCategory: "Goals Achievement" },

  // Digital — Digital Fluency & Citizenship
  { name: "Digital Literacy", category: "Digital", subCategory: "Digital Fluency & Citizenship" },
  { name: "Digital Learning", category: "Digital", subCategory: "Digital Fluency & Citizenship" },
  { name: "Digital Collaboration", category: "Digital", subCategory: "Digital Fluency & Citizenship" },
  { name: "Digital Ethics", category: "Digital", subCategory: "Digital Fluency & Citizenship" },
  // Digital — Software Use & Development
  { name: "Programming Literacy", category: "Digital", subCategory: "Software Use & Development" },
  { name: "Data Analytics & Statistics", category: "Digital", subCategory: "Software Use & Development" },
  { name: "Computational & Algorithmic Thinking", category: "Digital", subCategory: "Software Use & Development" },
  // Digital — Understanding Digital Systems
  { name: "Data Literacy", category: "Digital", subCategory: "Understanding Digital Systems" },
  {
    name: "AI Literacy",
    category: "Digital",
    subCategory: "Understanding Digital Systems",
    articleUrl:
      "https://www.linkedin.com/pulse/ai-literacy-your-roadmap-navigate-world-powered-lars-lin-villebæk-v3zof/",
  },
  {
    name: "Cybersecurity Literacy",
    category: "Digital",
    subCategory: "Understanding Digital Systems",
    articleUrl:
      "https://www.linkedin.com/pulse/improving-cybersecurity-through-human-adaptability-lars-lin-villebæk-33jpc/",
  },
  { name: "Tech Translation & Enablement", category: "Digital", subCategory: "Understanding Digital Systems" },
];

export const skills: Skill[] = raw.map((s) => ({ ...s, slug: slugify(s.name) }));

export const categoryOrder: SkillCategory[] = [
  "Adaptability",
  "Cognitive",
  "Interpersonal",
  "Self-leadership",
  "Digital",
];

export const skillsByCategory = categoryOrder.map((category) => {
  const items = skills.filter((s) => s.category === category);
  const subMap = new Map<string, Skill[]>();
  items.forEach((s) => {
    const list = subMap.get(s.subCategory) ?? [];
    list.push(s);
    subMap.set(s.subCategory, list);
  });
  return {
    category,
    subCategories: Array.from(subMap.entries()).map(([subCategory, skills]) => ({ subCategory, skills })),
  };
});

export const getSkillBySlug = (slug: string) => skills.find((s) => s.slug === slug);
