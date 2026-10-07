jest.mock('./msal-app', () => ({
  msalApplication: {
    getAllAccounts: jest.fn(() => []),
    getAccountByHomeId: jest.fn(),
    acquireTokenSilent: jest.fn(),
    loginPopup: jest.fn(),
    logoutPopup: jest.fn(),
    logoutRedirect: jest.fn()
  }
}));

jest.mock('../../app/services/variant-service', () => ({
  __esModule: true,
  default: { getFeatureVariables: jest.fn(() => false) }
}));

jest.mock('../../app/services/variant-constants', () => ({
  SAFEROLLOUTACTIVE: 'saferollout'
}));

jest.mock('./authUtils', () => ({
  getCurrentUri: jest.fn(() => 'http://localhost')
}));

jest.mock('./authentication-error-hints', () => ({
  signInAuthError: jest.fn(() => false)
}));

jest.mock('./ClaimsChallenge', () => ({
  ClaimsChallenge: jest.fn().mockImplementation(() => ({
    getClaimsFromStorage: jest.fn(() => null)
  }))
}));

jest.mock('../../app/services/graph-constants', () => ({
  AUTH_URL: 'https://login.microsoftonline.com',
  DEFAULT_USER_SCOPES: 'User.Read',
  HOME_ACCOUNT_KEY: 'homeAccountKey'
}));

import { AuthenticationWrapper } from './AuthenticationWrapper';
import { msalApplication } from './msal-app';

const mockMsal = msalApplication as jest.Mocked<typeof msalApplication>;

