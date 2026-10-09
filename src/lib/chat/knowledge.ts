// Builds the assistant's knowledge base from src/data/portfolio.ts, the same
// data the site renders. There is no separate knowledge file to maintain:
// add a project, skill, link or achievement there and the next deploy picks
// it up in both the UI and the assistant.
//
// Everything here is derived. Retrieval keywords come from titles, tags and
// categories, skill evidence comes from cross-referencing skills with project
// tags, and the link allowlist comes from the URLs in the data.

import * as portfolio from '../../data/portfolio';

// ── Shape of the data the assistant reads ────────────────────────

interface ProjectLike {
  title: string;
  subtitle: string;
  description: string;
  category: string;
  tags: string[];
  github: string;
  demo: string;
  featured?: boolean;
  status?: string;
  insights?: string[];
  details?: string[];
}

export interface PortfolioData {
  personal: {
    name: string;
    title: string;
    email: string;
    location: string;
    availability: string;
    website: string;
    headline: string;
    summary: string;
    resume: string;
    masterResume: string;
    videoResume: string;
    social: Record<string, string>;
    stats: { label: string; value: string }[];
  };
  capabilities: { title: string; items: string[] }[];
  skillsMarquee: string[];
  skillCategories: { category: string; skills: { name: string; level: number }[] }[];
  additionalSkills: Record<string, string[]>;
  projects: ProjectLike[];
  education: {
    degree: string;
    institution: string;
    location: string;
    period: string;
    description: string;
    highlights: string[];
    grade?: string;
    current?: boolean;
  }[];
  experience: {
    role: string;
    company: string;
    location: string;
    period: string;
    description: string;
    highlights: string[];
    details?: string[];
    current?: boolean;
  }[];
  certifications: { title: string; issuer: string; date: string; credentialId: string; url: string }[];
  codingProfiles: {
    github: { username: string; url: string; repos: number; contributions: number; topLanguages: string[] };
    leetcode: { username: string; url: string; solved: string };
    gfg: { username: string; url: string };
  };
  achievements: string[];
  training: { title: string; provider: string; period: string; details: string }[];
  careerInterests: string[];
}

export interface KnowledgeChunk {
  id: string;
  title: string;
  text: string;
  /** token → weight, used by retrieval */
  keywords: Map<string, number>;
  /** Always sent to the model, regardless of the question. */
  always?: boolean;
}

export interface KnowledgeBase {
  chunks: KnowledgeChunk[];
  siteUrl: string;
  allowedLinks: Set<string>;
  allowedEmails: Set<string>;
  allowedAnchors: Set<string>;
}

// ── Tokenisation (shared with retrieval) ─────────────────────────

const STOPWORDS = new Set(
  ('a an and are as at be by can could did do does for from get give has have he her him his how i if in ' +
    'into is it its me my of on or our please show so some tell than that the their them then there these ' +
    'they this to us was we what when where which who whom why will with would you your about any also ' +
    'akshit jain akshits more much very just like know used use using does did done one first second ' +
    'project projects work worked working')
    .split(' '),
);

