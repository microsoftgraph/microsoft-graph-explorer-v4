import { ResponseType } from '@microsoft/microsoft-graph-client';
import { IAction } from '../../../types/action';
import { IQuery } from '../../../types/query-runner';
import { IRequestOptions } from '../../../types/request';
import { GraphClient } from '../graph-client';
import { QUERY_GRAPH_SUCCESS } from '../redux-constants';
import { queryResponseError } from './error-action-creator';
import { profileRequestSuccess } from './profile-action-creators';
import { queryRunningStatus } from './query-loading-action-creators';

export function queryResponse(response: object): IAction {
  return {
    type: QUERY_GRAPH_SUCCESS,
    response,
  };
}

export function anonymousRequest(dispatch: Function, query: IQuery) {

  const authToken = '{token:https://graph.microsoft.com/}';
  const graphUrl = `https://proxy.apisandbox.msdn.microsoft.com/svc?url=${query.sampleUrl}`;
  const respHeaders: any = {};
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

  return fetch(graphUrl, options)
    .then((resp) => {
      if (resp.ok) {
        return parseResponse(resp, respHeaders);
      }
      return resp;
    })
    .then((json) => {
      if (json.ok === false) {
        return dispatch(queryResponseError(json));
      }

      return dispatch(
        queryResponse({
          body: json,
          headers: respHeaders,
        }),
      );
    });
}

export function authenticatedRequest(dispatch: Function, query: IQuery, profileRequest: boolean) {
  return makeRequest(query.selectedVerb, profileRequest)(dispatch, query);
}

export function isImageResponse(contentType: string) {
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

function parseResponse(resp: any, respHeaders: any): Promise<any> {
  resp.headers.forEach((val: any, key: any) => {
    respHeaders[key] = val;
  });

  const contentType = getContentType(resp.headers);
  if (contentType && isImageResponse(contentType)) {
    return resp;
  } else {
    return resp.json();
  }
}

const makeRequest = (httpVerb: string, profileRequest: boolean): Function => {
  return async (dispatch: Function, query: IQuery) => {
    const respHeaders: any = {};
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

    dispatch(profileRequestSuccess(profileRequest));

    if (response.ok) {
      const json = await parseResponse(response, respHeaders);
      return dispatch(
        queryResponse({
          body: json,
          headers: respHeaders
        }),
      );
    }
    return dispatch(queryResponseError(response));
  };
};
