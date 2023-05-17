import { Guid } from 'guid-typescript';

import {
  IPostmanCollection,
  Item
} from '../../../../../types/postman-collection';
import { IResourceLink, ResourceLinkType } from '../../../../../types/resources';
import { GRAPH_URL } from '../../../../services/graph-constants';

export function generatePostmanCollection(
  paths: IResourceLink[]
): IPostmanCollection {
  const collection: IPostmanCollection = {
    info: {
      _postman_id: Guid.create().toString(),
      name: 'Graph-Collection',
      schema:
        'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
    },
    item: generateItemsFromPaths(paths)
  };
  return collection;
}

function generateItemsFromPaths(resources: IResourceLink[]): Item[] {
  const list: Item[] = [];
  resources.forEach(resource => {
    const {
      method,
      name,
      url,
      version,
      paths: path
    } = resource;

    path.shift();
    path.unshift(version!);

    const item: Item = {
      name: `${name}-${version}`,
      request: {
        method: method!.toString().toUpperCase(),
        url: {
          raw: `${GRAPH_URL}/${version}${url}`,
          protocol: 'https',
          host: [
            'graph',
            'microsoft',
            'com'
          ],
          path
        }
      }
    }
    list.push(item);
  });
  return list;
}

export function generateResourceLinksFromPostmanCollection(collection: IPostmanCollection): IResourceLink[] {
  const resourceLinks: IResourceLink[] = [];

  collection.item.forEach((item) => {
    const { name, request } = item;
    const { method, url } = request!;

    const version = url.path[0];
    const paths = url.path.slice(1);

    const resourceLink: IResourceLink = {
      name,
      url: url.raw,
      method: method.toLowerCase(),
      version,
      paths,
      links: [],
      labels: [],
      parent: '',
      level: 0,
      type: ResourceLinkType.NODE
    };

    resourceLinks.push(resourceLink);
  });

  console.log('Here are the links ', resourceLinks);

  return resourceLinks;
}
