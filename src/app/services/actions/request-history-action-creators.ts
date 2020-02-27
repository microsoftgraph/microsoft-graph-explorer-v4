
import { IHistoryItem } from '../../../types/history';
import { removeHistoryData } from '../../views/sidebar/history/history-utils';
import {
  ADD_HISTORY_ITEM_SUCCESS,
  REMOVE_HISTORY_ITEM_SUCCESS,
  VIEW_HISTORY_ITEM_SUCCESS
} from '../redux-constants';

export function addHistoryItem(historyItem: IHistoryItem): any {
  return {
    type: ADD_HISTORY_ITEM_SUCCESS,
    response: historyItem,
  };
}

export function removeHistoryItem(historyItem: IHistoryItem): Function {

  delete historyItem.category;
  return async (dispatch: Function) => {
    return removeHistoryData(historyItem)
      .then(() => {
        dispatch({
          type: REMOVE_HISTORY_ITEM_SUCCESS,
          response: historyItem,
        });
      });
  };
}

export function viewHistoryItem(historyItem: IHistoryItem): any {
  return {
    type: VIEW_HISTORY_ITEM_SUCCESS,
    response: historyItem,
  };
}
