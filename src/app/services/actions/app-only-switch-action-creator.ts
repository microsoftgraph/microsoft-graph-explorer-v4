import { AppAction } from '../../../types/action';
import { MAKE_APP_ONLY_CALLS } from '../redux-constants';

export interface AppOnlyToken {
  isAppOnly: boolean;
  accessToken: string;
}
export function switchToAppOnlyCalls(response: AppOnlyToken): AppAction {
  return {
    type: MAKE_APP_ONLY_CALLS,
    response
  }
}