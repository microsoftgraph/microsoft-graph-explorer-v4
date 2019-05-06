export interface IAuthenticationProps {
  actions?: {
    authenticateUser: Function;
    signOut: Function;
  };
  tokenPresent: boolean;
}
