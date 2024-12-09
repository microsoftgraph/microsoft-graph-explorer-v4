import { InteractionType } from '@azure/msal-browser';
import {
  AuthenticationHandlerOptions,
  GraphRequest,
  ResponseType
} from '@microsoft/microsoft-graph-client';
import {
  AuthCodeMSALBrowserAuthenticationProviderOptions
} from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';

import { authenticationWrapper } from '../../../modules/authentication';
import { ApplicationState } from '../../../store';
import { ContentType } from '../../../types/enums';
import { ResponseBody } from '../../../types/query-response';
import { IQuery } from '../../../types/query-runner';
import { IRequestOptions } from '../../../types/request';
import { IStatus } from '../../../types/status';
import { ClientError } from '../../utils/error-utils/ClientError';
import { getHeaders } from '../../utils/http-methods.utils';
import { encodeHashCharacters } from '../../utils/query-url-sanitization';
import { translateMessage } from '../../utils/translate-messages';
import { authProvider, GraphClient } from '../graph-client';
import { DEFAULT_USER_SCOPES, GRAPH_URL } from '../graph-constants';

export async function anonymousRequest(
  query: IQuery,
  getState: Function
) {
  const { proxyUrl, queryRunnerStatus } = getState() as ApplicationState;
  const { graphUrl, options } = createAnonymousRequest(query, proxyUrl, queryRunnerStatus!);
  return fetch(graphUrl, options)
    .catch(() => {
      throw new ClientError({ error: translateMessage('Could not connect to the sandbox') });
    })
    .then((response) => { return response; });
}

export function createAnonymousRequest(query: IQuery, proxyUrl: string, queryRunnerStatus: IStatus) {
  const escapedUrl = encodeURIComponent(query.sampleUrl);
  const graphUrl = `${proxyUrl}?url=${escapedUrl}`;
  const sampleHeaders: any = {};

  if (query.sampleHeaders && query.sampleHeaders.length > 0) {
    query.sampleHeaders.forEach((header) => {
      sampleHeaders[header.name] = header.value;
    });
  }

  const authToken = `{token:${GRAPH_URL}/}`;
  let headers = {
    Authorization: `Bearer ${authToken}`,
    'Content-Type': 'application/json',
    SdkVersion: 'GraphExplorer/4.0',
    prefer: 'ms-graph-dev-mode',
    ...sampleHeaders
  };

  if (queryRunnerStatus && !queryRunnerStatus.ok) {
    const updatedHeaders = { ...headers, 'cache-control': 'no-cache', pragma: 'no-cache' }
    headers = updatedHeaders;
  }

  const options: IRequestOptions = {
    method: query.selectedVerb,
    headers,
    body: query.sampleBody ? JSON.stringify(query.sampleBody) : undefined
  };
  return { graphUrl, options };
}

export function authenticatedRequest(
  query: IQuery,
  scopes: string[] = DEFAULT_USER_SCOPES.split(' ')
) {
  return makeGraphRequest(scopes)(query);
}

function createAuthenticatedRequest(
  scopes: string[],
  query: IQuery
): GraphRequest {
  const sampleHeaders: Record<string, string> = {};
  sampleHeaders.SdkVersion = 'GraphExplorer/4.0';
  sampleHeaders.prefer = 'ms-graph-dev-mode';

  if (query.sampleHeaders && query.sampleHeaders.length > 0) {
    query.sampleHeaders.forEach((header) => {
      sampleHeaders[header.name] = header.value;
    });
  }
  const updatedHeaders = { ...sampleHeaders, 'cache-control': 'no-cache', pragma: 'no-cache' }

  const msalAuthOptions: AuthCodeMSALBrowserAuthenticationProviderOptions = {
    account: authenticationWrapper.getAccount()!,
    interactionType: InteractionType.Popup,
    scopes
  }
  const middlewareOptions = new AuthenticationHandlerOptions(
    authProvider,
    msalAuthOptions
  )
  return GraphClient.getInstance()
    .api(encodeHashCharacters(query))
    .middlewareOptions([middlewareOptions])
    .headers(updatedHeaders)
    .responseType(ResponseType.RAW);
}

