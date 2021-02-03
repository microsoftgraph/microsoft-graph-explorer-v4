import { IAction } from '../../../types/action';
import { DEVX_API_URL } from '../graph-constants';
import { SET_DEVX_API_URL_SUCCESS } from '../redux-constants';

const initialState = {
  baseUrl: DEVX_API_URL,
  parameters: ''
};
export function devxApi(state = initialState, action: IAction): any {
  switch (action.type) {

    case SET_DEVX_API_URL_SUCCESS:
      return action.response;

    default:
      return state;
  }
}
