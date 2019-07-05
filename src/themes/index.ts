import { IPartialTheme, loadTheme } from '@uifabric/styling';

import { dark } from './dark';
import { light } from './light';

const themes = {
  dark,
  light,
};

export function loadGETheme(theme: string): void {
  // @ts-ignore
  const selected: IPartialTheme = themes[theme];
  loadTheme(selected);
}
