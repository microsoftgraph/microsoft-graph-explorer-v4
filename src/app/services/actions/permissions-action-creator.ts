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
import { ACCOUNT_TYPE, DEFAULT_USER_SCOPES, GRAPH_URL, PERMS_SCOPE,
  UNCONSENTING_PERMISSIONS_REQUIRED_SCOPES } from '../graph-constants';
import {
  FETCH_SCOPES_ERROR,
  FETCH_FULL_SCOPES_PENDING,
  FETCH_URL_SCOPES_PENDING,
  FETCH_FULL_SCOPES_SUCCESS,
  FETCH_URL_SCOPES_SUCCESS,
  REVOKE_PERMISSION_PENDING,
  REVOKE_PERMISSION_SUCCESS,
  REVOKE_PERMISSION_ERROR
} from '../redux-constants';
import {
  getAuthTokenSuccess,
  getConsentedScopesSuccess
} from './auth-action-creators';
import { getProfileInfo } from './profile-action-creators';
import { setQueryResponseStatus } from './query-status-action-creator';
import { GraphClient } from '../graph-client';
import { IQuery } from '../../../types/query-runner';
import { makeGraphRequest, parseResponse } from './query-action-creator-util';

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

export function revokePermissionPending(response: boolean): any {
  return {
    type: REVOKE_PERMISSION_PENDING,
    response
  }
}

export function revokePermissionSuccess(response: boolean): any {
  return {
    type: REVOKE_PERMISSION_SUCCESS,
    response
  }
}

export function revokePermissionError(response: object): any {
  return {
    type: REVOKE_PERMISSION_ERROR,
    response
  }
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

export function unconsentToScopes(permissionToDelete: string): Function {
  return async (dispatch: Function, getState: Function) => {
    const { consentedScopes, profile } = getState();
    const requiredPermissions = UNCONSENTING_PERMISSIONS_REQUIRED_SCOPES.split(' ');
    const defaultScopes = DEFAULT_USER_SCOPES.split(' ');
    let response = null;

    if (userUnconsentingToDefaultScopes(defaultScopes, permissionToDelete)) {
      dispatch(revokePermissionPending(false));
      dispatch(
        setQueryResponseStatus({
          statusText: translateMessage('Default scope'),
          status: translateMessage('Cannot delete default scope'),
          ok: false,
          messageType: MessageBarType.error
        })
      );
      return;
    }

    if (!userHasRequiredPermissions(requiredPermissions, consentedScopes)) {
      dispatch(revokePermissionPending(false));
      dispatch(
        setQueryResponseStatus({
          statusText: translateMessage('Unable to dissent'),
          status: translateMessage('You require the following permissions to unconsent'),
          ok: false,
          messageType: MessageBarType.error
        })
      );
      return;
    }

    try {
      if (!consentedScopes && consentedScopes.length < 1) {
        return;
      }

      const newScopesArray: string[] = (consentedScopes.filter((scope: string) => scope !== permissionToDelete));
      const newScopesString = newScopesArray.join(' ');

      const servicePrincipalAppId = await getCurrentAppId(consentedScopes);
      response = await getPermissionGrant(consentedScopes, servicePrincipalAppId, profile.id);
      const permissionGrantId = response.id;

      await revokePermission(consentedScopes, permissionGrantId, newScopesString);

      response = await getPermissionGrant(consentedScopes, servicePrincipalAppId, profile.id);
      const updatedScopes = response.scope.split(' ');

      if (updatedScopes.length !== newScopesArray.length) {
        return;
      }

      const authResponse = await getAuthResponse(updatedScopes);

      if (authResponse && authResponse.accessToken) {
        dispatch(getAuthTokenSuccess(true));
        dispatch(getConsentedScopesSuccess(authResponse.scopes));
        dispatch(revokePermissionSuccess(true));
        dispatch(
          setQueryResponseStatus({
            statusText: translateMessage('Success'),
            status: translateMessage('Permission unconsented'),
            ok: true,
            messageType: MessageBarType.success
          })
        );
        if (authResponse.account &&authResponse.account.localAccountId !== profile?.id) {
          dispatch(getProfileInfo());
        }
      }

    }
    catch (error: any) {
      dispatch(revokePermissionError(error));
      dispatch(
        setQueryResponseStatus({
          statusText: translateMessage('Unable to dissent'),
          // eslint-disable-next-line max-len
          status: error ? error : translateMessage('An error was encountered when dissenting. Confirm that you have the right permissions'),
          ok: false,
          messageType: MessageBarType.error
        })
      );
    }
  }
}

const getQuery: IQuery = {
  selectedVerb: 'GET',
  sampleHeaders: [
    {
      name: 'Cache-Control',
      value: 'no-cache'
    }
  ],
  selectedVersion: '',
  sampleUrl: ''
};

const patchQuery: IQuery = {
  selectedVerb: 'PATCH',
  sampleHeaders: [
    {
      name: 'Cache-Control',
      value: 'no-cache'
    }
  ],
  selectedVersion: '',
  sampleUrl: ''
};

const userHasRequiredPermissions = (requiredPermissions: string[],
  consentedScopes: string[]) => {
  return requiredPermissions.every(scope => consentedScopes.includes(scope));
}

const userUnconsentingToDefaultScopes = (currentScopes: string[], permissionToDelete: string) => {
  return currentScopes.includes(permissionToDelete);
}

const getCurrentAppId = async (scopes: string[]) => {
  const currentAppId = process.env.REACT_APP_CLIENT_ID;
  getQuery.sampleUrl = `${GRAPH_URL}/v1.0/servicePrincipals?$filter=appId eq '${currentAppId}'`;
  const response = await getPermissionResponse(scopes, getQuery);
  return response.value[0].id;
}
const revokePermission = async (oldScopes: string[], permissionGrantId: string, newScopes: string) => {
  patchQuery.sampleUrl = `${GRAPH_URL}/v1.0/oauth2PermissionGrants/${permissionGrantId}`;
  patchQuery.sampleBody = JSON.stringify({
    scope: newScopes
  });
  await getPermissionResponse(oldScopes, patchQuery);
}

const getPermissionGrant = async (scopes: string[], servicePrincipalAppId: string, principalid: string) => {
  getQuery.sampleUrl = `${GRAPH_URL}/v1.0/oauth2PermissionGrants?$filter=clientId eq '${servicePrincipalAppId}'`;
  const response = await getPermissionResponse(scopes, getQuery);

  if (response && response.length > 1) {
    const filteredResponse = response.filter((permissionGrant: any) => permissionGrant.principalId === principalid);
    return filteredResponse[0];
  }
  return response.value[0];
}

const getPermissionResponse = async (scopes: string[], query: IQuery) => {
  const respHeaders: any = {};
  const response = await makeGraphRequest(scopes)(query);
  return await parseResponse(response, respHeaders);
}

const getAuthResponse = async (updatedScopes: string[]) => {
  let authResponse = await authenticationWrapper.consentToScopes(updatedScopes);

  while(authResponse.scopes.length !== updatedScopes.length){
    authResponse = await authenticationWrapper.consentToScopes(updatedScopes);
  }

  return parseResponse(authResponse);
}

