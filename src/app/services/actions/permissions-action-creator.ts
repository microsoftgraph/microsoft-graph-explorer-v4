import { MessageBarType } from '@fluentui/react';

import { geLocale } from '../../../appLocale';
import { authenticationWrapper } from '../../../modules/authentication';
import { IAction } from '../../../types/action';
import { IUser } from '../../../types/profile';
import { IRequestOptions } from '../../../types/request';
import { IRootState } from '../../../types/root';
import { sanitizeQueryUrl } from '../../utils/query-url-sanitization';
import { parseSampleUrl } from '../../utils/sample-url-generation';
import { translateMessage } from '../../utils/translate-messages';
import { getConsentAuthErrorHint } from '../../../modules/authentication/authentication-error-hints';
import {
  ACCOUNT_TYPE, DEFAULT_USER_SCOPES, GRAPH_URL, PERMS_SCOPE,
  REVOKING_PERMISSIONS_REQUIRED_SCOPES, AZURE_ADMIN_ROLES_AND_ACTIONS
} from '../graph-constants';
import {
  FETCH_SCOPES_ERROR,
  FETCH_FULL_SCOPES_PENDING,
  FETCH_URL_SCOPES_PENDING,
  FETCH_FULL_SCOPES_SUCCESS,
  FETCH_URL_SCOPES_SUCCESS
} from '../redux-constants';
import {
  getAuthTokenSuccess,
  getConsentedScopesSuccess
} from './auth-action-creators';
import { getProfileInfo } from './profile-action-creators';
import { setQueryResponseStatus } from './query-status-action-creator';
import { IQuery } from '../../../types/query-runner';
import { makeGraphRequest, parseResponse } from './query-action-creator-util';
import { componentNames, eventTypes, telemetry } from '../../../telemetry';
import { IPermission, IScopes } from '../../../types/permissions';

export function fetchFullScopesSuccess(response: object): IAction {
  return {
    type: FETCH_FULL_SCOPES_SUCCESS,
    response
  };
}

export function fetchUrlScopesSuccess(response: Object): IAction {
  return {
    type: FETCH_URL_SCOPES_SUCCESS,
    response
  }
}

export function fetchScopesPending(type: string): any {
  return { type };
}

export function fetchScopesError(response: object): IAction {
  return {
    type: FETCH_SCOPES_ERROR,
    response
  };
}

