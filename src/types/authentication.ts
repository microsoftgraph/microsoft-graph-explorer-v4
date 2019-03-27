export interface IAuthenticationProps {
    actions?: {
      authenticateUser: Function;
    };
    queryActions?: {
      runQuery: Function;
    };
  }

export interface IAuthenticationState {
    authenticatedUser: object;
    loading: boolean;
  }
