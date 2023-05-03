import { IResourceLink } from '../../../../types/resources';
import { getUrlFromLink } from './resource-explorer.utils';

export const existsInCollection = (link: IResourceLink, paths: IResourceLink[], version: string): boolean => {
  if (link.method) {
    const found = paths.find(p => p.key === `${link.key}-${version}` || p.key === link.key);
    return !!found;
  } else {
    const resourceUrl = getUrlFromLink(link) + '/' + link.url.split('-').pop();
    const pathsInCollection = paths.filter(p => p.url.startsWith(resourceUrl) &&
      p.key!.split('-').pop() === version);
    if (pathsInCollection.length > 0) {
      const noneNodeLinks: IResourceLink[] = link.links.filter((k: IResourceLink) => k.type !== 'node');
      const list: IResourceLink[] = [];
      noneNodeLinks.forEach((element: IResourceLink) => {
        if (pathsInCollection.find((k: IResourceLink) => k.key === element.key ||
          k.key === `${element.key}-${version}`)) {
          list.push(element);
        }
      });
      return list.length === noneNodeLinks.length;
    }
  }
  return false;
};

export function setExisting(item: any, value: boolean) {
  item.isInCollection = value;
}
