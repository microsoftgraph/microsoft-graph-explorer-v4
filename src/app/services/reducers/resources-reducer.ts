import { AppAction } from '../../../types/action';
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

export function resources(state: IResources = initialState, action: AppAction): IResources {
  switch (action.type) {
    case FETCH_RESOURCES_SUCCESS:
      return {
        pending: false,
        data: action.response,
        error: null,
        paths: []
      };
    case FETCH_RESOURCES_ERROR:
      return {
        pending: false,
        error: action.response,
        data: res,
        paths: []
      };
    case FETCH_RESOURCES_PENDING:
      return {
        pending: true,
        data: initialState.data,
        error: null,
        paths: []
      };
    case RESOURCEPATHS_ADD_SUCCESS:
      const paths: IResourceLink[] = [...state.paths];
      action.response.forEach((element: any) => {
        const exists = !!paths.find(k => k.key === element.key);
        if (!exists) {
          paths.push(element);
        }
      });
      return {
        ...state,
        paths
      };
    case RESOURCEPATHS_DELETE_SUCCESS:
      const list: IResourceLink[] = [...state.paths];
      action.response.forEach((path: IResourceLink) => {
        const index = list.findIndex(k => k.key === path.key);
        list.splice(index, 1);
      });
      return {
        ...state,
        paths: list
      };
    default:
      return state;
  }
}
