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

function getVersionsFromPaths(paths: ResourcePath[]) {
  const versions: string[] = [];
  paths.forEach(path => {
    if (!versions.includes(path.version!)) {
      versions.push(path.version!);
    }
  });
  return versions;
}

export { getVersionsFromPaths, scopeOptions, ScopeOption };
