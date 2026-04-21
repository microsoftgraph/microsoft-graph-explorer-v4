jest.mock('../../../telemetry', () => ({
  telemetry: { trackEvent: jest.fn(), trackLinkClickEvent: jest.fn() },
  componentNames: { REVOKE_PERMISSION_CONSENT_BUTTON: 'revoke' },
  eventTypes: { BUTTON_CLICK_EVENT: 'btn' }
}));
jest.mock('../../utils/fetch-retry-handler', () => ({
  exponentialFetchRetry: jest.fn()
}));
jest.mock('../graph-client', () => ({
  authProvider: {},
  GraphClient: { getInstance: jest.fn() }
}));
jest.mock('../../../modules/authentication', () => ({
  authenticationWrapper: { getAccount: jest.fn() }
}));
jest.mock('./query-action-creator-util', () => ({
  makeGraphRequest: jest.fn(() => jest.fn()),
  parseResponse: jest.fn()
}));

import { RevokePermissionsUtil } from './permissions-action-creator.util';
import { IOAuthGrantPayload, IPermissionGrant } from '../../../types/permissions';
import { RevokeScopesError } from '../../utils/error-utils/RevokeScopesError';

function createGrant(overrides: Partial<IPermissionGrant> = {}): IPermissionGrant {
  return {
    id: 'grant-1',
    consentType: 'Principal',
    scope: 'User.Read Mail.Read',
    clientId: 'client-1',
    principalId: 'user-1',
    resourceId: 'resource-1',
    ...overrides
  };
}

function createTestInstance(grantsPayload: IOAuthGrantPayload, signedInGrant: IPermissionGrant) {
  const instance = Object.create(RevokePermissionsUtil.prototype);
  instance.servicePrincipalAppId = 'test-id';
  instance.grantsPayload = grantsPayload;
  instance.signedInGrant = signedInGrant;
  instance.trackRevokeConsentEvent = jest.fn();
  return instance as InstanceType<typeof RevokePermissionsUtil>;
}

