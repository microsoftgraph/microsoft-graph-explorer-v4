import { ITheme } from '@fluentui/react';

import { ICloud } from './cloud';
import { ACCOUNT_TYPE } from '../app/services/graph-constants';

export interface IProfileProps {
    intl: {
        message: object;
    };
    theme?: ITheme;
    styles?: object;
    mobileScreen: boolean;
    cloud: ICloud;
    actions?: {
        getProfileInfo: Function;
        signOut: Function;
    };
}

export interface IProfileState {
    user: IUser;
}


export interface IUser {
    displayName: string;
    emailAddress: string;
    profileImageUrl: string;
    profileType?: ACCOUNT_TYPE;
}
