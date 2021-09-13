import { IAction } from '../../../types/action';
import { IResources } from '../../../types/resources';
import { FETCH_RESOURCES_ERROR, FETCH_RESOURCES_PENDING, FETCH_RESOURCES_SUCCESS } from '../redux-constants';

const initialState: IResources = {
  pending: false,
  data: [],
  error: null
};

export function resources(state: IResources = initialState, action: IAction): any {
  switch (action.type) {
    case FETCH_RESOURCES_SUCCESS:
      return {
        pending: false,
        data: action.response,
        error: null
      };
    case FETCH_RESOURCES_ERROR:
      return {
        pending: false,
        error: action.response,
        data: []
      };
    case FETCH_RESOURCES_PENDING:
      return {
        pending: true,
        data: [],
        error: null,
      };
    default:
      return state;
  }
}
