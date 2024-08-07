import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDimensions } from '../../../types/dimensions';

const initialState: IDimensions = {
  request: {
    width: '100%',
    height: '38vh'
  },
  response: {
    width: '100%',
    height: '50vh'
  },
  sidebar: {
    width: '28%',
    height: ''
  },
  content: {
    width: '72%',
    height: '100%'
  }
};

const dimensions = createSlice({
  name: 'dimensions',
  initialState,
  reducers: {
    setDimensions: (state, action: PayloadAction<IDimensions>) => state = action.payload
  }
})

export const { setDimensions } = dimensions.actions;
export default dimensions.reducer;