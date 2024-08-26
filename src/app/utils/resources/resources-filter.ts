import { IResource } from '../../../types/resources';
import { hasPlaceHolders } from '../sample-url-generation';

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

const getResourceFromURL = (url: string, resource: IResource): IResource | null =>{
  url.split('/').filter(u=>u!=='').forEach((segment:string)=>{
    const foundResource = resource?.children?.find(res=>return res.segment === segment);
    if(foundResource){
      console.log(`Found ${segment}`)
      resource = foundResource
    }
  })
  return resource;
}

export {
  searchResources,
  getMatchingResourceForUrl,
  getResourceFromURL
}
