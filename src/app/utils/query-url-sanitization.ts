import { GRAPH_URL } from '../services/graph-constants';
import { isAllAlpha, sanitizeQueryParameter } from './query-parameter-sanitization';
import { parseSampleUrl } from './sample-url-generation';

// Matches strings with deprecation identifier
const DEPRECATION_REGEX = /^[a-z]+_v2$/gi;
// Matches patterns like users('MeganB@M365x214355.onmicrosoft.com')
const TEXT_WITHIN_BRACKETS_REGEX  = /^[a-z]+\(.*(\))*/i;

/**
 * @param segment part of the url string to test
 * deprecated resources may have `_v2` temporarily
 * @returns boolean
 */
export function isDeprecation(segment: string): boolean {
  return DEPRECATION_REGEX.test(segment);
}

/**
 * Matches patterns like users('MeganB@M365x214355.onmicrosoft.com').
 * Characters before bracket must be letters only
 * @param segment
 */
export function hasIdWithinBracket(segment: string): boolean {
  return TEXT_WITHIN_BRACKETS_REGEX.test(segment);
}

/**
 * @param url - query url to be sanitized e.g. https://graph.microsoft.com/v1.0/users/{user-id}
 */
export function sanitizeQueryUrl(url: string): string {
  url = decodeURIComponent(url);

  const { search, queryVersion, requestUrl } = parseSampleUrl(url);
  const queryString: string = search ? `?${sanitizeQueryParameters(search)}` : '';

  // Split requestUrl into segments that can be sanitized individually
  let resourceUrl = requestUrl;
  const urlSegments = requestUrl.split('/');

  // Skipped segments: entities, entity sets
  // 1. Entities, entity sets and navigation properties, expected to contain alphabetic letters only
  // 2. Deprecated entities in the form <entity>_v2
  // The remaining URL segments are assumed to be variable Ids that need to be sanitized
  urlSegments.forEach(segment => {
    if (isAllAlpha(segment) || isDeprecation(segment)) {
      return;
    }

    // Check if segment is in this example form: users('<some-id> | <UPN>') and tranform to users({users-id})
    if (hasIdWithinBracket(segment)) {
      const textPrecedingBracket = segment.substring(0, segment.indexOf('('));
      const replacementItemWithPrefix = `${textPrecedingBracket}(${textPrecedingBracket}-id)`;
      resourceUrl = resourceUrl.replace(segment, replacementItemWithPrefix);
    }
    else {
      const index = urlSegments.indexOf(segment);
      const replacementItemWithPrefix = `{${urlSegments[index - 1]}-id}`;
      resourceUrl = resourceUrl.replace(segment, replacementItemWithPrefix);
    }
  });

  return `${GRAPH_URL}/${queryVersion}/${resourceUrl}${queryString}`;
}

function sanitizeQueryParameters(queryString: string): string {
  // remove leading ? from query string
  queryString = queryString.substring(1);
  return queryString.split('&').map(sanitizeQueryParameter).join('&');
}
