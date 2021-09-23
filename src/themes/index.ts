import { IPartialTheme, loadTheme } from '@fluentui/react';

import { dark } from './dark';
import { highContrast } from './high-contrast';
import { light } from './light';

const themes: any = {
  dark,
  light,
  'high-contrast': highContrast
};

export function loadGETheme(theme: string): void {
  const selected: IPartialTheme = themes[theme];
  loadTheme(selected);
}
