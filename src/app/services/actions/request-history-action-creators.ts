import { IHistoryItem } from '../../../types/history';
import { ADD_HISTORY_ITEM_SUCCESS } from '../redux-constants';

export function addHistoryItem(response: IHistoryItem): any {
  return {
    type: ADD_HISTORY_ITEM_SUCCESS,
    response,
  };
}
