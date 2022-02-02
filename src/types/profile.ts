import { ITheme } from '@fluentui/react';
import { ACCOUNT_TYPE } from '../app/services/graph-constants';

export interface IProfileProps {
  intl: {
    message: object;
  };
  theme?: ITheme;
  styles?: object;
  mobileScreen: boolean;
  actions?: {
    getProfileInfo: Function;
    signOut: Function;
  };
}

export interface IProfileState {
  user: IUser;
}

export interface IUser {
  id: string;
  displayName: string;
  emailAddress: string;
  profileImageUrl: string;
  profileType: ACCOUNT_TYPE;
  ageGroup: number;
}
