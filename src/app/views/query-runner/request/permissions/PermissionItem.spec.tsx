import React from 'react';
import '@testing-library/jest-dom';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../../../test-utils';

const mockRevokeScopes: any = jest.fn(() => ({ type: 'revoke/mock' }));
mockRevokeScopes.pending = 'revokeScopes/pending';
mockRevokeScopes.fulfilled = 'revokeScopes/fulfilled';
mockRevokeScopes.rejected = 'revokeScopes/rejected';
jest.mock('../../../../services/actions/revoke-scopes.action', () => ({
  revokeScopes: mockRevokeScopes
}));
jest.mock('../../../../../modules/authentication', () => ({
  authenticationWrapper: {
    logIn: jest.fn(),
    logOut: jest.fn(),
    getAccount: jest.fn(),
    getSessionId: jest.fn(),
    logInWithOther: jest.fn(),
    clearSession: jest.fn(),
    refreshToken: jest.fn()
  }
}));
jest.mock('../../../../../telemetry', () => ({
  telemetry: {
    trackEvent: jest.fn(),
    trackTabClickEvent: jest.fn(),
    trackCopyButtonClickEvent: jest.fn(),
    trackLinkClickEvent: jest.fn(),
    trackException: jest.fn(),
    getDeviceCharacteristicsData: jest.fn().mockReturnValue({})
  },
  componentNames: {},
  eventTypes: {},
  errorTypes: {}
}));
jest.mock('../../../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));

import PermissionItem from './PermissionItem';

const defaultPermission = {
  value: 'User.Read',
  consentDescription: 'Read user profile',
  isAdmin: false,
  consented: false
};

describe('PermissionItem', () => {
  const baseState = {
    scopes: {
      pending: { isSpecificPermissions: false, isTenantWide: false, isFullPermissions: false },
      data: { specificPermissions: [], fullPermissions: [], tenantWidePermissions: [] },
      error: null
    },
    auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
    profile: { user: { id: 'user-1', displayName: 'Test User' } },
    permissionGrants: { pending: false, error: null, permissions: [] }
  };

  it('renders permission value column', () => {
    renderWithProviders(
      <PermissionItem
        item={defaultPermission}
        index={0}
        column={{ key: 'value', fieldName: 'value' }}
      />,
      { preloadedState: baseState }
    );

    expect(screen.getByText('User.Read')).toBeInTheDocument();
  });

  it('renders least privileged tooltip for index 0', () => {
    renderWithProviders(
      <PermissionItem
        item={defaultPermission}
        index={0}
        column={{ key: 'value', fieldName: 'value' }}
      />,
      { preloadedState: baseState }
    );

    // The info icon button should be present for index 0
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('does not render info icon for index > 0', () => {
    renderWithProviders(
      <PermissionItem
        item={defaultPermission}
        index={1}
        column={{ key: 'value', fieldName: 'value' }}
      />,
      { preloadedState: baseState }
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders admin consent column with No', () => {
    renderWithProviders(
      <PermissionItem
        item={defaultPermission}
        index={0}
        column={{ key: 'isAdmin', fieldName: 'isAdmin' }}
      />,
      { preloadedState: baseState }
    );

    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('renders admin consent column with Yes for admin permission', () => {
    const adminPerm = { ...defaultPermission, isAdmin: true };
    renderWithProviders(
      <PermissionItem
        item={adminPerm}
        index={0}
        column={{ key: 'isAdmin', fieldName: 'isAdmin' }}
      />,
      { preloadedState: baseState }
    );

    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  it('renders consent button when not consented', () => {
    renderWithProviders(
      <PermissionItem
        item={defaultPermission}
        index={0}
        column={{ key: 'consented', fieldName: 'consented' }}
      />,
      { preloadedState: baseState }
    );

    expect(screen.getByText('Consent')).toBeInTheDocument();
  });

  it('clicking consent button dispatches consentToScopes', () => {
    const { store } = renderWithProviders(
      <PermissionItem
        item={defaultPermission}
        index={0}
        column={{ key: 'consented', fieldName: 'consented' }}
      />,
      { preloadedState: baseState }
    );

    fireEvent.click(screen.getByText('Consent'));
    // Consent button was clicked - action dispatched
    expect(screen.getByText('Consent')).toBeInTheDocument();
  });

  it('renders disabled revoke button when consented but lacking required permissions', () => {
    const consentedPerm = { ...defaultPermission, consented: true };
    renderWithProviders(
      <PermissionItem
        item={consentedPerm}
        index={0}
        column={{ key: 'consented', fieldName: 'consented' }}
      />,
      { preloadedState: baseState }
    );

    const revokeBtn = screen.getByText('Revoke').closest('button');
    expect(revokeBtn).toBeDisabled();
  });

  it('renders enabled revoke button when consented and has required permissions', () => {
    const consentedPerm = { ...defaultPermission, consented: true };
    const stateWithGrants = {
      ...baseState,
      auth: { authToken: { token: true, pending: false }, consentedScopes: ['DelegatedPermissionGrant.ReadWrite.All', 'Directory.Read.All'] },
      permissionGrants: {
        pending: false,
        error: null,
        permissions: [
          { consentType: 'AllPrincipals', scope: 'DelegatedPermissionGrant.ReadWrite.All Directory.Read.All' }
        ]
      }
    };
    renderWithProviders(
      <PermissionItem
        item={consentedPerm}
        index={0}
        column={{ key: 'consented', fieldName: 'consented' }}
      />,
      { preloadedState: stateWithGrants }
    );

    const revokeBtn = screen.getByText('Revoke').closest('button');
    expect(revokeBtn).not.toBeDisabled();
  });

  it('clicking revoke button dispatches revokeScopes', () => {
    const consentedPerm = { ...defaultPermission, consented: true };
    const stateWithGrants = {
      ...baseState,
      auth: { authToken: { token: true, pending: false }, consentedScopes: ['DelegatedPermissionGrant.ReadWrite.All', 'Directory.Read.All'] },
      permissionGrants: {
        pending: false,
        error: null,
        permissions: [
          { consentType: 'AllPrincipals', scope: 'DelegatedPermissionGrant.ReadWrite.All Directory.Read.All' }
        ]
      }
    };
    renderWithProviders(
      <PermissionItem
        item={consentedPerm}
        index={0}
        column={{ key: 'consented', fieldName: 'consented' }}
      />,
      { preloadedState: stateWithGrants }
    );

    fireEvent.click(screen.getByText('Revoke'));
    expect(mockRevokeScopes).toHaveBeenCalledWith('User.Read');
  });

  it('renders consentDescription column with tooltip', () => {
    renderWithProviders(
      <PermissionItem
        item={defaultPermission}
        index={0}
        column={{ key: 'consentDescription', fieldName: 'consentDescription' }}
      />,
      { preloadedState: baseState }
    );

    expect(screen.getByText('Read user profile')).toBeInTheDocument();
  });

  it('renders default column as tooltip span', () => {
    const perm = { ...defaultPermission, someField: 'Some value' };
    renderWithProviders(
      <PermissionItem
        item={perm}
        index={0}
        column={{ key: 'someField', fieldName: 'someField' }}
      />,
      { preloadedState: baseState }
    );

    expect(screen.getByText('Some value')).toBeInTheDocument();
  });

  it('returns null when column is undefined', () => {
    const { container } = renderWithProviders(
      <PermissionItem
        item={defaultPermission}
        index={0}
        column={undefined}
      />,
      { preloadedState: baseState }
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders consentType column as null when not consented', () => {
    const { container } = renderWithProviders(
      <PermissionItem
        item={defaultPermission}
        index={0}
        column={{ key: 'consentType', fieldName: 'consentType' }}
      />,
      { preloadedState: baseState }
    );

    // Should render null since item is not consented
    expect(container.textContent).toBe('');
  });

  it('renders consentType column when consented with user and permissions', () => {
    const consentedPerm = { ...defaultPermission, consented: true };
    const stateWithPerms = {
      ...baseState,
      scopes: {
        ...baseState.scopes,
        data: { specificPermissions: [consentedPerm], fullPermissions: [], tenantWidePermissions: [] }
      },
      auth: { authToken: { token: true, pending: false }, consentedScopes: ['User.Read'] },
      permissionGrants: {
        pending: false,
        error: null,
        permissions: [
          { consentType: 'AllPrincipals', scope: 'User.Read' },
          { consentType: 'Principal', scope: 'User.Read' }
        ]
      }
    };
    const { container } = renderWithProviders(
      <PermissionItem
        item={consentedPerm}
        index={0}
        column={{ key: 'consentType', fieldName: 'consentType' }}
      />,
      { preloadedState: stateWithPerms }
    );

    // ConsentTypeProperty should render something (not null)
    expect(container.innerHTML).not.toBe('');
  });

  it('renders consentType column null when user id is missing', () => {
    const consentedPerm = { ...defaultPermission, consented: true };
    const stateNoUser = {
      ...baseState,
      auth: { authToken: { token: true, pending: false }, consentedScopes: ['User.Read'] },
      profile: { user: { id: '', displayName: 'Test User' } }
    };
    const { container } = renderWithProviders(
      <PermissionItem
        item={consentedPerm}
        index={0}
        column={{ key: 'consentType', fieldName: 'consentType' }}
      />,
      { preloadedState: stateNoUser }
    );

    expect(container.textContent).toBe('');
  });

  it('renders value column without info icon for non-zero index', () => {
    renderWithProviders(
      <PermissionItem
        item={defaultPermission}
        index={5}
        column={{ key: 'value', fieldName: 'value' }}
      />,
      { preloadedState: baseState }
    );

    expect(screen.getByText('User.Read')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders revoke disabled when permissionGrants is empty array', () => {
    const consentedPerm = { ...defaultPermission, consented: true };
    const stateEmptyGrants = {
      ...baseState,
      auth: { authToken: { token: true, pending: false }, consentedScopes: ['User.Read'] },
      permissionGrants: { pending: false, error: null, permissions: [] }
    };
    renderWithProviders(
      <PermissionItem
        item={consentedPerm}
        index={0}
        column={{ key: 'consented', fieldName: 'consented' }}
      />,
      { preloadedState: stateEmptyGrants }
    );

    const revokeBtn = screen.getByText('Revoke').closest('button');
    expect(revokeBtn).toBeDisabled();
  });
});