export function makeGraphRequest(scopes: string[]) {
  return async (query: IQuery) => {
    let response: ResponseBody;

    const graphRequest: GraphRequest = createAuthenticatedRequest(scopes, query);

    switch (query.selectedVerb) {
    case 'GET':
      response = await graphRequest.get() as ResponseBody;
      break;
    case 'POST':
      response = await graphRequest.post(query.sampleBody) as ResponseBody;
      break;
    case 'PUT':
      response = await graphRequest.put(query.sampleBody) as ResponseBody;
      break;
    case 'PATCH':
      response = await graphRequest.patch(query.sampleBody) as ResponseBody;
      break;
    case 'DELETE':
      response = await graphRequest.delete() as ResponseBody;
      break;
    default:
      return;
    }
    return Promise.resolve(response) as ResponseBody;
  };
}

export function isImageResponse(contentType: string | undefined) {
  if (!contentType) {
    return false;
  }
  return (
    contentType === 'application/octet-stream' || contentType.includes('image/')
  );
}

export function isBetaURLResponse(json: any) {
  return !!json?.account?.[0]?.source?.type?.[0];
}

export function getContentType(headers: Record<string, string>): ContentType {
  let contentType: ContentType = '' as unknown as ContentType;

  if (headers) {
    let contentTypes: string | null = null;
    if (headers instanceof Headers) {
      contentTypes = headers.get('content-type');
    } else {
      contentTypes = headers['content-type'];
    }
    if (contentTypes) {
      /* Example: application/json;odata.metadata=minimal;odata.streaming=true;IEEE754Compatible=false;charset=utf-8
       * Take the first option after splitting since it is the only value useful in the description of the content
       */
      const splitContentTypes = contentTypes.split(';');
      contentType = (splitContentTypes.length > 0) ?
        splitContentTypes[0].toLowerCase() as ContentType : contentTypes as ContentType;
    }
  }
  return contentType;
}

export function isFileResponse(headers: Record<string, string>) {
  const contentDisposition: string |  null = (headers instanceof Headers) ?
    headers.get('content-disposition') : headers['content-disposition'];

  if (contentDisposition) {
    const directives = contentDisposition.split(';');
    if (directives.includes('attachment')) {
      return true;
    }
  }

  // use content type to determine if response is file
  const contentType = getContentType(headers);
  if (contentType) {
    return (
      contentType === 'application/octet-stream' ||
      contentType === 'application/onenote' ||
      contentType === 'application/pdf' ||
      contentType.includes('application/vnd.') ||
      contentType.includes('video/') ||
      contentType.includes('audio/')
    );
  }
  return false;
}

export async function generateResponseDownloadUrl(response: Response) {
  const headers = getHeaders(response)
  try {
    const fileContents = await parseResponse(response);
    const contentType = getContentType(headers);
    if (fileContents) {
      const buffer = await response.arrayBuffer();
      const blob = new Blob([buffer], { type: contentType });
      return URL.createObjectURL(blob);
    }
  } catch {
    return null;
  }
}

async function tryParseJson(textValue: string) {
  try {
    return JSON.parse(textValue);
  } catch {
    return textValue;
  }
}

export const parseResponse = (response: Response): Promise<ResponseBody> => {
  if (response && response.headers) {
    const headers = getHeaders(response)
    const contentType = getContentType(headers);
    switch (contentType) {
    case ContentType.Json:
      return response.text().then(tryParseJson);
    case ContentType.XML:
    case ContentType.HTML:
    case ContentType.TextCsv:
    case ContentType.TextPlain:
      return response.text();

    default:
      return Promise.resolve(response);
    }
  }
  return Promise.resolve(response);
}

/**
 * Check if query attempts to download from OneDrive's /content API or reporting API
 * Examples:
 *  /drive/items/{item-id}/content
 *  /shares/{shareIdOrEncodedSharingUrl}/driveItem/content
 *  /me/drive/items/{item-id}/thumbnails/{thumb-id}/{size}/content
 *  /sites/{site-id}/drive/items/{item-id}/versions/{version-id}/content
 *  /reports/getOffice365ActivationCounts?$format=text/csv
 *  /reports/getEmailActivityUserCounts(period='D7')?$format=text/csv
 * @param query
 * @returns true if query calls the OneDrive or reporting API, otherwise false
 */
export function queryResultsInCorsError(sampleUrl: string): boolean {
  sampleUrl = sampleUrl.toLowerCase();
  if (
    (['/drive/', '/drives/', '/driveItem/', '/employeeexperience/'].some((x) =>
      sampleUrl.includes(x)) && sampleUrl.endsWith('/content')) ||
    sampleUrl.includes('/reports/')
  ) {
    return true;
  }
  return false;
}
