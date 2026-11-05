import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { resourcesCache } from '../../../modules/cache/resources.cache';
import { ApplicationState } from '../../../store';
import { IRequestOptions } from '../../../types/request';
import { IResource, IResources } from '../../../types/resources';
import { IDevxAPI } from '../../../types/devx-api';
import { fetchDevxApi, getDevxConfiguration } from '../devx-api';
import { devxConfigurationChanged } from '../devx-events';

const initialState: IResources & { requestId?: string } = {
  pending: false,
  data: {},
  error: null
};

export async function loadResources(config: IDevxAPI, forceNetwork = false, signal?: AbortSignal) {
  if (!forceNetwork) {
    const [v1, beta] = await Promise.all([
      resourcesCache.readResources('v1.0', config), resourcesCache.readResources('beta', config)
    ]);
    if (v1 && beta) { return { 'v1.0': v1, beta }; }
  }
  const options: IRequestOptions & { signal?: AbortSignal } = {
    headers: { 'Content-Type': 'application/json' }, signal
  };
  const responses = await Promise.all([
    fetchDevxApi(config, '/openapi/tree', { graphVersions: 'v1.0' }, options),
    fetchDevxApi(config, '/openapi/tree', { graphVersions: 'beta' }, options)
  ]);
  if (responses.some(response => !response.ok)) { throw new Error('Failed to fetch resources'); }
  const [v1, beta] = await Promise.all(responses.map(response => response.json()));
  if (!v1 || !beta || !Array.isArray(v1.labels) || !Array.isArray(beta.labels)) {
    throw new Error('Invalid resources response');
  }
  void Promise.all([
    resourcesCache.saveResources(v1 as IResource, 'v1.0', config),
    resourcesCache.saveResources(beta as IResource, 'beta', config)
  ]).catch(() => undefined);
  return { 'v1.0': v1 as IResource, beta: beta as IResource };
}

export const fetchResources = createAsyncThunk(
  'resources/fetchResources', async (_, { getState, rejectWithValue, signal }) => {
    const config = getDevxConfiguration(getState() as ApplicationState);
    try {
      return await loadResources(config, false, signal);
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error);
    }
  });

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(devxConfigurationChanged, (state, action) => {
        state.data = action.payload.resources ?? {};
        state.pending = false;
        state.error = null;
        state.requestId = '';
      })
      .addCase(fetchResources.pending, (state, action) => {
        state.requestId = action.meta?.requestId;
        state.pending = true;
        state.error = null;
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        if (state.requestId !== action.meta?.requestId) { return; }
        state.pending = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchResources.rejected, (state, action) => {
        if (state.requestId !== action.meta?.requestId) { return; }
        state.pending = false;
        state.error = action.payload as Error;
      });
  }
});

export default resourcesSlice.reducer;
