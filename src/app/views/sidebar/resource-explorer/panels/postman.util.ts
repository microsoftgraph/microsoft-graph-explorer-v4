import { IPostmanCollection, Item } from '../../../../../types/postman-collection';
import { GRAPH_URL } from '../../../../services/graph-constants';
import { downloadToLocal } from '../../../../utils/download';

function generatePostmanCollection(paths: any[]): IPostmanCollection {
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

export function exportCollection(paths: any[]) {
  const content = generatePostmanCollection(paths);
  const filename = `${content.info.name}-${content.info._postman_id}.postman_collection.json`;
  downloadToLocal(content, filename);
}

function generateItemsFromPaths(resources: any[]): Item[] {
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
