import { AppAction } from '../../../types/action';
import { RESPONSE_EXPANDED } from '../redux-constants';

export function expandResponseArea(expanded: boolean): AppAction {
  return {
    type: RESPONSE_EXPANDED,
    response: expanded
  };
}
