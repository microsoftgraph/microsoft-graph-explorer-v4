import {
  getAgeGroup, getProfileType, getProfileInformation, getBetaProfile, getProfileImage, getTenantInfo
} from './profile-actions';
import { ACCOUNT_TYPE } from '../graph-constants';

jest.mock('./query-action-creator-util', () => ({
  makeGraphRequest: jest.fn(() => jest.fn()),
  parseResponse: jest.fn()
}));

jest.mock('../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));

jest.mock('../../../modules/authentication', () => ({
  authenticationWrapper: { getAccount: jest.fn() }
}));

jest.mock('../graph-client', () => ({
  authProvider: {},
  GraphClient: { getInstance: jest.fn() }
}));

describe('profile-actions', () => {
  describe('getProfileType', () => {
    it('should return profile type from user info', () => {
      const userInfo = { account: [{ source: { type: [ACCOUNT_TYPE.AAD] } }] };
      expect(getProfileType(userInfo)).toBe(ACCOUNT_TYPE.AAD);
    });

    it('should return MSA type', () => {
      const userInfo = { account: [{ source: { type: [ACCOUNT_TYPE.MSA] } }] };
      expect(getProfileType(userInfo)).toBe(ACCOUNT_TYPE.MSA);
    });

    it('should return UNDEFINED when no account info', () => {
      expect(getProfileType({})).toBe(ACCOUNT_TYPE.UNDEFINED);
    });

    it('should return UNDEFINED when account array is empty', () => {
      expect(getProfileType({ account: [] })).toBe(ACCOUNT_TYPE.UNDEFINED);
    });

    it('should return UNDEFINED for null input', () => {
      expect(getProfileType(null)).toBe(ACCOUNT_TYPE.UNDEFINED);
    });

    it('should return UNDEFINED when source is missing', () => {
      expect(getProfileType({ account: [{}] })).toBe(ACCOUNT_TYPE.UNDEFINED);
    });
  });

  describe('getAgeGroup', () => {
    it('should return 0 for AAD account', () => {
      const userInfo = { account: [{ source: { type: [ACCOUNT_TYPE.AAD] } }] };
      expect(getAgeGroup(userInfo)).toBe(0);
    });

    it('should return age group for MSA account', () => {
      const userInfo = { account: [{ source: { type: [ACCOUNT_TYPE.MSA] }, ageGroup: 3 }] };
      expect(getAgeGroup(userInfo)).toBe(3);
    });

    it('should return 0 when MSA has no age group', () => {
      const userInfo = { account: [{ source: { type: [ACCOUNT_TYPE.MSA] } }] };
      expect(getAgeGroup(userInfo)).toBe(0);
    });

    it('should return 0 when MSA age group is empty string', () => {
      const userInfo = { account: [{ source: { type: [ACCOUNT_TYPE.MSA] }, ageGroup: '' }] };
      expect(getAgeGroup(userInfo)).toBe(0);
    });

    it('should return 0 for undefined profile type', () => {
      expect(getAgeGroup({})).toBe(0);
    });
  });

  describe('getProfileInformation', () => {
    it('should return profile with user info on success', async () => {
      const { makeGraphRequest, parseResponse } = require('./query-action-creator-util');
      const mockResponse = new Response();
      const mockFn = jest.fn().mockResolvedValue(mockResponse);
      makeGraphRequest.mockReturnValue(mockFn);
      parseResponse.mockResolvedValue({
        id: 'user-123',
        displayName: 'Test User',
        mail: 'test@example.com'
      });

      const profile = await getProfileInformation();
      expect(profile.id).toBe('user-123');
      expect(profile.displayName).toBe('Test User');
      expect(profile.emailAddress).toBe('test@example.com');
    });

    it('should use userPrincipalName when mail is not available', async () => {
      const { makeGraphRequest, parseResponse } = require('./query-action-creator-util');
      const mockResponse = new Response();
      const mockFn = jest.fn().mockResolvedValue(mockResponse);
      makeGraphRequest.mockReturnValue(mockFn);
      parseResponse.mockResolvedValue({
        id: 'user-123',
        displayName: 'Test User',
        mail: null,
        userPrincipalName: 'test@contoso.onmicrosoft.com'
      });

      const profile = await getProfileInformation();
      expect(profile.emailAddress).toBe('test@contoso.onmicrosoft.com');
    });

    it('should throw when API call fails', async () => {
      const { makeGraphRequest } = require('./query-action-creator-util');
      makeGraphRequest.mockReturnValue(jest.fn().mockRejectedValue(new Error('Network error')));

      await expect(getProfileInformation()).rejects.toThrow();
    });
  });

  describe('getBetaProfile', () => {
    it('should return beta profile info on success', async () => {
      const { makeGraphRequest, parseResponse } = require('./query-action-creator-util');
      const mockResponse = new Response();
      const mockFn = jest.fn().mockResolvedValue(mockResponse);
      makeGraphRequest.mockReturnValue(mockFn);
      parseResponse.mockResolvedValue({
        account: [{ source: { type: [ACCOUNT_TYPE.MSA] }, ageGroup: 2 }]
      });

      const result = await getBetaProfile();
      expect(result.profileType).toBe(ACCOUNT_TYPE.MSA);
      expect(result.ageGroup).toBe(2);
    });

    it('should return defaults on error', async () => {
      const { makeGraphRequest } = require('./query-action-creator-util');
      makeGraphRequest.mockReturnValue(jest.fn().mockRejectedValue(new Error('fail')));

      const result = await getBetaProfile();
      expect(result.ageGroup).toBe(0);
      expect(result.profileType).toBe(ACCOUNT_TYPE.UNDEFINED);
    });
  });

  describe('getProfileImage', () => {
    it('should return empty string on error', async () => {
      const { makeGraphRequest } = require('./query-action-creator-util');
      makeGraphRequest.mockReturnValue(jest.fn().mockRejectedValue(new Error('fail')));

      const result = await getProfileImage();
      expect(result).toBe('');
    });

    it('should return blob URL on success', async () => {
      const { makeGraphRequest, parseResponse } = require('./query-action-creator-util');
      const mockArrayBuffer = new ArrayBuffer(8);
      const mockResponse = {
        arrayBuffer: jest.fn().mockResolvedValue(mockArrayBuffer)
      };
      const mockFn = jest.fn().mockResolvedValue(mockResponse);
      makeGraphRequest.mockReturnValue(mockFn);
      parseResponse.mockResolvedValue({ some: 'imageData' });

      global.URL.createObjectURL = jest.fn().mockReturnValue('blob:http://localhost/abc');

      const result = await getProfileImage();
      expect(result).toBe('blob:http://localhost/abc');
    });
  });

  describe('getTenantInfo', () => {
    it('should return Personal for MSA account', async () => {
      const result = await getTenantInfo(ACCOUNT_TYPE.MSA);
      expect(result).toBe('Personal');
    });

    it('should return tenant display name for AAD account', async () => {
      const { makeGraphRequest, parseResponse } = require('./query-action-creator-util');
      const mockResponse = new Response();
      const mockFn = jest.fn().mockResolvedValue(mockResponse);
      makeGraphRequest.mockReturnValue(mockFn);
      parseResponse.mockResolvedValue({
        value: [{ displayName: 'Contoso Ltd' }]
      });

      const result = await getTenantInfo(ACCOUNT_TYPE.AAD);
      expect(result).toBe('Contoso Ltd');
    });

    it('should return empty string on error', async () => {
      const { makeGraphRequest } = require('./query-action-creator-util');
      makeGraphRequest.mockReturnValue(jest.fn().mockRejectedValue(new Error('fail')));

      const result = await getTenantInfo(ACCOUNT_TYPE.AAD);
      expect(result).toBe('');
    });
  });
});
