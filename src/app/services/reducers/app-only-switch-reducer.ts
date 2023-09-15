import { AppAction } from '../../../types/action';
import { AppOnlyToken } from '../actions/app-only-switch-action-creator';
import { MAKE_APP_ONLY_CALLS } from '../redux-constants';

const initialState: AppOnlyToken = {
  isAppOnly: false,
  accessToken: ''
}

export function appOnlyCalls(state = initialState, action: AppAction): AppOnlyToken {
  switch (action.type) {
    case MAKE_APP_ONLY_CALLS:
      return action.response;
    default:
      return state;
  }
}