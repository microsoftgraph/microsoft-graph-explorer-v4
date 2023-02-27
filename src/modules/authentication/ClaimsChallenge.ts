import { authenticationWrapper } from './index';
import { configuration } from './msal-app';
import IClaimsChallenge from './interfaces/IClaimsChallenge';
import { IQuery } from '../../types/query-runner';
export class ClaimsChallenge implements IClaimsChallenge {
  private static instance: ClaimsChallenge;

  public static getInstance(){
    if (!ClaimsChallenge.instance) {
      ClaimsChallenge.instance = new ClaimsChallenge();
    }
    return ClaimsChallenge.instance;
  }
  public async handleClaimsChallenge(responseHeaders: Headers, sampleQuery: IQuery){
    const account = authenticationWrapper.getAccount();
    const authenticationHeader = responseHeaders.get('www-authenticate');
    const claimsChallenge = this.parseChallenges(authenticationHeader!);

    /**
         * Here we add the claims challenge to localStorage, using <cc.appId.userId.resource.method> scheme as key
         * This allows us to use the claim challenge string as a parameter in subsequent acquireTokenSilent calls
         * as MSAL will cache access tokens with different claims separately
         */
    if (account) {
      this.addClaimsToStorage(
        // eslint-disable-next-line max-len
        `cc.${configuration.auth.clientId}.${account.idTokenClaims!.oid}.${sampleQuery.sampleUrl}.${sampleQuery.selectedVerb}`,
        claimsChallenge.claims
      );
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

  public getClaimsFromStorage(claimsChallengeId: string){
    return sessionStorage.getItem(claimsChallengeId);
  }

}