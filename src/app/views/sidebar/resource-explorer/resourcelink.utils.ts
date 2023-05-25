import { IResourceLink, ResourcePath } from '../../../../types/resources';
import { getUrlFromLink } from './resource-explorer.utils';

export const existsInCollection = (link: IResourceLink, paths: ResourcePath[], version: string): boolean => {
  if (link.method) {
    const found = paths.find(p => p.key === `${link.key}-${version}` || p.key === link.key);
    return !!found;
  }

  const pathsInCollection = paths.filter(p => p.url.startsWith(getUrlFromLink(link.paths)) &&
    p.key!.split('-').pop() === version);

  if (pathsInCollection.length === 0) {
    return false;
  }

  const noneNodeLinks: IResourceLink[] = link.links.filter((k: IResourceLink) => k.type !== 'node');
  const list: IResourceLink[] = [];
  noneNodeLinks.forEach((element: IResourceLink) => {
    if (pathsInCollection.find((k: ResourcePath) => k.key === element.key ||
      k.key === `${element.key}-${version}`)) {
      list.push(element);
    }
  });
  return list.length === noneNodeLinks.length;
};

export function setExisting(item: any, value: boolean) {
  item.isInCollection = value;
}
