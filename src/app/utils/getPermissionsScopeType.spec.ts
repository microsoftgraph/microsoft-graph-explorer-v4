import { getPermissionsScopeType } from './getPermissionsScopeType';
import { ACCOUNT_TYPE, PERMS_SCOPE } from '../services/graph-constants';
import { IUser } from '../../types/profile';

describe('getPermissionsScopeType', () => {
  it('should return PERSONAL for MSA profile type', () => {
    const profile: IUser = {
      id: '1',
      displayName: 'Test',
      emailAddress: 'test@outlook.com',
      profileImageUrl: '',
      profileType: ACCOUNT_TYPE.MSA,
      ageGroup: 0,
      tenant: ''
    };
    expect(getPermissionsScopeType(profile)).toBe(PERMS_SCOPE.PERSONAL);
  });

  it('should return WORK for AAD profile type', () => {
    const profile: IUser = {
      id: '1',
      displayName: 'Test',
      emailAddress: 'test@company.com',
      profileImageUrl: '',
      profileType: ACCOUNT_TYPE.AAD,
      ageGroup: 0,
      tenant: ''
    };
    expect(getPermissionsScopeType(profile)).toBe(PERMS_SCOPE.WORK);
  });

  it('should return WORK for null profile', () => {
    expect(getPermissionsScopeType(null)).toBe(PERMS_SCOPE.WORK);
  });

  it('should return WORK for undefined profile', () => {
    expect(getPermissionsScopeType(undefined)).toBe(PERMS_SCOPE.WORK);
  });

  it('should return WORK for UNDEFINED account type', () => {
    const profile: IUser = {
      id: '1',
      displayName: 'Test',
      emailAddress: 'test@test.com',
      profileImageUrl: '',
      profileType: ACCOUNT_TYPE.UNDEFINED,
      ageGroup: 0,
      tenant: ''
    };
    expect(getPermissionsScopeType(profile)).toBe(PERMS_SCOPE.WORK);
  });
});
