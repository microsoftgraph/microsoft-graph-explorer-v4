import { GRAPH_URL } from '../services/graph-constants';
import { parseSampleUrl } from './sample-url-generation';

// Matches pattterns within quotes e.g "displayName: Gupta"
const quotedTextRegex = /"([^"]*)"/g;

// Matches patterns with alphanumeric characters e.g <CONGZUWfGUu4msTgNP66e2UAAySi>
const alphaNumericRegex = /[^a-z0-9]/g;


export function sanitizeQueryUrl(url: string): string {
  url = decodeURIComponent(url);

  // Extract query string
  const { search, queryVersion } = parseSampleUrl(url);
  const queryString: string = sanitizeQueryParameters(search);

  // Drop query string
  let sanitizedUrl = url.split('?')[0];

  /*
  * Remove url prefix and query version.
  * They have special characters used in the check that follows
  */
  const urlPrefix = `${GRAPH_URL}/${queryVersion}`;
  sanitizedUrl = sanitizedUrl.replace(urlPrefix, '');

  const sections = sanitizedUrl.split('/');
  sections.forEach(sec => {
    if (hasSpecialCharacters(sec)) {
      const index = sections.indexOf(sec);
      const replacementItemWithPrefix = `{${sections[index - 1]}-id}`;
      sanitizedUrl = sanitizedUrl.replace(sec, replacementItemWithPrefix);
    }
  });

  return `${urlPrefix}${sanitizedUrl}${queryString}` ;
}

function sanitizeQueryParameters(queryString: string): string {
   const params = queryString.split('&');
   let result: string = '';
   if (params.length)
   {
      params.forEach(param => {
       result += sanitizeQueryParameterValue(param) + '&';
      });
      result = result.slice(0, -1);
   }
   return result;
}

/*
* Special characters present in the url show that the
* segment contains an identifier
*/
function hasSpecialCharacters(segment: string): boolean {
  const specialCharacters = ['.', '=', '@', '-'];
  return specialCharacters.some((character) =>  segment.includes(character) || !!segment.match(alphaNumericRegex));
}

function sanitizeQueryParameterValue(param: string) {
  if (!param.includes('='))
  {
    return param;
  }
  param = decodeURIComponent(param);
  const key = param.split('=')[0];
  switch (key){
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
      param = param.replace(quotedTextRegex,  (capture) => {
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
  return  param;
}