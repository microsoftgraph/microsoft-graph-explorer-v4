import { AppAction } from '../../../types/action';
import { MAKE_APP_ONLY_CALLS } from '../redux-constants';

export function appOnlyCalls(state = false, action: AppAction): boolean {
  switch (action.type) {
    case MAKE_APP_ONLY_CALLS:
      return action.response;
    default:
      return state;
  }
}