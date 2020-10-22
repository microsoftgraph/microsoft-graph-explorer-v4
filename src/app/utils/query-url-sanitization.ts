import { GRAPH_URL } from '../services/graph-constants';
import { parseSampleUrl } from './sample-url-generation';

// Matches pattterns within quotes e.g "displayName: Gupta"
const quotedTextRegex = /"([^"]*)"/g;

// matches strings that are all alphabets
const allAlphaRegex = /^[A-Za-z]+$/;

// matches strings with depracation identifier
const depracationRegex = /_v2/gi;

export function sanitizeQueryUrl(url: string): string {
  url = decodeURIComponent(url);

  // Extract query string
  const { search, queryVersion, requestUrl } = parseSampleUrl(url);
  const queryString: string = sanitizeQueryParameters(search);

  let resourceUrl = requestUrl;
  const sections = requestUrl.split('/');
  sections.forEach(segment => {
    if (isAllAlpha(segment) || isDeprecation(segment)) {
      return;
    }

    const index = sections.indexOf(segment);
    const replacementItemWithPrefix = `{${sections[index - 1]}-id}`;
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
 * @param segment part of the url string to test
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
  return !!segment.match(depracationRegex);
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
