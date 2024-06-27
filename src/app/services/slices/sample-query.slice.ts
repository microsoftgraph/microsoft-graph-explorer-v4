import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IQuery } from '../../../types/query-runner';

const initialState: IQuery = {
  selectedVerb: 'GET',
  sampleHeaders: [],
  sampleUrl: 'https://graph.microsoft.com/v1.0/me',
  sampleBody: undefined,
  selectedVersion: 'v1.0'
}
const sampleQuery = createSlice({
  name: 'sampleQuery',
  initialState,
  reducers: {
    setSampleQuery: (state, action: PayloadAction<IQuery>)=>{
      state = action.payload
      return state
    }
  }
})

export const {setSampleQuery} = sampleQuery.actions
export default sampleQuery.reducer;
