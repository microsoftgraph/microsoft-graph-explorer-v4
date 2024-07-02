import { AppAction } from '../../../types/action';
import { IDevxAPI } from '../../../types/devx-api';
import { SET_DEVX_API_URL_SUCCESS } from '../redux-constants';

const initialState: IDevxAPI = {
  baseUrl: process.env.REACT_APP_DEVX_API_URL || '',
  parameters: ''
};
export function devxApi(state: IDevxAPI = initialState, action: AppAction): any {
  switch (action.type) {

    case SET_DEVX_API_URL_SUCCESS:
      return action.response;

    default:
      return state;
  }
}
