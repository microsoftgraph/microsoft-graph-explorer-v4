import { IAction } from '../../../types/action';
import { IResource, IResources } from '../../../types/resources';
import content from '../../utils/resources/resources.json';
import { FETCH_RESOURCES_ERROR, FETCH_RESOURCES_PENDING, FETCH_RESOURCES_SUCCESS } from '../redux-constants';

const res = JSON.parse(JSON.stringify(content)) as IResource;
const initialState: IResources = {
  pending: false,
  data: {
    children: [],
    labels: [],
    segment: ''
  },
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
        data: res
      };
    case FETCH_RESOURCES_PENDING:
      return {
        pending: true,
        data: {},
        error: null
      };
    default:
      return state;
  }
}
