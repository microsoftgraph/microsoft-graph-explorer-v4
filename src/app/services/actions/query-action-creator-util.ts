import { ResponseType } from '@microsoft/microsoft-graph-client';

import { IAction } from '../../../types/action';
import { IQuery } from '../../../types/query-runner';
import { IRequestOptions } from '../../../types/request';
import { QUERY_GRAPH_ERROR, QUERY_GRAPH_SUCCESS } from '../constants';
import { GraphClient } from '../graph-client';

export function queryResponseError(response: object): IAction {
  return {
    type: QUERY_GRAPH_ERROR,
    response,
  };
}

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

  const headers = {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  };


  let options: IRequestOptions = {};
  options = { method: query.selectedVerb, headers};

  return fetch(graphUrl, options)
    .then((resp) => {
      if (resp.ok) {
        return parseResponse(resp, respHeaders);
      }
      throw new Error('The request was not completed');
    })
    .then((json) =>

      dispatch(
        queryResponse({
          body: json,
          headers: respHeaders,
        }),
      ),
    )
    .catch((error) => dispatch(queryResponseError(error)));
}

export function authenticatedRequest(dispatch: Function, query: IQuery) {
  return makeRequest(query.selectedVerb)(dispatch, query);
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

const makeRequest = (httpVerb: string): Function => {
  return async (dispatch: Function, query: IQuery) => {
    const respHeaders: any = {};

    const client = GraphClient.getInstance()
      .api(query.sampleUrl)
      .responseType(ResponseType.RAW);

    let response;

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

    if (response.ok) {
      const json = await parseResponse(response, respHeaders);
      return dispatch(
        queryResponse({
          body: json,
          headers: respHeaders
        })
      );
    }
    dispatch(queryResponseError(response.body));
  };
};
