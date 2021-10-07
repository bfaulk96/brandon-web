import { Component } from '@angular/core';
import { MenuItem, MenuItemTypes } from './MenuItem';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss'],
})
export class TerminalComponent {
  constructor() {}

  termName = 'brandon.faulkner$';
  bio = {
    Degree: 'BS Computer Science',
    Occupation: 'Full-Stack Developer',
    Company: 'Bayer AG',
    Experience: '4.5 years',
  };
  socialMedia = {
    LinkedIn: {
      name: 'Brandon Faulkner',
      link: 'https://www.linkedin.com/in/brandon-faulkner-10836276/',
    },
    GitHub: {
      name: 'bfaulk96',
      link: 'https://github.com/bfaulk96',
    },
    Facebook: {
      name: 'Brandon Faulkner',
      link: 'https://www.facebook.com/monstro222',
    },
    Twitter: {
      name: 'BFaulk96',
      link: 'https://twitter.com/BFaulk96',
    },
  };

  fileMenuOpen = false;
  fileMenu: MenuItem[] = [
    {
      title: 'Download Resume (Outdated)',
      type: MenuItemTypes.FILE,
      path: '/assets/files/resume.pdf',
      key: 'download',
    },
  ];

  helpMenuOpen = false;
  helpMenu = [];

  getKeys(object): string[] {
    return Object.keys(object);
  }

  toggleFileMenu(open?: boolean): void {
    this.fileMenuOpen = open ?? !this.fileMenuOpen;
  }

  toggleHelpMenu(open?: boolean): void {
    this.helpMenuOpen = open ?? !this.helpMenuOpen;
  }

  selectFileMenuAction(index: number): void {
    const action: MenuItem = this.fileMenu[index];

    switch (action.type) {
      case MenuItemTypes.FILE:
      default:
        break;
    }
  }
}
