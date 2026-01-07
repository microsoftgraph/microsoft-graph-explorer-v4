import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GRAPH_API_PROXY_ENDPOINT } from '../graph-constants';

// MODIFIED: Removed async thunk getGraphProxyUrl to simplify proxy endpoint management
// Now proxy endpoint is configured directly via environment variable or constant
const proxyUrlSlice = createSlice({
  name: 'proxyUrl',
  initialState: GRAPH_API_PROXY_ENDPOINT,
  reducers: {
    // MODIFIED: Initialize proxy URL from configuration instead of async fetch
    setGraphProxyUrl: (_state, action: PayloadAction<string>) => {
      return action.payload;
    }
  }
});

export const { setGraphProxyUrl } = proxyUrlSlice.actions;
export default proxyUrlSlice.reducer;
