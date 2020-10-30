import { GRAPH_URL } from '../services/graph-constants';
import { parseSampleUrl } from './sample-url-generation';

// Matches pattterns within quotes e.g "displayName: Gupta"
const quotedTextRegex = /"([^"]*)"/g;

// Matches strings that are all letters. Will match abc, won't match ab2c
const allAlphaRegex = /^[A-Za-z]+$/;

// Matches strings with deprecation identifier
const deprecationRegex = /^[A-Za-z]+_v2$/gi;

/**
 *
 * @param url - query url to be sanitized e.g.
 *  - https://graph.microsoft.com/v1.0/planner/tasks/oIx3zN98jEmVOM-4mUJzSGUANeje
 *  - https://graph.microsoft.com/v1.0/users?$search="MeganB@M365x214355.onmicrosoft.com"
 */
export function sanitizeQueryUrl(url: string): string {
  url = decodeURIComponent(url);

  // Extract query string
  const { search, queryVersion, requestUrl } = parseSampleUrl(url);
  const queryString: string = sanitizeQueryParameters(search);

  /**
   * Non-IDs skipped during the sanitization process:
   *   - Entities/entity sets/navigations from metadata, expected to contain alphabetic characters only
   *   - Non-IDs that indicate deprecation in the form <non_id>_v2
   *  The remaining URL segments are assumed to be variable IDs that need to be sanitized
   */
  let resourceUrl = requestUrl;
  const urlSegments = requestUrl.split('/');
  urlSegments.forEach(segment => {
    if (isAllAlpha(segment) || isDeprecation(segment)) {
      return;
    }

    const index = urlSegments.indexOf(segment);
    const replacementItemWithPrefix = `{${urlSegments[index - 1]}-id}`;
    resourceUrl = resourceUrl.replace(segment, replacementItemWithPrefix);
});

  return `${GRAPH_URL}/${queryVersion}/${resourceUrl}${queryString}`;
}

function sanitizeQueryParameters(queryString: string): string {
  const params = queryString.split('&');
  let result: string = '';
  if (params.length) {
    params.forEach(param => {
      result += sanitizeQueryParameterValue(param) + '&';
    });
    result = result.slice(0, -1);
  }
  return result;
}

/**
 * @param segment - part of the url string to test
 * Currently, non-ID strings are all alphabetic characters
 * @returns boolean
 */
export function isAllAlpha(segment: string): boolean {
  return !!segment.match(allAlphaRegex);
}

/**
 * @param segment part of the url string to test
 * depracated resources may have `_v2` temporarily
 * @returns boolean
 */
export function isDeprecation(segment: string): boolean {
  return !!segment.match(deprecationRegex);
}

function sanitizeQueryParameterValue(param: string) {
  if (!param.includes('=')) {
    return param;
  }
  param = decodeURIComponent(param);
  const key = param.split('=')[0];
  switch (key) {
    // We do not expect sensitive data in these OData query params, nothing needs to be done
    case '$top':
    case '$skip':
    case '$count':
    case '$expand':
    case '$select':
    case '$format':
    case '$orderby': {
      break;
    }
    /**
     * Query URLs will look like the examples below after processing,
     * GET /me/people/?$search=<value>
     * GET /users?$search=displayName:<value>
     * GET /users?$search=displayName:<value> OR mail:<value>
     */
    case '$search': {
      param = param.replace(quotedTextRegex, (capture) => {
        if (!capture.includes(':')) {
          return '<value>';
        }
        // Drop quotes enclosing property and text to search
        capture = capture.replace('"', '');
        const property = capture.split(':')[0];
        return `${property}:<value>`;
      });
      break;
    }
    /**
     * Examples
     * GET /users?$filter=endsWith(mail,<value>)
     * GET /me/messages?$filter=from/emailAddress/address eq <value>
     */
    case '$filter': {
      // TO DO
      break;
    }
    default: {
      param = `${key}=<value>`;
      break;
    }
  }
  return param;
}
