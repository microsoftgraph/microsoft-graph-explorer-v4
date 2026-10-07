import { getUniquePaths } from './collections-reducer.util';
import { ResourcePath, ResourceLinkType } from '../../../types/resources';

describe('getUniquePaths', () => {
  const makePath = (key: string, name: string): ResourcePath => ({
    key,
    name,
    type: ResourceLinkType.PATH,
    url: `https://graph.microsoft.com/v1.0/${name}`,
    paths: [name]
  });

  it('should return combined paths when no duplicates', () => {
    const paths = [makePath('1', 'users')];
    const items = [makePath('2', 'groups')];
    const result = getUniquePaths(paths, items);
    expect(result).toHaveLength(2);
  });

  it('should not add duplicate paths', () => {
    const paths = [makePath('1', 'users')];
    const items = [makePath('1', 'users')];
    const result = getUniquePaths(paths, items);
    expect(result).toHaveLength(1);
  });

  it('should return original paths when items is empty', () => {
    const paths = [makePath('1', 'users')];
    const result = getUniquePaths(paths, []);
    expect(result).toHaveLength(1);
  });

  it('should return items when paths is empty', () => {
    const items = [makePath('1', 'users'), makePath('2', 'groups')];
    const result = getUniquePaths([], items);
    expect(result).toHaveLength(2);
  });

  it('should handle both empty', () => {
    const result = getUniquePaths([], []);
    expect(result).toHaveLength(0);
  });

  it('should handle partial duplicates', () => {
    const paths = [makePath('1', 'users'), makePath('2', 'groups')];
    const items = [makePath('2', 'groups'), makePath('3', 'messages')];
    const result = getUniquePaths(paths, items);
    expect(result).toHaveLength(3);
  });
});
