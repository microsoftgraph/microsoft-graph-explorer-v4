import { saveTheme, readTheme } from './theme-utils';

describe('Tests theme utils should', () => {
  it('save theme to local storage then retrieve the saved theme', () => {
    const theme = 'dark';
    saveTheme(theme);
    expect(readTheme()).toEqual(theme);
  })
})