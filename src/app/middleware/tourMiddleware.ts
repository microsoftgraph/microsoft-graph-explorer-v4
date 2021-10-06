import { store } from '../../store';
import { IAction } from '../../types/action';
import { setActionTypes } from '../services/actions/tour-action-creator';
import {
  FETCH_ADAPTIVE_CARD_ERROR,
  FETCH_ADAPTIVE_CARD_SUCCESS, GET_SNIPPET_ERROR, GET_SNIPPET_SUCCESS, PROFILE_REQUEST_ERROR,
  PROFILE_REQUEST_SUCCESS, QUERY_GRAPH_SUCCESS, SET_NEXT_TOUR_STEP_SUCCESS, SET_SAMPLE_QUERY_SUCCESS,
  VIEW_HISTORY_ITEM_SUCCESS
} from '../services/redux-constants';

const tourMiddleWare_ = (_store: any) => (next: any) => (action: IAction) => {
  switch (action.type) {
    case PROFILE_REQUEST_SUCCESS:
      store.dispatch(setActionTypes(action.type));
    case PROFILE_REQUEST_ERROR:
      store.dispatch(setActionTypes(action.type));
      break;
    case QUERY_GRAPH_SUCCESS:
      store.dispatch(setActionTypes(action.type));
      break;
    case FETCH_ADAPTIVE_CARD_SUCCESS:
      store.dispatch(setActionTypes(action.type));
      break;
    case FETCH_ADAPTIVE_CARD_ERROR:
      store.dispatch(setActionTypes(action.type));
      break;
    case GET_SNIPPET_ERROR:
      store.dispatch(setActionTypes(action.type));
      break;
    case GET_SNIPPET_SUCCESS:
      store.dispatch(setActionTypes(action.type));
      break;
    case SET_SAMPLE_QUERY_SUCCESS:
      store.dispatch(setActionTypes(action.type));
      break;
    case SET_NEXT_TOUR_STEP_SUCCESS:
      store.dispatch(setActionTypes(action.type));
      break;
    case VIEW_HISTORY_ITEM_SUCCESS:
      store.dispatch(setActionTypes(action.type));
      break;
  }
  return next(action);
};

export default tourMiddleWare_;