import { useContext } from 'react';

import { CollectionPermissionsContext } from '../context/collection-permissions/CollectionPermissionsContext';

export const useCollectionPermissions = () => {
  return useContext(CollectionPermissionsContext);
};