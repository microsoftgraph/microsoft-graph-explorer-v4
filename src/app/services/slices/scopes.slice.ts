import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { IPermission, IScopes } from '../../../types/permissions';
import { IRequestOptions } from '../../../types/request';
import { ApplicationState } from '../../../store';
import { ScopesError } from '../../utils/error-utils/ScopesError';
import { getPermissionsScopeType } from '../../utils/getPermissionsScopeType';
import { sanitizeQueryUrl } from '../../utils/query-url-sanitization';
import { parseSampleUrl } from '../../utils/sample-url-generation';

type ScopesFetchType = 'full' | 'query';

const initialState: IScopes = {
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
  async (scopesFetchType: ScopesFetchType = 'full', { getState, rejectWithValue }) => {
    const state = getState() as ApplicationState;
    const { devxApi, profile, sampleQuery: query } = state;
    const scopeType = getPermissionsScopeType(profile.user!);
    let permissionsUrl = `${devxApi.baseUrl}/permissions?scopeType=${scopeType}`;

    if (scopesFetchType === 'query') {
      const signature = sanitizeQueryUrl(query.sampleUrl);
      const { requestUrl, sampleUrl } = parseSampleUrl(signature);

      if (!sampleUrl) {
        throw new Error('url is invalid');
      }

      permissionsUrl = `${permissionsUrl}&requesturl=/${requestUrl}&method=${query.selectedVerb}`;
    }

    if (devxApi && devxApi?.parameters) {
      permissionsUrl = `${permissionsUrl}&${devxApi?.parameters!}`;
    }

    const headers = {
      'Content-Type': 'application/json'
    };

    const options: IRequestOptions = { headers };
    try {
      const response = await fetch(permissionsUrl, options);
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
      .addCase(fetchScopes.pending, (state, action) => {
        state.pending = action.meta.arg === 'full'
          ? { ...state.pending, isFullPermissions: true }
          : { ...state.pending, isSpecificPermissions: true };
        state.error = null;
      })
      .addCase(fetchScopes.fulfilled, (state, action) => {
        if (action.meta.arg === 'full') {
          state.data.fullPermissions = action.payload.scopes.fullPermissions || [];
        } else {
          state.data.specificPermissions = action.payload.scopes.specificPermissions || [];
        }
        state.pending = initialState.pending;
      })
      .addCase(fetchScopes.rejected, (state, action) => {
        state.pending = initialState.pending;
        state.data = initialState.data;
        state.error = action.payload as ScopesError;
      });
  }
});

export default scopesSlice.reducer;