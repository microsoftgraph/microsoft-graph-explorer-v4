import { useMemo, useState } from 'react';

import { CollectionPermission, Method, ResourcePath } from '../../../../types/resources';
import { getVersionsFromPaths } from '../../../views/sidebar/resource-explorer/collection/collection.util';
import { DEVX_API_URL } from '../../graph-constants';
import { CollectionPermissionsContext } from './CollectionPermissionsContext';

const DEVX_API_PERMISSIONS_URL = `${DEVX_API_URL}/api/permissions`;

function getRequestsFromPaths(paths: ResourcePath[], version: string) {
  const requests: any[] = [];
  paths.forEach(path => {
    const { method, url } = path;
    if (version === path.version) {
      requests.push({
        method: method as Method,
        requestUrl: url
      });
    }
  });
  return requests;
}

async function getCollectionPermissions(paths: ResourcePath[]): Promise<{ [key: string]: CollectionPermission[] }> {
  const versions = getVersionsFromPaths(paths);
  const collectionPermissions: { [key: string]: CollectionPermission[] } = {};
  for (const version of versions) {
    const response = await fetch(DEVX_API_PERMISSIONS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(getRequestsFromPaths(paths, version))
    });
    const perms = await response.json();
    collectionPermissions[version] = (perms.results) ? perms.results : [];
  }
  return collectionPermissions;
}

const CollectionPermissionsProvider = ({ children }: any) => {
  const [permissions, setPermissions] = useState<{ [key: string]: CollectionPermission[] } | undefined>(undefined);
  const [isFetching, setIsFetching] = useState(false);
  const [code, setCode] = useState('');
  const valueObject = useMemo(() => ({ permissions, isFetching }), [permissions, isFetching]);

  async function getPermissions(items: ResourcePath[]): Promise<void> {
    const hashCode = window.btoa(JSON.stringify([...items]));
    if (hashCode !== code) {
      try {
        setIsFetching(true);
        const perms = await getCollectionPermissions(items);
        setPermissions(perms);
        setIsFetching(false);
        setCode(hashCode);
      } catch (error) {
        setIsFetching(false);
        setPermissions(undefined);
      }
    }
  }

  return (
    <CollectionPermissionsContext.Provider
      value={{ getPermissions, ...valueObject}}>{children}</CollectionPermissionsContext.Provider>
  );
}

export default CollectionPermissionsProvider