import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ISidebarProps } from '../../../types/sidebar';
import {
  QUERY_GRAPH_RUNNING, QUERY_GRAPH_SUCCESS,
  SET_SAMPLE_QUERY_SUCCESS
} from '../redux-constants';

const initialState: ISidebarProps = {
  showSidebar: false,
  mobileScreen: false
};

const sidebarPropertiesSlice = createSlice({
  name: 'sidebarProperties',
  initialState,
  reducers: {
    toggleSidebar: (state, action: PayloadAction<Partial<ISidebarProps>>) => {
      state.showSidebar = action.payload.showSidebar !== undefined ? action.payload.showSidebar : !state.showSidebar;
      state.mobileScreen = action.payload.mobileScreen !== undefined ? action.payload.mobileScreen : state.mobileScreen;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(QUERY_GRAPH_RUNNING, (state) => {
        if (state.mobileScreen) {
          state.showSidebar = false;
        }
      })
      .addCase(SET_SAMPLE_QUERY_SUCCESS, (state) => {
        if (state.mobileScreen) {
          state.showSidebar = false;
        }
      })
      .addCase(QUERY_GRAPH_SUCCESS, (state) => {
        if (state.mobileScreen) {
          state.showSidebar = false;
        }
      });
  }
});

export const { toggleSidebar } = sidebarPropertiesSlice.actions
export default sidebarPropertiesSlice.reducer;