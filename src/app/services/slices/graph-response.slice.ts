import { BrowserAuthError } from '@azure/msal-browser';
import { MessageBarType } from '@fluentui/react';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { authenticationWrapper } from '../../../modules/authentication';
import { ClaimsChallenge } from '../../../modules/authentication/ClaimsChallenge';
import { historyCache } from '../../../modules/cache/history-utils';
import { ApplicationState } from '../../../store';
import { ContentType } from '../../../types/enums';
import { IHistoryItem } from '../../../types/history';
import { IGraphResponse } from '../../../types/query-response';
import { IQuery } from '../../../types/query-runner';
import { IStatus } from '../../../types/status';
import { ClientError } from '../../utils/error-utils/ClientError';
import { setStatusMessage } from '../../utils/status-message';
import { translateMessage } from '../../utils/translate-messages';
import {
  anonymousRequest,
  authenticatedRequest,
  generateResponseDownloadUrl,
  isFileResponse,
  isImageResponse,
  parseResponse,
  queryResultsInCorsError
} from '../actions/query-action-creator-util';
import { LOGOUT_SUCCESS } from '../redux-constants';
import { addHistoryItem } from './history.slice';
import { setQueryResponseStatus } from './query-status.slice';

const MAX_NUMBER_OF_RETRIES = 3;
let CURRENT_RETRIES = 0;

interface Result {
  body: any;
  headers: { [key: string]: string };
}

const initialState: IGraphResponse = {
  isLoadingData: false,
  response: {
    body: undefined,
    headers: undefined
  }
};

export const runQuery = createAsyncThunk(
  'query/runQuery',
  async (query: IQuery, { dispatch, getState, rejectWithValue }) => {
    const state = getState() as ApplicationState;
    const tokenPresent = !!state?.auth?.authToken?.token;
    const respHeaders: { [key: string]: string } = {};
    const createdAt = new Date().toISOString();

    try {
      const response: Response = tokenPresent
        ? await authenticatedRequest(query)
        : await anonymousRequest(query, getState);

      const result: Result = await processResponse(response, respHeaders, dispatch, query);

      const duration = new Date().getTime() - new Date(createdAt).getTime();
      const status = generateStatus({ duration, response });
      dispatch(setQueryResponseStatus(status));

      const historyItem = generateHistoryItem(status, respHeaders,
        query, createdAt, result, duration);
      dispatch(addHistoryItem(historyItem));

      return result;
    } catch (err: unknown) {
      const error = err as Error;
      const { status, body } = await handleError(error, query);
      dispatch(setQueryResponseStatus(status));
      if (body) {
        return rejectWithValue({ body, headers: {} });
      }
    }
  }
);

const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    setQueryResponse(state, action: PayloadAction<Result>) {
      state.isLoadingData = false;
      state.response = {
        body: action.payload.body,
        headers: action.payload.headers
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(runQuery.pending, (state) => {
        state.isLoadingData = true;
        state.response = {
          body: undefined,
          headers: undefined
        };
      })
      .addCase(runQuery.rejected, (state, action) => {
        state.isLoadingData = false;
        const actionPayload = action.payload as Result;
        state.response = {
          body: actionPayload.body!,
          headers: actionPayload.headers
        };
      })
      .addCase(LOGOUT_SUCCESS, (state) => {
        state.isLoadingData = false;
        state.response = {
          body: undefined,
          headers: undefined
        };
      })
      .addCase(runQuery.fulfilled, (state, action) => {
        state.isLoadingData = false;
        if (action.payload) {
          const actionPayload = action.payload as Result;
          state.response = {
            body: actionPayload.body,
            headers: actionPayload.headers
          };
        }
      });
  }
});

export const { setQueryResponse } = querySlice.actions;
export default querySlice.reducer;

async function processResponse(response: Response, respHeaders: { [key: string]: string },
  dispatch: Function, query: IQuery): Promise<Result> {
  let result = await parseResponse(response, respHeaders);
  if (response && response.ok) {
    CURRENT_RETRIES = 0;
    if (isFileResponse(respHeaders)) {
      const contentDownloadUrl = await generateResponseDownloadUrl(response, respHeaders);
      if (contentDownloadUrl) {
        result = { contentDownloadUrl };
      }
    }
  }

  if (response && response.status === 401 && CURRENT_RETRIES < MAX_NUMBER_OF_RETRIES) {
    const successful = await runReAuthenticatedRequest(response, query);
    if (successful) {
      dispatch(runQuery(query));
      return { body: null, headers: {} }; // returning an empty object for the original request
    }
  }

  return { body: result, headers: respHeaders };
}

const generateStatus = ({ duration, response }: { duration: number; response: Response }): IStatus => {
  const status: IStatus = {
    messageType: MessageBarType.error,
    ok: false,
    duration,
    status: response.status || 400,
    statusText: ''
  };

  if (response) {
    status.status = response.status;
    status.statusText = response.statusText === '' ? setStatusMessage(response.status) : response.statusText;
  }

  if (response && response.ok) {
    CURRENT_RETRIES = 0;
    status.ok = true;
    status.messageType = MessageBarType.success;
  }
  return status;
}

async function runReAuthenticatedRequest(response: Response, query: IQuery): Promise<boolean> {
  if (response.headers.get('www-authenticate')) {
    const account = authenticationWrapper.getAccount();
    if (!account) { return false; }
    new ClaimsChallenge(query, account).handle(response.headers);
    const authResult = await authenticationWrapper.logIn('', query);
    if (authResult.accessToken) {
      CURRENT_RETRIES += 1;
      return true;
    }
  }
  return false;
}

function generateHistoryItem(
  status: IStatus,
  respHeaders: { [key: string]: string },
  query: IQuery,
  createdAt: string,
  result: Result,
  duration: number
): IHistoryItem {
  let response = { ...result };
  const responseHeaders = { ...respHeaders };
  const contentType = respHeaders['content-type'];

  if (isImageResponse(contentType)) {
    response = { ...response, body: 'Run the query to view the image' };
    responseHeaders['content-type'] = ContentType.Json;
  }

  if (isFileResponse(respHeaders)) {
    response = { ...response, body: 'Run the query to generate file download URL' };
  }

  const historyItem: IHistoryItem = {
    index: -1,
    url: query.sampleUrl,
    method: query.selectedVerb,
    headers: query.sampleHeaders,
    body: query.sampleBody,
    responseHeaders,
    createdAt,
    status: status.status as number,
    statusText: status.statusText,
    duration,
    result: response.body
  };

  historyCache.writeHistoryData(historyItem);
  return historyItem;
}

async function handleError(error: Error, query: IQuery) {
  let body = null;
  const status: IStatus = {
    messageType: MessageBarType.error,
    ok: false,
    status: 400,
    statusText: 'Bad Request'
  };

  if (error instanceof ClientError) {
    status.status = error.message;
    status.statusText = error.name;
  }

  if (queryResultsInCorsError(query.sampleUrl)) {
    status.status = 0;
    status.statusText = 'CORS error';
    body = { throwsCorsError: true };
  }

  if (error instanceof BrowserAuthError) {
    if (error.errorCode === 'user_cancelled') {
      status.hint = translateMessage('user_cancelled');
    } else {
      status.statusText = `${error.name}: ${error.message}`;
    }
  }

  return { status, body };
}
