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
  return requestBasedOnVerb(dispatch, query);
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

function parseResponse(resp: any, respHeaders: any) {
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

function requestBasedOnVerb(dispatch: Function, query: IQuery) {
  switch (query.selectedVerb) {
    case 'GET':
      return getRequest(query, dispatch);
    case 'POST':
      break;
    case 'PUT':
      break;
    case 'PATCH':
      break;
    case 'DELETE':
      break;
    default:
      return;
  }
}

function getRequest(query: IQuery, dispatch: Function) {
  const respHeaders: any = {};

  return GraphClient.getInstance()
    .api(query.sampleUrl)
    .responseType(ResponseType.RAW)
    .get()
    .then((resp) => {
      if (resp.ok) {
        return parseResponse(resp, respHeaders);
      }
      throw new Error('The request was not completed');
    }).then((json: object) => {
      dispatch(
        queryResponse({
          body: json,
          headers: respHeaders
        }),
      );
    });
}
