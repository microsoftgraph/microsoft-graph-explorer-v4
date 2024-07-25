import { ITheme } from '@fluentui/react';
import { ACCOUNT_TYPE } from '../app/services/graph-constants';

export interface IProfileProps {
  theme?: ITheme;
  styles?: object;
  mobileScreen: boolean;
  actions?: {
    getProfileInfo: Function;
    signOut: Function;
  };
}

export interface IProfileState {
  status: 'unset' | 'success' | 'error',
  user?: IUser
  error?: Error
}

export interface IUser {
  id: string;
  displayName: string;
  emailAddress: string;
  profileImageUrl: string;
  profileType: ACCOUNT_TYPE;
  ageGroup: number;
  tenant: string;
}
