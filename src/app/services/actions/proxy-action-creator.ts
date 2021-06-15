import { IAction } from "../../../types/action";
import { GRAPH_API_SANDBOX_URL } from "../graph-constants";
import { SET_GRAPH_PROXY_URL } from "../redux-constants";

export function getGraphProxyUrl(): Function {
  return async (dispatch: Function) => {
    const endpointUrl = `https://developer.microsoft.com/en-us/graph/api/proxy/endpoint`;
    try {
      const response = await fetch(endpointUrl);
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

export function setGraphProxyUrl(response: string): IAction {
  return {
    type: SET_GRAPH_PROXY_URL,
    response,
  };
}