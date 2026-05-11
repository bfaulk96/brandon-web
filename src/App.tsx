import { Mail, Terminal } from 'lucide-react';
import { useState } from 'react';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { GitHubIcon, LinkedInIcon } from './components/BrandIcons';
import { TerminalWindow } from './components/TerminalWindow';
import { profile } from './data/profile';
import type { ViewMode } from './types';

type WindowState = 'open' | 'minimized' | 'closed';

export default function App() {
  const [mode, setMode] = useState<ViewMode>('home');
  const [windowState, setWindowState] = useState<WindowState>('open');
  const isTerminalHidden = windowState !== 'open';

  return (
    <div className="app-shell">
      <BackgroundCanvas />

      <header className="top-bar">
        <div className="brand-mark">
          <Terminal size={21} />
          <span>{profile.name}</span>
        </div>
        <nav aria-label="Primary links">
          <a href="https://github.com/bfaulk96" target="_blank" rel="noreferrer" aria-label="GitHub">
            <GitHubIcon size={18} />
          </a>
          <a href={profile.socials[0].href} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <LinkedInIcon size={18} />
          </a>
          <a href={profile.email} aria-label="Email Brandon">
            <Mail size={18} />
          </a>
        </nav>
      </header>

      <main className={isTerminalHidden ? 'workspace terminal-hidden' : 'workspace'}>
        <aside className="identity-panel" aria-hidden={!isTerminalHidden} aria-label="Profile summary">
          <img src={profile.profileImage} alt="Brandon Faulkner" />
          <div>
            <div className="section-kicker">software engineer</div>
            <h1>{profile.name}</h1>
            <p>{profile.summary}</p>
          </div>
          <div className="identity-actions">
            <button type="button" disabled={!isTerminalHidden} onClick={() => setWindowState('open')}>
              Restore terminal
            </button>
            <button
              type="button"
              disabled={!isTerminalHidden}
              onClick={() => {
                setMode('projects');
                setWindowState('open');
              }}>
              View projects
            </button>
          </div>
        </aside>

        <TerminalWindow
          mode={mode}
          windowState={windowState}
          onModeChange={(nextMode) => {
            setMode(nextMode);
            setWindowState('open');
          }}
          onMinimize={() => setWindowState('minimized')}
          onClose={() => setWindowState('closed')}
          onRestore={() => setWindowState('open')}
        />
      </main>

      <footer className="footer">
        <span>
          Copyright © {profile.name} {new Date().getFullYear()}
        </span>
        <span>React · Vite · oxlint · oxfmt</span>
      </footer>
    </div>
  );
}
