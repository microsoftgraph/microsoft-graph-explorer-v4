import graphResponseReducer, { setQueryResponse, runQuery } from './graph-response.slice';
import { LOGOUT_SUCCESS } from '../redux-constants';
import { configureStore } from '@reduxjs/toolkit';

jest.mock('../../../modules/authentication', () => ({
  authenticationWrapper: { getAccount: jest.fn(), logIn: jest.fn() }
}));
jest.mock('../../../modules/authentication/ClaimsChallenge', () => ({
  ClaimsChallenge: jest.fn().mockImplementation(() => ({ handle: jest.fn(), getClaimsFromStorage: jest.fn() }))
}));
jest.mock('../../../modules/cache/history-utils', () => ({
  historyCache: { writeHistoryData: jest.fn() }
}));
jest.mock('../../utils/translate-messages', () => ({
  translateMessage: (msg: string) => msg
}));
jest.mock('./history.slice', () => ({
  addHistoryItem: jest.fn((item) => ({ type: 'history/add', payload: item }))
}));
jest.mock('./query-status.slice', () => ({
  setQueryResponseStatus: jest.fn((status) => ({ type: 'queryStatus/set', payload: status }))
}));
jest.mock('../actions/query-action-creator-util', () => ({
  authenticatedRequest: jest.fn(),
  anonymousRequest: jest.fn(),
  generateResponseDownloadUrl: jest.fn(),
  isFileResponse: jest.fn(() => false),
  isImageResponse: jest.fn(() => false),
  parseResponse: jest.fn(),
  queryResultsInCorsError: jest.fn(() => false)
}));
jest.mock('../../utils/http-methods.utils', () => ({
  getHeaders: jest.fn(() => ({ 'content-type': 'application/json' }))
}));
jest.mock('../../utils/status-message', () => ({
  setStatusMessage: jest.fn((code) => `Status ${code}`)
}));

const { authenticatedRequest, anonymousRequest, parseResponse, queryResultsInCorsError, isImageResponse, isFileResponse } =
  require('../actions/query-action-creator-util');

