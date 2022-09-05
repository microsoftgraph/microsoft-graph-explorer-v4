import { IPermission } from '../../../../../types/permissions';

export function setConsentedStatus(tokenPresent: any, permissions: IPermission[], consentedScopes: string[]) {
  if (tokenPresent) {
    if (permissions && permissions.length > 0) {
      permissions.forEach((permission: IPermission) => {
        if (consentedScopes && consentedScopes.indexOf(permission.value) !== -1) {
          permission.consented = true;
        }
      });
    }
  }
}

export function setSelectedStatus(permissionSelected: IPermission, deselectionStatus: boolean) {
  if (permissionSelected) {
    if(permissionSelected.selected && deselectionStatus) {
      permissionSelected.selected = false;
      return;
    }
    permissionSelected.selected = true;
  }
}