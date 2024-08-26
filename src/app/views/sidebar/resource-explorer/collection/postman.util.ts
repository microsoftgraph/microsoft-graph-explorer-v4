import { Guid } from 'guid-typescript';

import {
  IPostmanCollection,
  Item
} from '../../../../../types/postman-collection';
import { ResourceLinkType, ResourcePath } from '../../../../../types/resources';
import { GRAPH_URL } from '../../../../services/graph-constants';
import { parseSampleUrl } from '../../../../utils/sample-url-generation';
import { generateKey } from '../resource-explorer.utils';

export function generatePostmanCollection(
  paths: ResourcePath[]
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

function generateItemsFromPaths(resources: ResourcePath[]): Item[] {
  const list: Item[] = [];
  resources.forEach(resource => {
    const {
      method,
      name,
      url,
      version,
      paths: resourcePaths
    } = resource;

    const path = [...resourcePaths];
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

export function generateResourcePathsFromPostmanCollection(collection: IPostmanCollection): ResourcePath[] {
  const resourcePaths: ResourcePath[] = [];

  collection.item.forEach((item) => {
    const { name, request } = item;
    const { method, url } = request!;

    const paths = url.path;
    paths.shift();
    paths.unshift('/')

    const { queryVersion: version, requestUrl } = parseSampleUrl(url.raw);

    const resourceLink: ResourcePath = {
      name: name.replace(`-${version}`, ''),
      url: `/${requestUrl}`,
      method: method.toUpperCase(),
      version,
      paths,
      type: ResourceLinkType.PATH,
      key: generateKey(method, paths, version)
    };

    resourcePaths.push(resourceLink);
  });

  return resourcePaths;
}
