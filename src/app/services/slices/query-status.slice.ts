import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IStatus } from '../../../types/status';
import { signOutSuccess } from './auth.slice';
import { runQuery } from './graph-response.slice';

const queryRunnerStatusSlice = createSlice({
  name: 'queryRunnerStatus',
  initialState: null as IStatus | null,
  reducers: {
    setQueryResponseStatus: (_state, action: PayloadAction<IStatus>) => {
      return action.payload;
    },
    clearQueryStatus: () => {
      return null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(runQuery.pending, () => {
      return null;
    });
    builder.addCase(signOutSuccess, () => {
      return null;
    });
  }
});

export const { setQueryResponseStatus, clearQueryStatus } = queryRunnerStatusSlice.actions;
export default queryRunnerStatusSlice.reducer;