export function fetchScopes(): Function {
  return async (dispatch: Function, getState: Function) => {
    try {
      const { devxApi, permissionsPanelOpen, profile, sampleQuery: query }: IRootState = getState();
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

      dispatch(fetchScopesPending(permissionsPanelOpen ? FETCH_FULL_SCOPES_PENDING : FETCH_URL_SCOPES_PENDING));

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

export function consentToScopes(scopes: string[]): Function {
  return async (dispatch: Function, getState: Function) => {
    try {
      const { profile }: IRootState = getState();
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

const getQuery: IQuery = {
  selectedVerb: 'GET',
  sampleHeaders: [],
  selectedVersion: '',
  sampleUrl: ''
};

const patchQuery: IQuery = {
  selectedVerb: 'PATCH',
  sampleHeaders: [],
  selectedVersion: 'v1.0',
  sampleUrl: ''
}

interface IPreliminaryChecksObject {
  defaultUserScopes: string[];
  requiredPermissions: string[];
  consentedScopes: string[];
  permissionToRevoke: string;
  scopes?: any;
}

enum REVOKE_STATUS {
  success = 'success',
  failure = 'failure',
  preliminaryChecksFail = 'preliminaryChecksFail'
}

export function revokeScopes(permissionToRevoke: string): Function {
  return async (dispatch: Function, getState: Function) => {
    const { consentedScopes, profile, scopes, sampleQuery } = getState();
    const requiredPermissions = REVOKING_PERMISSIONS_REQUIRED_SCOPES.split(' ');
    const defaultUserScopes = DEFAULT_USER_SCOPES.split(' ');

    if (!consentedScopes && consentedScopes.length === 0) {
      trackRevokeConsentEvent(REVOKE_STATUS.preliminaryChecksFail, permissionToRevoke);
      return;
    }
    const newScopesArray: string[] = (consentedScopes.filter((scope: string) => scope !== permissionToRevoke));
    const newScopesString: string = newScopesArray.join(' ');

    const preliminaryChecksObject: IPreliminaryChecksObject = {
      defaultUserScopes, requiredPermissions, consentedScopes, permissionToRevoke, scopes
    }

    const hasPreliminaryCheckPassed = await preliminaryChecksSuccess(dispatch, preliminaryChecksObject);

    if (!hasPreliminaryCheckPassed) {
      trackRevokeConsentEvent(REVOKE_STATUS.preliminaryChecksFail, permissionToRevoke);
      return;
    }
    try {
      const servicePrincipalAppId = await getServicePrincipalId(consentedScopes);
      const grantsPayload = await getPermissionGrant([],servicePrincipalAppId);
      const signedInGrant = getSignInPrincipalGrant(grantsPayload, profile.id);
      if(!permissionToRevokeInGrant(signedInGrant, permissionToRevoke)){
        dispatchPermissionInAllPrincipal(dispatch);
        return;
      }
      const userRevokingAdminScopes = await userRevokingAdminGrantedScopes(grantsPayload, sampleQuery);
      if(userRevokingAdminScopes){
        dispatchErrorStatus(dispatch, '200', 'You cannot revoke admin consented scopes', null);
        return;
      }
      const updatedScopes = await updatePermissionGrant(grantsPayload, profile, newScopesString);
      if (updatedScopes.length !== newScopesArray.length) {
        return;
      }
      const authResponse = await getNewAuthObject(updatedScopes);
      if (authResponse && authResponse.accessToken) {
        dispatchAuthResponseStatus(dispatch, authResponse, profile);
      }
      trackRevokeConsentEvent(REVOKE_STATUS.success, permissionToRevoke);
    }
    catch (error: any) {
      const { statusCode, code } = error;
      dispatchErrorStatus(dispatch, statusCode, code, error);
      const permissionObject = {
        permissionToRevoke,
        statusCode,
        code
      }
      trackRevokeConsentEvent(REVOKE_STATUS.failure, permissionObject);
    }
  }
}

const preliminaryChecksSuccess = async (dispatch: Function, preliminaryChecksObject: IPreliminaryChecksObject) => {
  const { defaultUserScopes, requiredPermissions, consentedScopes, permissionToRevoke, scopes }
   = preliminaryChecksObject
  if (userRevokingDefaultScopes(defaultUserScopes, permissionToRevoke)) {
    dispatch(
      setQueryResponseStatus({
        statusText: translateMessage('Default scope'),
        status: translateMessage('Cannot delete default scope'),
        ok: false,
        messageType: MessageBarType.error
      })
    );
    return false;
  }

  if (!userHasRequiredPermissions(requiredPermissions, consentedScopes)) {
    dispatch(
      setQueryResponseStatus({
        statusText: translateMessage('Unable to dissent'),
        status: translateMessage('You require the following permissions to revoke'),
        ok: false,
        messageType: MessageBarType.error
      })
    );
    return false;
  }

  // const userRevokingPreconsentedScopes = await userRevokingAdminGrantedScopes(scopes, permissionToRevoke);
  // if(userRevokingPreconsentedScopes) {
  //   dispatch(
  //     setQueryResponseStatus({
  //       statusText: translateMessage('Unable to dissent'),
  //       status: translateMessage('You are dissenting to an admin pre-consented permission'),
  //       ok: false,
  //       messageType: MessageBarType.error
  //     })
  //   );
  //   return false;
  // }
  return true;
}

const userRevokingAdminGrantedScopes = async (grantsPayload: any, sampleQuery: IQuery) => {
  const allPrincipalGrants = grantsPayload.value.find((grant: any) =>
    grant.consentType.toLowerCase() === 'AllPrincipals'.toLowerCase());
  console.log('Here are the allprincipal grants ', allPrincipalGrants);
  if(allPrincipalGrants){
    const signedInUserGroups = await getSignedInUserGroups();
    if(!signedInUserGroups || (signedInUserGroups && signedInUserGroups.length === 0)){
      return false;
    }
    const signedInUserIsTenantAdmin = isSignedInUserAdmin(signedInUserGroups.value);
    if(!signedInUserIsTenantAdmin){ return true }
    if(!signedInAdminHasRightsOverUrl(signedInUserGroups, sampleQuery)){
      return true;
    }
  }
  return false;
}

const getSignedInUserGroups = async () => {
  const tenantAdminQuery = {...getQuery};
  tenantAdminQuery.sampleUrl = `${GRAPH_URL}/v1.0/me/memberOf`;
  const userGroups = await makePermissionsRequest([], tenantAdminQuery);
  return userGroups;
}

const isSignedInUserAdmin = (signedInUserGroups: []): boolean => {
  return signedInUserGroups.some((value : any) => value['@odata.type'] === '#microsoft.graph.directoryRole')
}

const signedInAdminHasRightsOverUrl = async (signedInUserGroups: any, sampleQuery: IQuery): Promise<boolean> => {
  // eslint-disable-next-line max-len
  const adminRoleGroup = signedInUserGroups.find((value : any) => value['@odata.type'] === '#microsoft.graph.directoryRole');
  if(adminRoleGroup){
    const adminRole = adminRoleGroup.displayName;
    const adminRolesAndActions = Object.entries(AZURE_ADMIN_ROLES_AND_ACTIONS);
    const signedInAdminRole = adminRolesAndActions.find((role: any) => role[0].toLowerCase() ===
    adminRole.toLowerCase());
    const signedInAdminRoleActions = signedInAdminRole![1];
    const { requestUrl } = parseSampleUrl(sampleQuery.sampleUrl);
    const signedInAdminHasRights = signedInAdminRoleActions.some((action: string) => {
      return requestUrl.includes(action);
    })
    if(signedInAdminHasRights){ return true}
  }
  return false
}

const userHasRequiredPermissions = (requiredPermissions: string[],
  consentedScopes: string[]) => {
  return requiredPermissions.every(scope => consentedScopes.includes(scope));
}

const userRevokingDefaultScopes = (currentScopes: string[], permissionToDelete: string) => {
  return currentScopes.includes(permissionToDelete);
}


const makePermissionsRequest = async (scopes: string[], query: IQuery) => {
  const respHeaders: any = {};
  const response = await makeGraphRequest(scopes)(query);
  return parseResponse(response, respHeaders);
}

const getNewAuthObject = async (updatedScopes: string[]) => {
  let retries = 2;
  await authenticationWrapper.logOut();
  let authResponse = await authenticationWrapper.consentToScopes(updatedScopes);

  while (retries > 0 && authResponse && authResponse.scopes.length !== updatedScopes.length) {
    await authenticationWrapper.logOut();
    authResponse = await authenticationWrapper.consentToScopes(updatedScopes);
    retries--;
  }

  return authResponse;
}

const updatePermissionGrant = async (grantsPayload: any, profile: any, newScopesString: string) => {
  const servicePrincipalAppId = await getServicePrincipalId([]);
  const permissionGrantId = getSignInPrincipalGrant(grantsPayload, profile.id).id;
  await revokePermission(permissionGrantId, newScopesString);
  const response = await getPermissionGrant([], servicePrincipalAppId);
  const principalGrant = getSignInPrincipalGrant(response, profile.id);
  const updatedScopes = principalGrant.scope.split(' ');
  return updatedScopes;
}

const getSignInPrincipalGrant = (grantsPayload: any, userId: string) => {
  if (grantsPayload && grantsPayload.value.length > 1) {
    const filteredResponse = grantsPayload.value.find((permissionGrant: any) =>
      permissionGrant.principalId === userId);
    return filteredResponse;
  }
  return grantsPayload.value[0];
}

const getPermissionGrant = async (scopes: string[], servicePrincipalAppId: string) => {
  getQuery.sampleUrl = `${GRAPH_URL}/v1.0/oauth2PermissionGrants?$filter=clientId eq '${servicePrincipalAppId}'`;
  const response = await makePermissionsRequest(scopes, getQuery);
  return response;
}
const permissionToRevokeInGrant = (response: any, permissionToRevoke: string) => {
  return response.scope.split(' ').includes(permissionToRevoke);
}

const getServicePrincipalId = async (scopes: string[]) => {
  const currentAppId = process.env.REACT_APP_CLIENT_ID;
  getQuery.sampleUrl = `${GRAPH_URL}/v1.0/servicePrincipals?$filter=appId eq '${currentAppId}'`;
  const response = await makePermissionsRequest(scopes, getQuery);
  return response.value[0].id;
}

const revokePermission = async (permissionGrantId: string, newScopes: string) => {
  const oAuth2PermissionGrant = {
    scope: newScopes
  };
  patchQuery.sampleBody = JSON.stringify(oAuth2PermissionGrant);
  patchQuery.sampleUrl = `${GRAPH_URL}/v1.0/oauth2PermissionGrants/${permissionGrantId}`;
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await makePermissionsRequest([], patchQuery);
    const { error } = response;
    if (error) {
      throw error;
    }
  }
  catch (error: any) {
    throw error;
  }
}


const getAllPrincipalGrants = async (scopes: string[] = [], servicePrincipalAppId: string) => {
  getQuery.sampleUrl = `${GRAPH_URL}/v1.0/oauth2PermissionGrants?$filter=clientId eq '${servicePrincipalAppId}'`;
  const response = await makePermissionsRequest(scopes, getQuery);
  console.log('Here is the response', response);

  // Return value whose consentType property is AllPrincipals
  const allPrincipalConsentType = response.value.find((permissionGrant: any) => {
    return permissionGrant.consentType === 'AllPrincipals';
  })

  console.log('Here is the allPrincipal ', allPrincipalConsentType);
  return allPrincipalConsentType?.scopes;

}

const dispatchErrorStatus = (dispatch: Function, statusCode: string, code: string, error: any) => {
  dispatch(
    setQueryResponseStatus({
      statusText: statusCode && code ? (statusCode + ' ' + code) : translateMessage('Unable to dissent'),
      status: error ? error.message : translateMessage('An error occurred when dissenting'),
      ok: false,
      messageType: MessageBarType.error
    })
  );
}

const dispatchAuthResponseStatus = (dispatch: Function, authResponse: any, profile: any) => {
  if (authResponse.account && authResponse.account.localAccountId !== profile?.id) {
    dispatch(getProfileInfo());
  }
  dispatch(getAuthTokenSuccess(true));
  dispatch(getConsentedScopesSuccess(authResponse.scopes));
  dispatch(
    setQueryResponseStatus({
      statusText: translateMessage('Success'),
      status: translateMessage('Permission revoked'),
      ok: true,
      messageType: MessageBarType.success
    })
  );
}

const dispatchPermissionInAllPrincipal = (dispatch: Function) => {
  dispatch(
    setQueryResponseStatus({
      statusText: translateMessage('Unable to dissent'),
      status: translateMessage('The permission you are revoking is in AllPrincipals'),
      ok: true,
      messageType: MessageBarType.info
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