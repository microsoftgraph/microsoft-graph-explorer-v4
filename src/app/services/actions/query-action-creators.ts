import { MessageBarType } from '@fluentui/react';

import { ContentType } from '../../../types/enums';
import { IHistoryItem } from '../../../types/history';
import { IQuery } from '../../../types/query-runner';
import { IStatus } from '../../../types/status';
import { sanitizeQueryUrl } from '../../utils/query-url-sanitization';
import { parseSampleUrl } from '../../utils/sample-url-generation';
import { setStatusMessage } from '../../utils/status-message';
import { writeHistoryData } from '../../views/sidebar/history/history-utils';
import { CORS_ERROR_QUERIES } from '../graph-constants';
import {
  anonymousRequest,
  authenticatedRequest,
  generateResponseDownloadUrl,
  isFileResponse,
  isImageResponse,
  parseResponse,
  queryResponse
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
          );
        })
        .catch(async (error: any) => {
          return handleError(dispatch, error);
        });
    }

    return anonymousRequest(dispatch, query, getState)
      .then(
        async (response: Response) => {
          await processResponse(
            response,
            respHeaders,
            dispatch,
            createdAt,
          );
        }
      ).catch(async (error: any) => {
        return handleError(dispatch, error);
      });
  };

  async function processResponse(
    response: Response,
    respHeaders: any,
    dispatch: Function,
    createdAt: any,
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
      status.statusText =
        response.statusText === ''
          ? setStatusMessage(response.status)
          : response.statusText;
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
      const { requestUrl } = parseSampleUrl(sanitizeQueryUrl(query.sampleUrl));
      // check if this is one of the queries that result in a CORS error
      if (response.status === 0 && CORS_ERROR_QUERIES.has(requestUrl)) {
        result = {
          throwsCorsError: true,
          workload: CORS_ERROR_QUERIES.get(requestUrl)
        };
      }

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

function handleError(dispatch: Function, error: any) {
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
  const statusText = response.statusText === '' ? setStatusMessage(status) : response.statusText;
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
