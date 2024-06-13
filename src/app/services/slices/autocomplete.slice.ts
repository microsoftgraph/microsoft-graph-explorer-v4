import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { SignContext, suggestions } from '../../../modules/suggestions';
import { IAutocompleteResponse } from '../../../types/auto-complete';
import { IParsedOpenApiResponse } from '../../../types/open-api';
import { ApplicationState } from '../../../types/root';

export const fetchAutoCompleteOptions = createAsyncThunk(
  'autocomplete/fetch',
  async (arg: { url: string, version: string, context?: SignContext }, { getState }) => {
    const { url, version, context = 'paths' } = arg;
    const state = getState() as ApplicationState;

    const devxApiUrl = state.devxApi.baseUrl;
    const resources = Object.keys(state.resources.data).length > 0 ? state.resources.data[version] : undefined;
    const autoOptions = await suggestions.getSuggestions(
      url,
      devxApiUrl,
      version,
      context,
      resources
    );
    return autoOptions || new Error();
  }
);

const initialState: IAutocompleteResponse = {
  pending: false,
  data: null,
  error: null
};

const autocompleteSlice = createSlice({
  name: 'autocomplete',
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
        state.error = action.error;
      });
  }
});

export default autocompleteSlice.reducer;
