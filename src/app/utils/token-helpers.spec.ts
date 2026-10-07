import { getTokenSubstituteValue, substituteTokens } from '../../app/utils/token-helpers';
import { IQuery } from '../../types/query-runner';

jest.mock('../../app/views/sidebar/sample-queries/tokens', () => ({
  getTokens: jest.fn((profile?: any) => [
    {
      placeholder: 'user-id',
      authenticatedUserValue: 'auth-user-123',
      demoTenantValue: 'demo-user-456',
      defaultValue: 'default-user-789'
    },
    {
      placeholder: 'group-id',
      authenticatedUserValueFn: () => 'fn-auth-group',
      demoTenantValueFn: () => 'fn-demo-group',
      defaultValueFn: () => 'fn-default-group'
    },
    {
      placeholder: 'empty-token'
    }
  ])
}));

describe('Tests token helper utils', () => {
  const token = {
    placeholder: 'testHolder'
  };
  const isAuthenticated = true;
  const profile = {
    tenant: {
      id: 'tenantId',
      name: 'tenantName'
    },
    user: {
      id: 'userId',
      name: 'userName'
    }
  };
  it('should return the value of the token', () => {
    const value = getTokenSubstituteValue(token, isAuthenticated);
    expect(value).toBeUndefined();

    const unAuthenticatedValue = getTokenSubstituteValue(token, false);
    expect(unAuthenticatedValue).toBeUndefined();
  });
  it('should substitute the token with the correct value', () => {
    const query: IQuery = {
      selectedVerb: 'GET',
      sampleUrl: '/v1.0/me',
      selectedVersion: 'v1.0',
      sampleBody: '',
      sampleHeaders: []
    };
    substituteTokens(query, profile);
  });

  describe('getTokenSubstituteValue - authenticated', () => {
    it('should return authenticatedUserValue string when authenticated', () => {
      const t = { placeholder: 'test', authenticatedUserValue: 'auth-val' };
      expect(getTokenSubstituteValue(t, true)).toBe('auth-val');
    });

    it('should call authenticatedUserValueFn when authenticated and it is a function', () => {
      const t = { placeholder: 'test', authenticatedUserValueFn: () => 'fn-result' };
      expect(getTokenSubstituteValue(t, true)).toBe('fn-result');
    });

    it('should fall through to defaultValue when authenticated values are not set', () => {
      const t = { placeholder: 'test', defaultValue: 'default-val' };
      expect(getTokenSubstituteValue(t, true)).toBe('default-val');
    });

    it('should call defaultValueFn when it is a function', () => {
      const t = { placeholder: 'test', defaultValueFn: () => 'fn-default' };
      expect(getTokenSubstituteValue(t, true)).toBe('fn-default');
    });
  });

  describe('getTokenSubstituteValue - unauthenticated', () => {
    it('should return demoTenantValue when not authenticated', () => {
      const t = { placeholder: 'test', demoTenantValue: 'demo-val' };
      expect(getTokenSubstituteValue(t, false)).toBe('demo-val');
    });

    it('should call demoTenantValueFn when not authenticated', () => {
      const t = { placeholder: 'test', demoTenantValueFn: () => 'fn-demo' };
      expect(getTokenSubstituteValue(t, false)).toBe('fn-demo');
    });

    it('should fall through to defaultValue when demo values not set', () => {
      const t = { placeholder: 'test', defaultValue: 'fallback' };
      expect(getTokenSubstituteValue(t, false)).toBe('fallback');
    });
  });

  describe('getTokenSubstituteValue - priority', () => {
    it('should prefer authenticatedUserValueFn over authenticatedUserValue', () => {
      const t = {
        placeholder: 'test',
        authenticatedUserValueFn: () => 'fn-first',
        authenticatedUserValue: 'string-second'
      };
      expect(getTokenSubstituteValue(t, true)).toBe('fn-first');
    });

    it('should prefer demoTenantValueFn over demoTenantValue', () => {
      const t = {
        placeholder: 'test',
        demoTenantValueFn: () => 'fn-first',
        demoTenantValue: 'string-second'
      };
      expect(getTokenSubstituteValue(t, false)).toBe('fn-first');
    });

    it('should return undefined when no values are set', () => {
      const t = { placeholder: 'test' };
      expect(getTokenSubstituteValue(t, true)).toBeUndefined();
      expect(getTokenSubstituteValue(t, false)).toBeUndefined();
    });
  });

  describe('substituteTokens', () => {
    it('should replace token placeholders in sampleUrl', () => {
      const query: IQuery = {
        selectedVerb: 'GET',
        sampleUrl: 'https://graph.microsoft.com/v1.0/users/{user-id}',
        selectedVersion: 'v1.0',
        sampleHeaders: []
      };
      substituteTokens(query, profile);
      expect(query.sampleUrl).toBe('https://graph.microsoft.com/v1.0/users/auth-user-123');
    });

    it('should replace token placeholders in sampleBody', () => {
      const query: IQuery = {
        selectedVerb: 'POST',
        sampleUrl: '/v1.0/groups',
        selectedVersion: 'v1.0',
        sampleBody: '{"groupId": "{group-id}"}',
        sampleHeaders: []
      };
      substituteTokens(query, profile);
      expect(query.sampleBody).toBe('{"groupId": "fn-auth-group"}');
    });

    it('should skip fields that are null/undefined', () => {
      const query: IQuery = {
        selectedVerb: 'GET',
        sampleUrl: '/v1.0/me',
        selectedVersion: 'v1.0',
        sampleHeaders: []
      };
      // Should not throw
      substituteTokens(query, profile);
    });

    it('should not replace tokens that do not appear in the query', () => {
      const query: IQuery = {
        selectedVerb: 'GET',
        sampleUrl: '/v1.0/me',
        selectedVersion: 'v1.0',
        sampleHeaders: []
      };
      substituteTokens(query, profile);
      expect(query.sampleUrl).toBe('/v1.0/me');
    });

    it('should skip substitution when token has no substitute value', () => {
      const query: IQuery = {
        selectedVerb: 'GET',
        sampleUrl: '/v1.0/{empty-token}/data',
        selectedVersion: 'v1.0',
        sampleHeaders: []
      };
      substituteTokens(query, profile);
      expect(query.sampleUrl).toBe('/v1.0/{empty-token}/data');
    });
  });
})