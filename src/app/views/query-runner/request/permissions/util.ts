import { IPermission } from '../../../../../types/permissions';

export function setConsentedStatus(tokenPresent: boolean,
  permissions: IPermission[], consentedScopes: string[]): IPermission[] {
  if (tokenPresent && permissions && permissions.length > 0) {
    const clonedPermissions = JSON.parse(JSON.stringify(permissions)) as IPermission[];
    clonedPermissions.forEach((permission: IPermission) => {
      permission.consented = (consentedScopes && consentedScopes.length > 0 &&
        consentedScopes.indexOf(permission.value) !== -1);
    });
    return clonedPermissions;
  }
  return permissions;
}

export function sortPermissionsWithPrivilege(permissionsToSort: IPermission[]) {
  const leastPrivileged = permissionsToSort.find(permission => permission.isLeastPrivilege === true);
  if (leastPrivileged) {
    const permissions: IPermission[] = permissionsToSort.filter(k => k.value !== leastPrivileged.value);
    permissions.unshift(leastPrivileged);
    return permissions;
  }
  return permissionsToSort;
}