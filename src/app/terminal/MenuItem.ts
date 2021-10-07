export enum MenuItemTypes {
  FILE = 0,
}

export interface MenuItem {
  title: string;
  type: number;
  path?: string;
  key: string;
}
