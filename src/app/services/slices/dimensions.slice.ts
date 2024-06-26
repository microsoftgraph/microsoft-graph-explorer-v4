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
    resizeSuccess: (state, action: PayloadAction<IDimensions>) => state = action.payload
    //   state.request = action.payload.request;
    //   state.response = action.payload.response;
    //   state.sidebar = action.payload.sidebar;
    //   state.content = action.payload.content;
    // }
  }
})

export const {resizeSuccess} = dimensions.actions;
export default dimensions.reducer;