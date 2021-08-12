import { ITheme } from '@fluentui/react';

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
    displayName: string;
    emailAddress: string;
    profileImageUrl: string;
}
