import { MessageBarType } from '@fluentui/react';

import { geLocale } from '../../../appLocale';
import { authenticationWrapper } from '../../../modules/authentication';
import { AppAction } from '../../../types/action';
import { IUser } from '../../../types/profile';
import { IRequestOptions } from '../../../types/request';
import { ApplicationState } from '../../../types/root';
import { sanitizeQueryUrl } from '../../utils/query-url-sanitization';
import { parseSampleUrl } from '../../utils/sample-url-generation';
import { translateMessage } from '../../utils/translate-messages';
import { getConsentAuthErrorHint } from '../../../modules/authentication/authentication-error-hints';
import {
  ACCOUNT_TYPE, DEFAULT_USER_SCOPES, PERMS_SCOPE,
  REVOKING_PERMISSIONS_REQUIRED_SCOPES
} from '../graph-constants';
import {
  FETCH_SCOPES_ERROR,
  FETCH_FULL_SCOPES_PENDING,
  FETCH_URL_SCOPES_PENDING,
  FETCH_FULL_SCOPES_SUCCESS,
  FETCH_URL_SCOPES_SUCCESS,
  GET_ALL_PRINCIPAL_GRANTS_SUCCESS, GET_ALL_PRINCIPAL_GRANTS_ERROR, REVOKE_SCOPES_PENDING,
  REVOKE_SCOPES_SUCCESS, REVOKE_SCOPES_ERROR, GET_ALL_PRINCIPAL_GRANTS_PENDING
} from '../redux-constants';
import {
  getAuthTokenSuccess,
  getConsentedScopesSuccess
} from './auth-action-creators';
import { getProfileInfo } from './profile-action-creators';
import { setQueryResponseStatus } from './query-status-action-creator';
import { RevokePermissionsUtil, REVOKE_STATUS } from './permissions-action-creator.util';
import { componentNames, eventTypes, telemetry } from '../../../telemetry';
import { RevokeScopesError } from '../../utils/error-utils/RevokeScopesError';
import { IOAuthGrantPayload, IPermissionGrant } from '../../../types/permissions';

export function fetchFullScopesSuccess(response: object): AppAction {
  return {
    type: FETCH_FULL_SCOPES_SUCCESS,
    response
  };
}

export function fetchUrlScopesSuccess(response: Object): AppAction {
  return {
    type: FETCH_URL_SCOPES_SUCCESS,
    response
  }
}

export function fetchFullScopesPending(): AppAction {
  return {
    type: FETCH_FULL_SCOPES_PENDING,
    response: 'full'
  };
}

export function fetchUrlScopesPending(): AppAction {
  return {
    type: FETCH_URL_SCOPES_PENDING,
    response: 'url'
  };
}

export function fetchScopesError(response: object): AppAction {
  return {
    type: FETCH_SCOPES_ERROR,
    response
  };
}

