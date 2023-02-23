import { authenticationWrapper } from './index';
import { configuration } from './msal-app';
import IClaimsChallenge, { IResponseHeaders } from './interfaces/IClaimsChallenge';
import { IQuery } from '../../types/query-runner';
export class ClaimsChallenge implements IClaimsChallenge {
  private static instance: ClaimsChallenge;
  private static claimsStatus = false;

  public static getInstance(){
    if (!ClaimsChallenge.instance) {
      ClaimsChallenge.instance = new ClaimsChallenge();
    }
    return ClaimsChallenge.instance;
  }
  public async handleClaimsChallenge(responseHeaders: IResponseHeaders, sampleQuery: IQuery){
    const account = authenticationWrapper.getAccount();
    const authenticationHeader = responseHeaders['www-authenticate'];
    const claimsChallenge = this.parseChallenges(authenticationHeader);

    /**
         * Here we add the claims challenge to localStorage, using <cc.appId.userId.resource.method> scheme as key
         * This allows us to use the claim challenge string as a parameter in subsequent acquireTokenSilent calls
         * as MSAL will cache access tokens with different claims separately
         */
    if (account) {
      this.addClaimsToStorage(
        // eslint-disable-next-line max-len
        `cc.${configuration.auth.clientId}.${account!.idTokenClaims!.oid}.${new URL(sampleQuery.sampleUrl).hostname}.${sampleQuery.selectedVerb}`,
        claimsChallenge.claims
      );
    }

    // eslint-disable-next-line no-useless-catch
    try {
      const claims = window.atob(claimsChallenge.claims)
      await authenticationWrapper.logOut();
      const authResponse = await authenticationWrapper.loginWithInteraction([], '', claims);
      if(authResponse){
        ClaimsChallenge.claimsStatus = true;
      }
    } catch (error: any) {
      throw error;
    }
  }

  private parseChallenges(header: string) {
    interface IChallenge {
      [key: string]: string;
    }
    const schemeSeparator = header.indexOf(' ');
    const challenges: any = header.substring(schemeSeparator + 1).split(',');
    const challengeMap: IChallenge = {};

    challenges.forEach((challenge: string) => {
      const [key, value] = challenge.split('=');
      challengeMap[key.trim()] = window.decodeURI(value.replace(/['"]+/g, ''));
    });

    return challengeMap;
  }

  private addClaimsToStorage(claimsChallengeId: string, claimsChallenge: string) {
    sessionStorage.setItem(claimsChallengeId, claimsChallenge);
  }

  public getClaimsStatus(){
    return ClaimsChallenge.claimsStatus;
  }
}