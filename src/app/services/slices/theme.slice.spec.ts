import themeReducer, { changeTheme } from './theme.slice';

describe('theme slice', () => {
  it('should return initial state as light', () => {
    const state = themeReducer(undefined, { type: 'unknown' });
    expect(state).toBe('light');
  });

  it('should change theme to dark', () => {
    const state = themeReducer('light', changeTheme('dark'));
    expect(state).toBe('dark');
  });

  it('should change theme to light', () => {
    const state = themeReducer('dark', changeTheme('light'));
    expect(state).toBe('light');
  });

  it('should handle custom theme', () => {
    const state = themeReducer('light', changeTheme('high-contrast'));
    expect(state).toBe('high-contrast');
  });
});
