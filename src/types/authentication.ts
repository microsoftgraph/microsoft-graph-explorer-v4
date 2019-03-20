export interface IAuthenticationProps {
    actions?: {
      authenticateUser: Function;
    };
  }

export interface IAuthenticationState {
    user: object;
  }
