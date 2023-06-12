//const key = 'CURRENT_THEME';

export function saveTheme(theme: string) {
  localStorage.setItem('CURRENT_THEME', theme);
}

export function readTheme() {
  const theme = localStorage.getItem('CURRENT_THEME');
  return theme;
}

// TODO: Refactor the caching functions below to use the above functions
export const setToLS = (key: string, value: Object) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const getFromLS = (key: string) => {
  const value = window.localStorage.getItem(key);

  if (value) {
    return JSON.parse(value);
  }
};
