import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IHistoryItem } from '../../../types/history';

const initialState: IHistoryItem[] = [];

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addHistoryItem(state, action: PayloadAction<IHistoryItem>) {
      state.push(action.payload);
    },
    bulkAddHistoryItems(state, action: PayloadAction<IHistoryItem[]>) {
      state.push(...action.payload);
    },
    removeHistoryItem(state, action: PayloadAction<IHistoryItem>) {
      return state.filter(item => item.createdAt !== action.payload.createdAt);
    },
    removeAllHistoryItems(state, action: PayloadAction<string[]>) {
      return state.filter(item => !action.payload.includes(item.createdAt));
    }
  }
});

export const {
  addHistoryItem,
  bulkAddHistoryItems,
  removeHistoryItem,
  removeAllHistoryItems
} = historySlice.actions;

export default historySlice.reducer;
