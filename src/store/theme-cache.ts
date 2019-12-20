import { IThemeChangedMessage } from '../types/query-runner';

const key = 'CURRENT_THEME';
const defaultTheme = 'light';

export function saveTheme(theme: IThemeChangedMessage['theme']) {
  localStorage.setItem(key, theme);
}

export function readTheme() {
  const theme = localStorage.getItem(key) || defaultTheme;
  return theme;
}