export interface IAuthenticationProps {
    actions?: {
      authenticateUser: Function;
    };
    queryActions?: {
      runQuery: Function;
    };
  }

export interface IAuthenticationState {
    authenticated: object;
    loading: boolean;
  }
