import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const responseAreaExpandedSlice = createSlice({
  name: 'responseAreaExpanded',
  initialState: false,
  reducers: {
    expandResponseArea: (_, action: PayloadAction<boolean>) => action.payload
  }
})

export const { expandResponseArea } = responseAreaExpandedSlice.actions
export default responseAreaExpandedSlice.reducer;