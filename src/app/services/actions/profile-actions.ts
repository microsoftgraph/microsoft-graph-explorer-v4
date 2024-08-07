import { AgeGroup } from '@ms-ofb/officebrowserfeedbacknpm/scripts/app/Configuration/IInitOptions';

import { IUser } from '../../../types/profile';
import { IQuery } from '../../../types/query-runner';
import { translateMessage } from '../../utils/translate-messages';
import {
  ACCOUNT_TYPE, BETA_USER_INFO_URL, DEFAULT_USER_SCOPES, USER_INFO_URL,
  USER_ORGANIZATION_URL, USER_PICTURE_URL
} from '../graph-constants';
import { makeGraphRequest, parseResponse } from './query-action-creator-util';

interface IBetaProfile {
  ageGroup: number;
  profileType: ACCOUNT_TYPE;
}

interface IProfileResponse {
  userInfo: any;
  response: any;
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
    const { userInfo } = await getProfileResponse();
    profile.id = userInfo.id;
    profile.displayName = userInfo.displayName;
    profile.emailAddress = userInfo.mail || userInfo.userPrincipalName;
    return profile;
  } catch (error: unknown) {
    throw new Error(translateMessage('Failed to get profile information') + '- ' + error);
  }
}

export async function getBetaProfile(): Promise<IBetaProfile> {
  try {
    query.sampleUrl = BETA_USER_INFO_URL;
    const { userInfo } = await getProfileResponse();
    const ageGroup = getAgeGroup(userInfo);
    const profileType = getProfileType(userInfo);
    return { ageGroup, profileType };
  } catch (error) {
    return { ageGroup: 0, profileType: ACCOUNT_TYPE.UNDEFINED };
  }
}

export function getAgeGroup(userInfo: any): AgeGroup {
  const profileType = getProfileType(userInfo);
  if (profileType === ACCOUNT_TYPE.MSA) {
    const ageGroup = userInfo?.account?.[0]?.ageGroup;
    if (ageGroup === undefined || ageGroup === '') {
      return 0;
    }
    return ageGroup;
  } else {
    return 0;
  }
}
export function getProfileType(userInfo: any): ACCOUNT_TYPE {
  const profileType: ACCOUNT_TYPE = userInfo?.account?.[0]?.source?.type?.[0];
  if (profileType === undefined) {
    return ACCOUNT_TYPE.UNDEFINED;
  }
  return profileType;
}

export async function getProfileImage(): Promise<string> {
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

export async function getProfileResponse(): Promise<IProfileResponse> {
  const scopes = DEFAULT_USER_SCOPES.split(' ');
  const respHeaders: Record<string, string> = {};

  const response = await makeGraphRequest(scopes)(query);
  const userInfo = await parseResponse(response, respHeaders);
  return {
    userInfo,
    response
  };
}

export async function getTenantInfo(profileType: ACCOUNT_TYPE): Promise<string> {
  if (profileType === ACCOUNT_TYPE.MSA) {
    return 'Personal';
  }
  try {
    query.sampleUrl = USER_ORGANIZATION_URL;
    const { userInfo: tenant } = await getProfileResponse();
    return tenant.value[0]?.displayName;
  } catch (error: any) {
    return '';
  }
}
