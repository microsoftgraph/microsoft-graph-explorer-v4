import { authenticationWrapper } from './index';
import { configuration } from './msal-app';
import IClaimsChallenge from './interfaces/IClaimsChallenge';
import { IQuery } from '../../types/query-runner';
import { AccountInfo } from '@azure/msal-browser';
export class ClaimsChallenge implements IClaimsChallenge {
  private static instance: ClaimsChallenge;
  private sampleQuery: IQuery = {
    selectedVerb: '',
    selectedVersion:'',
    sampleHeaders: [],
    sampleUrl: ''
  };
  private account: AccountInfo;
  private claimsChallenge: string = '';

  constructor(sampleQuery: IQuery, account: AccountInfo){
    this.sampleQuery = sampleQuery;
    this.account = account;
    // eslint-disable-next-line max-len
    this.claimsChallenge = `cc.${configuration.auth.clientId}.${this.account.idTokenClaims!.oid}.${this.sampleQuery.sampleUrl}.${this.sampleQuery.selectedVerb}`
  }

  public handle(responseHeaders: Headers){
    const account = authenticationWrapper.getAccount();
    const authenticationHeader = responseHeaders.get('www-authenticate');
    const claimsChallenge = this.parseChallenges(authenticationHeader!);

    /**
         * Here we add the claims challenge to localStorage, using <cc.appId.userId.resource.method> scheme as key
         * This allows us to use the claim challenge string as a parameter in subsequent acquireTokenSilent calls
         * as MSAL will cache access tokens with different claims separately
         */
    if (account) {
      const challengeAvailable = this.getClaimsFromStorage();
      if (!challengeAvailable && claimsChallenge && claimsChallenge.claims){
        this.addClaimsToStorage(
          this.claimsChallenge,
          claimsChallenge.claims
        );
      }
    }
  }

  private parseChallenges(header: string) {
    interface IChallenge {
      [key: string]: string;
    }
    const schemeSeparator = header.indexOf(' ');
    const challenges: string[] = header.substring(schemeSeparator + 1).split(',');
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

  public getClaimsFromStorage(){
    return sessionStorage.getItem(this.claimsChallenge);
  }
}