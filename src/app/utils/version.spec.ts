import { getVersion } from './version';

describe('getVersion', () => {
  it('should return the version from package.json', () => {
    const version = getVersion();
    expect(version).toBeDefined();
    expect(typeof version).toBe('string');
  });

  it('should return a semver-like version string', () => {
    const version = getVersion();
    expect(version).toMatch(/^\d+\.\d+\.\d+/);
  });
});
