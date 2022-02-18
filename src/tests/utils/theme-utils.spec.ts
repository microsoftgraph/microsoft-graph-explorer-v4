import { saveTheme, readTheme } from '../../../src/themes/theme-utils';
describe('Tests theme utils', () => {
  it('Saves theme to local storage then retrieves the saved theme', () => {
    const theme = 'dark';
    saveTheme(theme);
    expect(readTheme()).toEqual(theme);
  })
})