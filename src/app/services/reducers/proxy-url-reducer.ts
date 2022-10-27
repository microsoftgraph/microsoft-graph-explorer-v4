import { AppAction } from '../../../types/action';
import { GRAPH_API_SANDBOX_URL } from '../graph-constants';
import { SET_GRAPH_PROXY_URL } from '../redux-constants';

export function proxyUrl(state = GRAPH_API_SANDBOX_URL, action: AppAction): any {
  switch (action.type) {
    case SET_GRAPH_PROXY_URL:
      return action.response;
    default:
      return state;
  }
}
