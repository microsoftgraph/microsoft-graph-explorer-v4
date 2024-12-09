import { ReactNode, useMemo, useState } from 'react';

import { CollectionPermission, Method, ResourcePath } from '../../../../types/resources';
import {
  getScopesFromPaths, getVersionsFromPaths, scopeOptions
} from '../../../views/sidebar/resource-explorer/collection/collection.util';
import { CollectionPermissionsContext } from './CollectionPermissionsContext';
import { useAppSelector } from '../../../../store';

interface CollectionRequest {
  method: Method;
  requestUrl: string;
}

function getRequestsFromPaths(paths: ResourcePath[], version: string, scope: string) {
  const requests: CollectionRequest[] = [];
  paths.forEach(path => {
    const { method, url } = path;
    const pathScope = path.scope ?? scopeOptions[0].key;
    if (version === path.version && scope === pathScope) {
      requests.push({
        method: method as Method,
        requestUrl: url
      });
    }
  });
  return requests;
}

async function getCollectionPermissions(permissionsUrl: string, paths: ResourcePath[]):
Promise<{ [key: string]: CollectionPermission[] }> {
  const versions = getVersionsFromPaths(paths);
  const scopes = getScopesFromPaths(paths);
  const collectionPermissions: { [key: string]: CollectionPermission[] } = {};

  for (const version of versions) {
    for (const scope of scopes) {
      const requestPaths = getRequestsFromPaths(paths, version, scope);
      if (requestPaths.length === 0) {
        continue;
      }
      const url = `${permissionsUrl}?version=${version}&scopeType=${scope}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestPaths)
      });
      const perms = await response.json();
      collectionPermissions[`${version}-${scope}`] = (perms.results) ? perms.results : [];
    }
  }
  return collectionPermissions;
}

const CollectionPermissionsProvider = ({ children }: { children: ReactNode }) => {
  const { baseUrl } = useAppSelector((state) => state.devxApi);
  const [permissions, setPermissions] = useState<{ [key: string]: CollectionPermission[] } | undefined>(undefined);
  const [isFetching, setIsFetching] = useState(false);
  const [code, setCode] = useState('');

  const getPermissions = async (items: ResourcePath[]): Promise<void> => {
    const hashCode = window.btoa(JSON.stringify([...items]));
    if (hashCode !== code) {
      try {
        setIsFetching(true);
        const perms = await getCollectionPermissions(`${baseUrl}/permissions`, items);
        setPermissions(perms);
        setCode(hashCode);
      } catch (error) {
        setPermissions(undefined);
      } finally {
        setIsFetching(false);
      }
    }
  };

  const contextValue = useMemo(
    () => ({ getPermissions, permissions, isFetching }),
    [getPermissions, permissions, isFetching]
  );

  return (
    <CollectionPermissionsContext.Provider value={contextValue}>
      {children}
    </CollectionPermissionsContext.Provider>
  );
};

export default CollectionPermissionsProvider;