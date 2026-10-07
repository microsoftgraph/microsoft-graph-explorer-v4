import React from 'react';
import { renderHook } from '@testing-library/react';
import { useCollectionPermissions } from './useCollectionPermissions';
import { CollectionPermissionsContext } from '../context/collection-permissions/CollectionPermissionsContext';

describe('useCollectionPermissions', () => {
  it('returns context value', () => {
    const mockPermissions = { '/me': [] };
    const mockGetPermissions = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CollectionPermissionsContext.Provider value={{
        getPermissions: mockGetPermissions,
        permissions: mockPermissions,
        isFetching: false
      }}>
        {children}
      </CollectionPermissionsContext.Provider>
    );
    const { result } = renderHook(() => useCollectionPermissions(), { wrapper });
    expect(result.current.permissions).toEqual(mockPermissions);
    expect(result.current.getPermissions).toBe(mockGetPermissions);
  });

  it('returns empty context when no provider', () => {
    const { result } = renderHook(() => useCollectionPermissions());
    expect(result.current).toBeDefined();
  });
});
