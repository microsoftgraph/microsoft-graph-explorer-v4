import { dark } from './dark';
import { light } from './light';
import { highContrast } from './high-contrast';

describe('Theme definitions', () => {
  it('dark theme has palette', () => {
    expect(dark.palette).toBeDefined();
    expect(dark.palette.themePrimary).toBeDefined();
  });

  it('light theme has palette', () => {
    expect(light.palette).toBeDefined();
    expect(light.palette.themePrimary).toBeDefined();
  });

  it('high contrast theme has palette', () => {
    expect(highContrast.palette).toBeDefined();
    expect(highContrast.palette.themePrimary).toBeDefined();
  });
});
