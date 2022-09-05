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
import { ACCOUNT_TYPE, DEFAULT_USER_SCOPES, PERMS_SCOPE,
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

const GRAPH_CLIENT = GraphClient.getInstance();

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
  // console.log('The permission to delete isss ', permissionToDelete);
  return async (dispatch: Function, getState: Function) => {
    // dispatch(revokePermissionPending(true));
    const { consentedScopes, profile } = getState();
    // console.log('Scopes before....! ', consentedScopes);
    const defaultScopes = DEFAULT_USER_SCOPES.split(' ');

    if (userUnconsentingToDefaultScopes(defaultScopes, permissionToDelete)) {
      dispatch(
        setQueryResponseStatus({
          statusText: translateMessage('Default scope'),
          status: translateMessage('Cannot delete default scope'),
          ok: false,
          messageType: MessageBarType.error
        })
      );
      dispatch(revokePermissionPending(false));
      return;
    }

    if (!userHasRequiredPermissions(consentedScopes)) {
      dispatch(
        setQueryResponseStatus({
          statusText: translateMessage('Unable to dissent'),
          status: translateMessage('You require the following permissions to unconsent'),
          ok: false,
          messageType: MessageBarType.error
        })
      );
      dispatch(revokePermissionPending(false));
      return;
    }

    try {
      if (consentedScopes && consentedScopes.length > 0) {
        console.log('We are here with scopes before filter as ', consentedScopes);
        const newScopesArray: string[] = (consentedScopes.filter((scope: string) => scope !== permissionToDelete));
        const newScopesString = newScopesArray.join(' ');
        console.log('Scopes after filter is  ', newScopesString);

        const servicePrincipalAppId = await getCurrentAppId();

        const permissionGrantId = await getPermissionGrantId(servicePrincipalAppId, profile.id);

        await revokePermission(permissionGrantId, newScopesString);

        const updatedScopes = await getUpdatedScopes(servicePrincipalAppId, profile.id)
        console.log('Updated scopes are ', updatedScopes)

        if (updatedScopes.length === newScopesArray.length) {
          console.log('Yaaaay!! Was successful so we are here...')
          try {
            // authenticate with updated scopes
            const authResponse = await authenticationWrapper.consentToScopes(updatedScopes);

            // do...while still WIP
            do{
              const authResponse = await authenticationWrapper.consentToScopes(updatedScopes);
              console.log('Auth scopessssss', authResponse.scopes);

              if (authResponse && authResponse.accessToken) {
                dispatch(getAuthTokenSuccess(true));
                // dispatch(getConsentedScopesSuccess(authResponse.scopes));
                dispatch(getConsentedScopesSuccess(updatedScopes));
                dispatch(revokePermissionSuccess(true));
                dispatch(
                  setQueryResponseStatus({
                    statusText: translateMessage('Success'),
                    status: translateMessage('Permission unconsented'),
                    ok: true,
                    messageType: MessageBarType.success
                  })
                );
                if (
                  authResponse.account &&
              authResponse.account.localAccountId !== profile?.id
                ) {
                  dispatch(getProfileInfo());
                }
              }
            }while(authResponse.scopes.length === updatedScopes.length);

          } catch (error: any) {
            console.log('Something went wrong on authentication: ', error);
            // dispatch(
            //   setQueryResponseStatus({
            //     statusText: translateMessage(''),
            //     status: error,
            //     ok: false,
            //     messageType: MessageBarType.error
            //   })
            // );
          }
          // await authenticationWrapper.loginWithInteraction(updatedScopes);
          // dispatch(getConsentedScopesSuccess(updatedScopes));

        }
        else {
          // dispatch(
          //   setQueryResponseStatus({
          //     statusText: translateMessage(''),
          //     status: error,
          //     ok: false,
          //     messageType: MessageBarType.error
          //   })
          // );
        }
      }
    }
    catch (error: any) {
      // we can first check if the user has the permissions to delete the permission
      const { errorCode } = error;
      console.log('Here is the error code ', errorCode)
      dispatch(revokePermissionError(error));
      dispatch(
        setQueryResponseStatus({
          statusText: translateMessage('Unable to dissent'),
          // eslint-disable-next-line max-len
          status: errorCode ? errorCode : translateMessage('An error was encountered when dissenting. Confirm that you have the right permissions'),
          ok: false,
          messageType: MessageBarType.error
        })
      );
      console.log('Unable to dissent');
    }
  }
}

const userHasRequiredPermissions = (consentedScopes: string[]) => {
  const requiredPermissions = UNCONSENTING_PERMISSIONS_REQUIRED_SCOPES.split(' ');
  return requiredPermissions.every(scope => consentedScopes.includes(scope));
}

const userUnconsentingToDefaultScopes = (currentScopes: string[], permissionToDelete: string) => {
  return currentScopes.includes(permissionToDelete);
}

const getCurrentAppId = async () => {
  const currentAppId = process.env.REACT_APP_CLIENT_ID;

  try {
    const response = await GRAPH_CLIENT.api(`/servicePrincipals?$filter=appId eq '${currentAppId}'`).get();
    return response.value[0].id;
  } catch (error: any) {
    console.log('Error: ', error);
    throw error;
  }
}
const revokePermission = async (permissionGrantId: string, newScopes: string) => {

  const oAuth2PermissionGrant = {
    scope: newScopes
  };
  try {
    await GRAPH_CLIENT.api(`/oauth2PermissionGrants/${permissionGrantId}`)
      .update(oAuth2PermissionGrant);
  } catch (error: any) {
    console.log('Error: ', error);
    throw error;
  }
}

const getPermissionGrantId = async (servicePrincipalAppId: string, principalid: string) => {

  // we need to further filter by principalId in cases where there are more than one value in returned array
  // to get principalId, run /me and get the id returned. That is the principalId of the signed in user

  try {
    const response = await GRAPH_CLIENT.api(`/oauth2PermissionGrants?$filter=clientId eq '${servicePrincipalAppId}'`)
      .get();
    if (response && response.length > 1) {
      const filteredResponse = response.filter((permissionGrant: any) => permissionGrant.principalId === principalid);
      return filteredResponse[0].id;
    }
    return response.value[0].id;
  } catch (error: any) {
    console.log('Error: ', error);
    throw error;
  }
}


// We could also have a case of two users. Filter by principal Id. Make sure to test this
const getUpdatedScopes = async (servicePrincipalAppId: string, principalid: string) => {

  try {
    const response = await GRAPH_CLIENT.api(`/oauth2PermissionGrants?$filter=clientId eq '${servicePrincipalAppId}'`)
      .get();

    if (response && response.length > 1) {
      const filteredResponse = response.filter((scope: any) => scope.principalId === principalid);
      return filteredResponse[0].scope.split(' ');
    }
    else {
      const returnedScopes = response.value[0].scope.split(' ');
      return returnedScopes;
    }
  } catch (error) {
    console.log('Error: ', error);
    throw error;
    // set status saying the user should consent to directory.read and user.read
  }
}