export function getAllPrincipalGrantsPending(response: boolean){
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

export function revokeScopesPending(): AppAction {
  return {
    type: REVOKE_SCOPES_PENDING,
    response: null
  }
}

export function revokeScopesSuccess(): AppAction {
  return {
    type: REVOKE_SCOPES_SUCCESS,
    response: null
  }
}

export function revokeScopesError(): AppAction {
  return {
    type: REVOKE_SCOPES_ERROR,
    response: null
  }
}

export function fetchScopes() {
  return async (dispatch: Function, getState: Function) => {
    try {
      const { devxApi, permissionsPanelOpen, profile, sampleQuery: query }: ApplicationState = getState();
      let permissionsUrl = `${devxApi.baseUrl}/permissions`;

      const scopeType = getPermissionsScopeType(profile);

      if (!permissionsPanelOpen) {
        const signature = sanitizeQueryUrl(query.sampleUrl);
        const { requestUrl, sampleUrl } = parseSampleUrl(signature);

        if (!sampleUrl) {
          throw new Error('url is invalid');
        }

        // eslint-disable-next-line max-len
        permissionsUrl = `${permissionsUrl}?requesturl=/${requestUrl}&method=${query.selectedVerb}&scopeType=${scopeType}`;
      }

      if (devxApi.parameters) {
        permissionsUrl = `${permissionsUrl}${query ? '&' : '?'}${devxApi.parameters}`;
      }

      const headers = {
        'Content-Type': 'application/json',
        'Accept-Language': geLocale
      };

      const options: IRequestOptions = { headers };
      if (permissionsPanelOpen) {
        dispatch(fetchFullScopesPending());
      } else {
        dispatch(fetchUrlScopesPending());
      }

      const response = await fetch(permissionsUrl, options);
      if (response.ok) {
        const scopes = await response.json();
        return permissionsPanelOpen ? dispatch(fetchFullScopesSuccess({
          scopes: { fullPermissions: scopes }
        })) :
          dispatch(fetchUrlScopesSuccess({
            scopes: { specificPermissions: scopes }
          }));
      }

      throw response;
    } catch (error) {
      return dispatch(
        fetchScopesError({
          error
        })
      );
    }
  };
}

export function getPermissionsScopeType(profile: IUser | null | undefined) {
  if (profile?.profileType === ACCOUNT_TYPE.MSA) {
    return PERMS_SCOPE.PERSONAL;
  }
  return PERMS_SCOPE.WORK;
}

export function consentToScopes(scopes: string[]) {
  return async (dispatch: Function, getState: Function) => {
    try {
      const { profile, consentedScopes }: ApplicationState = getState();
      const authResponse = await authenticationWrapper.consentToScopes(scopes);
      if (authResponse && authResponse.accessToken) {
        dispatch(getAuthTokenSuccess(true));
        const validatedScopes = validateConsentedScopes(scopes, consentedScopes, authResponse.scopes);
        dispatch(getConsentedScopesSuccess(validatedScopes));
        if (
          authResponse.account &&
          authResponse.account.localAccountId !== profile?.id
        ) {
          dispatch(getProfileInfo());
        }
        dispatch(
          setQueryResponseStatus({
            statusText: translateMessage('Success'),
            status: translateMessage('Scope consent successful'),
            ok: true,
            messageType: MessageBarType.success
          }))
        dispatch(fetchAllPrincipalGrants());
      }
    } catch (error: any) {
      const { errorCode } = error;
      dispatch(
        setQueryResponseStatus({
          statusText: translateMessage('Scope consent failed'),
          status: errorCode,
          ok: false,
          messageType: MessageBarType.error,
          hint: getConsentAuthErrorHint(errorCode)
        })
      );
    }
  };
}

const validateConsentedScopes = (scopeToBeConsented: string[], consentedScopes: string[],
  consentedResponse: string[]) => {
  if(!consentedScopes || !consentedResponse || !scopeToBeConsented) {
    return consentedResponse;
  }
  const expectedScopes = [...consentedScopes, ...scopeToBeConsented];
  if (expectedScopes.length === consentedResponse.length) {
    return consentedResponse;
  }
  return expectedScopes;
}

export function revokeScopes(permissionToRevoke: string) {
  return async (dispatch: Function, getState: Function) => {
    const { consentedScopes, profile } = getState();
    const requiredPermissions = REVOKING_PERMISSIONS_REQUIRED_SCOPES.split(' ');
    const defaultUserScopes = DEFAULT_USER_SCOPES.split(' ');
    const revokePermissionUtil = await RevokePermissionsUtil.initialize(profile.id);
    dispatch(revokeScopesPending());

    if (!consentedScopes || consentedScopes.length === 0) {
      dispatch(revokeScopesError());
      trackRevokeConsentEvent(REVOKE_STATUS.preliminaryChecksFail, permissionToRevoke);
      return;
    }

    const newScopesArray: string[] = consentedScopes.filter((scope: string) => scope !== permissionToRevoke);
    const newScopesString: string = newScopesArray.join(' ');

    try {
      const { userIsTenantAdmin, permissionBeingRevokedIsAllPrincipal, grantsPayload } = await revokePermissionUtil.
        getUserPermissionChecks({ consentedScopes, requiredPermissions, defaultUserScopes, permissionToRevoke });

      let updatedScopes;
      if (permissionBeingRevokedIsAllPrincipal && userIsTenantAdmin) {
        updatedScopes = await revokePermissionUtil.
          getUpdatedAllPrincipalPermissionGrant(grantsPayload, permissionToRevoke);
      }
      else {
        updatedScopes = await revokePermissionUtil.
          updateSinglePrincipalPermissionGrant(grantsPayload, profile, newScopesString);
      }

      if (updatedScopes.length !== newScopesArray.length) {
        throw new RevokeScopesError({
          errorText: 'Scopes not updated', statusText: 'An error occurred when unconsenting',
          status: '500', messageType: 1
        })
      }

      dispatchRevokeScopesStatus(dispatch, 'Permission revoked', 'Success', 4);
      dispatch(getConsentedScopesSuccess(updatedScopes));
      dispatch(revokeScopesSuccess());
      trackRevokeConsentEvent(REVOKE_STATUS.success, permissionToRevoke);
    }
    catch (errorMessage: any) {
      if (errorMessage instanceof RevokeScopesError || errorMessage instanceof Function) {
        const { errorText, statusText, status, messageType } = errorMessage
        dispatchRevokeScopesStatus(dispatch, statusText, status, messageType);
        const permissionObject = {
          permissionToRevoke,
          statusCode: statusText,
          status: errorText
        }
        trackRevokeConsentEvent(REVOKE_STATUS.failure, permissionObject);
      }
      else {
        const { code, message } = errorMessage;
        trackRevokeConsentEvent(REVOKE_STATUS.failure, 'Failed to revoke consent');
        dispatchRevokeScopesStatus(dispatch, message ? message : 'Failed to revoke consent', code ? code : 'Failed', 1);
      }
    }
  }
}

const dispatchRevokeScopesStatus = (dispatch: Function, statusText: string, status: string, messageType: number) => {
  dispatch(revokeScopesError());
  dispatch(
    setQueryResponseStatus({
      statusText: translateMessage(status),
      status: translateMessage(statusText),
      ok: false,
      messageType
    })
  )
}

const trackRevokeConsentEvent = (status: string, permissionObject: any) => {
  telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
    componentName: componentNames.REVOKE_PERMISSION_CONSENT_BUTTON,
    permissionObject,
    status
  });
}

