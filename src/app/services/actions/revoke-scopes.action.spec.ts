import { configureStore } from '@reduxjs/toolkit';

jest.mock('../../../modules/authentication', () => ({
  authenticationWrapper: {
    refreshToken: jest.fn()
  }
}));

jest.mock('./permissions-action-creator.util', () => ({
  REVOKE_STATUS: {
    success: 'success',
    failure: 'failure',
    preliminaryChecksFail: 'preliminaryChecksFail',
    allPrincipalScope: 'allPrincipalScope'
  },
  RevokePermissionsUtil: {
    initialize: jest.fn()
  }
}));

jest.mock('../../../telemetry', () => ({
  telemetry: {
    trackEvent: jest.fn(),
    trackLinkClickEvent: jest.fn(),
    trackReactComponent: jest.fn((c: any) => c),
    trackTabClickEvent: jest.fn()
  },
  eventTypes: { BUTTON_CLICK_EVENT: 'btn', LINK_CLICK_EVENT: 'link' },
  componentNames: { REVOKE_PERMISSION_CONSENT_BUTTON: 'revoke-btn' }
}));

jest.mock('../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));

jest.mock('../graph-constants', () => ({
  DEFAULT_USER_SCOPES: 'openid profile User.Read',
  REVOKING_PERMISSIONS_REQUIRED_SCOPES: 'DelegatedPermissionGrant.ReadWrite.All Directory.Read.All'
}));

jest.mock('../slices/auth.slice', () => ({
  getAuthTokenSuccess: jest.fn(() => ({ type: 'auth/getAuthTokenSuccess' })),
  getConsentedScopesSuccess: jest.fn((scopes: string[]) => ({
    type: 'auth/getConsentedScopesSuccess',
    payload: scopes
  }))
}));

jest.mock('../slices/permission-grants.slice', () => ({
  fetchAllPrincipalGrants: jest.fn(() => ({ type: 'grants/fetchAll' }))
}));

jest.mock('../slices/query-status.slice', () => ({
  setQueryResponseStatus: jest.fn((status: any) => ({
    type: 'queryStatus/set',
    payload: status
  }))
}));

import { revokeScopes } from './revoke-scopes.action';
import { RevokePermissionsUtil } from './permissions-action-creator.util';

function createTestStore(overrides: Record<string, any> = {}) {
  return configureStore({
    reducer: {
      auth: (state = { consentedScopes: ['User.Read', 'Mail.Read'], authToken: { token: true, pending: false } }) => state,
      profile: (state = { user: { id: 'user-id-123' } }) => state,
      queryStatus: (state = null, action: any) =>
        action.type === 'queryStatus/set' ? action.payload : state,
      ...overrides
    }
  });
}

describe('revokeScopes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects when no consented scopes', async () => {
    const store = createTestStore({
      auth: () => ({ consentedScopes: [], authToken: { token: false, pending: false } })
    });

    const result = await store.dispatch(revokeScopes('Mail.Read'));
    expect(result.type).toBe('auth/revokeScopes/rejected');
    expect(result.payload).toBe('No consented scopes found');
  });

  it('dispatches successfully when permissions are updated', async () => {
    const mockUtil = {
      getUserPermissionChecks: jest.fn().mockResolvedValue({
        userIsTenantAdmin: false,
        permissionBeingRevokedIsAllPrincipal: false,
        grantsPayload: { id: 'grant-1' }
      }),
      updateSinglePrincipalPermissionGrant: jest.fn().mockResolvedValue(true)
    };
    (RevokePermissionsUtil.initialize as jest.Mock).mockResolvedValue(mockUtil);

    const { authenticationWrapper } = require('../../../modules/authentication');
    authenticationWrapper.refreshToken.mockResolvedValue({ accessToken: 'new-token' });

    const store = createTestStore();
    const result = await store.dispatch(revokeScopes('Mail.Read'));

    expect(result.type).toBe('auth/revokeScopes/fulfilled');
    expect(RevokePermissionsUtil.initialize).toHaveBeenCalledWith('user-id-123');
  });

  it('rejects when consentedScopes is null/undefined', async () => {
    const store = createTestStore({
      auth: () => ({ consentedScopes: null, authToken: { token: false, pending: false } })
    });

    const result = await store.dispatch(revokeScopes('Mail.Read'));
    expect(result.type).toBe('auth/revokeScopes/rejected');
    expect(result.payload).toBe('No consented scopes found');
  });

  it('handles RevokeScopesError from getUserPermissionChecks', async () => {
    const { RevokeScopesError } = require('../../utils/error-utils/RevokeScopesError');
    const mockUtil = {
      getUserPermissionChecks: jest.fn().mockRejectedValue(new RevokeScopesError({
        errorText: 'Revoking default scopes',
        statusText: 'Cannot delete default scope',
        status: 'Default scope',
        messageType: 1
      }))
    };
    (RevokePermissionsUtil.initialize as jest.Mock).mockResolvedValue(mockUtil);

    const store = createTestStore();
    const result = await store.dispatch(revokeScopes('openid'));

    expect(result.type).toBe('auth/revokeScopes/rejected');
  });

  it('handles non-RevokeScopesError from getUserPermissionChecks', async () => {
    const mockUtil = {
      getUserPermissionChecks: jest.fn().mockRejectedValue({ code: 'AUTH_FAIL', message: 'Auth failed' })
    };
    (RevokePermissionsUtil.initialize as jest.Mock).mockResolvedValue(mockUtil);

    const store = createTestStore();
    const result = await store.dispatch(revokeScopes('Mail.Read'));

    expect(result.type).toBe('auth/revokeScopes/rejected');
  });

  it('handles non-RevokeScopesError without code/message', async () => {
    const mockUtil = {
      getUserPermissionChecks: jest.fn().mockRejectedValue({})
    };
    (RevokePermissionsUtil.initialize as jest.Mock).mockResolvedValue(mockUtil);

    const store = createTestStore();
    const result = await store.dispatch(revokeScopes('Mail.Read'));

    expect(result.type).toBe('auth/revokeScopes/rejected');
  });

  it('succeeds even when token refresh fails', async () => {
    const mockUtil = {
      getUserPermissionChecks: jest.fn().mockResolvedValue({
        userIsTenantAdmin: false,
        permissionBeingRevokedIsAllPrincipal: false,
        grantsPayload: { id: 'grant-1' }
      }),
      updateSinglePrincipalPermissionGrant: jest.fn().mockResolvedValue(true)
    };
    (RevokePermissionsUtil.initialize as jest.Mock).mockResolvedValue(mockUtil);

    const { authenticationWrapper } = require('../../../modules/authentication');
    authenticationWrapper.refreshToken.mockRejectedValue(new Error('refresh failed'));

    const store = createTestStore();
    const result = await store.dispatch(revokeScopes('Mail.Read'));

    expect(result.type).toBe('auth/revokeScopes/fulfilled');
  });

  it('dispatches correctly for allPrincipal revoke by admin', async () => {
    const mockUtil = {
      getUserPermissionChecks: jest.fn().mockResolvedValue({
        userIsTenantAdmin: true,
        permissionBeingRevokedIsAllPrincipal: true,
        grantsPayload: { id: 'grant-1' }
      }),
      getUpdatedAllPrincipalPermissionGrant: jest.fn().mockResolvedValue(true)
    };
    (RevokePermissionsUtil.initialize as jest.Mock).mockResolvedValue(mockUtil);

    const { authenticationWrapper } = require('../../../modules/authentication');
    authenticationWrapper.refreshToken.mockResolvedValue({ accessToken: 'new-token' });

    const store = createTestStore();
    const result = await store.dispatch(revokeScopes('Mail.Read'));

    expect(result.type).toBe('auth/revokeScopes/fulfilled');
    expect(mockUtil.getUpdatedAllPrincipalPermissionGrant).toHaveBeenCalled();
  });
});
