import { BrowserAuthError } from '@azure/msal-browser';
import { MessageBarType } from '@fluentui/react';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { authenticationWrapper } from '../../../modules/authentication';
import { ClaimsChallenge } from '../../../modules/authentication/ClaimsChallenge';
import { historyCache } from '../../../modules/cache/history-utils';
import { ContentType } from '../../../types/enums';
import { IHistoryItem } from '../../../types/history';
import { IGraphResponse } from '../../../types/query-response';
import { IQuery } from '../../../types/query-runner';
import { ApplicationState } from '../../../types/root';
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
import { addHistoryItem } from '../actions/request-history-action-creators';
import { setQueryResponseStatus } from './query-status.slice';

const MAX_NUMBER_OF_RETRIES = 3;
let CURRENT_RETRIES = 0;

const initialState: IGraphResponse = {
  body: undefined,
  headers: undefined
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
        ? await authenticatedRequest(dispatch, query)
        : await anonymousRequest(dispatch, query, getState);

      const result = await processResponse(response, respHeaders, dispatch, createdAt, query);
      return { body: result, headers: respHeaders };
    } catch (error) {
      return rejectWithValue(await handleError(dispatch, error, query));
    }
  }
);

const querySlice = createSlice({
  name: 'query',
  initialState,
  reducers: {
    setQueryResponse(state, action: PayloadAction<IGraphResponse>) {
      state.body = action.payload.body;
      state.headers = action.payload.headers;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(runQuery.pending, (state) => {
        state.body = undefined;
        state.headers = undefined;
      })
      .addCase(runQuery.rejected, (state, action) => {
        const payload = action.payload as IGraphResponse;
        state.body = payload.body;
        state.headers = payload.headers;
      })
      .addCase(runQuery.fulfilled, (state, action) => {
        state.body = action.payload.body;
        state.headers = action.payload.headers;
      });
  }
});

export const { setQueryResponse } = querySlice.actions;
export default querySlice.reducer;

async function processResponse(
  response: Response,
  respHeaders: { [key: string]: string },
  dispatch: Function,
  createdAt: string,
  query: IQuery
) {
  let result = await parseResponse(response, respHeaders);
  const duration = new Date().getTime() - new Date(createdAt).getTime();
  await createHistory(response, respHeaders, query, createdAt, dispatch, result, duration);

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

  dispatch(setQueryResponseStatus(status));
  return { body: result, headers: respHeaders };
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

async function createHistory(
  response: Response,
  respHeaders: any,
  query: IQuery,
  createdAt: string,
  dispatch: Function,
  result: any,
  duration: number
) {
  const status = response.status;
  const statusText = response.statusText === '' ? setStatusMessage(status) : response.statusText;
  const responseHeaders = { ...respHeaders };
  const contentType = respHeaders['content-type'];

  if (isImageResponse(contentType)) {
    result = { message: 'Run the query to view the image' };
    responseHeaders['content-type'] = ContentType.Json;
  }

  if (isFileResponse(respHeaders)) {
    result = { message: 'Run the query to generate file download URL' };
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

  historyCache.writeHistoryData(historyItem);

  dispatch(addHistoryItem(historyItem));
  return result;
}

async function handleError(dispatch: Function, error: any, query: IQuery) {
  let body = error;
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

  dispatch(setQueryResponse({ body, headers: {} }));
  return { status, body };
}
