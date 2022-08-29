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
import { ACCOUNT_TYPE, PERMS_SCOPE } from '../graph-constants';
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
    dispatch(revokePermissionPending(true));
    const { consentedScopes, profile } = getState();
    let newScopes = consentedScopes;
    try {
      if (newScopes && newScopes.length > 0) {
        newScopes = (newScopes.filter((scope: string) => scope !== permissionToDelete))
          .join(' ');
        const servicePrincipalAppId = await getCurrentAppId();
        const scopeId = await getScopeId(servicePrincipalAppId, profile.id);

        // more than one person may have consented to the app and we might have the same principal id more than once.
        // so we need to filter by principal id

        await revokePermission(scopeId, newScopes);
        const updatedScope = await getUpdatedScope(servicePrincipalAppId);
        dispatch(getConsentedScopesSuccess(updatedScope));
        dispatch(revokePermissionSuccess(true));
        authenticationWrapper.consentToScopes(updatedScope).then(response => {
          console.log('Here is the response', response);
        });
      }
    }
    catch (error: any) {
      dispatch(revokePermissionError(error))
      console.log('Unable to dissent');
    }
  }
}

const getCurrentAppId = async () => {
  const currentAppId = process.env.REACT_APP_CLIENT_ID;
  const graphClient = GraphClient.getInstance();

  try {
    const response = await graphClient.api(`/servicePrincipals?$filter=appId eq '${currentAppId}'`).get();
    console.log('Service peincipal id is ', response.value[0].id);
    return response.value[0].id;
  } catch (error) {
    console.log('Error: ', error);
    throw error;
  }
}

const getScopeId = async (servicePrincipalAppId: string, principalid: string) => {
  const graphClient = GraphClient.getInstance();

  // we need to further filter by principalId in cases where there are more than one value in returned array
  // to get principalId, run /me and get the id returned. That is the principalId of the signed in user

  try {
    const response = await graphClient.api(`/oauth2PermissionGrants?$filter=clientId eq '${servicePrincipalAppId}'`)
      .get();
    console.log('Scope id is ', response.value[0].id);
    if (response && response.length > 0) {
      // filter by principalId
      const filteredResponse = response.filter((scope: any) => scope.principalId === principalid);
      return filteredResponse[0].id;
    }
    return response.value[0].id;
  } catch (error) {
    console.log('Error: ', error);
    throw error;
  }
}

const revokePermission = async (scopeId: string, newScopes: string) => {
  const graphClient = GraphClient.getInstance();

  // const requestBody = { scope: newScopes };
  const oAuth2PermissionGrant = {
    scope: newScopes
  };
  try {
    const response = await graphClient.api(`/oauth2PermissionGrants/${scopeId}`)
      .update(oAuth2PermissionGrant);
    console.log('Here is the response after patch ', response);
  } catch (error) {
    console.log('Error: ', error);
    throw error;
  }
}

const getUpdatedScope = async (servicePrincipalAppId: string) => {
  const graphClient = GraphClient.getInstance();

  try {
    const response = await graphClient.api(`/oauth2PermissionGrants?$filter=clientId eq '${servicePrincipalAppId}'`)
      .get();
    console.log('Scope id is ', response.value[0].scope); //convert this to array
    const returnedScopes = response.value[0].scope.split(' ');
    console.log('Here are the returned scopes ', returnedScopes)
    return returnedScopes;
  } catch (error) {
    console.log('Error: ', error);
    throw error;
    // set status saying the user should consent to directory.read and user.read
  }
}