export function tokenize(text: string): string[] {
  const normalised = text
    .toLowerCase()
    .replace(/c\+\+/g, ' cpp ')
    .replace(/c#/g, ' csharp ')
    .replace(/next\.js/g, ' nextjs ')
    .replace(/node\.js/g, ' nodejs ')
    .replace(/a\*/g, ' astar ');
  const out: string[] = [];
  for (const raw of normalised.split(/[^a-z0-9]+/)) {
    if (!raw || STOPWORDS.has(raw)) continue;
    // Light stemming: "projects" → "project", "agents" → "agent".
    const t = raw.length > 3 && raw.endsWith('s') && !raw.endsWith('ss') ? raw.slice(0, -1) : raw;
    if (t.length < 2 && t !== 'c') continue;
    out.push(t);
  }
  return out;
}

function weigh(parts: Array<[string | string[] | undefined, number]>): Map<string, number> {
  const map = new Map<string, number>();
  for (const [value, weight] of parts) {
    if (!value) continue;
    const text = Array.isArray(value) ? value.join(' ') : value;
    for (const tok of tokenize(text)) map.set(tok, Math.max(map.get(tok) ?? 0, weight));
  }
  return map;
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const bullets = (items: string[]) => items.map((i) => `- ${i}`).join('\n');
const unique = <T,>(items: T[]) => Array.from(new Set(items));

// Generic synonyms so natural phrasing ("AI projects", "web apps") finds
// projects by their category and tags. Nothing here is per-project.
const CATEGORY_TERMS: Array<[RegExp, string]> = [
  [/machine learning|ml/i, 'ml machine learning ai model'],
  [/computer vision/i, 'cv computer vision image ai'],
  [/data science/i, 'data analytics analysis visualisation visualization'],
  [/web/i, 'web website app fullstack full stack'],
  [/desktop/i, 'desktop gui app'],
  [/simulation/i, 'simulation physics algorithm'],
];
const TAG_TERMS: Array<[RegExp, string]> = [
  [/gemini|llm|gpt|openai|generative/i, 'ai llm generative'],
  [/agent/i, 'agent agentic ai llm'],
  [/hackathon/i, 'hackathon competition'],
  [/nlp|huggingface|transformer/i, 'nlp language ai ml'],
  [/opencv|vision/i, 'cv vision image'],
  [/pytorch|tensorflow|scikit|k-modes|kmodes|keras/i, 'ml machine learning ai'],
  [/mlops|docker|aws|github actions/i, 'mlops deployment devops cloud'],
  [/django|fastapi|flask|next|react|vite/i, 'web fullstack backend frontend'],
  [/algorithm|quadtree|barnes|dijkstra/i, 'algorithm dsa'],
];

const derivedTerms = (p: ProjectLike) =>
  [
    ...CATEGORY_TERMS.filter(([re]) => re.test(p.category)).map(([, t]) => t),
    ...TAG_TERMS.filter(([re]) => p.tags.some((tag) => re.test(tag)) || re.test(p.subtitle)).map(([, t]) => t),
  ].join(' ');

const linkOrNone = (url: string, label: string) => (url ? `${label}: ${url}` : `${label}: not publicly listed`);

// ── Builders ─────────────────────────────────────────────────────

function projectChunk(p: ProjectLike): KnowledgeChunk {
  const extra = [...(p.insights ?? []), ...(p.details ?? [])];
  const lines = [
    `PROJECT: ${p.title} — ${p.subtitle}`,
    `Category: ${p.category}${p.status ? ` · Status: ${p.status}` : ''}`,
    `Technologies: ${p.tags.join(', ')}`,
    `Description: ${p.description}`,
    extra.length ? `Details:\n${bullets(extra)}` : '',
    linkOrNone(p.github, 'GitHub repository'),
    linkOrNone(p.demo, 'Live demo'),
  ].filter(Boolean);
  return {
    id: `project:${slug(p.title)}`,
    title: p.title,
    text: lines.join('\n'),
    keywords: weigh([
      [p.title, 6],
      [p.subtitle, 3],
      [p.tags, 3],
      [p.category, 2],
      [derivedTerms(p), 2],
      [p.description, 1],
      [extra, 1],
    ]),
  };
}

/** Splits "Pandas / NumPy" style entries so each name can be matched. */
const skillParts = (name: string) => name.split('/').map((s) => s.trim()).filter(Boolean);

function skillEvidence(d: PortfolioData): { used: string[]; unused: string[]; all: string[] } {
  const all = unique([
    ...d.skillCategories.flatMap((c) => c.skills.map((s) => s.name)),
    ...d.skillsMarquee,
    ...Object.values(d.additionalSkills).flat(),
  ]);
  const used: string[] = [];
  const unused: string[] = [];
  for (const skill of all) {
    const names = skillParts(skill).map((s) => s.toLowerCase());
    const inProjects = d.projects
      .filter((p) => p.tags.some((t) => names.includes(t.toLowerCase())))
      .map((p) => p.title);
    if (inProjects.length) used.push(`${skill}: ${inProjects.join(', ')}`);
    else unused.push(skill);
  }
  return { used, unused, all };
}

function buildCore(d: PortfolioData): KnowledgeChunk {
  const p = d.personal;
  const job = d.experience.find((e) => e.current) ?? d.experience[0];
  const study = d.education.find((e) => e.current) ?? d.education[0];
  const text = [
    'IDENTITY',
    `Name: ${p.name}`,
    `Portfolio headline title: ${p.title}`,
    job ? `Current role: ${job.role} at ${job.company} (${job.period})` : '',
    `Location: ${p.location}`,
    `Resume headline: ${p.headline}`,
    study
      ? `Education: ${study.degree}, ${study.institution}, ${study.location} (${study.period})${study.grade ? `, ${study.grade}` : ''}.`
      : '',
    `Availability: ${p.availability}.`,
    `Professional summary: ${p.summary}`,
    `Portfolio stats: ${p.stats.map((x) => `${x.value} ${x.label}`).join(' · ')}`,
    '',
    'VERIFIED LINKS AND CONTACT (the only links and contact details you may share)',
    `- Email: ${p.email} (mailto:${p.email})`,
    `- Portfolio website: ${p.website}`,
    ...Object.entries(p.social).map(([k, v]) => `- ${k[0].toUpperCase()}${k.slice(1)}: ${v}`),
    `- Resume (PDF, 1 page): ${p.resume}`,
    `- Detailed master resume (PDF): ${p.masterResume}`,
    `- Video resume: ${p.videoResume}`,
    '- Contact form: the Contact section of this site (#contact)',
    '- Phone number: not shared through this assistant. Use email or the contact form.',
    '',
    'PROJECT INDEX (names, stack and links only; details appear in separate sections when relevant)',
    ...d.projects.map(
      (x) =>
        `- ${x.title} [${x.tags.slice(0, 3).join(', ')}]${x.github ? ` repo: ${x.github}` : ' (no public repo)'}${x.demo ? ` demo: ${x.demo}` : ''}`,
    ),
    d.achievements[0] ? `\nHeadline achievement: ${d.achievements[0]}` : '',
  ].join('\n');
  return { id: 'core', title: 'Profile overview', text, keywords: new Map(), always: true };
}

function buildExperience(d: PortfolioData): KnowledgeChunk {
  const text = [
    'EXPERIENCE',
    ...d.experience.map((e) =>
      [
        `${e.role} — ${e.company}${e.location ? ` (${e.location})` : ''}, ${e.period}${e.current ? ' (current)' : ''}`,
        `Description: ${e.description}`,
        `Highlights: ${e.highlights.join('; ')}`,
        e.details?.length ? `Responsibilities and context:\n${bullets(e.details)}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
    ),
    `These are his only documented professional roles (${d.experience.length}). No other employment is documented.`,
  ].join('\n\n');
  return {
    id: 'experience',
    title: 'Professional experience',
    text,
    keywords: weigh([
      ['experience internship intern job role employment company professional responsibility enterprise', 5],
      [d.experience.map((e) => `${e.role} ${e.company}`), 5],
      [d.experience.flatMap((e) => [e.description, ...e.highlights, ...(e.details ?? [])]), 1],
    ]),
  };
}

function buildEducation(d: PortfolioData): KnowledgeChunk {
  const text = [
    'EDUCATION',
    ...d.education.map(
      (e) =>
        `- ${e.degree}, ${e.institution}, ${e.location} (${e.period})${e.grade ? `. Grade: ${e.grade}` : ''}. ${e.description} Highlights: ${e.highlights.join(', ')}.`,
    ),
    d.training.length ? 'Training:' : '',
    ...d.training.map((t) => `- ${t.title}, ${t.provider} (${t.period}): ${t.details}`),
  ]
    .filter(Boolean)
    .join('\n');
  return {
    id: 'education',
    title: 'Education',
    text,
    keywords: weigh([
      ['education degree btech university college school cgpa gpa grade marks study student academic graduate graduation class training', 5],
      [d.education.map((e) => `${e.degree} ${e.institution}`), 4],
      [d.training.map((t) => `${t.title} ${t.provider}`), 3],
    ]),
  };
}

function buildSkills(d: PortfolioData): KnowledgeChunk {
  const evidence = skillEvidence(d);
  const text = [
    'TECHNICAL SKILLS',
    'Portfolio skill categories (numbers are his own self-rated proficiency out of 100, not test scores):',
    ...d.skillCategories.map((c) => `- ${c.category}: ${c.skills.map((s) => `${s.name} (${s.level})`).join(', ')}`),
    `Technologies shown on the portfolio: ${d.skillsMarquee.join(', ')}`,
    'Additional skills listed on the resume:',
    ...Object.entries(d.additionalSkills).map(([k, v]) => `- ${k}: ${v.join(', ')}`),
    'What he does (portfolio capabilities):',
    ...d.capabilities.map((c) => `- ${c.title}: ${c.items.join('; ')}`),
    `GitHub top languages: ${d.codingProfiles.github.topLanguages.join(', ')}.`,
    '',
    'SKILL EVIDENCE (computed from project technology tags)',
    'Skills used in documented projects:',
    bullets(evidence.used),
    `Listed, but no project's technology tags document their use (mention work experience if relevant, otherwise say it is listed only): ${evidence.unused.join(', ')}`,
  ].join('\n');
  return {
    id: 'skills',
    title: 'Technical skills',
    text,
    keywords: weigh([
      ['skill skills technical technology technologies stack language languages programming framework library tool tools proficiency proficient expert strong strongest know experience', 4],
      [evidence.all, 3],
    ]),
  };
}

function buildCertifications(d: PortfolioData): KnowledgeChunk {
  const text = [
    `CERTIFICATIONS (${d.certifications.length} listed on the portfolio; each link opens the certificate)`,
    ...d.certifications.map(
      (c) => `- ${c.title} — ${c.issuer} (${c.date})${c.credentialId ? `, credential ID ${c.credentialId}` : ''}: ${c.url}`,
    ),
  ].join('\n');
  return {
    id: 'certifications',
    title: 'Certifications',
    text,
    keywords: weigh([
      ['certification certifications certificate certified course courses credential', 6],
      [d.certifications.map((c) => `${c.title} ${c.issuer}`), 1],
    ]),
  };
}

function buildAchievements(d: PortfolioData): KnowledgeChunk {
  const { github: gh, leetcode, gfg } = d.codingProfiles;
  const text = [
    'ACHIEVEMENTS',
    bullets(d.achievements),
    '',
    'CODING PROFILES',
    `- GitHub ${gh.username}: ${gh.url} — about ${gh.repos} repositories, ${gh.contributions}+ contributions; top languages ${gh.topLanguages.join(', ')}.`,
    `- LeetCode ${leetcode.username}: ${leetcode.url} — ${leetcode.solved} problems solved.`,
    `- GeeksforGeeks ${gfg.username}: ${gfg.url}.`,
    'No competitive programming ratings or rankings are documented.',
  ].join('\n');
  return {
    id: 'achievements',
    title: 'Achievements and coding profiles',
    text,
    keywords: weigh([
      ['achievement achievements award awards hackathon hackathons winner win won prize patent accomplishment recognition leetcode gfg geeksforgeeks dsa competitive coding profile github repositories repo', 5],
      [d.achievements, 1],
    ]),
  };
}

function buildGoals(d: PortfolioData): KnowledgeChunk {
  return {
    id: 'goals',
    title: 'Career interests',
    text: ['CAREER INTERESTS AND GOALS', `Availability: ${d.personal.availability}`, bullets(d.careerInterests)].join('\n'),
    keywords: weigh([
      ['goal goals interest interests career future aspiration looking open role roles hire hiring full time fulltime available availability passion motivate', 5],
    ]),
  };
}

// ── Link allowlist ───────────────────────────────────────────────

/** Canonical form used to compare URLs: lowercase host, no trailing slash / .git / fragment. */
export function canonicalUrl(url: string, siteUrl: string): string {
  let u = url.trim();
  if (u.startsWith('/') && !u.startsWith('//')) u = siteUrl.replace(/\/+$/, '') + u;
  u = u.replace(/#.*$/, '').replace(/\.git$/i, '').replace(/\/+$/, '');
  u = u.replace(/^http:\/\//i, 'https://').replace(/^https:\/\/www\./i, 'https://');
  return u.replace(/^(https:\/\/[^/]+)/i, (m) => m.toLowerCase());
}

const SITE_ANCHORS = ['#home', '#about', '#services', '#projects', '#skills', '#resume', '#journey', '#certifications', '#profiles', '#contact'];

// ── Entry point ──────────────────────────────────────────────────

export function createKnowledgeBase(d: PortfolioData): KnowledgeBase {
  const p = d.personal;
  const siteUrl = p.website;
  const links = [
    p.website,
    p.resume,
    p.masterResume,
    p.videoResume,
    ...Object.values(p.social),
    d.codingProfiles.github.url,
    d.codingProfiles.leetcode.url,
    d.codingProfiles.gfg.url,
    ...d.projects.flatMap((x) => [x.github, x.demo]),
    ...d.certifications.map((c) => c.url),
  ].filter(Boolean);

  return {
    chunks: [
      buildCore(d),
      buildExperience(d),
      buildEducation(d),
      buildSkills(d),
      buildCertifications(d),
      buildAchievements(d),
      buildGoals(d),
      ...d.projects.map(projectChunk),
    ],
    siteUrl,
    allowedLinks: new Set(links.map((l) => canonicalUrl(l, siteUrl))),
    allowedEmails: new Set([p.email.toLowerCase()]),
    allowedAnchors: new Set(SITE_ANCHORS),
  };
}

/**
 * Built once per server instance from the data bundled into this deployment.
 * Each Vercel deployment bundles its own copy of portfolio.ts, so a new deploy
 * always serves the new data. There is no cache that outlives a deployment.
 */
export const knowledgeBase: KnowledgeBase = createKnowledgeBase(portfolio);
