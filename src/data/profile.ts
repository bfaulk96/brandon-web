import profileImage from '../profile-pic.jpg';
import resumePdf from '../assets/files/resume.pdf';

export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
  stack: string[];
};

export type Project = {
  name: string;
  description: string;
  href: string;
  stack: string[];
  status: string;
};

export const profile = {
  name: 'Brandon Faulkner',
  handle: 'brandon.faulkner',
  title: 'Software Engineer',
  company: 'Largely',
  degree: 'BS Computer Science',
  experienceYears: '8+',
  location: 'United States',
  email: 'mailto:brandon.faulkner.dev@gmail.com',
  profileImage,
  resumePdf,
  summary:
    'Software engineer focused on pragmatic product work, maintainable frontends, and reliable systems that are easy for teams to own.',
  socials: [
    {
      label: 'LinkedIn',
      value: 'Brandon Faulkner',
      href: 'https://www.linkedin.com/in/brandon-faulkner-10836276/',
    },
    { label: 'GitHub', value: 'bfaulk96', href: 'https://github.com/bfaulk96' },
    { label: 'Twitter', value: 'BFaulk96', href: 'https://twitter.com/BFaulk96' },
    { label: 'Facebook', value: 'Brandon Faulkner', href: 'https://www.facebook.com/monstro222' },
  ],
  skills: [
    'React',
    'TypeScript',
    'AWS',
    'Node.js',
    'OpenSearch',
    'REST APIs',
    'Golang',
    'Angular',
    'UI Architecture',
    'API Integration',
    'Testing',
    'DevOps & CI/CD',
  ],
};

export const experiences: Experience[] = [
  {
    company: 'Largely',
    role: 'Software Engineer',
    period: 'Current',
    location: 'Remote',
    summary: 'Builds production web software across product surfaces, internal tooling, and platform integrations.',
    highlights: [
      'Turns ambiguous product needs into maintainable UI and service work.',
      'Improves team velocity through typed interfaces, reusable components, and practical tooling.',
      'Balances polish with delivery by focusing on workflows users repeat every day.',
    ],
    stack: ['TypeScript', 'React', 'Node.js', 'AWS', 'OpenSearch'],
  },
  {
    company: 'Earlier engineering roles',
    role: 'Full-stack and frontend development',
    period: '8+ years professional experience',
    location: 'United States',
    summary:
      'Delivered business-facing software with emphasis on dependable interfaces, readable code, and steady iteration.',
    highlights: [
      'Modernized legacy UI patterns while preserving existing product behavior.',
      'Collaborated with non-engineering stakeholders to clarify requirements and ship useful increments.',
      'Maintained production code across frontend, API, and build tooling boundaries.',
    ],
    stack: ['React', 'TypeScript', 'HTML', 'CSS', 'AWS', 'Golang', 'Node.js'],
  },
];

export const featuredProjects: Project[] = [
  {
    name: 'brandon-web',
    description:
      'This site: a terminal-inspired React portfolio with window controls, command input, resume views, and GitHub project discovery.',
    href: 'https://github.com/bfaulk96/brandon-web',
    stack: ['React', 'Vite', 'TypeScript', 'CSS'],
    status: 'Current Website',
  },
  {
    name: 'GitHub Highlights',
    description: 'View all of my public GitHub repositories.',
    href: 'https://github.com/bfaulk96?tab=repositories',
    stack: ['GitHub', 'Portfolio content'],
    status: 'Public Repositories',
  },
];
