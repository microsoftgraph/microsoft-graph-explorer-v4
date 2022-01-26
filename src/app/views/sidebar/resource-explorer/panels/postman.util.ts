import { Guid } from 'guid-typescript';

import {
  IPostmanCollection,
  Item
} from '../../../../../types/postman-collection';
import { IResourceLink } from '../../../../../types/resources';
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
  resources.forEach((resource) => {
    const { method, name, url, version, path } = resource;

    const item: Item = {
      name,
      request: {
        method: method!,
        url: {
          raw: `${GRAPH_URL}/${version}${url}`,
          protocol: 'https',
          host: ['graph', 'microsoft', 'com'],
          path
        }
      }
    };
    list.push(item);
  });
  return list;
}
