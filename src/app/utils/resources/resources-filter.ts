import { IResource } from '../../../types/resources';
import { hasPlaceHolders } from '../sample-url-generation';

function searchResources(resources: IResource[], needle: string): IResource[] {
  const foundResources: IResource[] = [];
  resources.forEach((resource: IResource) => {
    if (resource.segment.contains(needle)) {
      foundResources.push(resource);
      return;
    }
    if (resource.children) {
      const foundChildResources = searchResources(resource.children, needle);
      if (foundChildResources.length > 0) {
        const res = Object.assign({}, resource)
        res.children = foundChildResources;
        foundResources.push(res);
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
