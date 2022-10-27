import { AppAction } from '../../../types/action';
import { RESPONSE_EXPANDED } from '../redux-constants';

export function responseAreaExpanded(state: boolean = false, action: AppAction): any {
  switch (action.type) {
    case RESPONSE_EXPANDED:
      return !!action.response;

    default:
      return state;
  }
}
