import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { CollectionPermission, Method, ResourcePath } from '../../../../types/resources';
import {
  getScopesFromPaths, getVersionsFromPaths, scopeOptions
} from '../../../views/sidebar/resource-explorer/collection/collection.util';
import { CollectionPermissionsContext } from './CollectionPermissionsContext';
import { useAppSelector } from '../../../../store';
import { IDevxAPI } from '../../../../types/devx-api';
import { devxCacheKey, fetchDevxApi, getDevxConfiguration } from '../../devx-api';

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

async function getCollectionPermissions(
  config: IDevxAPI, paths: ResourcePath[], signal: AbortSignal, isCurrent: () => boolean
):
Promise<{ [key: string]: CollectionPermission[] }> {
  const versions = getVersionsFromPaths(paths);
  const scopes = getScopesFromPaths(paths);
  if (!isCurrent()) { return {}; }
  const batches = versions.flatMap(version => scopes.map(scope => ({
    version, scope, requestPaths: getRequestsFromPaths(paths, version, scope)
  }))).filter(({ requestPaths }) => requestPaths.length > 0);

  const results = await Promise.all(batches.map(async ({ version, scope, requestPaths }) => {
    const response = await fetchDevxApi(config, '/permissions', { version, scopeType: scope }, {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestPaths)
    });
    if (!response.ok) { throw new Error('Failed to fetch collection permissions'); }
    const perms = await response.json();
    return [`${version}-${scope}`, perms.results ? perms.results : []] as const;
  }));

  const collectionPermissions: { [key: string]: CollectionPermission[] } = {};
  if (!isCurrent()) { return collectionPermissions; }
  results.forEach(([key, value]) => { collectionPermissions[key] = value; });
  return collectionPermissions;
}

const CollectionPermissionsProvider = ({ children }: { children: ReactNode }) => {
  const devxApi = useAppSelector((state) => state.devxApi);
  const authToken = useAppSelector((state) => state.auth.authToken.token);
  const config = useMemo(() => getDevxConfiguration({
    devxApi, auth: { authToken: { token: authToken } }
  }), [devxApi, authToken]);
  const [permissions, setPermissions] = useState<{ [key: string]: CollectionPermission[] } | undefined>(undefined);
  const [isFetching, setIsFetching] = useState(false);
  const code = useRef('');
  const items = useRef<ResourcePath[] | null>(null);
  const request = useRef(0);
  const controller = useRef<AbortController>();
  const identity = `${devxCacheKey(config)}${devxApi.revision || 0}`;
  const currentIdentity = useRef(identity);
  const previousIdentity = useRef(identity);
  currentIdentity.current = identity;

  const getPermissions = useCallback(async (paths: ResourcePath[]): Promise<void> => {
    items.current = paths;
    const hashCode = `${identity}:${JSON.stringify(paths)}`;
    if (hashCode !== code.current) {
      controller.current?.abort();
      const batch = new AbortController();
      controller.current = batch;
      const requestId = ++request.current;
      const isCurrent = () => !batch.signal.aborted &&
        identity === currentIdentity.current && requestId === request.current;
      try {
        setIsFetching(true);
        const perms = await getCollectionPermissions(config, paths, batch.signal, isCurrent);
        if (!isCurrent()) { return; }
        setPermissions(perms);
        code.current = hashCode;
      } catch (error) {
        if (isCurrent()) {
          setPermissions(undefined);
        }
      } finally {
        if (isCurrent()) { setIsFetching(false); }
      }
    }
  }, [config, identity]);

  useEffect(() => {
    if (previousIdentity.current === identity) { return; }
    previousIdentity.current = identity;
    controller.current?.abort();
    code.current = '';
    setPermissions(undefined);
    setIsFetching(false);
    if (items.current) { void getPermissions(items.current); }
  }, [getPermissions, identity]);

  useEffect(() => () => { controller.current?.abort(); }, []);

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