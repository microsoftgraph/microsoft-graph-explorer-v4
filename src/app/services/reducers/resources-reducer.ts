import { IAction } from '../../../types/action';
import { IResource, IResourceLink, IResources } from '../../../types/resources';
import content from '../../utils/resources/resources.json';
import {
  FETCH_RESOURCES_ERROR, FETCH_RESOURCES_PENDING,
  FETCH_RESOURCES_SUCCESS, RESOURCEPATHS_ADD_SUCCESS, RESOURCEPATHS_DELETE_SUCCESS
} from '../redux-constants';

const res = JSON.parse(JSON.stringify(content)) as IResource;
const initialState: IResources = {
  pending: false,
  data: {
    children: [],
    labels: [],
    segment: ''
  },
  error: null,
  paths: []
};

export function resources(state = initialState, action: IAction): any {
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
        data: initialState.data,
        error: null
      };
    case RESOURCEPATHS_ADD_SUCCESS:
      const paths: IResourceLink[] = state.paths || [];
      action.response.forEach((element: any) => {
        const exists = !!paths.find(k => k.key === element.key);
        if (!exists) {
          paths.push(element);
        }
      });
      return { ...state, paths };
    case RESOURCEPATHS_DELETE_SUCCESS:
      const list: IResourceLink[] = state.paths || [];
      for (let i = 0; i < action.response.length; i++) {
        list.splice(i, 1);
      }
      return { ...state, paths: list };
    default:
      return state;
  }
}
