export interface IAuthenticationProps {
    actions?: {
      authenticateUser: Function;
    };
    queryActions?: {
      runQuery: Function;
    };
    authenticatedUser: IAuthenticationState;
  }

export interface IAuthenticationState {
    authenticatedUser: {
      status: boolean,
      user: {
          displayName: string,
          emailAddress: string,
          profileImageUrl: string,
        },
      token: string,
    };
    loading: boolean;
  }
