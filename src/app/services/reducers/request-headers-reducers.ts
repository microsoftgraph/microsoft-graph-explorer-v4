import { IAction } from '../../../types/action';
import { HEADER_ADD_SUCCESS, HEADER_REMOVE_SUCCESS } from '../redux-constants';

export function headersAdded(state = [], action: IAction): any {
  switch (action.type) {
    case HEADER_ADD_SUCCESS:
      return action.response;
    case HEADER_REMOVE_SUCCESS:
      let headers: any = [];
      headers = state.filter(header => header !== action.response);
      return headers;
    default:
      return state;
  }
}
