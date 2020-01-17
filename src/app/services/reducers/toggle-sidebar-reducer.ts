import { IAction } from '../../../types/action';
import { QUERY_GRAPH_RUNNING, SET_SAMPLE_QUERY_SUCCESS,
  TOGGLE_SIDEBAR_SUCCESS, VIEW_HISTORY_ITEM_SUCCESS } from '../redux-constants';

const initialState = {
  showSidebar: false,
  mobileScreen: false,
};

export function sidebarProperties(state = initialState, action: IAction): any {
  switch (action.type) {
    case TOGGLE_SIDEBAR_SUCCESS:
      return action.response;
    case QUERY_GRAPH_RUNNING:
      if (state.mobileScreen) {
        return {
          ...state,
          showSidebar: false,
        };
      }
    case SET_SAMPLE_QUERY_SUCCESS:
      if (state.mobileScreen) {
        return {
          ...state,
          showSidebar: false,
        };
      }
    case VIEW_HISTORY_ITEM_SUCCESS:
      if (state.mobileScreen) {
        return {
          ...state,
          showSidebar: false,
        };
      }
    default:
      return state;
  }
}
