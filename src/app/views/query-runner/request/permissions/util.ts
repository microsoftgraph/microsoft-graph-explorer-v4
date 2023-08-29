import { IPermission } from '../../../../../types/permissions';

export function setConsentedStatus(tokenPresent: any, permissions: IPermission[], consentedScopes: string[]) {
  if (tokenPresent) {
    if (permissions && permissions.length > 0) {
      permissions.forEach((permission: IPermission) => {
        permission.consented = (consentedScopes && consentedScopes.length > 0 &&
          consentedScopes.indexOf(permission.value) !== -1);
      });
    }
  }
}

export function sortPermissionsWithPrivilege(permissionsToSort: IPermission[]){
  const leastPrivilegedIndex = permissionsToSort.findIndex(permission => permission.isLeastPrivilege === true);
  if(leastPrivilegedIndex !== -1){
    const leastPrivilegedPermission = permissionsToSort.find(permission => permission.isLeastPrivilege === true);
    return [leastPrivilegedPermission!,
      ...permissionsToSort.filter(permission => permission !== leastPrivilegedPermission)];
  }
  return permissionsToSort;
}