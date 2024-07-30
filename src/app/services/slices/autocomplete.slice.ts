import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { SignContext, suggestions } from '../../../modules/suggestions';
import { ApplicationState } from '../../../store';
import { IAutocompleteResponse } from '../../../types/auto-complete';
import { IParsedOpenApiResponse } from '../../../types/open-api';

export const fetchAutoCompleteOptions = createAsyncThunk(
  'autoComplete/fetch',
  async (arg: { url: string, version: string, context?: SignContext }, { getState, rejectWithValue }) => {
    const { url, version, context = 'paths' } = arg;
    const state = getState() as ApplicationState;

    try {
      const devxApiUrl = state.devxApi.baseUrl;
      const resources = Object.keys(state.resources.data).length > 0 ? state.resources.data[version] : undefined;
      const autoOptions = await suggestions.getSuggestions(
        url,
        devxApiUrl,
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

const initialState: IAutocompleteResponse = {
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
      .addCase(fetchAutoCompleteOptions.pending, (state) => {
        state.pending = true;
        state.data = null;
        state.error = null;
      })
      .addCase(fetchAutoCompleteOptions.fulfilled, (state, action) => {
        state.pending = false;
        state.data = action.payload as IParsedOpenApiResponse;
        state.error = null;
      })
      .addCase(fetchAutoCompleteOptions.rejected, (state, action) => {
        state.pending = false;
        state.data = null;
        if (action.payload) {
          state.error = action.payload as Error;
        }
      });
  }
});

export default autoCompleteSlice.reducer;
