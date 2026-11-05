import { createSlice } from '@reduxjs/toolkit';
import { IDevxAPI } from '../../../types/devx-api';
import { defaultDevxConfiguration } from '../devx-api';
import { devxAccountSynced, devxConfigurationChanged, devxErrorCleared } from '../devx-events';
import { applyCustomSamples } from '../custom-samples';

const initialState: IDevxAPI = {
  ...defaultDevxConfiguration(),
  accountKey: '',
  eligible: false,
  revision: 0,
  pending: false,
  error: null
};

const devxApi = createSlice({
  name: 'devxApi',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(devxConfigurationChanged, (_, action) => ({
        ...action.payload.configuration, pending: false, requestId: '', error: null
      }))
      .addCase(devxAccountSynced, (state, action) => {
        state.accountKey = action.payload.accountKey;
        state.eligible = action.payload.eligible;
        state.pending = false;
        state.requestId = '';
        state.error = null;
      })
      .addCase(devxErrorCleared, state => {
        state.error = null;
      })
      .addCase(applyCustomSamples.pending, (state, action) => {
        state.pending = true;
        state.error = null;
        state.requestId = action.meta.requestId;
      })
      .addCase(applyCustomSamples.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) { return; }
        state.pending = false;
        state.error = action.payload || null;
        state.requestId = '';
      });
  }
})

export default devxApi.reducer;
