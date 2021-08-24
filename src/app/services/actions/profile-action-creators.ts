import { IUser } from '../../../types/profile';
import { IQuery } from '../../../types/query-runner';
import { BETA_USER_INFO_URL, DEFAULT_USER_SCOPES, USER_INFO_URL, USER_PICTURE_URL } from '../graph-constants';
import { PROFILE_REQUEST_ERROR, PROFILE_REQUEST_SUCCESS } from '../redux-constants';
import { makeRequest, parseResponse } from './query-action-creator-util';
import { queryRunningStatus } from './query-loading-action-creators';

export function profileRequestSuccess(response: object): any {
  return {
    type: PROFILE_REQUEST_SUCCESS,
    response,
  };
}

export function profileRequestError(response: object): any {
  return {
    type: PROFILE_REQUEST_ERROR,
    response,
  };
}

export function getProfileInfo(): Function {
  return async (dispatch: Function) => {
    const respHeaders: any = {};
    const query: IQuery = {
      selectedVerb: 'GET',
      sampleHeaders: [],
      selectedVersion: '',
      sampleUrl: ''
    }

    query.sampleHeaders.push({
      name: 'Cache-Control',
      value: 'no-cache'
    });

    const scopes = DEFAULT_USER_SCOPES.split(' ');

    dispatch(queryRunningStatus(true));

    try {
      const profile: IUser = await getProfileInformation(query, scopes, respHeaders);
      profile.profileImageUrl = await getProfileImage(query, scopes, respHeaders);
      profile.profileType = await getProfileType(query, scopes, respHeaders);
      dispatch(profileRequestSuccess(profile));
      return profile;
    } catch (error) {
      dispatch(profileRequestError({ error }));
      return null;
    }
  };
}
async function getProfileType(query: IQuery, scopes: string[], respHeaders: any) {
  query.sampleUrl = BETA_USER_INFO_URL;
  const response = await makeRequest(query.selectedVerb, scopes)(query);
  const userInfo = await parseResponse(response, respHeaders);
  return userInfo?.account?.[0]?.source?.type?.[0];
}

async function getProfileImage(query: IQuery, scopes: string[], respHeaders: any) {
  query.sampleUrl = USER_PICTURE_URL;
  let profileImageUrl = '';
  const response = await makeRequest(query.selectedVerb, scopes)(query);
  const userPicture = await parseResponse(response, respHeaders);
  if (userPicture) {
    const buffer = await response.arrayBuffer();
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    profileImageUrl = URL.createObjectURL(blob);
  }
  return profileImageUrl;
}

async function getProfileInformation(query: IQuery, scopes: string[], respHeaders: any) {
  query.sampleUrl = USER_INFO_URL;
  const profile: IUser = {
    displayName: '',
    emailAddress: '',
    profileImageUrl: '',
    profileType: undefined
  };
  const response = await makeRequest(query.selectedVerb, scopes)(query);
  const userInfo = await parseResponse(response, respHeaders);
  profile.displayName = userInfo.displayName;
  profile.emailAddress = userInfo.mail || userInfo.userPrincipalName;
  return profile;
}
