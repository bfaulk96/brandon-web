export type ViewMode = 'home' | 'resume' | 'projects';

export type TerminalLine =
  | { kind: 'command'; value: string }
  | { kind: 'output'; value: string }
  | { kind: 'links'; value: { label: string; href: string; text: string }[] }
  | { kind: 'projects' };
