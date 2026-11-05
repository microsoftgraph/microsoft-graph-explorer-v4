import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { IPermission, IScopes } from '../../../types/permissions';
import { IRequestOptions } from '../../../types/request';
import { ApplicationState } from '../../../store';
import { ScopesError } from '../../utils/error-utils/ScopesError';
import { getPermissionsScopeType } from '../../utils/getPermissionsScopeType';
import { sanitizeQueryUrl } from '../../utils/query-url-sanitization';
import { parseSampleUrl } from '../../utils/sample-url-generation';
import { fetchDevxApi, getDevxConfiguration } from '../devx-api';
import { devxConfigurationChanged } from '../devx-events';

type ScopesFetchType = 'full' | 'query';

const initialState: IScopes & { requestIds?: { full?: string; query?: string } } = {
  pending: {
    isSpecificPermissions: false,
    isFullPermissions: false
  },
  data: {
    specificPermissions: [],
    fullPermissions: []
  },
  error: null
}

export const fetchScopes = createAsyncThunk(
  'scopes/fetchScopes',
  async (scopesFetchType: ScopesFetchType = 'full', { getState, rejectWithValue, signal }) => {
    const state = getState() as ApplicationState;
    const { profile, sampleQuery: query } = state;
    const config = getDevxConfiguration(state);
    const scopeType = getPermissionsScopeType(profile.user!);
    const permissionsUrl = `${config.baseUrl}/permissions`;
    const parameters: Record<string, string> = { scopeType };

    if (scopesFetchType === 'query') {
      const signature = sanitizeQueryUrl(query.sampleUrl);
      const { requestUrl, sampleUrl } = parseSampleUrl(signature);

      if (!sampleUrl) {
        throw new Error('url is invalid');
      }

      parameters.requesturl = `/${requestUrl}`;
      parameters.method = query.selectedVerb;
    }

    const headers = {
      'Content-Type': 'application/json'
    };

    const options: IRequestOptions & { signal?: AbortSignal } = { headers, signal };
    try {
      const response = await fetchDevxApi(config, '/permissions', parameters, options);
      if (response.ok) {
        const scopes = await response.json() as IPermission[];

        if (scopesFetchType === 'full') {
          return { scopes: { fullPermissions: scopes } };
        } else {
          return { scopes: { specificPermissions: scopes } };
        }
      } else {
        throw new ScopesError({
          url: permissionsUrl,
          message: scopesFetchType === 'full' ? 'Cannot get full scopes': 'Cannot get url specific scopes',
          status: response.status,
          messageType: 1
        });
      }
    } catch (error: unknown) {
      return rejectWithValue(error as ScopesError);
    }
  }
);

const scopesSlice = createSlice({
  name: 'scopes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(devxConfigurationChanged, (state) => {
        state.data = initialState.data;
        state.pending = initialState.pending;
        state.error = null;
        state.requestIds = { full: '', query: '' };
      })
      .addCase(fetchScopes.pending, (state, action) => {
        const kind = action.meta?.arg === 'query' ? 'query' : 'full';
        state.requestIds = { ...state.requestIds, [kind]: action.meta?.requestId };
        state.pending = kind === 'full'
          ? { ...state.pending, isFullPermissions: true }
          : { ...state.pending, isSpecificPermissions: true };
        state.error = null;
      })
      .addCase(fetchScopes.fulfilled, (state, action) => {
        const kind = action.meta?.arg === 'query' ? 'query' : 'full';
        if (state.requestIds?.[kind] !== action.meta?.requestId) { return; }
        if (kind === 'full') {
          state.data.fullPermissions = action.payload.scopes.fullPermissions || [];
        } else {
          state.data.specificPermissions = action.payload.scopes.specificPermissions || [];
        }
        state.pending[kind === 'full' ? 'isFullPermissions' : 'isSpecificPermissions'] = false;
      })
      .addCase(fetchScopes.rejected, (state, action) => {
        const kind = action.meta?.arg === 'query' ? 'query' : 'full';
        if (state.requestIds?.[kind] !== action.meta?.requestId) { return; }
        state.pending[kind === 'full' ? 'isFullPermissions' : 'isSpecificPermissions'] = false;
        state.data[kind === 'full' ? 'fullPermissions' : 'specificPermissions'] = [];
        state.error = action.payload as ScopesError;
      });
  }
});

export default scopesSlice.reducer;