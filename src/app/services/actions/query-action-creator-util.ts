import { ResponseType } from '@microsoft/microsoft-graph-client';
import { IAction } from '../../../types/action';
import { IQuery } from '../../../types/query-runner';
import { IRequestOptions } from '../../../types/request';
import { GraphClient } from '../graph-client';
import { QUERY_GRAPH_SUCCESS } from '../redux-constants';
import { queryRunningStatus } from './query-loading-action-creators';

export function queryResponse(response: object): IAction {
  return {
    type: QUERY_GRAPH_SUCCESS,
    response,
  };
}

export async function anonymousRequest(dispatch: Function, query: IQuery) {

  const authToken = '{token:https://graph.microsoft.com/}';
  const graphUrl = `https://proxy.apisandbox.msdn.microsoft.com/svc?url=${query.sampleUrl}`;
  const sampleHeaders: any = {};

  if (query.sampleHeaders) {
    query.sampleHeaders.forEach(header => {
      if (header.name !== '' && header.value !== '') {
        sampleHeaders[header.name] = header.value;
      }
    });
  }

  const headers = {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json',
    ...sampleHeaders
  };

  const options: IRequestOptions = { method: query.selectedVerb, headers };

  dispatch(queryRunningStatus(true));

  return fetch(graphUrl, options);
}

export function authenticatedRequest(dispatch: Function, query: IQuery) {
  return makeRequest(query.selectedVerb)(dispatch, query);
}

export function isImageResponse(contentType: string) {
  if (!contentType) { return false; }
  return (
    contentType === 'application/octet-stream' ||
    contentType.substr(0, 6) === 'image/'
  );
}

export function getContentType(headers: Headers) {
  const full = headers.get('content-type');
  if (full) {
    const delimiterPos = full.indexOf(';');
    if (delimiterPos !== -1) {
      return full.substr(0, delimiterPos);
    } else {
      return full;
    }
  }
}

export function parseResponse(response: any, respHeaders: any): Promise<any> {
  if (response && response.headers) {
    response.headers.forEach((val: any, key: any) => {
      respHeaders[key] = val;
    });

    const contentType = getContentType(response.headers);
    if (contentType && isImageResponse(contentType)) {
      return response;
    } else {
      if (response.ok) {
        return response.json();
      }
    }
  }
  return response;
}

const makeRequest = (httpVerb: string): Function => {
  return async (dispatch: Function, query: IQuery) => {
    const sampleHeaders: any = {};

    if (query.sampleHeaders) {
      query.sampleHeaders.forEach(header => {
        if (header.name !== '' && header.value !== '') {
          sampleHeaders[header.name] = header.value;
        }
      });
    }

    const client = GraphClient.getInstance()
      .api(query.sampleUrl)
      .headers(sampleHeaders)
      .responseType(ResponseType.RAW);

    let response;

    dispatch(queryRunningStatus(true));

    switch (httpVerb) {
      case 'GET':
        response = await client.get();
        break;
      case 'POST':
        response = await client.post(query.sampleBody);
        break;
      case 'PUT':
        response = await client.put(query.sampleBody);
        break;
      case 'PATCH':
        response = await client.patch(query.sampleBody);
        break;
      case 'DELETE':
        response = await client.delete();
        break;
      default:
        return;
    }

    return Promise.resolve(response);
  };
};
