import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { SignContext, suggestions } from '../../../modules/suggestions';
import { ApplicationState } from '../../../store';
import { IAutocompleteResponse } from '../../../types/auto-complete';
import { IParsedOpenApiResponse } from '../../../types/open-api';
import { getDevxConfiguration } from '../devx-api';
import { devxConfigurationChanged } from '../devx-events';

export const fetchAutoCompleteOptions = createAsyncThunk(
  'autoComplete/fetch',
  async (arg: { url: string, version: string, context?: SignContext }, { getState, rejectWithValue }) => {
    const { url, version, context = 'paths' } = arg;
    const state = getState() as ApplicationState;

    try {
      const config = getDevxConfiguration(state);
      const resources = Object.keys(state.resources.data).length > 0 ? state.resources.data[version] : undefined;
      const autoOptions = await suggestions.getSuggestions(
        url,
        config,
        version,
        context,
        resources
      );
      return autoOptions;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState: IAutocompleteResponse & { requestId?: string } = {
  pending: false,
  data: null,
  error: null
};

const autoCompleteSlice = createSlice({
  name: 'autoComplete',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(devxConfigurationChanged, (state) => {
        state.data = null;
        state.error = null;
        state.pending = false;
        state.requestId = '';
      })
      .addCase(fetchAutoCompleteOptions.pending, (state, action) => {
        state.requestId = action.meta?.requestId;
        state.pending = true;
        state.data = null;
        state.error = null;
      })
      .addCase(fetchAutoCompleteOptions.fulfilled, (state, action) => {
        if (state.requestId !== action.meta?.requestId) { return; }
        state.pending = false;
        state.data = action.payload as IParsedOpenApiResponse;
        state.error = null;
      })
      .addCase(fetchAutoCompleteOptions.rejected, (state, action) => {
        if (state.requestId !== action.meta?.requestId) { return; }
        state.pending = false;
        state.data = null;
        if (action.payload) {
          state.error = action.payload as Error;
        }
      });
  }
});

export default autoCompleteSlice.reducer;
