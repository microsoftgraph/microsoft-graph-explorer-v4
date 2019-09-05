import { ITheme } from 'office-ui-fabric-react';

export interface IProfileProps {
    theme?: ITheme;
    styles?: object;
    actions?: {
        getProfileInfo: Function;
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