export function fetchAllPrincipalGrants() {
  return async (dispatch: Function, getState: Function) => {
    try {
      const { profile, consentedScopes, scopes } = getState();
      let tenantWideGrant: IOAuthGrantPayload = scopes.data.tenantWidePermissionsGrant;
      let revokePermissionUtil = await RevokePermissionsUtil.initialize(profile.id);
      const servicePrincipalAppId = revokePermissionUtil.getServicePrincipalAppId();
      dispatch(getAllPrincipalGrantsPending(true));
      let requestCounter = 0;

      if (servicePrincipalAppId) {
        tenantWideGrant = revokePermissionUtil.getGrantsPayload();
        if(tenantWideGrant){
          if (!allScopesHaveConsentType(consentedScopes, tenantWideGrant, profile.id)){
            while (requestCounter < 10 && profile && profile.id &&
              !allScopesHaveConsentType(consentedScopes, tenantWideGrant, profile.id)) {
              requestCounter += 1;
              revokePermissionUtil = await RevokePermissionsUtil.initialize(profile.id);
              dispatch(getAllPrincipalGrantsPending(true));
              tenantWideGrant = revokePermissionUtil.getGrantsPayload();
            }
            dispatchGrantsStatus(dispatch, tenantWideGrant.value)
          }
          else{
            dispatchGrantsStatus(dispatch, tenantWideGrant.value)
          }
        }
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
  const requiredPermission = 'Directory.Read.All';
  if(consentedScopes.includes(requiredPermission)){
    const allPrincipalGrants: string[] = getAllPrincipalGrant(tenantWideGrant.value);
    const singlePrincipalGrants: string[] = getSinglePrincipalGrant(tenantWideGrant.value, id);
    const combinedPermissions = [...allPrincipalGrants, ...singlePrincipalGrants];
    return consentedScopes.every(scope => combinedPermissions.includes(scope));
  }
  return false;
}

export const getAllPrincipalGrant = (tenantWideGrant: IPermissionGrant[]): string[] => {
  if(tenantWideGrant){
    const allGrants = tenantWideGrant;
    if(allGrants){
      const principalGrant =  allGrants.find(grant => grant.consentType === 'AllPrincipals');
      if(principalGrant){
        return principalGrant.scope.split(' ');
      }
    }
  }
  return [];
}

export const getSinglePrincipalGrant = (tenantWideGrant: IPermissionGrant[], principalId: string): string[] => {
  if(tenantWideGrant && principalId){
    const allGrants = tenantWideGrant;
    const singlePrincipalGrant = allGrants.find(grant => grant.principalId === principalId);
    if(singlePrincipalGrant){
      return singlePrincipalGrant.scope.split(' ');
    }
  }
  return [];
}
