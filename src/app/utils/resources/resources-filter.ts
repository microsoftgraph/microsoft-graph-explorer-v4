import { IResource } from '../../../types/resources';
import { hasPlaceHolders } from '../sample-url-generation';

function searchResources(resources: IResource[], needle: string): IResource[] {
  const foundResources: IResource[] = [];

  const segmentMatched = (resources: IResource[]): IResource[] => {
    return resources.filter((resource: IResource) => resource.segment.contains(needle))
  }

  const cloneResources: IResource[] = Object.assign([], resources)
  for (const resource of cloneResources) {
    if (resource) {
      if (resource.segment.contains(needle)) foundResources.push(resource);
      else if (resource.children) {
        const found = segmentMatched(resource.children);
        if (found.length > 0) {
          const cloneResource = Object.assign({}, resource)
          cloneResource.children = found;
          foundResources.push(cloneResource)
        }
      }
    }
  }
  return foundResources;
}

function getMatchingResourceForUrl(url: string, resources: IResource[]): IResource | undefined {
  const parts = url.split('/').filter(k => k !== '');
  let matching = [...resources];
  let node;
  for (const path of parts) {
    if (hasPlaceHolders(path) && path !== '{undefined-id}') {
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
  getMatchingResourceForUrl
}
