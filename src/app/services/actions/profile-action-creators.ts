import { IUser } from '../../../types/profile';
import { IQuery } from '../../../types/query-runner';
import {
  ACCOUNT_TYPE, BETA_USER_INFO_URL, DEFAULT_USER_SCOPES,
  USER_INFO_URL, USER_PICTURE_URL
} from '../graph-constants';
import { PROFILE_REQUEST_ERROR, PROFILE_REQUEST_SUCCESS } from '../redux-constants';
import { makeRequest, parseResponse } from './query-action-creator-util';
import { queryRunningStatus } from './query-loading-action-creators';

export function profileRequestSuccess(response: object): any {
  return {
    type: PROFILE_REQUEST_SUCCESS,
    response
  };
}

export function profileRequestError(response: object): any {
  return {
    type: PROFILE_REQUEST_ERROR,
    response
  };
}

const query: IQuery = {
  selectedVerb: 'GET',
  sampleHeaders: [{
    name: 'Cache-Control',
    value: 'no-cache'
  }],
  selectedVersion: '',
  sampleUrl: ''
}

export function getProfileInfo(): Function {
  return async (dispatch: Function) => {
    dispatch(queryRunningStatus(true));
    try {
      const profile: IUser = await getProfileInformation();
      profile.profileType = await getProfileType();
      profile.profileImageUrl = await getProfileImage();
      dispatch(profileRequestSuccess(profile));
    } catch (error) {
      dispatch(profileRequestError({ error }));
    }
  };
}

async function getProfileInformation(): Promise<IUser> {
  const profile: IUser = {
    displayName: '',
    emailAddress: '',
    profileImageUrl: ''
  };
  try {
    query.sampleUrl = USER_INFO_URL;
    const { userInfo } = await getProfileResponse();
    profile.displayName = userInfo.displayName;
    profile.emailAddress = userInfo.mail || userInfo.userPrincipalName;
    return profile;
  } catch (error) {
    throw error;
  }
}

async function getProfileType(): Promise<ACCOUNT_TYPE> {
  try {
    query.sampleUrl = BETA_USER_INFO_URL;
    const { userInfo } = await getProfileResponse();
    return userInfo?.account?.[0]?.source?.type?.[0];
  } catch (error) {
    return ACCOUNT_TYPE.MSA;
  }
}

async function getProfileImage(): Promise<string> {
  let profileImageUrl = '';
  try {
    query.sampleUrl = USER_PICTURE_URL;
    const { response, userInfo: userPicture } = await getProfileResponse();
    if (userPicture) {
      const buffer = await response.arrayBuffer();
      const blob = new Blob([buffer], { type: 'image/jpeg' });
      profileImageUrl = URL.createObjectURL(blob);
    }
  } catch (error) {
    return profileImageUrl;
  }
  return profileImageUrl;
}

async function getProfileResponse() {
  const scopes = DEFAULT_USER_SCOPES.split(' ');
  const respHeaders: any = {};

  const response = await makeRequest(query.selectedVerb, scopes)(query);
  const userInfo = await parseResponse(response, respHeaders);
  return {
    userInfo,
    response
  };
}
