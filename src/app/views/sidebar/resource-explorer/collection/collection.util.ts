import { ResourcePath } from '../../../../../types/resources';
import { PERMS_SCOPE } from '../../../../services/graph-constants';

interface ScopeOption {
  key: PERMS_SCOPE;
  text: PERMS_SCOPE;
}

const scopeOptions: ScopeOption[] = Object.entries(PERMS_SCOPE).map(([_key, value]) => ({
  key: value,
  text: value as PERMS_SCOPE
}));

function getScopesFromPaths(paths: ResourcePath[]): string[] {
  const scopes = paths.map(path => path.scope ?? scopeOptions[0].key);
  return [...new Set(scopes)];
}

function getVersionsFromPaths(paths: ResourcePath[]): string[] {
  const versions = paths.map(path => path.version!);
  return [...new Set(versions)];
}

export { getVersionsFromPaths, scopeOptions, ScopeOption, getScopesFromPaths };
