
import { AppAction } from '../../../types/action';
import { IHistoryItem } from '../../../types/history';
import {
  ADD_HISTORY_ITEM_SUCCESS,
  BULK_ADD_HISTORY_ITEMS_SUCCESS,
  REMOVE_ALL_HISTORY_ITEMS_SUCCESS,
  REMOVE_HISTORY_ITEM_SUCCESS,
  VIEW_HISTORY_ITEM_SUCCESS
} from '../redux-constants';

export function addHistoryItem(historyItem: IHistoryItem): AppAction {
  return {
    type: ADD_HISTORY_ITEM_SUCCESS,
    response: historyItem
  };
}

export function bulkAddHistoryItems(historyItems: IHistoryItem[]): AppAction {
  return {
    type: BULK_ADD_HISTORY_ITEMS_SUCCESS,
    response: historyItems
  };
}

export function viewHistoryItem(historyItem: IHistoryItem): AppAction {
  return {
    type: VIEW_HISTORY_ITEM_SUCCESS,
    response: {
      body: historyItem.result,
      headers: historyItem.headers
    }
  };
}

export function removeHistoryItem(historyItem: IHistoryItem): AppAction {
  return {
    type: REMOVE_HISTORY_ITEM_SUCCESS,
    response: historyItem
  };
}

export function bulkRemoveHistoryItems(listOfKeys: string[]) {
  return {
    type: REMOVE_ALL_HISTORY_ITEMS_SUCCESS,
    response: listOfKeys
  };
}