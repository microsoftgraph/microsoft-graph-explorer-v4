import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDevxAPI } from '../../../types/devx-api';

const initialState: IDevxAPI = {
  baseUrl: process.env.REACT_APP_DEVX_API_URL || '',
  parameters: ''
};

const devxApi = createSlice({
  name: 'devxApi',
  initialState,
  reducers: {
    setDevxApiUrl: (state, action: PayloadAction<IDevxAPI>) => state = action.payload
  }
})

export const { setDevxApiUrl } = devxApi.actions;
export default devxApi.reducer;
