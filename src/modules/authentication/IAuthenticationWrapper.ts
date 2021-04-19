import { AuthenticationResult } from "@azure/msal-browser";

export default interface IAuthenticationWrapper {
  getSessionId(): string;
  logIn(sessionId?: string): Promise<AuthenticationResult>;
  logOut(): void;
  logOutPopUp(): void;
  consentToScopes(scopes: string[]): Promise<AuthenticationResult>;
}