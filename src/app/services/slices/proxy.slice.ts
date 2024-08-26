import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GRAPH_API_SANDBOX_ENDPOINT_URL, GRAPH_API_SANDBOX_URL } from '../graph-constants';

export const getGraphProxyUrl = createAsyncThunk(
  'proxyUrl/getGraphProxyUrl',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(GRAPH_API_SANDBOX_ENDPOINT_URL);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(GRAPH_API_SANDBOX_URL);
    }
  }
);

const proxyUrlSlice = createSlice({
  name: 'proxyUrl',
  initialState: GRAPH_API_SANDBOX_URL,
  reducers: {
    setGraphProxyUrl: (_state, action: PayloadAction<string>) => {
      return action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getGraphProxyUrl.fulfilled, (_state, action) => {
      return action.payload as string;
    });
    builder.addCase(getGraphProxyUrl.rejected, (_state, action) => {
      if (action.payload) {
        return action.payload as string;
      }
    });
  }
});

export const { setGraphProxyUrl } = proxyUrlSlice.actions;
export default proxyUrlSlice.reducer;
