import { darkThemeHostConfig, lightThemeHostConfig } from './AdaptiveHostConfig';

describe('AdaptiveHostConfig', () => {
  it('exports darkThemeHostConfig with containerStyles', () => {
    expect(darkThemeHostConfig).toBeDefined();
    expect(darkThemeHostConfig.containerStyles).toBeDefined();
    expect(darkThemeHostConfig.containerStyles.default).toBeDefined();
    expect(darkThemeHostConfig.containerStyles.emphasis).toBeDefined();
  });

  it('exports lightThemeHostConfig with containerStyles', () => {
    expect(lightThemeHostConfig).toBeDefined();
    expect(lightThemeHostConfig.containerStyles).toBeDefined();
    expect(lightThemeHostConfig.containerStyles.default).toBeDefined();
    expect(lightThemeHostConfig.containerStyles.emphasis).toBeDefined();
  });

  it('darkThemeHostConfig has foregroundColors in default container', () => {
    const fg = darkThemeHostConfig.containerStyles.default.foregroundColors;
    expect(fg.default).toBeDefined();
    expect(fg.dark).toBeDefined();
    expect(fg.light).toBeDefined();
    expect(fg.accent).toBeDefined();
    expect(fg.good).toBeDefined();
    expect(fg.warning).toBeDefined();
    expect(fg.attention).toBeDefined();
  });

  it('lightThemeHostConfig has foregroundColors in default container', () => {
    const fg = lightThemeHostConfig.containerStyles.default.foregroundColors;
    expect(fg.default).toBeDefined();
    expect(fg.dark).toBeDefined();
    expect(fg.light).toBeDefined();
    expect(fg.accent).toBeDefined();
    expect(fg.good).toBeDefined();
    expect(fg.warning).toBeDefined();
    expect(fg.attention).toBeDefined();
  });

  it('each foreground color set has default, subtle and highlightColors', () => {
    const fg = darkThemeHostConfig.containerStyles.default.foregroundColors;
    for (const key of Object.keys(fg)) {
      expect(fg[key].default).toBeDefined();
      expect(fg[key].subtle).toBeDefined();
      expect(fg[key].highlightColors).toBeDefined();
      expect(fg[key].highlightColors.default).toBe('rgba(0, 0, 0, 0.13)');
      expect(fg[key].highlightColors.subtle).toBe('rgba(0, 0, 0, 0.06)');
    }
  });

  it('darkThemeHostConfig has backgroundColor on containers', () => {
    expect(darkThemeHostConfig.containerStyles.default.backgroundColor).toBeDefined();
    expect(darkThemeHostConfig.containerStyles.emphasis.backgroundColor).toBeDefined();
  });

  it('lightThemeHostConfig has backgroundColor on containers', () => {
    expect(lightThemeHostConfig.containerStyles.default.backgroundColor).toBeDefined();
    expect(lightThemeHostConfig.containerStyles.emphasis.backgroundColor).toBeDefined();
  });
});
