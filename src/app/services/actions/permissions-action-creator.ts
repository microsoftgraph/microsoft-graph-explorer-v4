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
  REVOKE_SCOPES_SUCCESS, REVOKE_SCOPES_ERROR
} from '../redux-constants';
import {
  getAuthTokenSuccess,
  getConsentedScopesSuccess
} from './auth-action-creators';
import { getProfileInfo } from './profile-action-creators';
import { setQueryResponseStatus } from './query-status-action-creator';
import { IOAuthGrantPayload } from '../../../types/permissions';
import { RevokePermissionsUtil } from './permissions-action-creator.util';
import { componentNames, eventTypes, telemetry } from '../../../telemetry';
import { RevokeScopesError } from '../../utils/error-utils/RevokeScopesErrorHandler';

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

export function revokeScopesPending(): any {
  return {
    type: REVOKE_SCOPES_PENDING
  }
}

export function revokeScopesSuccess(): any{
  return {
    type: REVOKE_SCOPES_SUCCESS
  }
}

export function revokeScopesError(): any{
  return {
    type: REVOKE_SCOPES_ERROR
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
      const { profile }: ApplicationState = getState();
      const authResponse = await authenticationWrapper.consentToScopes(scopes);
      if (authResponse && authResponse.accessToken) {
        dispatch(getAuthTokenSuccess(true));
        dispatch(getConsentedScopesSuccess(authResponse.scopes));
        if (
          authResponse.account &&
          authResponse.account.localAccountId !== profile?.id
        ) {
          dispatch(getProfileInfo());
        }
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

interface IPreliminaryChecksObject {
  defaultUserScopes: string[];
  requiredPermissions: string[];
  consentedScopes: string[];
  permissionToRevoke: string;
  grantsPayload?: IOAuthGrantPayload;
}

enum REVOKE_STATUS {
  success = 'success',
  failure = 'failure',
  preliminaryChecksFail = 'preliminaryChecksFail',
  allPrincipalScope = 'allPrincipalScope'
}

export function revokeScopes(permissionToRevoke: string) {
  return async (dispatch: Function, getState: Function) => {
    const { consentedScopes, profile } = getState();
    const requiredPermissions = REVOKING_PERMISSIONS_REQUIRED_SCOPES.split(' ');
    const defaultUserScopes = DEFAULT_USER_SCOPES.split(' ');
    const revokePermissionUtil = await RevokePermissionsUtil.initialize(profile.id);
    dispatch(revokeScopesPending());

    if (!consentedScopes && consentedScopes.length === 0) {
      trackRevokeConsentEvent(REVOKE_STATUS.preliminaryChecksFail, permissionToRevoke);
      return;
    }
    const newScopesArray: string[] = consentedScopes.filter((scope: string) => scope !== permissionToRevoke);
    const newScopesString: string = newScopesArray.join(' ');


    try {
      const grantsPayload = revokePermissionUtil.getGrantsPayload();
      const signedInGrant = revokePermissionUtil.getSignedInGrant();
      const preliminaryChecksObject: IPreliminaryChecksObject = {
        defaultUserScopes, requiredPermissions, consentedScopes, permissionToRevoke, grantsPayload
      }
      const hasPreliminaryCheckPassed = await revokePermissionUtil.
        preliminaryChecksSuccess(dispatch, preliminaryChecksObject);

      if (!hasPreliminaryCheckPassed) {
        trackRevokeConsentEvent(REVOKE_STATUS.preliminaryChecksFail, permissionToRevoke);
        throw new RevokeScopesError({errorText: 'Preliminary checks failed', statusText: 'Cannot delete default scope',
          status: '400', messageType: 1})
      }
      const userIsTenantAdmin = await revokePermissionUtil.isSignedInUserTenantAdmin();
      const permissionBeingRevokedIsAllPrincipal = revokePermissionUtil.
        userRevokingAdminGrantedScopes(grantsPayload, permissionToRevoke);

      if(permissionBeingRevokedIsAllPrincipal && !userIsTenantAdmin) {
        trackRevokeConsentEvent(REVOKE_STATUS.allPrincipalScope, permissionToRevoke);
        throw new RevokeScopesError({errorText:'Revoking admin granted scopes',
          statusText: 'You are dissenting to an admin pre-consented permission',
          status: 'Revoking admin granted scopes',
          messageType: 1})
      }

      let updatedScopes;
      if(permissionBeingRevokedIsAllPrincipal && userIsTenantAdmin) {
        updatedScopes = await revokePermissionUtil.updateAllPrincipalPermissionGrant(grantsPayload, permissionToRevoke);
      }
      else if(!revokePermissionUtil.permissionToRevokeInGrant(signedInGrant, permissionToRevoke) && userIsTenantAdmin){
        trackRevokeConsentEvent(REVOKE_STATUS.allPrincipalScope, permissionToRevoke);
        throw new RevokeScopesError({errorText: 'Permission not found',
          statusText: 'You cannot revoke permissions not in your scopes', status: 'Permission not found',
          messageType: 1})
      }
      else{
        updatedScopes = await revokePermissionUtil.
          updateSinglePrincipalPermissionGrant(grantsPayload, profile, newScopesString);
        if (updatedScopes.length !== newScopesArray.length) {
          throw new RevokeScopesError({errorText: 'Scopes not updated',statusText: 'Scopes not updated',
            status: '500', messageType: 1})
        }
      }
      dispatchRevokeScopesStatus(dispatch, 'Permission revoked', 'Success', 4);
      dispatch(getConsentedScopesSuccess(updatedScopes));
      dispatch(revokeScopesSuccess());
      trackRevokeConsentEvent(REVOKE_STATUS.success, permissionToRevoke);
    }
    catch (errorMessage: any) {
      if(errorMessage instanceof RevokeScopesError) {
        const { errorText, statusText, status, messageType } = errorMessage
        dispatchRevokeScopesStatus(dispatch, statusText, status, messageType);
        dispatch(revokeScopesError());
        const permissionObject = {
          permissionToRevoke,
          statusCode: statusText,
          status: errorText
        }
        trackRevokeConsentEvent(REVOKE_STATUS.failure, permissionObject);
      }
      else{
        trackRevokeConsentEvent(REVOKE_STATUS.failure, 'Failed to revoke consent');
        dispatchRevokeScopesStatus(dispatch, 'Failed to revoke consent', 'Failed', 1);
      }
    }
  }
}

const dispatchRevokeScopesStatus = (dispatch: Function, status: string, statusText: string, messageType: number) => {
  dispatch(
    setQueryResponseStatus({
      statusText: translateMessage(statusText),
      status: translateMessage(status),
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
    try{
      const { profile } = getState();
      const revokePermissionUtil = await RevokePermissionsUtil.initialize(profile.id);
      const servicePrincipalAppId = revokePermissionUtil.getServicePrincipalAppId();
      if(servicePrincipalAppId){
        const tenantWideGrant = await revokePermissionUtil.getGrantsPayload();
        dispatch(getAllPrincipalGrantsSuccess(tenantWideGrant.value));
      }
      else{
        dispatch(getAllPrincipalGrantsError({}));
      }
    }catch(error: any){
      dispatch(getAllPrincipalGrantsError(error));
    }
  }
}