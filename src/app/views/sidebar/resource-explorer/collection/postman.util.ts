import { Guid } from 'guid-typescript';

import {
  IPostmanCollection,
  Item
} from '../../../../../types/postman-collection';
import { IResource, IResourceLink, ResourceLinkType } from '../../../../../types/resources';
import { GRAPH_URL } from '../../../../services/graph-constants';
import { parseSampleUrl } from '../../../../utils/sample-url-generation';
import { getMatchingResourceForUrl } from '../../../../utils/resources/resources-filter';
import { getCurrentTree } from '../resource-explorer.utils';

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

export function generateResourceLinksFromPostmanCollection(collection: IPostmanCollection, resources: IResource):
IResourceLink[] {
  const resourceLinks: IResourceLink[] = [];

  collection.item.forEach((item) => {
    const { name, request } = item;
    const { method, url } = request!;

    // const version = url.path[0];
    const paths = url.path;
    paths.shift();
    paths.unshift('/')

    const { queryVersion: version, requestUrl } = parseSampleUrl(url.raw);

    const level = paths.length;

    const filtered = getCurrentTree({resourceItems: resources.children, level, version, paths})
    if(!filtered) { return }
    const filteredResource = filtered.links[0] as IResourceLink;

    if(!filteredResource){return  }

    console.log(filteredResource);

    const resourceLink: any = {
      name: name.replace(`-${version}`, ''),
      url: `/${requestUrl}`,
      method: method.toUpperCase(),
      version,
      paths,
      links: [],
      labels: [],
      parent: filteredResource.parent,
      level,
      type: ResourceLinkType.PATH,
      isExpanded: false,
      key: `${filteredResource.key}-${version}`,
      docLink: filteredResource.docLink
    };

    resourceLinks.push(resourceLink);
  });

  return resourceLinks;
}
