import { IPermission } from '../../../../../types/permissions';

export function setConsentedStatus(tokenPresent: any, permissions: IPermission[], consentedScopes: string[]) {
  if (tokenPresent) {
    if (permissions && permissions.length > 0) {
      permissions.forEach((permission: IPermission) => {
        if (consentedScopes && consentedScopes.length > 0 && consentedScopes.indexOf(permission.value) !== -1) {
          permission.consented = true;
        }
      });
    }
  }
}