describe('graph-response slice', () => {
  const initialState = {
    isLoadingData: false,
    response: {
      body: undefined,
      headers: {}
    }
  };

  it('should return initial state', () => {
    const state = graphResponseReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('should set query response', () => {
    const result = { body: { value: [{ id: '1' }] }, headers: { 'content-type': 'application/json' } };
    const state = graphResponseReducer(undefined, setQueryResponse(result));
    expect(state.isLoadingData).toBe(false);
    expect(state.response.body).toEqual(result.body);
    expect(state.response.headers).toEqual(result.headers);
  });

  it('should reset on LOGOUT_SUCCESS', () => {
    const loadingState = {
      isLoadingData: true,
      response: { body: { some: 'data' }, headers: { 'x-test': 'val' } }
    };
    const state = graphResponseReducer(loadingState, { type: LOGOUT_SUCCESS });
    expect(state.isLoadingData).toBe(false);
    expect(state.response.body).toBeUndefined();
    expect(state.response.headers).toEqual({});
  });

  describe('runQuery async thunk extra reducers', () => {
    it('should set isLoadingData true and clear response on pending', () => {
      const prevState = {
        isLoadingData: false,
        response: { body: { old: 'data' }, headers: { 'x-old': 'val' } }
      };
      const state = graphResponseReducer(prevState, { type: runQuery.pending.type });
      expect(state.isLoadingData).toBe(true);
      expect(state.response.body).toBeUndefined();
      expect(state.response.headers).toEqual({});
    });

    it('should set response body and headers on fulfilled', () => {
      const prevState = {
        isLoadingData: true,
        response: { body: undefined, headers: {} }
      };
      const payload = { body: { value: 'result' }, headers: { 'content-type': 'application/json' } };
      const state = graphResponseReducer(prevState, { type: runQuery.fulfilled.type, payload });
      expect(state.isLoadingData).toBe(false);
      expect(state.response.body).toEqual(payload.body);
      expect(state.response.headers).toEqual(payload.headers);
    });

    it('should handle fulfilled with undefined payload', () => {
      const prevState = {
        isLoadingData: true,
        response: { body: undefined, headers: {} }
      };
      const state = graphResponseReducer(prevState, { type: runQuery.fulfilled.type, payload: undefined });
      expect(state.isLoadingData).toBe(false);
      expect(state.response.body).toBeUndefined();
      expect(state.response.headers).toEqual({});
    });

    it('should set error body on rejected', () => {
      const prevState = {
        isLoadingData: true,
        response: { body: undefined, headers: {} }
      };
      const payload = { body: { error: { message: 'Bad Request' } }, headers: {} };
      const state = graphResponseReducer(prevState, { type: runQuery.rejected.type, payload });
      expect(state.isLoadingData).toBe(false);
      expect(state.response.body).toEqual(payload.body);
      expect(state.response.headers).toEqual({});
    });

    it('should handle rejected with throwsCorsError body', () => {
      const prevState = {
        isLoadingData: true,
        response: { body: undefined, headers: {} }
      };
      const payload = { body: { throwsCorsError: true }, headers: {} };
      const state = graphResponseReducer(prevState, { type: runQuery.rejected.type, payload });
      expect(state.isLoadingData).toBe(false);
      expect(state.response.body).toEqual({ throwsCorsError: true });
    });
  });

  describe('runQuery thunk - dispatched', () => {
    const sampleQuery = {
      sampleUrl: 'https://graph.microsoft.com/v1.0/me',
      selectedVerb: 'GET',
      selectedVersion: 'v1.0',
      sampleHeaders: []
    };

    function createStore(tokenPresent = true) {
      return configureStore({
        reducer: {
          graphResponse: graphResponseReducer,
          auth: () => ({ authToken: { token: tokenPresent } }),
          sampleQuery: () => sampleQuery
        }
      });
    }

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('dispatches fulfilled with parsed response for authenticated request', async () => {
      const mockResponse = new Response(JSON.stringify({ value: [{ id: '1' }] }), {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' }
      });
      authenticatedRequest.mockResolvedValue(mockResponse);
      parseResponse.mockResolvedValue({ value: [{ id: '1' }] });

      const store = createStore(true);
      const result = await store.dispatch(runQuery(sampleQuery));

      expect(result.type).toBe('query/runQuery/fulfilled');
      expect(authenticatedRequest).toHaveBeenCalledWith(sampleQuery);
    });

    it('dispatches fulfilled for anonymous request when not authenticated', async () => {
      const mockResponse = new Response(JSON.stringify({ value: [] }), {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' }
      });
      anonymousRequest.mockResolvedValue(mockResponse);
      parseResponse.mockResolvedValue({ value: [] });

      const store = createStore(false);
      const result = await store.dispatch(runQuery(sampleQuery));

      expect(result.type).toBe('query/runQuery/fulfilled');
      expect(anonymousRequest).toHaveBeenCalled();
    });

    it('dispatches rejected with CORS error body', async () => {
      authenticatedRequest.mockRejectedValue(new Error('Network error'));
      queryResultsInCorsError.mockReturnValue(true);

      const store = createStore(true);
      const result = await store.dispatch(runQuery(sampleQuery));

      expect(result.type).toBe('query/runQuery/rejected');
      expect(result.payload).toEqual({ body: { throwsCorsError: true }, headers: {} });
    });

    it('dispatches rejected for generic errors without CORS', async () => {
      authenticatedRequest.mockRejectedValue(new Error('Unknown error'));
      queryResultsInCorsError.mockReturnValue(false);

      const store = createStore(true);
      const result = await store.dispatch(runQuery(sampleQuery));

      expect(result.type).toBe('query/runQuery/rejected');
    });

    it('handles image response in history item', async () => {
      const mockResponse = new Response('binary-data', {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'image/png' }
      });
      authenticatedRequest.mockResolvedValue(mockResponse);
      parseResponse.mockResolvedValue('binary-data');
      isImageResponse.mockReturnValue(true);

      const store = createStore(true);
      await store.dispatch(runQuery(sampleQuery));

      expect(isImageResponse).toHaveBeenCalled();
    });

    it('handles file response in history item', async () => {
      const mockResponse = new Response('file-data', {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/octet-stream' }
      });
      authenticatedRequest.mockResolvedValue(mockResponse);
      parseResponse.mockResolvedValue('file-data');
      isFileResponse.mockReturnValue(true);
      const { generateResponseDownloadUrl } = require('../actions/query-action-creator-util');
      generateResponseDownloadUrl.mockResolvedValue('https://download.url');

      const store = createStore(true);
      await store.dispatch(runQuery(sampleQuery));

      expect(isFileResponse).toHaveBeenCalled();
    });

    it('dispatches rejected when authenticatedRequest throws ClientError', async () => {
      const ClientError = class extends Error {
        constructor(msg: any) { super(msg.error || 'client error'); this.name = 'ClientError'; }
      };
      authenticatedRequest.mockRejectedValue(new ClientError({ error: 'sandbox error' }));
      queryResultsInCorsError.mockReturnValue(false);

      const store = createStore(true);
      const result = await store.dispatch(runQuery(sampleQuery));

      expect(result.type).toBe('query/runQuery/rejected');
    });

    it('handles response with non-200 status code', async () => {
      const mockResponse = new Response(JSON.stringify({ error: { message: 'Not Found' } }), {
        status: 404,
        statusText: 'Not Found',
        headers: { 'content-type': 'application/json' }
      });
      authenticatedRequest.mockResolvedValue(mockResponse);
      parseResponse.mockResolvedValue({ error: { message: 'Not Found' } });

      const store = createStore(true);
      const result = await store.dispatch(runQuery(sampleQuery));

      expect(result.type).toBe('query/runQuery/fulfilled');
    });

    it('handles anonymous request with body for POST', async () => {
      const postQuery = {
        ...sampleQuery,
        selectedVerb: 'POST',
        sampleBody: { displayName: 'Test' }
      };
      const mockResponse = new Response(JSON.stringify({ id: '123' }), {
        status: 201,
        statusText: 'Created',
        headers: { 'content-type': 'application/json' }
      });
      anonymousRequest.mockResolvedValue(mockResponse);
      parseResponse.mockResolvedValue({ id: '123' });

      const store = createStore(false);
      const result = await store.dispatch(runQuery(postQuery));

      expect(result.type).toBe('query/runQuery/fulfilled');
      expect(anonymousRequest).toHaveBeenCalled();
    });

    it('handles response with empty statusText', async () => {
      const mockResponse = new Response(JSON.stringify({ value: [] }), {
        status: 200,
        statusText: '',
        headers: { 'content-type': 'application/json' }
      });
      authenticatedRequest.mockResolvedValue(mockResponse);
      parseResponse.mockResolvedValue({ value: [] });

      const store = createStore(true);
      const result = await store.dispatch(runQuery(sampleQuery));

      expect(result.type).toBe('query/runQuery/fulfilled');
    });

    it('handles 401 response without www-authenticate header', async () => {
      const mockResponse = new Response(JSON.stringify({ error: { message: 'Unauthorized' } }), {
        status: 401,
        statusText: 'Unauthorized',
        headers: { 'content-type': 'application/json' }
      });
      authenticatedRequest.mockResolvedValue(mockResponse);
      parseResponse.mockResolvedValue({ error: { message: 'Unauthorized' } });

      const store = createStore(true);
      const result = await store.dispatch(runQuery(sampleQuery));

      expect(result.type).toBe('query/runQuery/fulfilled');
    });

    it('handles 401 response with www-authenticate and re-auth', async () => {
      const { authenticationWrapper } = require('../../../modules/authentication');
      const mockResponse = new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        statusText: 'Unauthorized',
        headers: { 'content-type': 'application/json', 'www-authenticate': 'Bearer claims="test"' }
      });
      authenticatedRequest.mockResolvedValue(mockResponse);
      parseResponse.mockResolvedValue({ error: 'Unauthorized' });
      authenticationWrapper.getAccount.mockReturnValue({ username: 'user@test.com' });
      authenticationWrapper.logIn.mockResolvedValue({ accessToken: 'new-token' });

      const store = createStore(true);
      const result = await store.dispatch(runQuery(sampleQuery));
      // Re-auth dispatches another runQuery, original returns empty
      expect(result.type).toBe('query/runQuery/fulfilled');
    });

    it('handles 401 response with www-authenticate but no account', async () => {
      const { authenticationWrapper } = require('../../../modules/authentication');
      const mockResponse = new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        statusText: 'Unauthorized',
        headers: { 'content-type': 'application/json', 'www-authenticate': 'Bearer claims="test"' }
      });
      authenticatedRequest.mockResolvedValue(mockResponse);
      parseResponse.mockResolvedValue({ error: 'Unauthorized' });
      authenticationWrapper.getAccount.mockReturnValue(null);

      const store = createStore(true);
      const result = await store.dispatch(runQuery(sampleQuery));
      expect(result.type).toBe('query/runQuery/fulfilled');
    });

    it('handles BrowserAuthError with user_cancelled', async () => {
      const { BrowserAuthError } = require('@azure/msal-browser');
      const error = new BrowserAuthError('user_cancelled', 'User cancelled');
      authenticatedRequest.mockRejectedValue(error);
      queryResultsInCorsError.mockReturnValue(false);

      const store = createStore(true);
      const result = await store.dispatch(runQuery(sampleQuery));
      expect(result.type).toBe('query/runQuery/rejected');
    });

    it('handles BrowserAuthError with non user_cancelled code', async () => {
      const { BrowserAuthError } = require('@azure/msal-browser');
      const error = new BrowserAuthError('interaction_required', 'Interaction required');
      authenticatedRequest.mockRejectedValue(error);
      queryResultsInCorsError.mockReturnValue(false);

      const store = createStore(true);
      const result = await store.dispatch(runQuery(sampleQuery));
      expect(result.type).toBe('query/runQuery/rejected');
    });

    it('handles file response with download URL', async () => {
      const mockResponse = new Response('file-data', {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/octet-stream', 'content-disposition': 'attachment;filename=file.pdf' }
      });
      authenticatedRequest.mockResolvedValue(mockResponse);
      parseResponse.mockResolvedValue('file-data');
      isFileResponse.mockReturnValue(true);
      const { generateResponseDownloadUrl } = require('../actions/query-action-creator-util');
      generateResponseDownloadUrl.mockResolvedValue('https://download.url/file.pdf');
      const { getHeaders } = require('../../utils/http-methods.utils');
      getHeaders.mockReturnValue({ 'content-type': 'application/octet-stream', 'content-disposition': 'attachment;filename=file.pdf' });

      const store = createStore(true);
      const result = await store.dispatch(runQuery(sampleQuery));
      expect(result.type).toBe('query/runQuery/fulfilled');
      expect(result.payload.body).toEqual({ contentDownloadUrl: 'https://download.url/file.pdf' });
    });

    it('handles file response when download URL is null', async () => {
      const mockResponse = new Response('file-data', {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/octet-stream' }
      });
      authenticatedRequest.mockResolvedValue(mockResponse);
      parseResponse.mockResolvedValue('file-data');
      isFileResponse.mockReturnValue(true);
      const { generateResponseDownloadUrl } = require('../actions/query-action-creator-util');
      generateResponseDownloadUrl.mockResolvedValue(null);

      const store = createStore(true);
      const result = await store.dispatch(runQuery(sampleQuery));
      expect(result.type).toBe('query/runQuery/fulfilled');
    });

    it('handles non-Response objects (e.g. from proxy)', async () => {
      const plainResponse = { value: [{ id: '1' }] };
      authenticatedRequest.mockResolvedValue(plainResponse);
      parseResponse.mockResolvedValue(plainResponse);
      const { getHeaders } = require('../../utils/http-methods.utils');
      getHeaders.mockReturnValue({});

      const store = createStore(true);
      const result = await store.dispatch(runQuery(sampleQuery));
      expect(result.type).toBe('query/runQuery/fulfilled');
    });
  });

  describe('setQueryResponse reducer', () => {
    it('should set response with body and headers', () => {
      const result = { body: { data: 'test' }, headers: { 'x-custom': 'value' } };
      const state = graphResponseReducer(
        { isLoadingData: true, response: { body: undefined, headers: {} } },
        setQueryResponse(result)
      );
      expect(state.isLoadingData).toBe(false);
      expect(state.response.body).toEqual({ data: 'test' });
      expect(state.response.headers).toEqual({ 'x-custom': 'value' });
    });

    it('should overwrite previous response', () => {
      const prevState = {
        isLoadingData: false,
        response: { body: { old: 'data' }, headers: { 'old-header': 'val' } }
      };
      const result = { body: { new: 'data' }, headers: { 'new-header': 'val' } };
      const state = graphResponseReducer(prevState, setQueryResponse(result));
      expect(state.response.body).toEqual({ new: 'data' });
      expect(state.response.headers).toEqual({ 'new-header': 'val' });
    });
  });
});
