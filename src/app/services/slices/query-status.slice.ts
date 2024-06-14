import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IStatus } from '../../../types/status';

type Status = Partial<IStatus>

const initialState: Status = {
  ok: false,
  statusText: 'Something worked!',
  status: 200,
  messageType: 1,
  hint: 'Something worked!'
}

const queryStatus = createSlice({
  name: 'queryStatus',
  initialState,
  reducers: {
    setQueryResponseStatus: (state, action: PayloadAction<Status>)=>state=action.payload,
    clearResponse: (state)=> state = {},
    clearQueryStatus: (state)=> state = {}
  }
})

export const {setQueryResponseStatus, clearQueryStatus, clearResponse}=queryStatus.actions;
export default queryStatus.reducer;
