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
  const folderNames = resources
    .map((resource) => {
      if (resource.paths.length > 1) {
        return resource.paths[1];
      }
    })
    .filter((value, i, arr) => arr.indexOf(value) === i) // selects distinct folder names
    .sort();
  const items: any[] = folderNames.map((folder) => {
    const childItems = resources
      .filter((resource) => resource.url.match(`^\/${folder}\/?`))
      .map((resource) => {
        const { method, url, version, paths: path } = resource;
        path.shift();
        path.unshift(version!);
        const item: Item = {
          name: url,
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
        return item;
      });
    return { name: folder, item: childItems };
  });
  return items;
}
