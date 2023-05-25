import { useState } from 'react';

import { CollectionPermission, Method, ResourcePath } from '../../../../types/resources';
import { CollectionPermissionsContext } from './CollectionPermissionsContext';

const DEVX_API_URL = 'https://graphexplorerapi-staging.azurewebsites.net/api/permissions';

function getRequestsFromPaths(paths: ResourcePath[]) {
  const requests: any[] = [];
  paths.forEach(path => {
    const { method, url } = path;
    requests.push({
      method: method as Method,
      requestUrl: url
    });
  });
  return requests;
}

async function getCollectionPermissions(paths: ResourcePath[]) {
  const response = await fetch(DEVX_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(getRequestsFromPaths(paths))
  });
  const perms = await response.json();
  return perms;
}

const CollectionPermissionsProvider = ({ children }: any) => {
  const [permissions, setPermissions] = useState<CollectionPermission[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  async function getPermissions(items: ResourcePath[]): Promise<CollectionPermission[] | null> {
    try {
      setIsFetching(true);
      const perms = await getCollectionPermissions(items);
      setPermissions(perms.results);
      setIsFetching(false);
      return perms.result;
    } catch (error) {
      setIsFetching(false);
    }
    return null;
  }

  return (
    <CollectionPermissionsContext.Provider
      value={{ getPermissions, permissions, isFetching }}>{children}</CollectionPermissionsContext.Provider>
  );
}

export default CollectionPermissionsProvider