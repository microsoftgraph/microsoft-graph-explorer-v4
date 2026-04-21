import React from 'react';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
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
  fetchAllPrincipalGrants: jest.fn(() => ({ type: 'grants/fetch' })),
  getAllPrincipalGrant: jest.fn().mockReturnValue([]),
  getSinglePrincipalGrant: jest.fn().mockReturnValue([])
}));
jest.mock('../../../../services/hooks', () => ({
  usePopups: () => ({ show: jest.fn() })
}));
jest.mock('../../../../services/context/validation-context/ValidationContext', () => {
  const { createContext } = require('react');
  return { ValidationContext: createContext({ isValid: true }) };
});

const { ValidationContext } = require('../../../../services/context/validation-context/ValidationContext');

import { Permissions } from './Permissions.Query';

describe('Permissions (Query)', () => {
  it('renders with query permissions', () => {
    renderWithProviders(
      <ValidationContext.Provider value={{ isValid: true }}>
        <Permissions />
      </ValidationContext.Provider>,
      {
        preloadedState: {
          scopes: {
            pending: { isSpecificPermissions: false, isTenantWide: false, isFullPermissions: false },
            data: {
              specificPermissions: [
                { value: 'User.Read', consentDescription: 'Read user profile', isAdmin: false, consented: true }
              ],
              fullPermissions: [],
              tenantWidePermissions: []
            },
            error: null
          },
          auth: { authToken: { token: 'valid-token', pending: false }, consentedScopes: ['User.Read'] },
          profile: { status: 'success', user: { id: 'user-1', displayName: 'Test' }, error: null },
          permissionGrants: { pending: false, error: null, permissions: [] },
          sampleQuery: {
            sampleUrl: 'https://graph.microsoft.com/v1.0/me',
            selectedVerb: 'GET',
            sampleBody: undefined,
            sampleHeaders: [],
            selectedVersion: 'v1.0'
          }
        }
      }
    );

    expect(screen.getByText('permissions required to run the query')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    renderWithProviders(
      <ValidationContext.Provider value={{ isValid: true }}>
        <Permissions />
      </ValidationContext.Provider>,
      {
        preloadedState: {
          scopes: {
            pending: { isSpecificPermissions: true, isTenantWide: false, isFullPermissions: false },
            data: { specificPermissions: [], fullPermissions: [], tenantWidePermissions: [] },
            error: null
          },
          auth: { authToken: { token: 'valid-token', pending: false }, consentedScopes: [] },
          sampleQuery: {
            sampleUrl: 'https://graph.microsoft.com/v1.0/me',
            selectedVerb: 'GET',
            sampleBody: undefined,
            sampleHeaders: [],
            selectedVersion: 'v1.0'
          }
        }
      }
    );

    expect(screen.getByText(/Fetching permissions/)).toBeInTheDocument();
  });

  it('handles empty permissions when not signed in', () => {
    renderWithProviders(
      <ValidationContext.Provider value={{ isValid: true }}>
        <Permissions />
      </ValidationContext.Provider>,
      {
        preloadedState: {
          scopes: {
            pending: { isSpecificPermissions: false, isTenantWide: false, isFullPermissions: false },
            data: { specificPermissions: [], fullPermissions: [], tenantWidePermissions: [] },
            error: null
          },
          auth: { authToken: { token: false, pending: false }, consentedScopes: [] },
          sampleQuery: {
            sampleUrl: 'https://graph.microsoft.com/v1.0/me',
            selectedVerb: 'GET',
            sampleBody: undefined,
            sampleHeaders: [],
            selectedVersion: 'v1.0'
          }
        }
      }
    );

    expect(screen.getByText('sign in to view a list of all permissions')).toBeInTheDocument();
  });

  it('renders invalid URL when validation is not valid', () => {
    renderWithProviders(
      <ValidationContext.Provider value={{ isValid: false, validate: jest.fn(), query: '', error: '' }}>
        <Permissions />
      </ValidationContext.Provider>,
      {
        preloadedState: {
          scopes: {
            pending: { isSpecificPermissions: false, isTenantWide: false, isFullPermissions: false },
            data: { specificPermissions: [], fullPermissions: [], tenantWidePermissions: [] },
            error: null
          },
          auth: { authToken: { token: 'valid-token', pending: false }, consentedScopes: [] },
          sampleQuery: {
            sampleUrl: 'https://graph.microsoft.com/v1.0/me',
            selectedVerb: 'GET',
            sampleBody: undefined,
            sampleHeaders: [],
            selectedVersion: 'v1.0'
          }
        }
      }
    );

    expect(screen.getByText('Invalid URL!')).toBeInTheDocument();
  });
});
