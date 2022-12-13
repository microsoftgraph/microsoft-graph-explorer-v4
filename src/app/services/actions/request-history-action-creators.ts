
import { AppAction } from '../../../types/action';
import { IHistoryItem } from '../../../types/history';
import { historyCache } from '../../../modules/cache/history-utils';
import {
  ADD_HISTORY_ITEM_SUCCESS,
  REMOVE_ALL_HISTORY_ITEMS_SUCCESS,
  REMOVE_HISTORY_ITEM_SUCCESS,
  VIEW_HISTORY_ITEM_SUCCESS,
  BULK_ADD_HISTORY_ITEMS_SUCCESS
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

export function removeHistoryItem(historyItem: IHistoryItem) {

  delete historyItem.category;
  return async (dispatch: Function) => {
    return historyCache.removeHistoryData(historyItem)
      .then(() => {
        dispatch({
          type: REMOVE_HISTORY_ITEM_SUCCESS,
          response: historyItem
        });
      });
  };
}

export function bulkRemoveHistoryItems(historyItems: IHistoryItem[]) {

  const listOfKeys: any = [];
  historyItems.forEach(historyItem => {
    listOfKeys.push(historyItem.createdAt);
  });

  return async (dispatch: Function) => {
    return historyCache.bulkRemoveHistoryData(listOfKeys)
      .then(() => {
        dispatch({
          type: REMOVE_ALL_HISTORY_ITEMS_SUCCESS,
          response: listOfKeys
        });
      });
  };
}

