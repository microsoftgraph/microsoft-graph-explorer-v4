import { ResourcePath } from '../../../../../types/resources';

function getVersionsFromPaths(paths: ResourcePath[]) {
  const versions: string[] = [];
  paths.forEach(path => {
    if (!versions.includes(path.version!)) {
      versions.push(path.version!);
    }
  });
  return versions;
}

export { getVersionsFromPaths };
