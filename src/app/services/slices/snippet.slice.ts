import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ApplicationState } from '../../../store';
import { IRequestOptions } from '../../../types/request';
import { ISnippet, Snippet, SnippetError } from '../../../types/snippets';
import { parseSampleUrl } from '../../utils/sample-url-generation';
import { constructHeaderString } from '../../utils/snippet.utils';

const initialState: ISnippet = {
  pending: false,
  data: {} as Snippet,
  error: {} as SnippetError,
  snippetTab: 'csharp'
};

export const getSnippet = createAsyncThunk<object, string>(
  'snippet/getSnippet',
  async (language, { getState, rejectWithValue }) => {
    const { devxApi, sampleQuery } = getState() as ApplicationState;

    try {
      let snippetsUrl = `${devxApi.baseUrl}/api/graphexplorersnippets`;

      const { requestUrl, sampleUrl, queryVersion, search } = parseSampleUrl(
        sampleQuery.sampleUrl
      );

      if (!sampleUrl) {
        throw new Error('url is invalid');
      }

      if (language !== 'csharp') {
        snippetsUrl += `?lang=${language}`;
      }

      const openApiSnippets: string[] = ['go', 'powershell', 'python', 'cli', 'php'];
      if (openApiSnippets.includes(language)) {
        snippetsUrl += '&generation=openapi';
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

      const options: IRequestOptions = { method, headers, body };

      const response = await fetch(snippetsUrl, options);
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
      .addCase(getSnippet.pending, (state) => {
        state.pending = true;
        state.error = {} as SnippetError;
        state.data = {};
      })
      .addCase(getSnippet.fulfilled, (state, action) => {
        state.pending = false;
        state.data = action.payload as Snippet;
        state.error = {} as SnippetError;
      })
      .addCase(getSnippet.rejected, (state, action) => {
        state.pending = false;
        state.error = action.payload as SnippetError;
        state.data = {};
      });
  }
});

export const { setSnippetTabSuccess } = snippetSlice.actions;
export default snippetSlice.reducer;
