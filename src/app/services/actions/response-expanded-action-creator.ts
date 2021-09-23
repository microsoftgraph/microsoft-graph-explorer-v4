import { RESPONSE_EXPANDED } from '../redux-constants';

export function expandResponseArea(expanded: boolean): any {
  return {
    type: RESPONSE_EXPANDED,
    response: expanded
  };
}
