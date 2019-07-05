import { IPartialTheme, loadTheme } from '@uifabric/styling';

import { dark } from './dark';
import { light } from './light';

const themes: any = {
  dark,
  light,
};

export function loadGETheme(theme: string): void {
  const selected: IPartialTheme = themes[theme];
  loadTheme(selected);
}
