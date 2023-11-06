import { ReactNode, useMemo, useState } from 'react';

import { CollectionPermission, Method, ResourcePath } from '../../../../types/resources';
import {
  getScopesFromPaths, getVersionsFromPaths, scopeOptions
} from '../../../views/sidebar/resource-explorer/collection/collection.util';
import { DEVX_API_URL } from '../../graph-constants';
import { CollectionPermissionsContext } from './CollectionPermissionsContext';

const DEVX_API_PERMISSIONS_URL = `${DEVX_API_URL}/api/permissions`;

interface CollectionRequest {
  method: Method;
  requestUrl: string;
}

function getRequestsFromPaths(paths: ResourcePath[], version: string, scope: string) {
  const requests: CollectionRequest[] = [];
  paths.forEach(path => {
    const { method, url } = path;
    path.scope = path.scope || scopeOptions[0].key;
    if (version === path.version && scope === path.scope) {
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
  const scopes = getScopesFromPaths(paths);
  const collectionPermissions: { [key: string]: CollectionPermission[] } = {};
  const fetchPromises: Promise<Response>[] = [];

  for (const version of versions) {
    for (const scope of scopes) {
      const requestPaths = getRequestsFromPaths(paths, version, scope);
      if (requestPaths.length === 0) {
        continue;
      }
      const url = `${DEVX_API_PERMISSIONS_URL}?version=${version}&scopeType=${scope}`;
      fetchPromises.push(fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestPaths)
      }));
    }
  }

  const responses = await Promise.all(fetchPromises);

  for (let i = 0; i < responses.length; i++) {
    const perms = await responses[i].json();
    const key = `${versions[Math.floor(i / scopes.length)]}-${scopes[i % scopes.length]}`;
    collectionPermissions[key] = (perms.results) ? perms.results : [];
  }

  return collectionPermissions;
}

const CollectionPermissionsProvider = ({ children }: { children: ReactNode }) => {
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
      value={{ getPermissions, ...valueObject }}>{children}</CollectionPermissionsContext.Provider>
  );
}

export default CollectionPermissionsProvider