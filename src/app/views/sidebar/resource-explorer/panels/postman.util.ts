import { IPostmanCollection, Item } from '../../../../../types/postman-collection';
import { IResourceLink, IResourceLabel, MethodObject } from '../../../../../types/resources';
import { GRAPH_URL } from '../../../../services/graph-constants';
import { downloadToLocal } from '../../../../utils/download';
import { flatten, getUrlFromLink } from '../resource-explorer.utils';

function generatePostmanCollection(paths: IResourceLink[]): IPostmanCollection {
  const collection: IPostmanCollection = {
    info: {
      _postman_id: Math.random().toString().replace('.', ''),
      name: 'Graph-Collection',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
    },
    item: generateItemsFromPaths(paths)
  };
  return collection;
}

export function exportCollection(paths: IResourceLink[]) {
  const content = generatePostmanCollection(paths);
  const filename = `${content.info.name}-${content.info._postman_id}.postman_collection.json`;
  downloadToLocal(content, filename);
}

export function getResourcePaths(item: IResourceLink, version: string): IResourceLink[] {
  const { links } = item;
  const content: IResourceLink[] = flatten(links).filter((k: any) => k.type === 'path');
  content.unshift(item);
  if (content.length > 0) {
    content.forEach((element: IResourceLink) => {
      const methods = element.labels.find((k: IResourceLabel) => k.name === version)?.methods || [];
      const listOfMethods: MethodObject[] = [];
      methods.forEach((method: string) => {
        listOfMethods.push({
          name: method.toUpperCase(),
          checked: true
        });
      });
      element.version = version;
      element.url = `${getUrlFromLink(element)}`;
      element.methods = listOfMethods;
    });
  }
  return content;
}

function generateItemsFromPaths(resources: IResourceLink[]): Item[] {
  const list: Item[] = [];
  resources.forEach(resource => {
    const {
      method,
      name,
      url,
      version,
      path
    } = resource;

    const item: Item = {
      name,
      request: {
        method,
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
