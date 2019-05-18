export interface IProfileProps {
    actions?: {
        runQuery: Function;
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
