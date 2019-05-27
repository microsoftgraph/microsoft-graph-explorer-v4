import { IAction } from '../../../types/action';
import { HEADER_ADD, HEADER_REMOVE } from '../redux-constants';

export function headersAdded(state = [], action: IAction): any {
  switch (action.type) {
    case HEADER_ADD:
      return action.response;
    case HEADER_REMOVE:
      const headers: any = [];
      const header = action.response;

      state.forEach(element => {
        if (element !== header) {
          headers.push(element);
        }
      });

      if (headers.length === 0) {
        headers.push({name: '', value: ''});
      }

      return headers;
    default:
      return state;
  }
}
