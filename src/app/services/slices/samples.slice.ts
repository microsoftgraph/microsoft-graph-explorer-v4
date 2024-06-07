import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { samplesCache } from '../../../modules/cache/samples.cache';
import { ISampleQuery } from '../../../types/query-runner';
import { ApplicationState } from '../../../types/root';
import { queries } from '../../views/sidebar/sample-queries/queries';

interface SamplesState {
  queries: ISampleQuery[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: object | null | string;
}

const initialState: SamplesState = {
  queries: [],
  status: 'idle',
  error: null
};

export const fetchSamples = createAsyncThunk<ISampleQuery[], void, { rejectValue: ISampleQuery[] }>(
  'samples/fetchSamples',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as ApplicationState;
    const { devxApi } = state;
    let samplesUrl = `${devxApi.baseUrl}/samplsses`;

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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSamples.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSamples.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.queries = action.payload;
      })
      .addCase(fetchSamples.rejected, (state, action) => {
        if (action.payload) {
          state.queries = action.payload;
        }
        state.status = 'failed';
        state.error = 'failed';
      });


  }
});

export default samplesSlice.reducer;