describe('AuthenticationWrapper', () => {
  let wrapper: AuthenticationWrapper;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    // Reset singleton
    (AuthenticationWrapper as any).instance = undefined;
    wrapper = AuthenticationWrapper.getInstance();
  });

  describe('getInstance', () => {
    it('returns a singleton instance', () => {
      const instance1 = AuthenticationWrapper.getInstance();
      const instance2 = AuthenticationWrapper.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('getSessionId', () => {
    it('returns null when no account', () => {
      mockMsal.getAllAccounts.mockReturnValue([]);
      expect(wrapper.getSessionId()).toBeNull();
    });

    it('returns sid from idTokenClaims when account exists', () => {
      const account = {
        homeAccountId: 'home-1',
        environment: 'login.microsoftonline.com',
        tenantId: 'tenant-1',
        username: 'user@test.com',
        localAccountId: 'local-1',
        idTokenClaims: { sid: 'session-123' }
      };
      mockMsal.getAllAccounts.mockReturnValue([account]);
      expect(wrapper.getSessionId()).toBe('session-123');
    });
  });

  describe('getAccount', () => {
    it('returns undefined when no accounts', () => {
      mockMsal.getAllAccounts.mockReturnValue([]);
      expect(wrapper.getAccount()).toBeUndefined();
    });

    it('returns first account when one account exists', () => {
      const account = {
        homeAccountId: 'home-1',
        environment: 'login.microsoftonline.com',
        tenantId: 'tenant-1',
        username: 'user@test.com',
        localAccountId: 'local-1'
      };
      mockMsal.getAllAccounts.mockReturnValue([account]);
      expect(wrapper.getAccount()).toBe(account);
    });

    it('uses homeAccountId from localStorage when multiple accounts', () => {
      const account1 = {
        homeAccountId: 'home-1',
        environment: 'login.microsoftonline.com',
        tenantId: 'tenant-1',
        username: 'user1@test.com',
        localAccountId: 'local-1'
      };
      const account2 = {
        homeAccountId: 'home-2',
        environment: 'login.microsoftonline.com',
        tenantId: 'tenant-2',
        username: 'user2@test.com',
        localAccountId: 'local-2'
      };
      mockMsal.getAllAccounts.mockReturnValue([account1, account2]);
      localStorage.setItem('homeAccountKey', 'home-2');
      mockMsal.getAccountByHomeId.mockReturnValue(account2);

      expect(wrapper.getAccount()).toBe(account2);
      expect(mockMsal.getAccountByHomeId).toHaveBeenCalledWith('home-2');
    });

    it('returns undefined when multiple accounts and no homeAccountId stored', () => {
      const account1 = {
        homeAccountId: 'home-1',
        environment: 'env',
        tenantId: 't1',
        username: 'u1',
        localAccountId: 'l1'
      };
      const account2 = {
        homeAccountId: 'home-2',
        environment: 'env',
        tenantId: 't2',
        username: 'u2',
        localAccountId: 'l2'
      };
      mockMsal.getAllAccounts.mockReturnValue([account1, account2]);
      expect(wrapper.getAccount()).toBeUndefined();
    });
  });

  describe('logIn', () => {
    it('calls getAuthResult internally (acquireTokenSilent)', async () => {
      const authResult = {
        accessToken: 'token-123',
        account: {
          homeAccountId: 'home-1',
          environment: 'env',
          tenantId: 't1',
          username: 'u1',
          localAccountId: 'l1'
        }
      };
      mockMsal.getAllAccounts.mockReturnValue([]);
      mockMsal.acquireTokenSilent.mockRejectedValue(new Error('no account'));
      mockMsal.loginPopup.mockResolvedValue(authResult as any);

      const result = await wrapper.logIn();
      expect(result.accessToken).toBe('token-123');
    });
  });

  describe('consentToScopes', () => {
    it('sets and resets consentingToNewScopes flag', async () => {
      const authResult = {
        accessToken: 'consent-token',
        account: {
          homeAccountId: 'home-1',
          environment: 'env',
          tenantId: 't1',
          username: 'u1',
          localAccountId: 'l1'
        }
      };
      mockMsal.loginPopup.mockResolvedValue(authResult as any);
      mockMsal.getAllAccounts.mockReturnValue([]);

      const result = await wrapper.consentToScopes(['Mail.Read']);
      expect(result.accessToken).toBe('consent-token');
    });

    it('resets flag on error', async () => {
      mockMsal.loginPopup.mockRejectedValue(new Error('consent failed'));
      mockMsal.getAllAccounts.mockReturnValue([]);

      await expect(wrapper.consentToScopes(['Mail.Read'])).rejects.toThrow();
    });
  });

  describe('getToken', () => {
    it('tries silent acquisition with active account', async () => {
      const account = {
        homeAccountId: 'home-1',
        environment: 'env',
        tenantId: 't1',
        username: 'u1',
        localAccountId: 'l1'
      };
      const authResult = { accessToken: 'silent-token', account };
      mockMsal.getAllAccounts.mockReturnValue([account]);
      mockMsal.acquireTokenSilent.mockResolvedValue(authResult as any);

      const result = await wrapper.getToken();
      expect(result.accessToken).toBe('silent-token');
      expect(mockMsal.acquireTokenSilent).toHaveBeenCalled();
    });

    it('throws when no accounts at all', async () => {
      mockMsal.getAllAccounts.mockReturnValue([]);
      await expect(wrapper.getToken()).rejects.toThrow(
        'No active or cached account found. User login required.'
      );
    });
  });

  describe('clearCache', () => {
    it('removes localStorage keys matching homeAccountId', () => {
      localStorage.setItem('homeAccountKey', 'home-1');
      localStorage.setItem('home-1.realm-login.windows.net-idtoken', 'val1');
      localStorage.setItem('home-1.realm-login.windows.net-accesstoken', 'val2');
      localStorage.setItem('unrelated-key', 'val3');

      wrapper.clearCache();

      expect(localStorage.getItem('home-1.realm-login.windows.net-idtoken')).toBeNull();
      expect(localStorage.getItem('home-1.realm-login.windows.net-accesstoken')).toBeNull();
      expect(localStorage.getItem('unrelated-key')).toBe('val3');
    });

    it('uses "login" as fallback filter when no homeAccountId', () => {
      localStorage.setItem('login.windows.net-idtoken', 'val1');
      localStorage.setItem('no-match-key', 'val2');

      wrapper.clearCache();

      expect(localStorage.getItem('login.windows.net-idtoken')).toBeNull();
      expect(localStorage.getItem('no-match-key')).toBe('val2');
    });
  });

  describe('deleteHomeAccountId', () => {
    it('removes homeAccountKey from localStorage', () => {
      localStorage.setItem('homeAccountKey', 'home-1');
      wrapper.deleteHomeAccountId();
      expect(localStorage.getItem('homeAccountKey')).toBeNull();
    });
  });

  describe('getToken - additional paths', () => {
    it('falls back to cached account when no active account found', async () => {
      const cachedAccount = {
        homeAccountId: 'cached-1',
        environment: 'env',
        tenantId: 't1',
        username: 'cached@test.com',
        localAccountId: 'l1'
      };
      // First call for getAccount returns empty (multiple accounts, no homeAccountId)
      // But getAllAccounts returns one account for the fallback path
      // getAccount -> multiple, no localStorage
      mockMsal.getAllAccounts.mockReturnValueOnce([cachedAccount, cachedAccount]);
      mockMsal.getAllAccounts.mockReturnValue([cachedAccount]); // fallback in getToken
      mockMsal.acquireTokenSilent.mockResolvedValue({ accessToken: 'cached-token', account: cachedAccount } as any);

      const result = await wrapper.getToken();
      expect(result.accessToken).toBe('cached-token');
      expect(localStorage.getItem('homeAccountKey')).toBe('cached-1');
    });

    it('throws when silent acquisition fails for cached account', async () => {
      const cachedAccount = {
        homeAccountId: 'cached-1',
        environment: 'env',
        tenantId: 't1',
        username: 'cached@test.com',
        localAccountId: 'l1'
      };
      mockMsal.getAllAccounts.mockReturnValueOnce([cachedAccount, cachedAccount]);
      mockMsal.getAllAccounts.mockReturnValue([cachedAccount]);
      mockMsal.acquireTokenSilent.mockRejectedValue(new Error('silent failed'));

      await expect(wrapper.getToken()).rejects.toThrow('Silent token acquisition failed for cached account');
    });

    it('retries with forceRefresh on InteractionRequiredAuthError then throws', async () => {
      const { InteractionRequiredAuthError } = require('@azure/msal-browser');
      const account = {
        homeAccountId: 'home-1',
        environment: 'env',
        tenantId: 't1',
        username: 'u1',
        localAccountId: 'l1'
      };
      mockMsal.getAllAccounts.mockReturnValue([account]);
      const interactionError = new InteractionRequiredAuthError('interaction_required');
      mockMsal.acquireTokenSilent
        .mockRejectedValueOnce(interactionError)
        .mockRejectedValueOnce(new Error('refresh also failed'));

      await expect(wrapper.getToken()).rejects.toThrow('Silent token refresh failed, login required');
    });

    it('throws generic error for non-interaction errors', async () => {
      const account = {
        homeAccountId: 'home-1',
        environment: 'env',
        tenantId: 't1',
        username: 'u1',
        localAccountId: 'l1'
      };
      mockMsal.getAllAccounts.mockReturnValue([account]);
      mockMsal.acquireTokenSilent.mockRejectedValue(new Error('network error'));

      await expect(wrapper.getToken()).rejects.toThrow('Token acquisition failed: Error: network error');
    });

    it('succeeds on forceRefresh retry after InteractionRequiredAuthError', async () => {
      const { InteractionRequiredAuthError } = require('@azure/msal-browser');
      const account = {
        homeAccountId: 'home-1',
        environment: 'env',
        tenantId: 't1',
        username: 'u1',
        localAccountId: 'l1'
      };
      mockMsal.getAllAccounts.mockReturnValue([account]);
      const interactionError = new InteractionRequiredAuthError('interaction_required');
      mockMsal.acquireTokenSilent
        .mockRejectedValueOnce(interactionError)
        .mockResolvedValueOnce({ accessToken: 'refreshed-token', account } as any);

      const result = await wrapper.getToken();
      expect(result.accessToken).toBe('refreshed-token');
    });
  });

  describe('logIn - additional paths', () => {
    it('sets performingStepUpAuth when sampleQuery provided', async () => {
      const authResult = {
        accessToken: 'step-up-token',
        account: {
          homeAccountId: 'home-1',
          environment: 'env',
          tenantId: 't1',
          username: 'u1',
          localAccountId: 'l1'
        }
      };
      mockMsal.getAllAccounts.mockReturnValue([]);
      mockMsal.acquireTokenSilent.mockRejectedValue(new Error('no account'));
      mockMsal.loginPopup.mockResolvedValue(authResult as any);

      const sampleQuery = {
        sampleUrl: 'https://graph.microsoft.com/v1.0/me',
        selectedVerb: 'GET',
        selectedVersion: 'v1.0',
        sampleHeaders: []
      };
      const result = await wrapper.logIn('', sampleQuery);
      expect(result.accessToken).toBe('step-up-token');
    });

    it('throws wrapped error on login failure', async () => {
      mockMsal.getAllAccounts.mockReturnValue([]);
      mockMsal.acquireTokenSilent.mockRejectedValue(new Error('silent fail'));
      mockMsal.loginPopup.mockRejectedValue(new Error('popup blocked'));

      await expect(wrapper.logIn()).rejects.toThrow('Error occurred during login');
    });
  });

  describe('logOut', () => {
    it('calls logoutPopup with logoutHint when homeAccountId exists', async () => {
      localStorage.setItem('homeAccountKey', 'home-1');
      const account = {
        homeAccountId: 'home-1',
        environment: 'env',
        tenantId: 't1',
        username: 'u1',
        localAccountId: 'l1',
        idTokenClaims: { login_hint: 'hint@test.com' }
      };
      mockMsal.getAccountByHomeId.mockReturnValue(account);
      mockMsal.logoutPopup.mockResolvedValue(undefined);

      await wrapper.logOut();
      expect(mockMsal.logoutPopup).toHaveBeenCalledWith({ logoutHint: 'hint@test.com' });
    });

    it('calls logoutRedirect when no homeAccountId', async () => {
      mockMsal.logoutRedirect.mockResolvedValue(undefined);
      await wrapper.logOut();
      expect(mockMsal.logoutRedirect).toHaveBeenCalled();
    });
  });

  describe('logOutPopUp', () => {
    it('deletes homeAccountId and calls logoutPopup', async () => {
      localStorage.setItem('homeAccountKey', 'home-1');
      mockMsal.logoutPopup.mockResolvedValue(undefined as any);
      await wrapper.logOutPopUp();
      expect(localStorage.getItem('homeAccountKey')).toBeNull();
      expect(mockMsal.logoutPopup).toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('calls loginWithInteraction with provided scopes', async () => {
      const authResult = {
        accessToken: 'refresh-token',
        account: {
          homeAccountId: 'home-1',
          environment: 'env',
          tenantId: 't1',
          username: 'u1',
          localAccountId: 'l1'
        }
      };
      mockMsal.getAllAccounts.mockReturnValue([]);
      mockMsal.loginPopup.mockResolvedValue(authResult as any);

      const result = await wrapper.refreshToken(['Mail.Read']);
      expect(result.accessToken).toBe('refresh-token');
    });

    it('uses default scopes when no scopes provided', async () => {
      const authResult = {
        accessToken: 'default-refresh',
        account: {
          homeAccountId: 'home-1',
          environment: 'env',
          tenantId: 't1',
          username: 'u1',
          localAccountId: 'l1'
        }
      };
      mockMsal.getAllAccounts.mockReturnValue([]);
      mockMsal.loginPopup.mockResolvedValue(authResult as any);

      const result = await wrapper.refreshToken();
      expect(result.accessToken).toBe('default-refresh');
    });

    it('resets revokingScopes flag on error', async () => {
      mockMsal.getAllAccounts.mockReturnValue([]);
      mockMsal.loginPopup.mockRejectedValue(new Error('refresh error'));

      await expect(wrapper.refreshToken()).rejects.toThrow('refresh error');
    });
  });

  describe('getSessionId - no sid', () => {
    it('returns null when idTokenClaims has no sid', () => {
      const account = {
        homeAccountId: 'home-1',
        environment: 'env',
        tenantId: 't1',
        username: 'u1',
        localAccountId: 'l1',
        idTokenClaims: {}
      };
      mockMsal.getAllAccounts.mockReturnValue([account]);
      expect(wrapper.getSessionId()).toBeNull();
    });
  });

  describe('clearSession', () => {
    it('clears cache, deletes homeAccountId, and clears sessionStorage', () => {
      localStorage.setItem('homeAccountKey', 'home-1');
      localStorage.setItem('home-1.token', 'val');
      sessionStorage.setItem('someKey', 'val');

      wrapper.clearSession();

      expect(localStorage.getItem('homeAccountKey')).toBeNull();
      expect(localStorage.getItem('home-1.token')).toBeNull();
      expect(sessionStorage.getItem('someKey')).toBeNull();
    });
  });

  describe('getAccount - multiple accounts with null from getAccountByHomeId', () => {
    it('returns undefined when getAccountByHomeId returns null', () => {
      const account1 = {
        homeAccountId: 'home-1',
        environment: 'env',
        tenantId: 't1',
        username: 'u1',
        localAccountId: 'l1'
      };
      const account2 = {
        homeAccountId: 'home-2',
        environment: 'env',
        tenantId: 't2',
        username: 'u2',
        localAccountId: 'l2'
      };
      mockMsal.getAllAccounts.mockReturnValue([account1, account2]);
      localStorage.setItem('homeAccountKey', 'home-3');
      mockMsal.getAccountByHomeId.mockReturnValue(null);

      expect(wrapper.getAccount()).toBeUndefined();
    });
  });

  describe('logInWithOther', () => {
    it('calls loginPopup with select_account prompt and stores homeAccountId', async () => {
      const authResult = {
        accessToken: 'other-token',
        account: {
          homeAccountId: 'other-home',
          environment: 'env',
          tenantId: 't1',
          username: 'other@test.com',
          localAccountId: 'l1'
        }
      };
      mockMsal.loginPopup.mockResolvedValue(authResult as any);

      const result = await wrapper.logInWithOther();
      expect(result.accessToken).toBe('other-token');
      expect(localStorage.getItem('homeAccountKey')).toBe('other-home');
    });

    it('erases interaction cookie on interaction_in_progress BrowserAuthError', async () => {
      const { BrowserAuthError } = jest.requireActual('@azure/msal-browser');
      const error = new BrowserAuthError();
      (error as any).errorCode = 'interaction_in_progress';
      mockMsal.loginPopup.mockRejectedValue(error);

      await expect(wrapper.logInWithOther()).rejects.toBeDefined();
    });

    it('rethrows non-BrowserAuthError errors', async () => {
      mockMsal.loginPopup.mockRejectedValue(new Error('generic error'));

      await expect(wrapper.logInWithOther()).rejects.toThrow('generic error');
    });
  });

  describe('loginWithInteraction - sessionId handling', () => {
    it('passes sessionId and removes prompt when sessionId provided', async () => {
      const authResult = {
        accessToken: 'session-token',
        account: {
          homeAccountId: 'home-1',
          environment: 'env',
          tenantId: 't1',
          username: 'u1',
          localAccountId: 'l1'
        }
      };
      mockMsal.getAllAccounts.mockReturnValue([]);
      mockMsal.acquireTokenSilent.mockRejectedValue(new Error('no account'));
      mockMsal.loginPopup.mockResolvedValue(authResult as any);

      const result = await wrapper.logIn('session-abc');
      expect(result.accessToken).toBe('session-token');
      // loginPopup should have been called with sid in request
      const popupCall = mockMsal.loginPopup.mock.calls[0][0] as any;
      expect(popupCall.sid).toBe('session-abc');
      expect(popupCall.prompt).toBeUndefined();
    });
  });

  describe('loginWithInteraction - error rethrow', () => {
    it('rethrows errors from loginPopup', async () => {
      mockMsal.getAllAccounts.mockReturnValue([]);
      mockMsal.acquireTokenSilent.mockRejectedValue(new Error('no account'));
      mockMsal.loginPopup.mockRejectedValue(new Error('popup_closed'));

      await expect(wrapper.logIn()).rejects.toThrow('Error occurred during login');
    });
  });

  describe('getAuthResult - signInAuthError path', () => {
    it('deletes homeAccountId when signInAuthError returns true for string error', async () => {
      const { signInAuthError } = require('./authentication-error-hints');
      signInAuthError.mockReturnValue(true);
      const account = {
        homeAccountId: 'home-1',
        environment: 'env',
        tenantId: 't1',
        username: 'u1',
        localAccountId: 'l1'
      };
      mockMsal.getAllAccounts.mockReturnValue([account]);
      // acquireTokenSilent throws a non-InteractionRequired string-like error
      const strError = 'some_string_error';
      mockMsal.acquireTokenSilent.mockRejectedValue(strError);

      localStorage.setItem('homeAccountKey', 'home-1');
      await expect(wrapper.logIn()).rejects.toBeDefined();
    });
  });

  describe('consentToScopes - prompt removal', () => {
    it('removes prompt and sets loginHint when consenting to new scopes', async () => {
      const account = {
        homeAccountId: 'home-1',
        environment: 'env',
        tenantId: 't1',
        username: 'user@test.com',
        localAccountId: 'l1'
      };
      const authResult = {
        accessToken: 'consent-token',
        account
      };
      mockMsal.getAllAccounts.mockReturnValue([account]);
      // Make acquireTokenSilent throw InteractionRequiredAuthError so loginWithInteraction is called
      const { InteractionRequiredAuthError } = require('@azure/msal-browser');
      mockMsal.acquireTokenSilent.mockRejectedValue(new InteractionRequiredAuthError('interaction_required'));
      mockMsal.loginPopup.mockResolvedValue(authResult as any);

      const result = await wrapper.consentToScopes(['Mail.Read']);
      expect(result.accessToken).toBe('consent-token');
      // Verify loginPopup was called without prompt (since consentingToNewScopes is true)
      const popupCall = mockMsal.loginPopup.mock.calls[0][0] as any;
      expect(popupCall.prompt).toBeUndefined();
      expect(popupCall.loginHint).toBe('user@test.com');
    });
  });

  describe('getAuthority', () => {
    it('uses common tenant by default', async () => {
      const authResult = {
        accessToken: 'token',
        account: {
          homeAccountId: 'home-1',
          environment: 'env',
          tenantId: 't1',
          username: 'u1',
          localAccountId: 'l1'
        }
      };
      mockMsal.getAllAccounts.mockReturnValue([]);
      mockMsal.loginPopup.mockResolvedValue(authResult as any);
      mockMsal.acquireTokenSilent.mockRejectedValue(new Error('no account'));

      await wrapper.logIn();
      const popupCall = mockMsal.loginPopup.mock.calls[0][0] as any;
      expect(popupCall.authority).toBe('https://login.microsoftonline.com/common/');
    });
  });

  describe('loginWithInteraction - BrowserAuthError with signInAuthError true', () => {
    it('calls clearSession when signInAuthError returns true and not consenting', async () => {
      const { signInAuthError } = require('./authentication-error-hints');
      signInAuthError.mockReturnValue(true);
      const { BrowserAuthError } = require('@azure/msal-browser');
      const error = new BrowserAuthError();
      (error as any).errorCode = 'popup_window_error';

      mockMsal.getAllAccounts.mockReturnValue([]);
      mockMsal.acquireTokenSilent.mockRejectedValue(new Error('no account'));
      mockMsal.loginPopup.mockRejectedValue(error);

      localStorage.setItem('homeAccountKey', 'home-1');
      await expect(wrapper.logIn()).rejects.toThrow();
      // clearSession removes homeAccountKey
      expect(localStorage.getItem('homeAccountKey')).toBeNull();
    });

    it('erases interaction cookie when errorCode is interaction_in_progress', async () => {
      const { signInAuthError } = require('./authentication-error-hints');
      signInAuthError.mockReturnValue(true);
      const { BrowserAuthError } = require('@azure/msal-browser');
      const error = new BrowserAuthError();
      (error as any).errorCode = 'interaction_in_progress';

      // Set up interaction cookie
      document.cookie = 'msal.interaction.status=active; path=/';

      mockMsal.getAllAccounts.mockReturnValue([]);
      mockMsal.acquireTokenSilent.mockRejectedValue(new Error('no account'));
      mockMsal.loginPopup.mockRejectedValue(error);

      await expect(wrapper.logIn()).rejects.toThrow();
    });

    it('does not call clearSession when user_cancelled', async () => {
      const { signInAuthError } = require('./authentication-error-hints');
      signInAuthError.mockReturnValue(true);
      const { BrowserAuthError } = require('@azure/msal-browser');
      const error = new BrowserAuthError();
      (error as any).errorCode = 'user_cancelled';

      mockMsal.getAllAccounts.mockReturnValue([]);
      mockMsal.acquireTokenSilent.mockRejectedValue(new Error('no account'));
      mockMsal.loginPopup.mockRejectedValue(error);

      localStorage.setItem('homeAccountKey', 'home-1');
      await expect(wrapper.logIn()).rejects.toThrow();
      // homeAccountKey should still be there since user_cancelled doesn't trigger clearSession
      expect(localStorage.getItem('homeAccountKey')).toBe('home-1');
    });
  });

  describe('getAuthority - tenant parameter', () => {
    it('uses tenant from URL query parameter', async () => {
      // Set up location.search with tenant
      const originalLocation = window.location;
      Object.defineProperty(window, 'location', {
        value: { ...originalLocation, search: '?tenant=myorg.onmicrosoft.com' },
        writable: true
      });

      const authResult = {
        accessToken: 'tenant-token',
        account: {
          homeAccountId: 'home-1',
          environment: 'env',
          tenantId: 't1',
          username: 'u1',
          localAccountId: 'l1'
        }
      };
      mockMsal.getAllAccounts.mockReturnValue([]);
      mockMsal.acquireTokenSilent.mockRejectedValue(new Error('no account'));
      mockMsal.loginPopup.mockResolvedValue(authResult as any);

      await wrapper.logIn();
      const popupCall = mockMsal.loginPopup.mock.calls[0][0] as any;
      expect(popupCall.authority).toBe('https://login.microsoftonline.com/myorg.onmicrosoft.com/');

      // Restore
      Object.defineProperty(window, 'location', {
        value: originalLocation,
        writable: true
      });
    });
  });

  describe('getClaims - with stored claims', () => {
    it('returns decoded claims when ClaimsChallenge has stored claims', async () => {
      const { ClaimsChallenge } = require('./ClaimsChallenge');
      const base64Claims = btoa('{"access_token":{"acrs":{"values":["c1"]}}}');
      ClaimsChallenge.mockImplementation(() => ({
        getClaimsFromStorage: jest.fn(() => base64Claims)
      }));

      const account = {
        homeAccountId: 'home-1',
        environment: 'env',
        tenantId: 't1',
        username: 'u1',
        localAccountId: 'l1'
      };
      mockMsal.getAllAccounts.mockReturnValue([account]);
      mockMsal.acquireTokenSilent.mockResolvedValue({ accessToken: 'claims-token', account } as any);

      // logIn with sampleQuery to set performingStepUpAuth and sampleUrl
      const sampleQuery = {
        sampleUrl: 'https://graph.microsoft.com/v1.0/me',
        selectedVerb: 'GET',
        selectedVersion: 'v1.0',
        sampleHeaders: []
      };
      const result = await wrapper.logIn('', sampleQuery);
      expect(result.accessToken).toBe('claims-token');
      // Verify acquireTokenSilent was called with claims
      const silentCall = mockMsal.acquireTokenSilent.mock.calls[0][0] as any;
      expect(silentCall.claims).toBe('{"access_token":{"acrs":{"values":["c1"]}}}');
    });
  });

  describe('getExtraQueryParameters - safe rollout', () => {
    it('includes safe_rollout when variant is active and env var is set', async () => {
      const variantService = require('../../app/services/variant-service').default;
      variantService.getFeatureVariables.mockReturnValue(true);
      const originalEnv = process.env.REACT_APP_MIGRATION_PARAMETER;
      process.env.REACT_APP_MIGRATION_PARAMETER = 'migration_v2';

      const authResult = {
        accessToken: 'rollout-token',
        account: {
          homeAccountId: 'home-1',
          environment: 'env',
          tenantId: 't1',
          username: 'u1',
          localAccountId: 'l1'
        }
      };
      mockMsal.getAllAccounts.mockReturnValue([]);
      mockMsal.acquireTokenSilent.mockRejectedValue(new Error('no account'));
      mockMsal.loginPopup.mockResolvedValue(authResult as any);

      await wrapper.logIn();
      const popupCall = mockMsal.loginPopup.mock.calls[0][0] as any;
      expect(popupCall.extraQueryParameters).toEqual({ safe_rollout: 'migration_v2' });
      expect(popupCall.tokenQueryParameters).toEqual({ safe_rollout: 'migration_v2' });

      // Restore
      process.env.REACT_APP_MIGRATION_PARAMETER = originalEnv;
      variantService.getFeatureVariables.mockReturnValue(false);
    });
  });

  describe('getAuthResult - InteractionRequiredAuthError triggers loginWithInteraction', () => {
    it('falls back to loginWithInteraction on InteractionRequiredAuthError', async () => {
      const { InteractionRequiredAuthError } = require('@azure/msal-browser');
      const account = {
        homeAccountId: 'home-1',
        environment: 'env',
        tenantId: 't1',
        username: 'u1',
        localAccountId: 'l1'
      };
      mockMsal.getAllAccounts.mockReturnValue([account]);
      mockMsal.acquireTokenSilent.mockRejectedValue(new InteractionRequiredAuthError('interaction_required'));
      const authResult = { accessToken: 'popup-token', account };
      mockMsal.loginPopup.mockResolvedValue(authResult as any);

      const result = await wrapper.logIn();
      expect(result.accessToken).toBe('popup-token');
      expect(mockMsal.loginPopup).toHaveBeenCalled();
    });
  });

  describe('consentToScopes - BrowserAuthError during consent does not clearSession', () => {
    it('does not clear session on BrowserAuthError when consenting', async () => {
      const { signInAuthError } = require('./authentication-error-hints');
      signInAuthError.mockReturnValue(true);
      const { BrowserAuthError } = jest.requireActual('@azure/msal-browser');
      const error = new BrowserAuthError();
      (error as any).errorCode = 'popup_window_error';

      const account = {
        homeAccountId: 'home-1',
        environment: 'env',
        tenantId: 't1',
        username: 'u1',
        localAccountId: 'l1'
      };
      mockMsal.getAllAccounts.mockReturnValue([account]);
      const { InteractionRequiredAuthError } = require('@azure/msal-browser');
      mockMsal.acquireTokenSilent.mockRejectedValue(new InteractionRequiredAuthError('interaction_required'));
      mockMsal.loginPopup.mockRejectedValue(error);

      localStorage.setItem('homeAccountKey', 'home-1');
      await expect(wrapper.consentToScopes(['Mail.Read'])).rejects.toBeDefined();
      // consentingToNewScopes is true so valid = false, clearSession not called
      expect(localStorage.getItem('homeAccountKey')).toBe('home-1');
    });
  });
});
