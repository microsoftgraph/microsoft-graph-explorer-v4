import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDevxAPI } from '../../../types/devx-api';
import { DEVX_API_URL } from '../graph-constants';

const initialState: IDevxAPI = {
  baseUrl: DEVX_API_URL,
  parameters: ''
};

const devxApi = createSlice({
  name: 'devxApi',
  initialState,
  reducers: {
    setUrlSuccess: (state, action: PayloadAction<IDevxAPI>) => state = action.payload
  }
})

export const  {setUrlSuccess} = devxApi.actions;
export default devxApi.reducer;
