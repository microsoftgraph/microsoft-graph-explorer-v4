import {
  AuthenticationHandlerOptions,
  GraphRequest,
  ResponseType
} from '@microsoft/microsoft-graph-client';
import {
  MSALAuthenticationProviderOptions
} from '@microsoft/microsoft-graph-client/lib/src/MSALAuthenticationProviderOptions';

import { IAction } from '../../../types/action';
import { ContentType } from '../../../types/enums';
import { IQuery } from '../../../types/query-runner';
import { IRequestOptions } from '../../../types/request';
import { IStatus } from '../../../types/status';
import { ClientError } from '../../utils/ClientError';
import { encodeHashCharacters } from '../../utils/query-url-sanitization';
import { translateMessage } from '../../utils/translate-messages';
import { authProvider, GraphClient } from '../graph-client';
import { DEFAULT_USER_SCOPES } from '../graph-constants';
import { QUERY_GRAPH_SUCCESS } from '../redux-constants';
import { queryRunningStatus } from './query-loading-action-creators';

export function queryResponse(response: object): IAction {
  return {
    type: QUERY_GRAPH_SUCCESS,
    response
  };
}

export async function anonymousRequest(
  dispatch: Function,
  query: IQuery,
  getState: Function
) {
  const { proxyUrl, queryRunnerStatus } = getState();
  const { graphUrl, options } = createAnonymousRequest(query, proxyUrl, queryRunnerStatus);
  dispatch(queryRunningStatus(true));
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

  const authToken = '{token:https://graph.microsoft.com/}';
  let headers = {
    Authorization: `Bearer ${authToken}`,
    'Content-Type': 'application/json',
    SdkVersion: 'GraphExplorer/4.0',
    ...sampleHeaders
  };

  if (queryRunnerStatus && !queryRunnerStatus.ok) {
    const updatedHeaders = { ...headers, 'cache-control': 'no-cache', pragma: 'no-cache' }
    headers = updatedHeaders;
  }

  const options: IRequestOptions = {
    method: query.selectedVerb,
    headers
  };
  return { graphUrl, options };
}

export function authenticatedRequest(
  dispatch: Function,
  query: IQuery,
  scopes: string[] = DEFAULT_USER_SCOPES.split(' ')
) {
  dispatch(queryRunningStatus(true));
  return makeGraphRequest(scopes)(query);
}

function createAuthenticatedRequest(
  scopes: string[],
  query: IQuery
): GraphRequest {
  const sampleHeaders: any = {};
  sampleHeaders.SdkVersion = 'GraphExplorer/4.0';

  if (query.sampleHeaders && query.sampleHeaders.length > 0) {
    query.sampleHeaders.forEach((header) => {
      sampleHeaders[header.name] = header.value;
    });
  }

  const msalAuthOptions = new MSALAuthenticationProviderOptions(scopes);
  const middlewareOptions = new AuthenticationHandlerOptions(
    authProvider,
    msalAuthOptions
  );
  const graphRequest = GraphClient.getInstance()
    .api(encodeHashCharacters(query))
    .middlewareOptions([middlewareOptions])
    .headers(sampleHeaders)
    .responseType(ResponseType.RAW);

  return graphRequest;
}

export function makeGraphRequest(scopes: string[]): Function {
  return async (query: IQuery) => {
    let response;

    const graphRequest = createAuthenticatedRequest(scopes, query);

    switch (query.selectedVerb) {
      case 'GET':
        response = await graphRequest.get();
        break;
      case 'POST':
        response = await graphRequest.post(query.sampleBody);
        break;
      case 'PUT':
        response = await graphRequest.put(query.sampleBody);
        break;
      case 'PATCH':
        response = await graphRequest.patch(query.sampleBody);
        break;
      case 'DELETE':
        response = await graphRequest.delete();
        break;
      default:
        return;
    }
    return Promise.resolve(response);
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

export function getContentType(headers: any) {
  let contentType = null;

  if (headers) {
    let contentTypes = headers['content-type'];
    if (headers instanceof Headers) {
      contentTypes = headers.get('content-type');
    }
    if (contentTypes) {
      /* Example: application/json;odata.metadata=minimal;odata.streaming=true;IEEE754Compatible=false;charset=utf-8
       * Take the first option after splitting since it is the only value useful in the description of the content
       */
      const splitContentTypes = contentTypes.split(';');
      if (splitContentTypes.length > 0) {
        contentType = splitContentTypes[0].toLowerCase();
      }
    }
  }
  return contentType;
}

export function isFileResponse(headers: any) {
  const contentDisposition = headers['content-disposition'];
  if (contentDisposition) {
    const directives = contentDisposition.split(';');
    if (directives.contains('attachment')) {
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

export async function generateResponseDownloadUrl(
  response: Response,
  respHeaders: any
) {
  try {
    const fileContents = await parseResponse(response, respHeaders);
    const contentType = getContentType(respHeaders);
    if (fileContents) {
      const buffer = await response.arrayBuffer();
      const blob = new Blob([buffer], { type: contentType });
      const downloadUrl = URL.createObjectURL(blob);
      return downloadUrl;
    }
  } catch (error) {
    return null;
  }
}

export function parseResponse(
  response: any,
  respHeaders: any = {}
): Promise<any> {
  if (response && response.headers) {
    response.headers.forEach((val: any, key: any) => {
      respHeaders[key] = val;
    });

    const contentType = getContentType(response.headers);
    switch (contentType) {
      case ContentType.Json:
        return response.json();

      case ContentType.XML:
      case ContentType.HTML:
      case ContentType.TextPlain:
        return response.text();

      default:
        return response;
    }
  }
  return response;
}
