import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { samplesCache } from '../../../modules/cache/samples.cache';
import { ApplicationState } from '../../../store';
import { ISampleQuery } from '../../../types/query-runner';
import { queries } from '../../views/sidebar/sample-queries/queries';
import { IDevxAPI } from '../../../types/devx-api';
import { fetchDevxApi, getDevxConfiguration } from '../devx-api';
import { devxConfigurationChanged } from '../devx-events';

interface SamplesState {
  queries: ISampleQuery[];
  pending: boolean;
  error: object | null | string;
  hasAutoSelectedDefault: boolean;
  loaded?: boolean;
  requestId?: string;
}

const initialState: SamplesState = {
  queries: [],
  pending: false,
  error: null,
  hasAutoSelectedDefault: false,
  loaded: false
};

export async function loadSamples(config: IDevxAPI, signal?: AbortSignal): Promise<ISampleQuery[]> {
  const response = await fetchDevxApi(config, '/samples', {}, {
    headers: { 'Content-Type': 'application/json' }, signal
  });
  if (!response.ok) {
    throw new Error('Failed to fetch samples');
  }
  const data = await response.json();
  if (!Array.isArray(data.sampleQueries)) {
    throw new Error('Invalid samples response');
  }
  void Promise.resolve(samplesCache.saveSamples(data.sampleQueries, config)).catch(() => undefined);
  return data.sampleQueries;
}

export const fetchSamples = createAsyncThunk<ISampleQuery[], void, { rejectValue: ISampleQuery[] }>(
  'samples/fetchSamples',
  async (_, { getState, rejectWithValue, signal }) => {
    const state = getState() as ApplicationState;
    const config = getDevxConfiguration(state);
    try {
      return await loadSamples(config, signal);
    } catch (error) {
      let cachedSamples = await samplesCache.readSamples(config).catch(() => []);
      if (cachedSamples.length === 0 && !config.custom) {
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
      .addCase(devxConfigurationChanged, (state, action) => {
        state.queries = action.payload.samples ?? [];
        state.loaded = action.payload.samples !== undefined;
        state.pending = false;
        state.error = null;
        state.requestId = '';
        state.hasAutoSelectedDefault = true;
      })
      .addCase(fetchSamples.pending, (state, action) => {
        state.requestId = action.meta?.requestId;
        state.pending = true;
        state.error = null;
      })
      .addCase(fetchSamples.fulfilled, (state, action) => {
        if (state.requestId !== action.meta?.requestId) { return; }
        state.pending = false;
        state.loaded = true;
        state.queries = action.payload;
      })
      .addCase(fetchSamples.rejected, (state, action) => {
        if (state.requestId !== action.meta?.requestId) { return; }
        if (action.payload) {
          state.queries = action.payload;
        }
        state.pending = false;
        state.loaded = true;
        state.error = 'failed';
      });
  }
});

export const { setHasAutoSelectedDefault } = samplesSlice.actions;
export default samplesSlice.reducer;
