import { createContext } from 'react';
import { ResourcePath } from '../../../../types/resources';
import { CollectionPermission } from '../../../views/sidebar/resource-explorer/collection/collection-permission';

interface CollectionPermissionsContext {
  getPermissions: (paths: ResourcePath[]) => Promise<CollectionPermission[] | null>;
  permissions: any[];
  isFetching?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const CollectionPermissionsContext = createContext<CollectionPermissionsContext>(
  {} as CollectionPermissionsContext
);