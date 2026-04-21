import { setConsentedStatus, sortPermissionsWithPrivilege } from './util';
import { IPermission } from '../../../../../types/permissions';

describe('setConsentedStatus', () => {
  const permissions: IPermission[] = [
    { value: 'User.Read', isAdmin: false, consentDescription: '', consentDisplayName: '' } as IPermission,
    { value: 'Mail.Read', isAdmin: false, consentDescription: '', consentDisplayName: '' } as IPermission,
    { value: 'Files.Read', isAdmin: true, consentDescription: '', consentDisplayName: '' } as IPermission
  ];

  it('should mark consented scopes when token present', () => {
    const result = setConsentedStatus(true, permissions, ['User.Read', 'Files.Read']);
    expect(result[0].consented).toBe(true);
    expect(result[1].consented).toBe(false);
    expect(result[2].consented).toBe(true);
  });

  it('should return permissions unchanged when token not present', () => {
    const result = setConsentedStatus(false, permissions, ['User.Read']);
    expect(result).toBe(permissions);
  });

  it('should return permissions when empty array', () => {
    const result = setConsentedStatus(true, [], ['User.Read']);
    expect(result).toEqual([]);
  });

  it('should handle empty consented scopes', () => {
    const result = setConsentedStatus(true, permissions, []);
    expect(result[0].consented).toBe(false);
    expect(result[1].consented).toBe(false);
  });
});

describe('sortPermissionsWithPrivilege', () => {
  it('should move least privileged permission to front', () => {
    const permissions: IPermission[] = [
      { value: 'Mail.Read', isLeastPrivilege: false } as IPermission,
      { value: 'User.Read', isLeastPrivilege: true } as IPermission,
      { value: 'Files.Read', isLeastPrivilege: false } as IPermission
    ];
    const result = sortPermissionsWithPrivilege(permissions);
    expect(result[0].value).toBe('User.Read');
    expect(result.length).toBe(3);
  });

  it('should return permissions unchanged when no least privileged', () => {
    const permissions: IPermission[] = [
      { value: 'Mail.Read', isLeastPrivilege: false } as IPermission,
      { value: 'User.Read', isLeastPrivilege: false } as IPermission
    ];
    const result = sortPermissionsWithPrivilege(permissions);
    expect(result[0].value).toBe('Mail.Read');
  });

  it('should handle empty array', () => {
    const result = sortPermissionsWithPrivilege([]);
    expect(result).toEqual([]);
  });
});
