import { createContext } from 'react';

import { CollectionPermission, ResourcePath } from '../../../../types/resources';

interface CollectionPermissionsContext {
  getPermissions: (paths: ResourcePath[]) => Promise<CollectionPermission[] | null>;
  permissions: any[];
  isFetching?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const CollectionPermissionsContext = createContext<CollectionPermissionsContext>(
  {} as CollectionPermissionsContext
);