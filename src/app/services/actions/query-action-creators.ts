import { MessageBarType } from '@fluentui/react';

import { ContentType } from '../../../types/enums';
import { IHistoryItem } from '../../../types/history';
import { IQuery } from '../../../types/query-runner';
import { IStatus } from '../../../types/status';
import { setStatusMessage } from '../../utils/status-message';
import { writeHistoryData } from '../../views/sidebar/history/history-utils';
import {
  anonymousRequest,
  authenticatedRequest,
  generateResponseDownloadUrl,
  isFileResponse,
  isImageResponse,
  parseResponse,
  queryResponse,
  queryResultsInCorsError
} from './query-action-creator-util';
import { setQueryResponseStatus } from './query-status-action-creator';
import { addHistoryItem } from './request-history-action-creators';

export function runQuery(query: IQuery): Function {
  return (dispatch: Function, getState: Function) => {
    const tokenPresent = !!getState()?.authToken?.token;
    const respHeaders: any = {};
    const createdAt = new Date().toISOString();

    if (tokenPresent) {
      return authenticatedRequest(dispatch, query)
        .then(async (response: Response) => {
          await processResponse(
            response,
            respHeaders,
            dispatch,
            createdAt,
            tokenPresent
          );
        })
        .catch(async (error: any) => {
          dispatch(
            queryResponse({
              body: error,
              headers: null
            })
          );
          return dispatch(
            setQueryResponseStatus({
              messageType: MessageBarType.error,
              ok: false,
              status: 400,
              statusText: 'Bad Request'
            })
          );
        });
    }

    return anonymousRequest(dispatch, query, getState).then(
      async (response: Response) => {
        await processResponse(
          response,
          respHeaders,
          dispatch,
          createdAt,
          tokenPresent
        );
      }
    );
  };

  async function processResponse(
    response: Response,
    respHeaders: any,
    dispatch: Function,
    createdAt: any,
    tokenPresent: boolean
  ) {
    let result = await parseResponse(response, respHeaders);
    const duration = new Date().getTime() - new Date(createdAt).getTime();
    createHistory(
      response,
      respHeaders,
      query,
      createdAt,
      dispatch,
      result,
      duration
    );

    const status: IStatus = {
      messageType: MessageBarType.error,
      ok: false,
      duration,
      status: 400,
      statusText: ''
    };

    if (response) {
      status.status = response.status;
      status.statusText = response.statusText === '' ? setStatusMessage(response.status) : response.statusText;
    }

    if (response && response.ok) {
      status.ok = true;
      status.messageType = MessageBarType.success;

      dispatch(setQueryResponseStatus(status));

      if (isFileResponse(respHeaders)) {
        const contentDownloadUrl = await generateResponseDownloadUrl(
          response,
          respHeaders
        );
        if (contentDownloadUrl) {
          result = {
            contentDownloadUrl
          };
        }
      }

      return dispatch(
        queryResponse({
          body: result,
          headers: respHeaders
        })
      );
    } else {
      if (
        response.status === 0 &&
        tokenPresent &&
        queryResultsInCorsError(query)
      ) {
        fetchContentDownloadUrl(query, dispatch);
      } else {
        dispatch(
          queryResponse({
            body: result,
            headers: respHeaders
          })
        );
        return dispatch(setQueryResponseStatus(status));
      }
    }
  }
}

async function fetchContentDownloadUrl(
  sampleQuery: IQuery,
  dispatch: Function
) {
  const requestUrl = new URL(sampleQuery.sampleUrl);
  const isOriginalFormat = !requestUrl.searchParams.has('format');

  // drop any search params from query URL
  requestUrl.search = '';

  // remove /content from path
  requestUrl.pathname = requestUrl.pathname.replace(/\/content(\/)*$/i, '');

  // set new sampleUrl for fetching download URL
  const query: IQuery = { ...sampleQuery };
  query.sampleUrl = requestUrl.toString();

  const status: IStatus = {
    messageType: MessageBarType.error,
    ok: false,
    status: 400,
    statusText: ''
  };

  authenticatedRequest(dispatch, query)
    .then(async (response: Response) => {
      if (response) {
        status.status = response.status;
        status.statusText = response.statusText;
        status.ok = response.ok;

        if (response.ok) {
          status.messageType = MessageBarType.success;

          const result = await parseResponse(response);
          const downloadUrl = result['@microsoft.graph.downloadUrl'];

          dispatch(
            queryResponse({
              body: {
                contentDownloadUrl: downloadUrl,
                isOriginalFormat,
                isWorkaround: true
              },
              headers: null
            })
          );
        }
      } else {
        dispatch(
          queryResponse({
            body: null,
            headers: null
          })
        );
      }
      return dispatch(setQueryResponseStatus(status));
    })
    .catch(async (error: any) => {
      dispatch(
        queryResponse({
          body: error,
          headers: null
        })
      );
      return dispatch(setQueryResponseStatus(status));
    });
}

async function createHistory(
  response: Response,
  respHeaders: any,
  query: IQuery,
  createdAt: any,
  dispatch: Function,
  result: any,
  duration: number
) {
  const status = response.status;
  const statusText = response.statusText;
  const responseHeaders = { ...respHeaders };
  const contentType = respHeaders['content-type'];

  if (isImageResponse(contentType)) {
    result = {
      message: 'Run the query to view the image'
    };
    responseHeaders['content-type'] = ContentType.Json;
  }

  if (isFileResponse(respHeaders)) {
    result = {
      message: 'Run the query to generate file download URL'
    };
  }

  const historyItem: IHistoryItem = {
    index: -1,
    url: query.sampleUrl,
    method: query.selectedVerb,
    headers: query.sampleHeaders,
    body: query.sampleBody,
    responseHeaders,
    createdAt,
    status,
    statusText,
    duration,
    result
  };

  writeHistoryData(historyItem);

  dispatch(addHistoryItem(historyItem));
  return result;
}
