import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { samplesCache } from '../../../modules/cache/samples.cache';
import { ApplicationState } from '../../../store';
import { ISampleQuery } from '../../../types/query-runner';
import { queries } from '../../views/sidebar/sample-queries/queries';

interface SamplesState {
  queries: ISampleQuery[];
  pending: boolean;
  error: object | null | string;
  hasAutoSelectedDefault: boolean;
}

const initialState: SamplesState = {
  queries: [],
  pending: false,
  error: null,
  hasAutoSelectedDefault: false
};

export const fetchSamples = createAsyncThunk<ISampleQuery[], void, { rejectValue: ISampleQuery[] }>(
  'samples/fetchSamples',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as ApplicationState;
    const { devxApi } = state;
    let samplesUrl = `${devxApi.baseUrl}/samples`;

    samplesUrl = devxApi.parameters
      ? `${samplesUrl}?${devxApi.parameters}`
      : `${samplesUrl}`;

    const headers = {
      'Content-Type': 'application/json'
    };

    try {
      const response = await fetch(samplesUrl, { headers });
      if (!response.ok) {
        throw response;
      }
      const res = await response.json();
      return res.sampleQueries;
    } catch (error) {
      let cachedSamples = await samplesCache.readSamples();
      if (cachedSamples.length === 0) {
        cachedSamples = queries;
      }
      return rejectWithValue(cachedSamples);
    }
  }
);

const samplesSlice = createSlice({
  name: 'samples',
  initialState,
  reducers: {
    setHasAutoSelectedDefault: (state, action) => {
      state.hasAutoSelectedDefault = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSamples.pending, (state) => {
        state.pending = true;
        state.error = null;
      })
      .addCase(fetchSamples.fulfilled, (state, action) => {
        state.pending = false;
        state.queries = action.payload;
      })
      .addCase(fetchSamples.rejected, (state, action) => {
        if (action.payload) {
          state.queries = action.payload;
        }
        state.pending = false;
        state.error = 'failed';
      });
  }
});

export const { setHasAutoSelectedDefault } = samplesSlice.actions;
export default samplesSlice.reducer;
