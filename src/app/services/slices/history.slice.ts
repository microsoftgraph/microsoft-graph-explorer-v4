import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IHistoryItem } from '../../../types/history';

const initialState: IHistoryItem[] = [];

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addHistoryItemSuccess(state, action: PayloadAction<IHistoryItem>) {
      state.push(action.payload);
    },
    bulkAddHistoryItemsSuccess(state, action: PayloadAction<IHistoryItem[]>) {
      state.push(...action.payload);
    },
    removeHistoryItemSuccess(state, action: PayloadAction<IHistoryItem>) {
      return state.filter(item => item.createdAt !== action.payload.createdAt);
    },
    removeAllHistoryItemsSuccess(state, action: PayloadAction<string[]>) {
      return state.filter(item => !action.payload.includes(item.createdAt));
    }
  }
});

export const {
  addHistoryItemSuccess,
  bulkAddHistoryItemsSuccess,
  removeHistoryItemSuccess,
  removeAllHistoryItemsSuccess
} = historySlice.actions;

export default historySlice.reducer;
