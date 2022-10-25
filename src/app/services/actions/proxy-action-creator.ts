import { AppAction } from '../../../types/action';
import { GRAPH_API_SANDBOX_ENDPOINT_URL, GRAPH_API_SANDBOX_URL } from '../graph-constants';
import { SET_GRAPH_PROXY_URL } from '../redux-constants';

export function getGraphProxyUrl() {
  return async (dispatch: Function) => {
    try {
      const response = await fetch(GRAPH_API_SANDBOX_ENDPOINT_URL);
      if (!response.ok) {
        throw response;
      }
      const res = await response.json();
      return dispatch(setGraphProxyUrl(res));
    } catch (error) {
      return dispatch(setGraphProxyUrl(GRAPH_API_SANDBOX_URL));
    }
  };
}

export function setGraphProxyUrl(response: string): AppAction {
  return {
    type: SET_GRAPH_PROXY_URL,
    response
  };
}