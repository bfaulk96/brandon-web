import {
  BriefcaseBusiness,
  Code2,
  Download,
  FileText,
  HelpCircle,
  Mail,
  Maximize2,
  Minus,
  PanelBottom,
  Square,
  Terminal,
  X,
} from 'lucide-react';
import {
  FormEvent,
  KeyboardEvent,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { experiences, profile } from '../data/profile';
import type { TerminalLine, ViewMode } from '../types';
import { GitHubIcon, LinkedInIcon } from './BrandIcons';
import { Modal } from './Modal';
import { ProjectGrid } from './ProjectGrid';

type TerminalWindowProps = {
  mode: ViewMode;
  windowState: 'open' | 'minimized' | 'closed';
  onModeChange: (mode: ViewMode) => void;
  onMinimize: () => void;
  onClose: () => void;
  onRestore: () => void;
};

const prompt = `${profile.handle}$`;

const commandHelp = [
  { command: 'help', detail: 'Open the command reference.' },
  { command: 'bio', detail: 'Print a concise profile summary.' },
  { command: 'social_media', detail: 'List professional/social links.' },
  { command: 'experience', detail: 'Show deeper resume-style job details.' },
  { command: 'projects', detail: 'Open the project page and GitHub cards.' },
  { command: 'resume', detail: 'Open the resume PDF in a new tab.' },
  { command: 'contact', detail: 'Show contact links.' },
  { command: 'clear', detail: 'Clear terminal history.' },
  { command: 'whoami', detail: 'A small identity check.' },
  { command: 'coffee', detail: 'Easter egg.' },
  { command: 'sudo hire brandon', detail: 'Easter egg.' },
];

function initialLines(): TerminalLine[] {
  return [
    { kind: 'command', value: 'bio' },
    {
      kind: 'output',
      value: [
        `Degree:      ${profile.degree}`,
        `Occupation:  ${profile.title}`,
        `Company:     ${profile.company}`,
        `Experience:  ${profile.experienceYears} years`,
      ].join('\n'),
    },
    { kind: 'command', value: 'social_media' },
    {
      kind: 'links',
      value: profile.socials.map((item) => ({
        label: item.label,
        href: item.href,
        text: item.value,
      })),
    },
  ];
}

export function TerminalWindow({
  mode,
  windowState,
  onModeChange,
  onMinimize,
  onClose,
  onRestore,
}: TerminalWindowProps) {
  const [fileOpen, setFileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [lines, setLines] = useState<TerminalLine[]>(initialLines);
  const [input, setInput] = useState('');
  const [modal, setModal] = useState<'help' | 'about' | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isMinimizing, setIsMinimizing] = useState(false);
  const terminalContentRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  const fileItems = useMemo(
    () => [
      {
        label: 'Download resume',
        icon: Download,
        action: () => window.open(profile.resumePdf, '_blank', 'noreferrer'),
      },
      { label: 'Open resume details', icon: FileText, action: () => onModeChange('resume') },
      { label: 'Open projects', icon: Code2, action: () => onModeChange('projects') },
      {
        label: 'GitHub profile',
        icon: GitHubIcon,
        action: () => window.open('https://github.com/bfaulk96', '_blank', 'noreferrer'),
      },
      {
        label: 'LinkedIn profile',
        icon: LinkedInIcon,
        action: () => window.open(profile.socials[0].href, '_blank', 'noreferrer'),
      },
      { label: 'Email', icon: Mail, action: () => window.open(profile.email) },
    ],
    [onModeChange],
  );

  const helpItems = useMemo(
    () => [
      { label: 'Command reference', icon: Terminal, action: () => setModal('help') },
      { label: 'About this site', icon: HelpCircle, action: () => setModal('about') },
      { label: 'Resume details', icon: BriefcaseBusiness, action: () => onModeChange('resume') },
      { label: 'Projects page', icon: PanelBottom, action: () => onModeChange('projects') },
    ],
    [onModeChange],
  );

  useEffect(() => {
    terminalContentRef.current?.scrollTo({
      top: terminalContentRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [lines, mode]);

  useEffect(() => {
    function closeTransientUi(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setFileOpen(false);
        setHelpOpen(false);
      }
    }

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key !== 'Escape') return;

      setFileOpen(false);
      setHelpOpen(false);
      setModal(null);
    }

    document.addEventListener('pointerdown', closeTransientUi);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('pointerdown', closeTransientUi);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  function runCommand(rawValue: string) {
    const value = rawValue.trim();
    if (!value) return;

    const normalized = value.toLowerCase();
    const nextLines: TerminalLine[] = [{ kind: 'command', value }];

    switch (normalized) {
      case 'help':
        setModal('help');
        nextLines.push({ kind: 'output', value: 'Opening command reference...' });
        break;
      case 'bio':
      case 'about':
        onModeChange('home');
        nextLines.push({
          kind: 'output',
          value: [
            `${profile.name} · ${profile.title}`,
            profile.summary,
            `Core stack: ${profile.skills.slice(0, 6).join(', ')}...`,
          ].join('\n'),
        });
        break;
      case 'social':
      case 'social_media':
        onModeChange('home');
        nextLines.push({
          kind: 'links',
          value: profile.socials.map((item) => ({
            label: item.label,
            href: item.href,
            text: item.value,
          })),
        });
        break;
      case 'experience':
      case 'jobs':
        onModeChange('resume');
        nextLines.push({ kind: 'output', value: 'Opening detailed resume view...' });
        break;
      case 'projects':
      case 'repos':
        onModeChange('projects');
        nextLines.push({ kind: 'output', value: 'Opening project cards...' });
        break;
      case 'resume':
        window.open(profile.resumePdf, '_blank', 'noreferrer');
        onModeChange('home');
        nextLines.push({ kind: 'output', value: 'Opening resume PDF...' });
        break;
      case 'contact':
        onModeChange('home');
        nextLines.push({
          kind: 'links',
          value: [
            { label: 'Email', href: profile.email, text: 'Email Brandon' },
            ...profile.socials.slice(0, 2).map((item) => ({ label: item.label, href: item.href, text: item.value })),
          ],
        });
        break;
      case 'whoami':
        onModeChange('home');
        nextLines.push({
          kind: 'output',
          value: 'A practical engineer who likes sharp tools and quiet interfaces.',
        });
        break;
      case 'coffee':
        onModeChange('home');
        nextLines.push({
          kind: 'output',
          value: 'Coffee status: probably compiling. Try again after the next build.',
        });
        break;
      case 'sudo hire brandon':
        onModeChange('home');
        nextLines.push({
          kind: 'output',
          value: 'Permission granted. Next step: open LinkedIn or email from File > Contact.',
        });
        break;
      case 'clear':
        setLines([]);
        setInput('');
        onModeChange('home');
        return;
      default:
        nextLines.push({
          kind: 'output',
          value: `Command not found: ${value}. Type "help" for options.`,
        });
    }

    setLines((current) => [...current, ...nextLines]);
    setInput('');
  }

  function submitCommand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    runCommand(input);
  }

  function handleCommandKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter') return;

    event.preventDefault();
    runCommand(input);
  }

  function closeTerminal() {
    setIsClosing(true);
    window.setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 260);
  }

  function minimizeTerminal() {
    setIsMinimizing(true);
    window.setTimeout(() => {
      setIsMinimizing(false);
      onMinimize();
    }, 260);
  }

  const shellClass = [
    'terminal-shell',
    mode !== 'home' ? 'is-expanded' : '',
    isMinimizing ? 'is-minimizing' : '',
    isClosing ? 'is-closing' : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (windowState === 'closed') {
    return null;
  }

  if (windowState === 'minimized') {
    return (
      <button className="dock-tab" type="button" onClick={onRestore}>
        <Terminal size={18} />
        <span>brandon.faulkner</span>
        <small>restore terminal</small>
      </button>
    );
  }

  return (
    <>
      <section className={shellClass} aria-label="Interactive terminal portfolio">
        <header className="terminal-header">
          <nav className="menu-group" aria-label="Terminal menu" ref={menuRef}>
            <div className="menu-wrap">
              <button
                className={fileOpen ? 'menu-button active' : 'menu-button'}
                type="button"
                onPointerDown={(event: ReactPointerEvent<HTMLButtonElement>) => event.stopPropagation()}
                onClick={() => {
                  setHelpOpen(false);
                  setFileOpen((open) => !open);
                }}>
                File
              </button>
              {fileOpen ? (
                <div className="menu-popover">
                  {fileItems.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setFileOpen(false);
                        item.action();
                      }}>
                      <item.icon size={16} />
                      {item.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="menu-wrap">
              <button
                className={helpOpen ? 'menu-button active' : 'menu-button'}
                type="button"
                onPointerDown={(event: ReactPointerEvent<HTMLButtonElement>) => event.stopPropagation()}
                onClick={() => {
                  setFileOpen(false);
                  setHelpOpen((open) => !open);
                }}>
                Help
              </button>
              {helpOpen ? (
                <div className="menu-popover help-menu">
                  {helpItems.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setHelpOpen(false);
                        item.action();
                      }}>
                      <item.icon size={16} />
                      {item.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </nav>
          <div className="terminal-title">
            {mode === 'resume' ? 'resume.detail' : mode === 'projects' ? 'projects.index' : 'home.session'}
          </div>
          <div className="window-actions">
            <button className="window-button" type="button" aria-label="Minimize terminal" onClick={minimizeTerminal}>
              <Minus size={17} />
            </button>
            <button
              className="window-button"
              type="button"
              aria-label="Show resume details"
              onClick={() => onModeChange(mode === 'resume' ? 'home' : 'resume')}>
              {mode === 'resume' ? <Square size={15} /> : <Maximize2 size={16} />}
            </button>
            <button className="window-button" type="button" aria-label="Close terminal" onClick={closeTerminal}>
              <X size={17} />
            </button>
          </div>
        </header>

        <div className="terminal-content" ref={terminalContentRef}>
          {mode === 'resume' ? <ResumeView /> : null}
          {mode === 'projects' ? <ProjectGrid /> : null}
          <TerminalHistory
            lines={mode === 'home' ? lines : lines.slice(initialLines().length)}
            isCompact={mode !== 'home'}
          />
          <form className="terminal-input-row" onSubmit={submitCommand}>
            <label htmlFor="terminal-input">{prompt}</label>
            <input
              id="terminal-input"
              autoComplete="off"
              spellCheck={false}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleCommandKeyDown}
              placeholder="type help"
            />
          </form>
        </div>
      </section>

      {modal === 'help' ? (
        <Modal title="Terminal commands" onClose={() => setModal(null)}>
          <div className="command-list">
            {commandHelp.map((item) => (
              <div key={item.command}>
                <code>{item.command}</code>
                <span>{item.detail}</span>
              </div>
            ))}
          </div>
        </Modal>
      ) : null}

      {modal === 'about' ? (
        <Modal title="About this site" onClose={() => setModal(null)}>
          <p>
            This portfolio is a terminal-inspired React portfolio with window controls, command input, resume views, and
            GitHub project discovery.
          </p>
          <p>This is a fun little passion project to showcase some of my work and skills.</p>
        </Modal>
      ) : null}
    </>
  );
}

function TerminalHistory({ lines, isCompact = false }: { lines: TerminalLine[]; isCompact?: boolean }) {
  if (lines.length === 0) {
    return null;
  }

  return (
    <div className={isCompact ? 'history history-compact' : 'history'}>
      {lines.map((line, index) => {
        if (line.kind === 'command') {
          return (
            <div className="terminal-line" key={`${line.kind}-${index}`}>
              <span className="prompt">{prompt}</span> <span className="typed">{line.value}</span>
            </div>
          );
        }

        if (line.kind === 'links') {
          return (
            <dl className="result-table" key={`${line.kind}-${index}`}>
              {line.value.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}:</dt>
                  <dd>
                    <a href={item.href} target="_blank" rel="noreferrer">
                      {item.text}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          );
        }

        if (line.kind === 'projects') {
          return <ProjectGrid key={`${line.kind}-${index}`} />;
        }

        return (
          <pre className="terminal-output" key={`${line.kind}-${index}`}>
            {line.value}
          </pre>
        );
      })}
    </div>
  );
}

function ResumeView() {
  return (
    <section className="resume-view" aria-labelledby="resume-heading">
      <div className="section-kicker">maximize · resume detail</div>
      <div className="resume-heading-row">
        <div>
          <h2 id="resume-heading">{profile.name}</h2>
          <p>{profile.summary}</p>
        </div>
        <a className="resume-download" href={profile.resumePdf} target="_blank" rel="noreferrer">
          <Download size={17} />
          PDF
        </a>
      </div>

      <div className="resume-grid">
        <article>
          <h3>Profile</h3>
          <dl className="compact-facts">
            <div>
              <dt>Role</dt>
              <dd>{profile.title}</dd>
            </div>
            <div>
              <dt>Company</dt>
              <dd>{profile.company}</dd>
            </div>
            <div>
              <dt>Education</dt>
              <dd>{profile.degree}</dd>
            </div>
            <div>
              <dt>Experience</dt>
              <dd>{profile.experienceYears} years</dd>
            </div>
          </dl>
        </article>

        <article>
          <h3>Core skills</h3>
          <div className="tag-row">
            {profile.skills.map((skill) => (
              <span className="tag" key={skill}>
                {skill}
              </span>
            ))}
          </div>
        </article>
      </div>

      <div className="experience-list">
        {experiences.map((experience) => (
          <article className="experience-card" key={experience.company}>
            <div className="experience-topline">
              <div>
                <h3>{experience.role}</h3>
                <p>
                  {experience.company} · {experience.location}
                </p>
              </div>
              <span>{experience.period}</span>
            </div>
            <p>{experience.summary}</p>
            <ul>
              {experience.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
            <div className="tag-row">
              {experience.stack.map((item) => (
                <span className="tag" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
