import { GRAPH_URL } from '../services/graph-constants';
import { parseSampleUrl } from './sample-url-generation';

// Matches pattterns within quotes e.g "displayName: Gupta"
const quotedTextRegex = /"([^"]*)"/g;

export function sanitizeQueryUrl(url: string): string {
  url = decodeURIComponent(url);

  // Extract query string
  const { search, queryVersion, requestUrl } = parseSampleUrl(url);
  const queryString: string = sanitizeQueryParameters(search);

  let resourceUrl = requestUrl;
  const sections = resourceUrl.split('/');
  sections.forEach(sec => {
    if (containsIdentifier(sec)) {
      const index = sections.indexOf(sec);
      const replacementItemWithPrefix = `{${sections[index - 1]}-id}`;
      resourceUrl = resourceUrl.replace(sec, replacementItemWithPrefix);
    }
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

/*
* A string contains an identifier if either:
*   1. it is an alphanumeric string
*   2. special characters are present
*/
export function containsIdentifier(segment: string): boolean {
  return isAlphaNumericString(segment)
  || isNumericString(segment)
  || hasSpecialCharacters(segment);
}

export function hasSpecialCharacters(segment: string): boolean {
  const specialCharacters = ['.', '=', '@', '-'];
  return specialCharacters.some((character) => segment.includes(character));
}

export function isNumericString(segment: string): boolean {
  const numberRegex = /^[0-9]*$/;
  return !!segment.match(numberRegex);
}

export function isAlphaNumericString(str: string): boolean {
  let code = 0;
  let isNumeric = false;
  let isAlpha = false;

  for (let index = 0; index < str.length; index++) {
    code = str.charCodeAt(index);

    switch (true) {
      // check if all values are 0-9
      case code > 47 && code < 58:
        isNumeric = true;
        break;

      // check if all values are A-Z or a-z
      case (code > 64 && code < 91) || (code > 96 && code < 123):
        isAlpha = true;
        break;

      // not 0-9, not A-Z or a-z
      default:
        return false;
    }
  }

  return isNumeric && isAlpha;
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
