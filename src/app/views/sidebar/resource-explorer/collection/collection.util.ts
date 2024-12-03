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

const formatScopeLabel = (scope: PERMS_SCOPE) => {
  switch (scope) {
  case PERMS_SCOPE.WORK:
    return 'Delegated Work';
  case PERMS_SCOPE.APPLICATION:
    return 'Application';
  case PERMS_SCOPE.PERSONAL:
    return 'Delegated Personal';
  default:
    return scope; // fallback in case of an unknown value
  }
};

export { getVersionsFromPaths, scopeOptions, ScopeOption, getScopesFromPaths, formatScopeLabel };
