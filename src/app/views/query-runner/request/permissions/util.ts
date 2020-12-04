import { IPermission } from '../../../../../types/permissions';

export function setConsentedStatus(tokenPresent: any, permissions: IPermission[], consentedScopes: string[]) {
    if (tokenPresent) {
        permissions.forEach((permission: IPermission) => {
            if (consentedScopes.indexOf(permission.value) !== -1) {
                permission.consented = true;
            }
        });
    }
}