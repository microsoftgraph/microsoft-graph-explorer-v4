
import { AppAction } from '../../../types/action';
import { IOAuthGrantPayload, IPermissionGrant } from '../../../types/permissions';
import { IUser } from '../../../types/profile';
import { translateMessage } from '../../utils/translate-messages';
import {
  GET_ALL_PRINCIPAL_GRANTS_ERROR,
  GET_ALL_PRINCIPAL_GRANTS_PENDING,
  GET_ALL_PRINCIPAL_GRANTS_SUCCESS
} from '../redux-constants';
import { setQueryResponseStatus } from '../slices/query-status.slice';
import { RevokePermissionsUtil } from './permissions-action-creator.util';

export function getAllPrincipalGrantsPending(response: boolean) {
  return {
    type: GET_ALL_PRINCIPAL_GRANTS_PENDING,
    response
  };
}

export function getAllPrincipalGrantsSuccess(response: object): AppAction {
  return {
    type: GET_ALL_PRINCIPAL_GRANTS_SUCCESS,
    response
  };
}

export function getAllPrincipalGrantsError(response: object): AppAction {
  return {
    type: GET_ALL_PRINCIPAL_GRANTS_ERROR,
    response
  };

}

export function fetchAllPrincipalGrants() {
  return async (dispatch: Function, getState: Function) => {
    dispatch(getAllPrincipalGrantsPending(true));
    try {
      const { profile, consentedScopes, scopes } = getState();
      const tenantWideGrant: IOAuthGrantPayload = scopes.data.tenantWidePermissionsGrant;
      const revokePermissionUtil = await RevokePermissionsUtil.initialize(profile.id);
      if (revokePermissionUtil && revokePermissionUtil.getGrantsPayload() !== null) {
        const servicePrincipalAppId = revokePermissionUtil.getServicePrincipalAppId();
        dispatch(getAllPrincipalGrantsPending(true));
        const requestCounter = 0;

        await checkScopesConsentType(servicePrincipalAppId, tenantWideGrant,
          revokePermissionUtil, consentedScopes, profile, requestCounter, dispatch);
      }
      else {
        dispatch(getAllPrincipalGrantsPending(false));
        setQueryResponseStatus({
          statusText: translateMessage('Permissions'),
          status: translateMessage('You require the following permissions to read'),
          ok: false,
          messageType: 0
        })
      }
    } catch (error: any) {
      dispatch(getAllPrincipalGrantsPending(false));
      dispatch(getAllPrincipalGrantsError(error));
    }
  }
}

const dispatchGrantsStatus = (dispatch: Function, tenantGrantValue: IPermissionGrant[]): void => {
  dispatch(getAllPrincipalGrantsPending(false));
  dispatch(getAllPrincipalGrantsSuccess(tenantGrantValue));
}

const allScopesHaveConsentType = (consentedScopes: string[], tenantWideGrant: IOAuthGrantPayload, id: string) => {
  const allPrincipalGrants: string[] = getAllPrincipalGrant(tenantWideGrant.value);
  const singlePrincipalGrants: string[] = getSinglePrincipalGrant(tenantWideGrant.value, id);
  const combinedPermissions = [...allPrincipalGrants, ...singlePrincipalGrants];
  return consentedScopes.every(scope => combinedPermissions.includes(scope));
}

export const getAllPrincipalGrant = (tenantWideGrant: IPermissionGrant[]): string[] => {
  if (tenantWideGrant) {
    const allGrants = tenantWideGrant;
    if (allGrants) {
      const principalGrant = allGrants.find(grant => grant.consentType === 'AllPrincipals');
      if (principalGrant) {
        return principalGrant.scope.split(' ');
      }
    }
  }
  return [];
}

export const getSinglePrincipalGrant = (tenantWideGrant: IPermissionGrant[], principalId: string): string[] => {
  if (tenantWideGrant && principalId) {
    const allGrants = tenantWideGrant;
    const singlePrincipalGrant = allGrants.find(grant => grant.principalId === principalId);
    if (singlePrincipalGrant) {
      return singlePrincipalGrant.scope.split(' ');
    }
  }
  return [];
}
async function checkScopesConsentType(servicePrincipalAppId: string, tenantWideGrant: IOAuthGrantPayload,
  revokePermissionUtil: RevokePermissionsUtil, consentedScopes: string[], profile: IUser,
  requestCounter: number, dispatch: Function) {
  if (servicePrincipalAppId) {
    tenantWideGrant = revokePermissionUtil.getGrantsPayload();
    if (tenantWideGrant) {
      if (!allScopesHaveConsentType(consentedScopes, tenantWideGrant, profile.id)) {
        while (requestCounter < 10 && profile && profile.id &&
          !allScopesHaveConsentType(consentedScopes, tenantWideGrant, profile.id)) {
          requestCounter += 1;
          await new Promise((resolve) => setTimeout(resolve, 400 * requestCounter));
          revokePermissionUtil = await RevokePermissionsUtil.initialize(profile.id);
          dispatch(getAllPrincipalGrantsPending(true));
          tenantWideGrant = revokePermissionUtil.getGrantsPayload();
        }
        dispatchGrantsStatus(dispatch, tenantWideGrant.value);
      }
      else {
        dispatchGrantsStatus(dispatch, tenantWideGrant.value);
      }
    }
  }
}

