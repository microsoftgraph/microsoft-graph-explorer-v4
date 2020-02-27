import { Dispatch } from 'redux';

import { IHistoryItem } from '../../../types/history';
import { removeHistoryData } from '../../views/sidebar/history/history-utils';
import {
  ADD_HISTORY_ITEM_SUCCESS, QUERY_GRAPH_SUCCESS,
  REMOVE_HISTORY_ITEM_SUCCESS, VIEW_HISTORY_ITEM_SUCCESS
} from '../redux-constants';

export function addHistoryItem(response: IHistoryItem): any {
  return {
    type: ADD_HISTORY_ITEM_SUCCESS,
    response,
  };
}

export function removeHistoryItem(query: IHistoryItem): Function {

  delete query.category;
  return async (dispatch: Function) => {
    return removeHistoryData(query)
      .then(res => {
        dispatch({
          type: REMOVE_HISTORY_ITEM_SUCCESS,
          response: query,
        });
      });
  };
}

export function viewHistoryItem(response: IHistoryItem): any {
  return {
    type: VIEW_HISTORY_ITEM_SUCCESS,
    response,
  };
}
