import { useMemo, useState } from 'react';

import { CollectionPermission, Method, ResourcePath } from '../../../../types/resources';
import { DEVX_API_URL } from '../../graph-constants';
import { CollectionPermissionsContext } from './CollectionPermissionsContext';

const DEVX_API_PERMISSIONS_URL = `${DEVX_API_URL}/api/permissions`;

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
  const response = await fetch(DEVX_API_PERMISSIONS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(getRequestsFromPaths(paths))
  });
  const perms = await response.json();
  if (!perms.results) {
    throw new Error('No permissions found');
  }
  return perms;
}

const CollectionPermissionsProvider = ({ children }: any) => {
  const [permissions, setPermissions] = useState<CollectionPermission[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [code, setCode] = useState('');
  const valueObject = useMemo(() => ({ permissions, isFetching }), [permissions, isFetching]);

  async function getPermissions(items: ResourcePath[]): Promise<void> {
    const hashCode = window.btoa(JSON.stringify([...items]));
    if (hashCode !== code) {
      try {
        setIsFetching(true);
        const perms = await getCollectionPermissions(items);
        setPermissions(perms.results);
        setIsFetching(false);
        setCode(hashCode);
      } catch (error) {
        setIsFetching(false);
        setPermissions([]);
      }
    }
  }

  return (
    <CollectionPermissionsContext.Provider
      value={{ getPermissions, ...valueObject}}>{children}</CollectionPermissionsContext.Provider>
  );
}

export default CollectionPermissionsProvider