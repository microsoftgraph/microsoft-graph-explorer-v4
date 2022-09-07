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
  UNCONSENTING_PERMISSIONS_REQUIRED_SCOPES
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

      const authResponse = await getNewAuthObject(updatedScopes);

      if (authResponse && authResponse.accessToken) {
        dispatch(getAuthTokenSuccess(true));
        dispatch(getConsentedScopesSuccess(authResponse.scopes));
        dispatch(
          setQueryResponseStatus({
            statusText: translateMessage('Success'),
            status: translateMessage('Permission unconsented'),
            ok: true,
            messageType: MessageBarType.success
          })
        );
        if (authResponse.account && authResponse.account.localAccountId !== profile?.id) {
          dispatch(getProfileInfo());
        }
      }

    }
    catch (error: any) {
      const { statusCode, code } = error;
      dispatch(
        setQueryResponseStatus({
          statusText: statusCode && code ? (statusCode + ' ' + code) : translateMessage('Unable to dissent'),
          status: error ? error.message : translateMessage('An error occurred when dissenting'),
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
  const oAuth2PermissionGrant = {
    scope: newScopes
  };
  const graphClient = GraphClient.getInstance();

  await graphClient.api(`/oauth2PermissionGrants/${permissionGrantId}`)
    .update(oAuth2PermissionGrant);
}

const getPermissionGrant = async (scopes: string[], servicePrincipalAppId: string, principalid: string) => {
  getQuery.sampleUrl = `${GRAPH_URL}/v1.0/oauth2PermissionGrants?$filter=clientId eq '${servicePrincipalAppId}'`;
  const response = await getPermissionResponse(scopes, getQuery);

  if (response && response.value.length > 1) {
    const filteredResponse = response.value.filter((permissionGrant: any) =>
      permissionGrant.principalId === principalid);
    return filteredResponse[0];
  }
  return response.value[0];
}

const getPermissionResponse = async (scopes: string[], query: IQuery) => {
  const respHeaders: any = {};
  const response = await makeGraphRequest(scopes)(query);
  return parseResponse(response, respHeaders);
}

const getNewAuthObject = async (updatedScopes: string[]) => {
  let retries = 2;
  await authenticationWrapper.logOut();
  let authResponse = await authenticationWrapper.consentToScopes(updatedScopes);

  if (authResponse && authResponse.scopes.length === updatedScopes.length) {
    return authResponse;
  }
  else{
    while(retries > 0 && authResponse && authResponse.scopes.length !== updatedScopes.length){
      await authenticationWrapper.logOut();
      authResponse = await authenticationWrapper.consentToScopes(updatedScopes);
      retries --;
    }
  }
  return authResponse;
}