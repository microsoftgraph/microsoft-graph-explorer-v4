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
import { ACCOUNT_TYPE, DEFAULT_USER_SCOPES, PERMS_SCOPE } from '../graph-constants';
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
  console.log('The permission to delete isss ', permissionToDelete);
  return async (dispatch: Function, getState: Function) => {
    dispatch(revokePermissionPending(true));
    const { consentedScopes, profile } = getState();
    const requiredPermissions = ['Directory.ReadWrite.All', 'DelegatedPermissionGrant.ReadWrite.All']; //fix this
    const defaultScopes = DEFAULT_USER_SCOPES.split(' ');

    if (userUnconsentingToDefaultScopes(defaultScopes, permissionToDelete, dispatch)) {
      console.log('Dude dissneting to default scopes')
      dispatch(revokePermissionPending(false));
      return;
    }

    // if (!userHasRequiredPermissions(requiredPermissions, consentedScopes, dispatch)) {
    //   console.log('Required permissions missing')
    //   dispatch(revokePermissionPending(false));
    //   return;
    // }
    const newScopes = consentedScopes;

    try {
      if (newScopes && newScopes.length > 0) {
        console.log('We are here with scopes before filter as ', newScopes);
        const newScopesArray: string[] = (newScopes.filter((scope: string) => scope !== permissionToDelete));
        const newScopesString = newScopesArray.join(' ');
        console.log('Scopes after filter is  ', newScopesString);

        const servicePrincipalAppId = await getCurrentAppId();

        const scopeId = await getScopeId(servicePrincipalAppId, profile.id);

        await revokePermission(scopeId, newScopesString);


        const updatedScopes = await getUpdatedScope(servicePrincipalAppId, profile.id)
        console.log('Updated scopes are ', updatedScopes)

        if (updatedScopes.length === newScopesArray.length) {
          console.log('Was successful so we are here')
          //log user out
          await authenticationWrapper.loginWithInteraction(updatedScopes); // logOut()
          dispatch(getConsentedScopesSuccess(updatedScopes));
          dispatch(revokePermissionSuccess(true));

        }
        else {
          //show an error
        }
        window.location.reload();
      }
    }
    catch (error: any) {
      // we can first check if the user has the permissions to delete the permission
      const { errorCode } = error;
      console.log('Here is the error code ', errorCode)
      if (errorCode === 'interaction_in_progress') {
        //delete this cookie
        authenticationWrapper.eraseInteractionInProgressCookie();
      }
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

const userHasRequiredPermissions = (requiredPermissions: string[],
  consentedScopes: string[], dispatch: Function) => {
  console.log('Here are the current scopes ', consentedScopes);
  const isAnyRequiredAvailable = consentedScopes.includes('Directory.Read.All') ||
    consentedScopes.includes('Directory.ReadWrite.All');
  const isRequiredPermissionAvailable = consentedScopes.includes('DelegatedPermissionGrant.ReadWrite.All')
  console.log('Required Permissions are available ', isAnyRequiredAvailable)
  return false;
}

const userUnconsentingToDefaultScopes = (currentScopes: string[], permissionToDelete: string, dispatch: Function) => {
  const unconsentingToDefaultScopes = currentScopes.includes(permissionToDelete);
  if (unconsentingToDefaultScopes) {
    dispatch(
      setQueryResponseStatus({
        statusText: translateMessage('Default scope'),
        status: translateMessage('Cannot delete default scope'),
        ok: false,
        messageType: MessageBarType.error
      })
    );
    return true;
  }
  return false;
}

const getCurrentAppId = async () => {
  const currentAppId = process.env.REACT_APP_CLIENT_ID;
  const graphClient = GraphClient.getInstance();

  try {
    const response = await graphClient.api(`/servicePrincipals?$filter=appId eq '${currentAppId}'`).get();
    return response.value[0].id;
  } catch (error: any) {
    console.log('Error: ', error);
    throw error;
  }
}
const revokePermission = async (scopeId: string, newScopes: string) => {
  const graphClient = GraphClient.getInstance();

  const oAuth2PermissionGrant = {
    scope: newScopes
  };
  try {
    await graphClient.api(`/oauth2PermissionGrants/${scopeId}`)
      .update(oAuth2PermissionGrant);
  } catch (error: any) {
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
    if (response && response.length > 0) {
      const filteredResponse = response.filter((scope: any) => scope.principalId === principalid);
      return filteredResponse[0].id;
    }
    return response.value[0].id;
  } catch (error: any) {
    console.log('Error: ', error);
    throw error;
  }
}


// We could also have a case of two users. Filter by principal Id. Make sure to test this
const getUpdatedScope = async (servicePrincipalAppId: string, principalid: string) => {
  const graphClient = GraphClient.getInstance();

  try {
    const response = await graphClient.api(`/oauth2PermissionGrants?$filter=clientId eq '${servicePrincipalAppId}'`)
      .get();

    if (response && response.length > 0) {
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