import { getTokenSubstituteValue, substituteTokens } from '../../app/utils/token-helpers';
import { IQuery } from '../../types/query-runner';

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
  it('Returns the value of the token', () => {
    const value = getTokenSubstituteValue(token, isAuthenticated);
    expect(value).toBeUndefined();

    const unAuthenticatedValue = getTokenSubstituteValue(token, false);
    expect(unAuthenticatedValue).toBeUndefined();
  });
  it('Substitutes the token with the correct value', () => {
    const query: IQuery = {
      selectedVerb: 'GET',
      sampleUrl: '/v1.0/me',
      selectedVersion: 'v1.0',
      sampleBody: '',
      sampleHeaders: []
    };
    substituteTokens(query, profile);
  });
})