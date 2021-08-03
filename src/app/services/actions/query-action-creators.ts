import { MessageBarType } from 'office-ui-fabric-react';
import { ContentType } from '../../../types/enums';
import { IHistoryItem } from '../../../types/history';
import { IQuery } from '../../../types/query-runner';
import { IStatus } from '../../../types/status';
import { writeHistoryData } from '../../views/sidebar/history/history-utils';
import { TEAMS_APP_ID, RSC_HIDE_POPUP } from '../graph-constants';
import { changePopUp } from './permission-mode-action-creator';
import {
  anonymousRequest, authenticatedRequest,
  isImageResponse, parseResponse, queryResponse
} from './query-action-creator-util';
import { setQueryResponseStatus } from './query-status-action-creator';
import { addHistoryItem } from './request-history-action-creators';

export function runQuery(query: IQuery): Function {
  return (dispatch: Function, getState: Function) => {
    const tokenPresent = !!getState()?.authToken?.token;
    const respHeaders: any = {};
    const createdAt = new Date().toISOString();

    if (tokenPresent) {
      return authenticatedRequest(dispatch, query).then(async (response: Response) => {
        await processResponse(response, respHeaders, dispatch, createdAt);
      }).catch(async (error: any) => {
        dispatch(queryResponse({
          body: error,
          headers: null
        }));
        return dispatch(setQueryResponseStatus({
          messageType: MessageBarType.error,
          ok: false,
          status: 400,
          statusText: 'Bad Request'
        }));
      });
    }

    return anonymousRequest(dispatch, query, getState).then(async (response: Response) => {
      await processResponse(response, respHeaders, dispatch, createdAt);
    });
  };

  async function processResponse(response: Response, respHeaders: any, dispatch: Function,
    createdAt: any) {

    const result = await parseResponse(response, respHeaders);
    const duration = (new Date()).getTime() - new Date(createdAt).getTime();
    createHistory(response, respHeaders, query, createdAt, dispatch, result, duration);

    const status: IStatus = {
      messageType: MessageBarType.error,
      ok: false,
      duration,
      status: 400,
      statusText: ''
    };

    if (response) {
      status.status = response.status;
      status.statusText = response.statusText;
    }

    if (response && response.ok) {

      status.ok = true;
      status.messageType = MessageBarType.success;

      dispatch(setQueryResponseStatus(status));

      return dispatch(queryResponse({
        body: result,
        headers: respHeaders
      }));
    }
    else {
      dispatch(queryResponse({
        body: result,
        headers: respHeaders
      }));
      return dispatch(setQueryResponseStatus(status));
    }

  }
}

async function createHistory(response: Response, respHeaders: any, query: IQuery,
  createdAt: any, dispatch: Function, result: any, duration: number) {
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
    result,
  };

  writeHistoryData(historyItem);

  dispatch(addHistoryItem(historyItem));
  return result;
}

export function toggleRSCPopup(query: IQuery): Function {
  return (dispatch: Function, getState: Function) => {
    const tokenPresent = !!getState()?.authToken?.token;
    const respHeaders: any = {};

    if (tokenPresent && localStorage.getItem(RSC_HIDE_POPUP) !== "true") {
      return authenticatedRequest(dispatch, query).then(async (response: Response) => {
        const result = await parseResponse(response, respHeaders);
        for (const i of result.value) {
          // check if Sample Teams App is installed
          if (i.teamsApp.externalId === TEAMS_APP_ID) {
            if (!getState().hideDialog) {
              dispatch(changePopUp(true));
            }
            return
          }
        }
        dispatch(changePopUp(false));
      }).catch(async () => {
        dispatch(changePopUp(false));
      }
      )
    }
  };
}
