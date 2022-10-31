import { IPermission } from '../../../../../types/permissions';
import { getBrowserScreenSize } from '../../../../utils/device-characteristics-telemetry';

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

interface IDescriptionSize {
  minWidth: number;
  maxWidth: number;
}
export function setDescriptionColumnSize(): IDescriptionSize{
  const browserSize = getBrowserScreenSize(window.innerWidth);
  switch(browserSize){
    case 's':
      return {
        minWidth: 100,
        maxWidth: 150
      }
    case 'm':
      return {
        minWidth: 150,
        maxWidth: 200
      }
    case 'l':
      return {
        minWidth: 200,
        maxWidth: 250
      }
    case 'xl':
      return {
        minWidth: 250,
        maxWidth: 400
      }
    case 'xxl':
      return {
        minWidth: 400,
        maxWidth: 500
      }
    case 'xxxl':
      return {
        minWidth: 500,
        maxWidth: 600
      }
    default:
      return {
        minWidth: 200,
        maxWidth: 251
      }
  }
}