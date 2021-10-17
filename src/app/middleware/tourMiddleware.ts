import { store } from '../../store';
import { IAction } from '../../types/action';
import { setActionTypes } from '../services/actions/tour-action-creator';
import {
  FETCH_ADAPTIVE_CARD_ERROR,
  FETCH_ADAPTIVE_CARD_SUCCESS, GET_SNIPPET_ERROR, GET_SNIPPET_SUCCESS, PROFILE_REQUEST_ERROR,
  PROFILE_REQUEST_SUCCESS, QUERY_GRAPH_SUCCESS, SET_NEXT_TOUR_STEP_SUCCESS, SET_SAMPLE_QUERY_SUCCESS,
  VIEW_HISTORY_ITEM_SUCCESS
} from '../services/redux-constants';

const validActionTypes = [FETCH_ADAPTIVE_CARD_ERROR, FETCH_ADAPTIVE_CARD_SUCCESS,
  GET_SNIPPET_SUCCESS, PROFILE_REQUEST_SUCCESS, PROFILE_REQUEST_ERROR, QUERY_GRAPH_SUCCESS, SET_NEXT_TOUR_STEP_SUCCESS,
  SET_SAMPLE_QUERY_SUCCESS, VIEW_HISTORY_ITEM_SUCCESS, GET_SNIPPET_ERROR]
const tourMiddleWare_ = (_store: any) => (next: any) => (action: IAction) => {
  if (validActionTypes.includes(action.type)) {
    store.dispatch(setActionTypes(action.type));
  }
  return next(action);
};

export default tourMiddleWare_;