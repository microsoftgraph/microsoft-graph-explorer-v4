import { AgeGroup } from '@ms-ofb/officebrowserfeedbacknpm/scripts/app/Configuration/IInitOptions';

import { AppDispatch } from '../../../store';
import { AppAction } from '../../../types/action';
import { IUser } from '../../../types/profile';
import { IQuery } from '../../../types/query-runner';
import { translateMessage } from '../../utils/translate-messages';
import {
  ACCOUNT_TYPE, BETA_USER_INFO_URL, DEFAULT_USER_SCOPES, USER_INFO_URL,
  USER_ORGANIZATION_URL, USER_PICTURE_URL
} from '../graph-constants';
import { PROFILE_REQUEST_ERROR, PROFILE_REQUEST_SUCCESS } from '../redux-constants';
import { makeGraphRequest, parseResponse } from './query-action-creator-util';

interface UserInfo {
  '@microsoft.graph.tips': string;
  businessPhones: string[];
  displayName: string;
  givenName: string;
  jobTitle: string;
  mail: string;
  mobilePhone?: number;
  officeLocation: string;
  surname: string;
  userPrincipalName: string;
  id: string;
}

interface BetaUserInfo extends UserInfo {
  account: Account[];
}

interface Account {
  ageGroup: string;
  source: Source;
}

interface Source {
  type: string[];
}


interface IBetaProfile {
  ageGroup: number;
  profileType: ACCOUNT_TYPE;
}

interface Organization {
  value: Value[];
}

interface Value {
  id: string;
  displayName: string;
}

interface IProfileResponse {
  response?: Response;
  userInfo: unknown;
}


export function profileRequestSuccess(response: object): AppAction {
  return {
    type: PROFILE_REQUEST_SUCCESS,
    response
  };
}

export function profileRequestError(response: object): AppAction {
  return {
    type: PROFILE_REQUEST_ERROR,
    response
  };
}

const query: IQuery = {
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

export function getProfileInfo() {
  return async (dispatch: AppDispatch) => {
    try {
      const profile: IUser = await getProfileInformation();
      const { profileType, ageGroup } = await getBetaProfile();
      profile.profileType = profileType;
      profile.ageGroup = ageGroup;
      profile.profileImageUrl = await getProfileImage();
      profile.tenant = await getTenantInfo(profileType);
      dispatch(profileRequestSuccess(profile));
    } catch (error) {
      dispatch(profileRequestError({ error }));
    }
  };
}

export async function getProfileInformation(): Promise<IUser> {
  const profile: IUser = {
    id: '',
    displayName: '',
    emailAddress: '',
    profileImageUrl: '',
    profileType: ACCOUNT_TYPE.UNDEFINED,
    ageGroup: 0,
    tenant: ''
  };
  try {
    query.sampleUrl = USER_INFO_URL;
    const result = await getProfileResponse();
    const userInfo = result.userInfo as UserInfo;
    profile.id = userInfo.id;
    profile.displayName = userInfo.displayName;
    profile.emailAddress = userInfo.mail || userInfo.userPrincipalName;
    return profile;
  } catch (error: unknown) {
    let message = '';
    if (error instanceof Error) {
      message += '- ' + error.toString();
    }
    throw new Error(translateMessage('Failed to get profile information' + message));
  }
}

export async function getBetaProfile(): Promise<IBetaProfile> {
  try {
    query.sampleUrl = BETA_USER_INFO_URL;
    const info = await getProfileResponse();
    const userInfo = info.userInfo as BetaUserInfo;
    const ageGroup = getAgeGroup(userInfo);
    const profileType = getProfileType(userInfo);
    return { ageGroup, profileType };
  } catch (error) {
    return { ageGroup: 0, profileType: ACCOUNT_TYPE.UNDEFINED };
  }
}

function getAgeGroup(userInfo: BetaUserInfo): AgeGroup {
  const profileType = getProfileType(userInfo);
  if (profileType === ACCOUNT_TYPE.MSA) {
    const ageGroup = userInfo?.account?.[0]?.ageGroup;
    if (ageGroup === undefined || ageGroup === '') {
      return 0;
    }
    return parseInt(ageGroup, 10);
  } else {
    return 0;
  }
}
function getProfileType(userInfo: BetaUserInfo): ACCOUNT_TYPE {
  const profileType = userInfo?.account?.[0]?.source?.type?.[0];
  if (profileType === undefined) {
    return ACCOUNT_TYPE.UNDEFINED;
  }
  return profileType as ACCOUNT_TYPE;
}

export async function getProfileImage(): Promise<string> {
  let profileImageUrl = '';
  try {
    query.sampleUrl = USER_PICTURE_URL;
    const { response, userInfo: userPicture } = await getProfileResponse();
    if (userPicture && response) {
      const buffer = await response.arrayBuffer();
      const blob = new Blob([buffer], { type: 'image/jpeg' });
      profileImageUrl = URL.createObjectURL(blob);
    }
  } catch (error) {
    return profileImageUrl;
  }
  return profileImageUrl;
}

export async function getProfileResponse(): Promise<IProfileResponse> {
  const scopes = DEFAULT_USER_SCOPES.split(' ');
  const response = await makeGraphRequest(scopes)(query);
  const userInfo = await parseResponse(response!);
  return { response, userInfo };
}

export async function getTenantInfo(profileType: ACCOUNT_TYPE) {
  if (profileType === ACCOUNT_TYPE.MSA) {
    return 'Personal';
  }
  try {
    query.sampleUrl = USER_ORGANIZATION_URL;
    const result = await getProfileResponse();
    const tenant = result.userInfo as Organization;
    return tenant.value[0]?.displayName;
  } catch (error) {
    return '';
  }
}
