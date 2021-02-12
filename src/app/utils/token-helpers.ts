import { IQuery } from '../../types/query-runner';
import { IToken } from '../../types/sidebar';
import { getTokens } from '../views/sidebar/sample-queries/tokens';

/*
 * Given a token, go through each of the possible replacement scenarios and find which value to
 * replace the token with.
 * Order: Authenticated user values, demo tenant replacement values, default replacement values.
 */
export function getTokenSubstituteValue(token: IToken, isAuthenticated: boolean) {
  const priorityOrder = []; // Desc
  if (isAuthenticated) {
    priorityOrder.push(token.authenticatedUserValueFn);
    priorityOrder.push(token.authenticatedUserValue);
  } else {
    priorityOrder.push(token.demoTenantValueFn);
    priorityOrder.push(token.demoTenantValue);
  }

  priorityOrder.push(token.defaultValueFn);
  priorityOrder.push(token.defaultValue);

  for (const tokenVal of priorityOrder) {
    if (!tokenVal) {
      continue;
    }
    if (typeof tokenVal === 'string') {
      return tokenVal;
    } else if (typeof tokenVal === 'function') {
      return tokenVal();
    }
  }

}

/**
 * Given a query, replace all tokens in the request URL and the POST body with their
 * values.  When a token is found, use getTokenSubstituteValue() to find the right
 * value to substitute based on the session.
 */

export function substituteTokens(query: IQuery, profile: object) {
  type QueryFields = keyof IQuery;
  const tokens = getTokens(profile);
  const authenticated = !!profile;
  for (const token of tokens) {
    const queryFieldsToCheck: QueryFields[] = ['sampleBody', 'sampleUrl'];

    for (const queryField of queryFieldsToCheck) {
      if (!query[queryField]) {
        continue;
      }

      if ((query[queryField] as string).indexOf(`{${token.placeholder}}`) !== -1) {
        const substitutedValue = getTokenSubstituteValue(token, authenticated);
        if (!substitutedValue) {
          continue;
        }
        // @ts-ignore
        query[queryField] = (query[queryField] as string).replace(`{${token.placeholder}}`, substitutedValue);
      }
    }
  }
}