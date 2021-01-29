import { IAction } from '../../../types/action';
import { RESPONSE_EXPANDED } from '../redux-constants';

export function responseAreaExpanded(state: boolean = false, action: IAction): any {
  switch (action.type) {
    case RESPONSE_EXPANDED:
      return !!action.response;

    default:
      return state;
  }
}
