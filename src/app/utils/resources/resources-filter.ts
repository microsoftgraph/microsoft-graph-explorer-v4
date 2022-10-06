import { IResource } from '../../../types/resources';

function getResourcesSupportedByVersion(
  resources: IResource[],
  version: string,
  searchText?: string
): IResource[] {
  const versionedResources: IResource[] = [];
  resources.forEach((resource: IResource) => {
    if (versionExists(resource, version)) {
      resource.children = getResourcesSupportedByVersion(
        resource.children || [],
        version
      );
      versionedResources.push(resource);
    }
  });
  return searchText
    ? searchResources(versionedResources, searchText)
    : versionedResources;
}

function versionExists(resource: IResource, version: string): boolean {
  return resource.labels.some((k) => k.name === version);
}

function searchResources(haystack: IResource[], needle: string): IResource[] {
  const foundResources: IResource[] = [];
  haystack.forEach((resource: IResource) => {
    if (resource.segment.contains(needle)) {
      foundResources.push(resource);
      return;
    }
    if (resource.children) {
      const foundChildResources = searchResources(resource.children, needle);
      if (foundChildResources.length > 0) {
        resource.children = foundChildResources;
        foundResources.push(resource);
      }
    }
  });
  return foundResources;
}

export {
  searchResources,
  getResourcesSupportedByVersion,
  versionExists
}