describe('RevokePermissionsUtil', () => {
  describe('getSignedInPrincipalGrant', () => {
    it('returns correct grant for user when multiple grants exist', () => {
      const userGrant = createGrant({ principalId: 'user-2', id: 'grant-2' });
      const payload: IOAuthGrantPayload = {
        value: [createGrant(), userGrant],
        '@odata.context': ''
      };

      const result = RevokePermissionsUtil.getSignedInPrincipalGrant(payload, 'user-2');
      expect(result).toEqual(userGrant);
    });

    it('returns first grant when only one exists', () => {
      const grant = createGrant();
      const payload: IOAuthGrantPayload = {
        value: [grant],
        '@odata.context': ''
      };

      const result = RevokePermissionsUtil.getSignedInPrincipalGrant(payload, 'any-id');
      expect(result).toEqual(grant);
    });
  });

  describe('preliminaryChecksSuccess', () => {
    it('throws RevokeScopesError for default scopes', () => {
      const grant = createGrant();
      const payload: IOAuthGrantPayload = { value: [grant], '@odata.context': '' };
      const instance = createTestInstance(payload, grant);

      expect(() =>
        instance.preliminaryChecksSuccess({
          defaultUserScopes: ['User.Read'],
          requiredPermissions: [],
          consentedScopes: ['User.Read'],
          permissionToRevoke: 'User.Read',
          grantsPayload: payload
        })
      ).toThrow(RevokeScopesError);
    });

    it('throws RevokeScopesError when missing required permissions', () => {
      const grant = createGrant();
      const payload: IOAuthGrantPayload = { value: [grant], '@odata.context': '' };
      const instance = createTestInstance(payload, grant);

      expect(() =>
        instance.preliminaryChecksSuccess({
          defaultUserScopes: [],
          requiredPermissions: ['Directory.ReadWrite.All'],
          consentedScopes: ['User.Read'],
          permissionToRevoke: 'Mail.Read',
          grantsPayload: payload
        })
      ).toThrow(RevokeScopesError);
    });
  });

  describe('userRevokingAdminGrantedScopes', () => {
    it('returns true when scope is in AllPrincipals grant', () => {
      const allPrincipalGrant = createGrant({ consentType: 'AllPrincipals', scope: 'Mail.Read Files.Read' });
      const payload: IOAuthGrantPayload = { value: [createGrant(), allPrincipalGrant], '@odata.context': '' };
      const instance = createTestInstance(payload, createGrant());

      expect(instance.userRevokingAdminGrantedScopes(payload, 'Mail.Read')).toBe(true);
    });

    it('returns false when no AllPrincipals grant exists', () => {
      const payload: IOAuthGrantPayload = { value: [createGrant()], '@odata.context': '' };
      const instance = createTestInstance(payload, createGrant());

      expect(instance.userRevokingAdminGrantedScopes(payload, 'Mail.Read')).toBe(false);
    });

    it('returns false when grantsPayload is null', () => {
      const instance = createTestInstance({ value: [], '@odata.context': '' }, createGrant());

      expect(instance.userRevokingAdminGrantedScopes(null as any, 'Mail.Read')).toBe(false);
    });
  });

  describe('permissionToRevokeInGrant', () => {
    it('returns true when permission exists in combined scopes', () => {
      const principalGrant = createGrant({ scope: 'User.Read' });
      const allPrincipalGrant = createGrant({ consentType: 'AllPrincipals', scope: 'Mail.Read Files.Read' });
      const instance = createTestInstance({ value: [principalGrant, allPrincipalGrant], '@odata.context': '' },
        principalGrant);

      expect(instance.permissionToRevokeInGrant(principalGrant, allPrincipalGrant, 'Mail.Read')).toBe(true);
    });

    it('returns false when permission is missing from combined scopes', () => {
      const principalGrant = createGrant({ scope: 'User.Read' });
      const allPrincipalGrant = createGrant({ consentType: 'AllPrincipals', scope: 'Mail.Read' });
      const instance = createTestInstance({ value: [principalGrant, allPrincipalGrant], '@odata.context': '' },
        principalGrant);

      expect(instance.permissionToRevokeInGrant(principalGrant, allPrincipalGrant, 'Files.ReadWrite')).toBe(false);
    });

    it('returns false when grants are null', () => {
      const instance = createTestInstance({ value: [], '@odata.context': '' }, createGrant());

      expect(instance.permissionToRevokeInGrant(null as any, null as any, 'User.Read')).toBe(false);
    });

    it('returns true when permission exists only in principal grant', () => {
      const principalGrant = createGrant({ scope: 'User.Read Mail.Read' });
      const allPrincipalGrant = createGrant({ consentType: 'AllPrincipals', scope: 'Files.Read' });
      const instance = createTestInstance({ value: [principalGrant, allPrincipalGrant], '@odata.context': '' },
        principalGrant);

      expect(instance.permissionToRevokeInGrant(principalGrant, allPrincipalGrant, 'Mail.Read')).toBe(true);
    });
  });

  describe('preliminaryChecksSuccess - passing case', () => {
    it('does not throw when scopes are valid and permissions are met', () => {
      const grant = createGrant({ scope: 'User.Read Mail.Read' });
      const payload: IOAuthGrantPayload = { value: [grant], '@odata.context': '' };
      const instance = createTestInstance(payload, grant);

      expect(() =>
        instance.preliminaryChecksSuccess({
          defaultUserScopes: ['openid'],
          requiredPermissions: ['User.Read'],
          consentedScopes: ['User.Read', 'Mail.Read'],
          permissionToRevoke: 'Mail.Read',
          grantsPayload: payload
        })
      ).not.toThrow();
    });
  });

  describe('userRevokingAdminGrantedScopes - scope not in AllPrincipals', () => {
    it('returns false when scope is not in AllPrincipals grant', () => {
      const allPrincipalGrant = createGrant({ consentType: 'AllPrincipals', scope: 'Mail.Read' });
      const payload: IOAuthGrantPayload = { value: [createGrant(), allPrincipalGrant], '@odata.context': '' };
      const instance = createTestInstance(payload, createGrant());

      expect(instance.userRevokingAdminGrantedScopes(payload, 'Files.ReadWrite')).toBe(false);
    });
  });

  describe('getSignedInPrincipalGrant edge cases', () => {
    it('returns undefined when userId does not match any grant in multi-grant payload', () => {
      const payload: IOAuthGrantPayload = {
        value: [createGrant({ principalId: 'user-1' }), createGrant({ principalId: 'user-2' })],
        '@odata.context': ''
      };
      const result = RevokePermissionsUtil.getSignedInPrincipalGrant(payload, 'non-existent');
      expect(result).toBeUndefined();
    });
  });

  describe('getTenantPermissionGrants', () => {
    it('returns empty payload when servicePrincipalAppId is empty', async () => {
      const result = await RevokePermissionsUtil.getTenantPermissionGrants([], '');
      expect(result).toEqual({ value: [], '@odata.context': '' });
    });
  });

  describe('getServicePrincipalAppId / getGrantsPayload / getSignedInGrant accessors', () => {
    it('returns the values set in the instance', () => {
      const grant = createGrant();
      const payload: IOAuthGrantPayload = { value: [grant], '@odata.context': '' };
      const instance = createTestInstance(payload, grant);

      expect(instance.getServicePrincipalAppId()).toBe('test-id');
      expect(instance.getGrantsPayload()).toEqual(payload);
      expect(instance.getSignedInGrant()).toEqual(grant);
    });
  });

  describe('userHasRequiredPermissions via preliminaryChecksSuccess', () => {
    it('does not throw when required permissions are in allPrincipal scopes', () => {
      const allPrincipalGrant = createGrant({ consentType: 'AllPrincipals', scope: 'Directory.ReadWrite.All User.Read' });
      const principalGrant = createGrant({ scope: 'Mail.Read' });
      const payload: IOAuthGrantPayload = { value: [principalGrant, allPrincipalGrant], '@odata.context': '' };
      const instance = createTestInstance(payload, principalGrant);

      expect(() =>
        instance.preliminaryChecksSuccess({
          defaultUserScopes: [],
          requiredPermissions: ['Directory.ReadWrite.All'],
          consentedScopes: ['Mail.Read'],
          permissionToRevoke: 'Mail.Read',
          grantsPayload: payload
        })
      ).not.toThrow();
    });
  });

  describe('getTenantPermissionGrants with valid servicePrincipalAppId', () => {
    it('calls makeGraphRequest and returns parsed response', async () => {
      const { makeGraphRequest, parseResponse: mockParseResponse } = require('./query-action-creator-util');
      const { exponentialFetchRetry } = require('../../utils/fetch-retry-handler');
      const expectedPayload: IOAuthGrantPayload = {
        value: [createGrant()],
        '@odata.context': 'https://graph.microsoft.com/v1.0/$metadata#oauth2PermissionGrants'
      };
      exponentialFetchRetry.mockResolvedValue(expectedPayload);

      const result = await RevokePermissionsUtil.getTenantPermissionGrants([], 'valid-id');
      expect(exponentialFetchRetry).toHaveBeenCalled();
    });
  });

  describe('getServicePrincipalId', () => {
    it('returns id from response value', async () => {
      const { makeGraphRequest, parseResponse: mockParseResponse } = require('./query-action-creator-util');
      const mockFn = jest.fn().mockResolvedValue({ value: [{ id: 'sp-id-123' }] });
      makeGraphRequest.mockReturnValue(mockFn);
      (require('./query-action-creator-util').parseResponse as jest.Mock).mockResolvedValue({ value: [{ id: 'sp-id-123' }] });

      const result = await RevokePermissionsUtil.getServicePrincipalId([]);
      expect(result).toBe('sp-id-123');
    });

    it('returns empty string when value is empty', async () => {
      const { makeGraphRequest, parseResponse: mockParseResponse } = require('./query-action-creator-util');
      const mockFn = jest.fn().mockResolvedValue({ value: [] });
      makeGraphRequest.mockReturnValue(mockFn);
      (require('./query-action-creator-util').parseResponse as jest.Mock).mockResolvedValue({ value: [] });

      const result = await RevokePermissionsUtil.getServicePrincipalId([]);
      expect(result).toBe('');
    });

    it('returns empty string when response has no value', async () => {
      const { makeGraphRequest, parseResponse: mockParseResponse } = require('./query-action-creator-util');
      const mockFn = jest.fn().mockResolvedValue({});
      makeGraphRequest.mockReturnValue(mockFn);
      (require('./query-action-creator-util').parseResponse as jest.Mock).mockResolvedValue({});

      const result = await RevokePermissionsUtil.getServicePrincipalId([]);
      expect(result).toBe('');
    });
  });

  describe('isSignedInUserTenantAdmin', () => {
    it('returns true when user has Global Administrator role', async () => {
      const { exponentialFetchRetry } = require('../../utils/fetch-retry-handler');
      const { parseResponse: mockParseResponse } = require('./query-action-creator-util');
      exponentialFetchRetry.mockResolvedValue(new Response());
      mockParseResponse.mockResolvedValue({ value: [{ displayName: 'Global Administrator' }] });

      const result = await RevokePermissionsUtil.isSignedInUserTenantAdmin();
      expect(result).toBe(true);
    });

    it('returns false when user does not have Global Administrator role', async () => {
      const { exponentialFetchRetry } = require('../../utils/fetch-retry-handler');
      const { parseResponse: mockParseResponse } = require('./query-action-creator-util');
      exponentialFetchRetry.mockResolvedValue(new Response());
      mockParseResponse.mockResolvedValue({ value: [{ displayName: 'User' }] });

      const result = await RevokePermissionsUtil.isSignedInUserTenantAdmin();
      expect(result).toBe(false);
    });

    it('returns false when value is undefined', async () => {
      const { exponentialFetchRetry } = require('../../utils/fetch-retry-handler');
      const { parseResponse: mockParseResponse } = require('./query-action-creator-util');
      exponentialFetchRetry.mockResolvedValue(new Response());
      mockParseResponse.mockResolvedValue({});

      const result = await RevokePermissionsUtil.isSignedInUserTenantAdmin();
      expect(result).toBe(false);
    });
  });

  describe('getUserPermissionChecks', () => {
    it('throws when permission is admin-granted and user is not tenant admin', async () => {
      const { exponentialFetchRetry } = require('../../utils/fetch-retry-handler');
      const { parseResponse: mockParseResponse } = require('./query-action-creator-util');
      const allPrincipalGrant = createGrant({ consentType: 'AllPrincipals', scope: 'Mail.Read Files.Read' });
      const signedInGrant = createGrant({ principalId: 'user-1', scope: 'Mail.Read Files.Read' });
      const payload: IOAuthGrantPayload = { value: [signedInGrant, allPrincipalGrant], '@odata.context': '' };
      const instance = createTestInstance(payload, signedInGrant);

      // isSignedInUserTenantAdmin returns false
      exponentialFetchRetry.mockResolvedValue(new Response());
      mockParseResponse.mockResolvedValue({ value: [{ displayName: 'User' }] });

      await expect(instance.getUserPermissionChecks({
        defaultUserScopes: [],
        requiredPermissions: ['Mail.Read'],
        consentedScopes: ['Mail.Read', 'Files.Read'],
        permissionToRevoke: 'Mail.Read'
      })).rejects.toThrow(RevokeScopesError);
    });

    it('succeeds when user is admin and permission is in principal grant', async () => {
      const { exponentialFetchRetry } = require('../../utils/fetch-retry-handler');
      const { parseResponse: mockParseResponse } = require('./query-action-creator-util');
      const allPrincipalGrant = createGrant({ consentType: 'AllPrincipals', scope: 'Files.Read' });
      const signedInGrant = createGrant({ principalId: 'user-1', scope: 'User.Read Mail.Read' });
      const payload: IOAuthGrantPayload = { value: [signedInGrant, allPrincipalGrant], '@odata.context': '' };
      const instance = createTestInstance(payload, signedInGrant);

      // isSignedInUserTenantAdmin returns true
      exponentialFetchRetry.mockResolvedValue(new Response());
      mockParseResponse.mockResolvedValue({ value: [{ displayName: 'Global Administrator' }] });

      const result = await instance.getUserPermissionChecks({
        defaultUserScopes: [],
        requiredPermissions: ['User.Read'],
        consentedScopes: ['User.Read', 'Mail.Read'],
        permissionToRevoke: 'Mail.Read'
      });
      expect(result.userIsTenantAdmin).toBe(true);
      expect(result.permissionBeingRevokedIsAllPrincipal).toBe(false);
    });
  });

  describe('updateSinglePrincipalPermissionGrant', () => {
    it('calls revokePermission with grant id and new scopes', async () => {
      const { makeGraphRequest, parseResponse: mockParseResponse } = require('./query-action-creator-util');
      const mockFn = jest.fn().mockResolvedValue({});
      makeGraphRequest.mockReturnValue(mockFn);
      (require('./query-action-creator-util').parseResponse as jest.Mock).mockResolvedValue({});

      const signedInGrant = createGrant({ principalId: 'user-1', id: 'grant-id-1' });
      const payload: IOAuthGrantPayload = { value: [signedInGrant], '@odata.context': '' };
      const instance = createTestInstance(payload, signedInGrant);

      const result = await instance.updateSinglePrincipalPermissionGrant(
        payload,
        { id: 'user-1' } as any,
        'User.Read'
      );
      expect(result).toBe(true);
    });
  });

  describe('getUpdatedAllPrincipalPermissionGrant', () => {
    it('revokes scope from AllPrincipal grant', async () => {
      const { makeGraphRequest, parseResponse: mockParseResponse } = require('./query-action-creator-util');
      const mockFn = jest.fn().mockResolvedValue({});
      makeGraphRequest.mockReturnValue(mockFn);
      (require('./query-action-creator-util').parseResponse as jest.Mock).mockResolvedValue({});

      const allPrincipalGrant = createGrant({ consentType: 'AllPrincipals', scope: 'Mail.Read Files.Read', id: 'all-grant-1' });
      const signedInGrant = createGrant({ principalId: 'user-1' });
      const payload: IOAuthGrantPayload = { value: [signedInGrant, allPrincipalGrant], '@odata.context': '' };
      const instance = createTestInstance(payload, signedInGrant);

      const result = await instance.getUpdatedAllPrincipalPermissionGrant(payload, 'Mail.Read');
      expect(result).toBe(true);
    });
  });
});
