import { IAction } from '../../../types/action';
import { IDevxAPI } from '../../../types/IDevxAPI';
import { DEVX_API_URL } from '../graph-constants';
import { SET_DEVX_API_URL_SUCCESS } from '../redux-constants';

const initialState: IDevxAPI = {
  baseUrl: DEVX_API_URL,
  parameters: ''
};
export function devxApi(state: IDevxAPI = initialState, action: IAction): any {
  switch (action.type) {

    case SET_DEVX_API_URL_SUCCESS:
      return action.response;

    default:
      return state;
  }
}
