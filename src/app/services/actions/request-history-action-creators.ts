import { ADD_HISTORY_ITEM_SUCCESS } from '../redux-constants';

export function addHistoryItem(response: object): any {
  return {
    type: ADD_HISTORY_ITEM_SUCCESS,
    response,
  };
}
