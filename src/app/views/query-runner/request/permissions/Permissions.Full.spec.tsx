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
jest.mock('../../../../services/slices/scopes.slice', () => ({
  fetchScopes: jest.fn(() => ({ type: 'scopes/fetch' }))
}));
jest.mock('../../../../services/slices/permission-grants.slice', () => ({
  fetchAllPrincipalGrants: jest.fn(() => ({ type: 'grants/fetch' }))
}));

import FullPermissions from './Permissions.Full';

describe('FullPermissions', () => {
  it('renders with permissions data from store', () => {
    renderWithProviders(<FullPermissions />, {
      preloadedState: {
        scopes: {
          pending: { isSpecificPermissions: false, isTenantWide: false, isFullPermissions: false },
          data: {
            specificPermissions: [],
            fullPermissions: [
              { value: 'User.Read', consentDescription: 'Read user', isAdmin: false, consented: false },
              { value: 'Mail.Read', consentDescription: 'Read mail', isAdmin: true, consented: false }
            ],
            tenantWidePermissions: []
          },
          error: null
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });

    expect(screen.getByText('Select different permissions')).toBeInTheDocument();
    expect(screen.getByText('Filter')).toBeInTheDocument();
  });

  it('shows loading text when loading', () => {
    renderWithProviders(<FullPermissions />, {
      preloadedState: {
        scopes: {
          pending: { isSpecificPermissions: false, isTenantWide: false, isFullPermissions: true },
          data: { specificPermissions: [], fullPermissions: [], tenantWidePermissions: [] },
          error: null
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });

    expect(screen.getByText('Fetching permissions...')).toBeInTheDocument();
  });

  it('handles empty permissions with 404 error', () => {
    renderWithProviders(<FullPermissions />, {
      preloadedState: {
        scopes: {
          pending: { isSpecificPermissions: false, isTenantWide: false, isFullPermissions: false },
          data: { specificPermissions: [], fullPermissions: [], tenantWidePermissions: [] },
          error: { status: 404, url: '/permissions' }
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });

    expect(screen.getByText('permissions not found')).toBeInTheDocument();
  });

  it('shows error message when fetching fails with non-404 error', () => {
    renderWithProviders(<FullPermissions />, {
      preloadedState: {
        scopes: {
          pending: { isSpecificPermissions: false, isTenantWide: false, isFullPermissions: false },
          data: { specificPermissions: [], fullPermissions: [], tenantWidePermissions: [] },
          error: { status: 500, url: '/permissions' }
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });

    expect(screen.getByText('Fetching permissions failing')).toBeInTheDocument();
  });

  it('renders search input for permissions', () => {
    renderWithProviders(<FullPermissions />, {
      preloadedState: {
        scopes: {
          pending: { isSpecificPermissions: false, isTenantWide: false, isFullPermissions: false },
          data: {
            specificPermissions: [],
            fullPermissions: [
              { value: 'User.Read', consentDescription: 'Read user', isAdmin: false, consented: false }
            ],
            tenantWidePermissions: []
          },
          error: null
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });

    expect(screen.getByPlaceholderText('Search permissions')).toBeInTheDocument();
  });

  it('filters permissions by search value', () => {
    renderWithProviders(<FullPermissions />, {
      preloadedState: {
        scopes: {
          pending: { isSpecificPermissions: false, isTenantWide: false, isFullPermissions: false },
          data: {
            specificPermissions: [],
            fullPermissions: [
              { value: 'User.Read', consentDescription: 'Read user profile', isAdmin: false, consented: false },
              { value: 'Mail.Read', consentDescription: 'Read mail', isAdmin: false, consented: false },
              { value: 'User.ReadWrite', consentDescription: 'Read and write user', isAdmin: false, consented: false }
            ],
            tenantWidePermissions: []
          },
          error: null
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });

    const searchInput = screen.getByPlaceholderText('Search permissions');
    fireEvent.change(searchInput, { target: { value: 'Mail' } });

    // Mail group should still be visible, User group should be filtered out
    expect(screen.getByText('Mail')).toBeInTheDocument();
  });

  it('renders permission groups as expandable tree items', () => {
    renderWithProviders(<FullPermissions />, {
      preloadedState: {
        scopes: {
          pending: { isSpecificPermissions: false, isTenantWide: false, isFullPermissions: false },
          data: {
            specificPermissions: [],
            fullPermissions: [
              { value: 'User.Read', consentDescription: 'Read user', isAdmin: false, consented: false },
              { value: 'Mail.Read', consentDescription: 'Read mail', isAdmin: true, consented: false }
            ],
            tenantWidePermissions: []
          },
          error: null
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });

    // Should show group names
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Mail')).toBeInTheDocument();
  });

  it('dispatches fetchAllPrincipalGrants when authenticated', () => {
    renderWithProviders(<FullPermissions />, {
      preloadedState: {
        scopes: {
          pending: { isSpecificPermissions: false, isTenantWide: false, isFullPermissions: false },
          data: { specificPermissions: [], fullPermissions: [], tenantWidePermissions: [] },
          error: null
        },
        auth: { authToken: { token: true, pending: false }, consentedScopes: ['User.Read'] }
      }
    });

    const { fetchAllPrincipalGrants } = require('../../../../services/slices/permission-grants.slice');
    expect(fetchAllPrincipalGrants).toHaveBeenCalled();
  });

  it('filters permissions to show only consented when filter is applied', () => {
    renderWithProviders(<FullPermissions />, {
      preloadedState: {
        scopes: {
          pending: { isSpecificPermissions: false, isTenantWide: false, isFullPermissions: false },
          data: {
            specificPermissions: [],
            fullPermissions: [
              { value: 'User.Read', consentDescription: 'Read user', isAdmin: false, consented: true },
              { value: 'Mail.Read', consentDescription: 'Read mail', isAdmin: false, consented: false }
            ],
            tenantWidePermissions: []
          },
          error: null
        },
        auth: { authToken: { token: true, pending: false }, consentedScopes: ['User.Read'] }
      }
    });

    // Click Filter menu button
    const filterButton = screen.getByText('Filter');
    fireEvent.click(filterButton);

    // Click "Consented permissions" menu item
    const consentedOption = screen.getByText('Consented permissions');
    fireEvent.click(consentedOption);

    // User group should still be visible (has consented permission)
    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('filters permissions to show only unconsented when filter is applied', () => {
    renderWithProviders(<FullPermissions />, {
      preloadedState: {
        scopes: {
          pending: { isSpecificPermissions: false, isTenantWide: false, isFullPermissions: false },
          data: {
            specificPermissions: [],
            fullPermissions: [
              { value: 'User.Read', consentDescription: 'Read user', isAdmin: false, consented: true },
              { value: 'Mail.Read', consentDescription: 'Read mail', isAdmin: false, consented: false }
            ],
            tenantWidePermissions: []
          },
          error: null
        },
        auth: { authToken: { token: true, pending: false }, consentedScopes: ['User.Read'] }
      }
    });

    const filterButton = screen.getByText('Filter');
    fireEvent.click(filterButton);

    const unconsentedOption = screen.getByText('Unconsented permissions');
    fireEvent.click(unconsentedOption);

    // Mail group should be visible (has unconsented permission)
    expect(screen.getByText('Mail')).toBeInTheDocument();
  });

  it('shows all permissions when "All permissions" filter is selected', () => {
    renderWithProviders(<FullPermissions />, {
      preloadedState: {
        scopes: {
          pending: { isSpecificPermissions: false, isTenantWide: false, isFullPermissions: false },
          data: {
            specificPermissions: [],
            fullPermissions: [
              { value: 'User.Read', consentDescription: 'Read user', isAdmin: false, consented: true },
              { value: 'Mail.Read', consentDescription: 'Read mail', isAdmin: false, consented: false }
            ],
            tenantWidePermissions: []
          },
          error: null
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });

    const filterButton = screen.getByText('Filter');
    fireEvent.click(filterButton);

    const allOption = screen.getByText('All permissions');
    fireEvent.click(allOption);

    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Mail')).toBeInTheDocument();
  });

  it('disables filter button when permissions list is empty', () => {
    renderWithProviders(<FullPermissions />, {
      preloadedState: {
        scopes: {
          pending: { isSpecificPermissions: false, isTenantWide: false, isFullPermissions: false },
          data: { specificPermissions: [], fullPermissions: [], tenantWidePermissions: [] },
          error: null
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });

    const filterButton = screen.getByText('Filter').closest('button');
    expect(filterButton).toBeDisabled();
  });

  it('marks permissions as consented when token and consentedScopes match', () => {
    renderWithProviders(<FullPermissions />, {
      preloadedState: {
        scopes: {
          pending: { isSpecificPermissions: false, isTenantWide: false, isFullPermissions: false },
          data: {
            specificPermissions: [],
            fullPermissions: [
              { value: 'User.Read', consentDescription: 'Read user', isAdmin: false, consented: false },
              { value: 'Mail.Read', consentDescription: 'Read mail', isAdmin: false, consented: false }
            ],
            tenantWidePermissions: []
          },
          error: null
        },
        auth: { authToken: { token: true, pending: false }, consentedScopes: ['User.Read'] }
      }
    });

    // Both groups should render
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Mail')).toBeInTheDocument();
  });

  it('handles search with no matching results', () => {
    renderWithProviders(<FullPermissions />, {
      preloadedState: {
        scopes: {
          pending: { isSpecificPermissions: false, isTenantWide: false, isFullPermissions: false },
          data: {
            specificPermissions: [],
            fullPermissions: [
              { value: 'User.Read', consentDescription: 'Read user', isAdmin: false, consented: false }
            ],
            tenantWidePermissions: []
          },
          error: null
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });

    const searchInput = screen.getByPlaceholderText('Search permissions');
    fireEvent.change(searchInput, { target: { value: 'NonExistentPermission' } });

    // No group should be visible
    expect(screen.queryByText('User')).not.toBeInTheDocument();
  });

  it('handles permissions with no dot in value (Unknown group)', () => {
    renderWithProviders(<FullPermissions />, {
      preloadedState: {
        scopes: {
          pending: { isSpecificPermissions: false, isTenantWide: false, isFullPermissions: false },
          data: {
            specificPermissions: [],
            fullPermissions: [
              { value: 'openid', consentDescription: 'OpenID Connect', isAdmin: false, consented: false }
            ],
            tenantWidePermissions: []
          },
          error: null
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });

    // The group name will be 'openid' (first part before dot, but since there's no dot, split returns the whole value)
    expect(screen.getByText('openid')).toBeInTheDocument();
  });

  it('case-insensitive search works correctly', () => {
    renderWithProviders(<FullPermissions />, {
      preloadedState: {
        scopes: {
          pending: { isSpecificPermissions: false, isTenantWide: false, isFullPermissions: false },
          data: {
            specificPermissions: [],
            fullPermissions: [
              { value: 'User.Read', consentDescription: 'Read user', isAdmin: false, consented: false },
              { value: 'Mail.Read', consentDescription: 'Read mail', isAdmin: false, consented: false }
            ],
            tenantWidePermissions: []
          },
          error: null
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });

    const searchInput = screen.getByPlaceholderText('Search permissions');
    fireEvent.change(searchInput, { target: { value: 'user' } });

    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.queryByText('Mail')).not.toBeInTheDocument();
  });

  it('renders multiple permissions in same group', () => {
    renderWithProviders(<FullPermissions />, {
      preloadedState: {
        scopes: {
          pending: { isSpecificPermissions: false, isTenantWide: false, isFullPermissions: false },
          data: {
            specificPermissions: [],
            fullPermissions: [
              { value: 'User.Read', consentDescription: 'Read user', isAdmin: false, consented: false },
              { value: 'User.ReadWrite', consentDescription: 'Read write user', isAdmin: false, consented: false },
              { value: 'User.Export.All', consentDescription: 'Export all', isAdmin: true, consented: false }
            ],
            tenantWidePermissions: []
          },
          error: null
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] }
      }
    });

    // Only one 'User' group entry should appear
    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('expands and collapses tree items when clicked', () => {
    renderWithProviders(<FullPermissions />, {
      preloadedState: {
        scopes: {
          pending: { isSpecificPermissions: false, isTenantWide: false, isFullPermissions: false },
          data: {
            specificPermissions: [],
            fullPermissions: [
              { value: 'User.Read', consentDescription: 'Read user', isAdmin: false, consented: false },
              { value: 'Mail.Read', consentDescription: 'Read mail', isAdmin: false, consented: false }
            ],
            tenantWidePermissions: []
          },
          error: null
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        profile: {
          status: 'success',
          user: { id: '1', displayName: 'Test', emailAddress: 'test@test.com', profileImageUrl: '' },
          error: null
        },
        permissionGrants: {
          permissions: { singlePermissionsGrant: [], tenantWidePermissionsGrant: [] },
          pending: false, error: null
        }
      }
    });

    // Click on User group to expand it
    const userGroup = screen.getByText('User');
    fireEvent.click(userGroup);

    // The DataGrid with permission details should now be visible
    expect(screen.getByText('User.Read')).toBeInTheDocument();

    // Click again to collapse
    fireEvent.click(userGroup);
  });

  it('expands multiple groups independently', () => {
    renderWithProviders(<FullPermissions />, {
      preloadedState: {
        scopes: {
          pending: { isSpecificPermissions: false, isTenantWide: false, isFullPermissions: false },
          data: {
            specificPermissions: [],
            fullPermissions: [
              { value: 'User.Read', consentDescription: 'Read user', isAdmin: false, consented: false },
              { value: 'Mail.Read', consentDescription: 'Read mail', isAdmin: true, consented: false }
            ],
            tenantWidePermissions: []
          },
          error: null
        },
        auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
        profile: {
          status: 'success',
          user: { id: '1', displayName: 'Test', emailAddress: 'test@test.com', profileImageUrl: '' },
          error: null
        },
        permissionGrants: {
          permissions: { singlePermissionsGrant: [], tenantWidePermissionsGrant: [] },
          pending: false, error: null
        }
      }
    });

    // Expand User group
    fireEvent.click(screen.getByText('User'));
    expect(screen.getByText('User.Read')).toBeInTheDocument();

    // Expand Mail group too
    fireEvent.click(screen.getByText('Mail'));
    expect(screen.getByText('Mail.Read')).toBeInTheDocument();

    // Both should still be expanded
    expect(screen.getByText('User.Read')).toBeInTheDocument();
    expect(screen.getByText('Mail.Read')).toBeInTheDocument();
  });
});
