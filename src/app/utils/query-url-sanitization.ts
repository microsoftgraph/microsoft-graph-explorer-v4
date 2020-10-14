import { parseSampleUrl } from './sample-url-generation';

// Matches patterns like "('<1f7ff346-c174-45e5-af38-294e51d9969a>')" or "('<key>')"
const keyIdRegex = /\(\'\<?\{?[ ?0-9a-zA-Z-]*\}?\>?\'\)/g;

// Matches patterns like "(query=<key>)" or "(itemat=<key>,mode=<mode>)"
const functionParamInitialRegex = /(?<=\=).*?(?=,)/g;
const functionParamFinalRegex = /(?<=\=).[^,]*(?=\))/g;

// Matches pattterns within quotes e.g "displayName: Gupta"
const quotedTextRegex = /"([^"]*)"/g;

// Matches PII patterns
const numberRegex =  /(?<=\/)\d+\b/g; // number between forward slashes
const emailRegex = /([a-z0-9_\-.+]+)@\w+(\.\w+)*/gi;
const guidRegex =
 /(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}/gi;


export function sanitizeQueryUrl(url: string): string {
  url = decodeURIComponent(url);

  // Extract query string
  const { search } = parseSampleUrl(url);
  const queryString: string = sanitizeQueryParameters(search);

  // Drop query string
  let sanitizedUrl = url.split('?')[0];

  // Normalize parameters in param=<arbitraryKey> format with param={value} format
  sanitizedUrl = sanitizedUrl.replace(functionParamInitialRegex, '<value>');
  sanitizedUrl = sanitizedUrl.replace(functionParamFinalRegex, '<value>');

  // Replace IDs and ID placeholders with generic {id}
  sanitizedUrl = sanitizedUrl.replace(keyIdRegex, '/<id>');
  sanitizedUrl = sanitizedUrl.replace(guidRegex, '<guid>');
  sanitizedUrl = sanitizedUrl.replace(numberRegex, '<number>');

  // Redact PII
  sanitizedUrl = sanitizedUrl.replace(emailRegex, '<email>');
  return `${sanitizedUrl}${queryString}` ;
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