import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { resourcesCache } from '../../../modules/cache/resources.cache';
import { ApplicationState } from '../../../store';
import { IRequestOptions } from '../../../types/request';
import { IResource, IResources } from '../../../types/resources';

const initialState: IResources = {
  pending: false,
  data: {},
  error: null
};

export const fetchResources = createAsyncThunk(
  'resources/fetchResources', async (_, { getState, rejectWithValue }) => {
    const { devxApi } = getState() as ApplicationState;
    const resourcesUrl = `${devxApi.baseUrl}/openapi/tree`;
    const v1Url = resourcesUrl + '?graphVersions=v1.0';
    const betaUrl = resourcesUrl + '?graphVersions=beta';

    const headers = {
      'Content-Type': 'application/json'
    }

    const options: IRequestOptions = { headers };

    try {
      const v1CachedResources = await resourcesCache.readResources('v1.0');
      const betaCachedResources = await resourcesCache.readResources('beta');

      if (v1CachedResources && betaCachedResources) {
        return {
          'v1.0': v1CachedResources,
          beta: betaCachedResources
        };
      } else {
        const [v1Response, betaResponse] = await Promise.all([
          fetch(v1Url, options),
          fetch(betaUrl, options)
        ]);

        if (v1Response.ok && betaResponse.ok) {
          const [v1Data, betaData] = await Promise.all([
            v1Response.json(),
            betaResponse.json()
          ]);

          resourcesCache.saveResources(v1Data as IResource, 'v1.0');
          resourcesCache.saveResources(betaData as IResource, 'beta');

          return {
            'v1.0': v1Data,
            beta: betaData
          }
        } else {
          throw new Error('Failed to fetch resources');
        }
      }
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
      .addCase(fetchResources.pending, (state) => {
        state.pending = true;
        state.error = null;
      })
      .addCase(fetchResources.fulfilled, (state, action: PayloadAction<{ [version: string]: IResource }>) => {
        state.pending = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.pending = false;
        state.error = action.payload as Error;
      });
  }
});

export default resourcesSlice.reducer;
