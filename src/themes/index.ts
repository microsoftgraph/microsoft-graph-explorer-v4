import { IPartialTheme, loadTheme } from '@fluentui/react';

import { dark } from './dark';
import { highContrast } from './high-contrast';
import { light } from './light';
// changes to be removed on cleanup
const getSystemTheme = (): string => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

const themes: any = {
  dark,
  light,
  'high-contrast': highContrast,
  system: getSystemTheme() === 'dark' ? dark : light
};

export function loadGETheme(theme: string): void {
  const selected: IPartialTheme = themes[theme];
  loadTheme(selected);
}
