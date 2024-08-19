import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IStatus } from '../../../types/status';
import { LOGOUT_SUCCESS, QUERY_GRAPH_RUNNING } from '../redux-constants';

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
    builder.addCase(QUERY_GRAPH_RUNNING, () => {
      return null;
    });
    builder.addCase(LOGOUT_SUCCESS, () => {
      return null;
    });
  }
});

export const { setQueryResponseStatus, clearQueryStatus } = queryRunnerStatusSlice.actions;
export default queryRunnerStatusSlice.reducer;
