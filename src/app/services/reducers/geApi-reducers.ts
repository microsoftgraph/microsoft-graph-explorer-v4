import { IAction } from '../../../types/action';
import { GE_API_URL } from '../graph-constants';
import { SET_GE_API_URL_SUCCESS } from '../redux-constants';

export function geApi(state: string = GE_API_URL, action: IAction): any {
  switch (action.type) {

    case SET_GE_API_URL_SUCCESS:
      return action.response;

    default:
      return state;
  }
}
