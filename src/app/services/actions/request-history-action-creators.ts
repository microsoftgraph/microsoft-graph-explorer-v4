import { Dispatch } from 'redux';
import { IHistoryItem } from '../../../types/history';
import { ADD_HISTORY_ITEM_SUCCESS, QUERY_GRAPH_SUCCESS,
  REMOVE_HISTORY_ITEM_SUCCESS } from '../redux-constants';

export function addHistoryItem(response: IHistoryItem): any {
  return {
    type: ADD_HISTORY_ITEM_SUCCESS,
    response,
  };
}
export function removeHistoryItem(response: IHistoryItem): any {
  return {
    type: REMOVE_HISTORY_ITEM_SUCCESS,
    response,
  };
}

export function viewHistoryItem(response: IHistoryItem): Function {
  return (dispatch: Dispatch) => {
    dispatch({
      type: QUERY_GRAPH_SUCCESS,
      response
    });
  };
}