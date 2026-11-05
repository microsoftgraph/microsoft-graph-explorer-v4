import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ApplicationState } from '../../../store';
import { IRequestOptions } from '../../../types/request';
import { ISnippet, Snippet, SnippetError } from '../../../types/snippets';
import { parseSampleUrl } from '../../utils/sample-url-generation';
import { constructHeaderString } from '../../utils/snippet.utils';
import { fetchDevxApi, getDevxConfiguration } from '../devx-api';
import { devxConfigurationChanged } from '../devx-events';

const initialState: ISnippet & { requestId?: string } = {
  pending: false,
  data: {} as Snippet,
  error: {} as SnippetError,
  snippetTab: 'csharp'
};

export const getSnippet = createAsyncThunk<object, string>(
  'snippet/getSnippet',
  async (language, { getState, rejectWithValue, signal }) => {
    const state = getState() as ApplicationState;
    const { sampleQuery } = state;
    const config = getDevxConfiguration(state);

    try {
      const parameters: Record<string, string> = {};

      const { requestUrl, sampleUrl, queryVersion, search } = parseSampleUrl(
        sampleQuery.sampleUrl
      );

      if (!sampleUrl) {
        throw new Error('url is invalid');
      }

      if (language !== 'csharp') {
        parameters.lang = language;
      }

      const openApiSnippets: string[] = ['go', 'powershell', 'python', 'cli', 'php'];
      if (openApiSnippets.includes(language)) {
        parameters.generation = 'openapi';
      }

      const method = 'POST';
      const headers = {
        'Content-Type': 'application/http'
      };

      const requestBody =
        sampleQuery.sampleBody && Object.keys(sampleQuery.sampleBody).length !== 0
          ? JSON.stringify(sampleQuery.sampleBody)
          : '';

      const httpVersion = 'HTTP/1.1';
      const host = 'Host: graph.microsoft.com';
      const sampleHeaders = constructHeaderString(sampleQuery);

      // eslint-disable-next-line max-len
      let body = `${sampleQuery.selectedVerb} /${queryVersion}/${requestUrl + search} ${httpVersion}\r\n${host}\r\n${sampleHeaders}\r\n\r\n`;
      if (sampleQuery.selectedVerb !== 'GET') {
        body += `${requestBody}`;
      }

      const options: IRequestOptions & { signal?: AbortSignal } = { method, headers, body, signal };

      const response = await fetchDevxApi(config, '/api/graphexplorersnippets', parameters, options);
      if (response.ok) {
        const result = await response.text();
        return { [language]: result };
      }
      throw new Error(response.statusText);
    } catch (err: unknown) {
      const error = err as Error;
      return rejectWithValue({ error: error.message, language });
    }
  });

const snippetSlice = createSlice({
  name: 'snippet',
  initialState,
  reducers: {
    setSnippetTabSuccess(state, action: PayloadAction<string>) {
      state.snippetTab = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(devxConfigurationChanged, (state) => {
        state.data = {};
        state.error = {} as SnippetError;
        state.pending = false;
        state.requestId = '';
      })
      .addCase(getSnippet.pending, (state, action) => {
        state.requestId = action.meta?.requestId;
        state.pending = true;
        state.error = {} as SnippetError;
        state.data = {};
      })
      .addCase(getSnippet.fulfilled, (state, action) => {
        if (state.requestId !== action.meta?.requestId) { return; }
        state.pending = false;
        const [rawKey, value] = Object.entries(action.payload)[0];
        const key = rawKey.toLowerCase();
        state.data = { [key]: value };
        state.error = {} as SnippetError;
      })
      .addCase(getSnippet.rejected, (state, action) => {
        if (state.requestId !== action.meta?.requestId) { return; }
        state.pending = false;
        state.error = action.payload as SnippetError;
        state.data = {};
      });
  }
});

export const { setSnippetTabSuccess } = snippetSlice.actions;
export default snippetSlice.reducer;
