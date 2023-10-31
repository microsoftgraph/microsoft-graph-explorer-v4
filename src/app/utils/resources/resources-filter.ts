import { IResource } from '../../../types/resources';
import { hasPlaceHolders } from '../sample-url-generation';

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
  if (!resource) {
    return false;
  }

  const hasLabels = resource.labels && resource.labels.length > 0;
  const hasChildren = resource.children && resource.children?.length > 0;

  if (!hasLabels && !hasChildren) {
    return false;
  }

  if (!hasLabels && hasChildren) {
    const childLabels = resource.children.map((child) => child.labels);
    return childLabels.some((child) => child.some((label) => label.name === version));
  }

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

function getMatchingResourceForUrl(url: string, resources: IResource[]): IResource | undefined {
  const parts = url.split('/').filter(k => k !== '');
  let matching = [...resources];
  let node;
  for (const path of parts) {
    if (hasPlaceHolders(path)) {
      node = matching.find(k => hasPlaceHolders(k.segment));
      matching = node?.children || [];
    } else {
      node = matching.find(k => k.segment === path);
      matching = node?.children || [];
    }
  }
  return node;
}

export {
  searchResources,
  getResourcesSupportedByVersion,
  versionExists,
  getMatchingResourceForUrl
}
