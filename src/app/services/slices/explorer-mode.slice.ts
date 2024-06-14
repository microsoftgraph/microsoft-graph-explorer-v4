import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Mode } from '../../../types/enums';

const graphExplorerMode = createSlice({
  name: 'graphExplorerMode',
  initialState: Mode.Complete,
  reducers: {
    setGraphExplorerMode: (_, action: PayloadAction<Mode>) => action.payload
  }
})

export const { setGraphExplorerMode } = graphExplorerMode.actions
export default graphExplorerMode.reducer;