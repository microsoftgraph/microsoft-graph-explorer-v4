
import { IHistoryItem } from '../../../types/history';
import { bulkRemoveHistoryData, removeHistoryData } from '../../views/sidebar/history/history-utils';
import {
  ADD_HISTORY_ITEM_SUCCESS,
  REMOVE_ALL_HISTORY_ITEMS_SUCCESS,
  REMOVE_HISTORY_ITEM_SUCCESS,
  VIEW_HISTORY_ITEM_SUCCESS
} from '../redux-constants';

export function addHistoryItem(historyItem: IHistoryItem): any {
  return {
    type: ADD_HISTORY_ITEM_SUCCESS,
    response: historyItem
  };
}

export function removeHistoryItem(historyItem: IHistoryItem): Function {

  delete historyItem.category;
  return async (dispatch: Function) => {
    return removeHistoryData(historyItem)
      .then(() => {
        dispatch({
          type: REMOVE_HISTORY_ITEM_SUCCESS,
          response: historyItem
        });
      });
  };
}

export function bulkRemoveHistoryItems(historyItems: IHistoryItem[]): Function {

  const listOfKeys: any = [];
  historyItems.forEach(historyItem => {
    listOfKeys.push(historyItem.createdAt);
  });

  return async (dispatch: Function) => {
    return bulkRemoveHistoryData(listOfKeys)
      .then(() => {
        dispatch({
          type: REMOVE_ALL_HISTORY_ITEMS_SUCCESS,
          response: listOfKeys
        });
      });
  };
}

export function viewHistoryItem(historyItem: IHistoryItem): any {
  return {
    type: VIEW_HISTORY_ITEM_SUCCESS,
    response: historyItem
  };
}
