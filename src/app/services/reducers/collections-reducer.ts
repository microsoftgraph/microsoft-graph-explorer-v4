import { AppAction } from '../../../types/action';
import { Collection, ResourcePath } from '../../../types/resources';
import {
  COLLECTION_CREATE_SUCCESS,
  RESOURCEPATHS_ADD_SUCCESS, RESOURCEPATHS_DELETE_SUCCESS
} from '../redux-constants';
import { getUniquePaths } from './collections-reducer.util';

const initialState: Collection[] = [];

export function collections(state: Collection[] = initialState, action: AppAction): Collection[] {
  switch (action.type) {

    case COLLECTION_CREATE_SUCCESS:
      const items = [...state];
      items.push(action.response);
      return items;

    case RESOURCEPATHS_ADD_SUCCESS:
      const index = state.findIndex(k => k.isDefault);
      if (index > -1) {
        const paths: ResourcePath[] = getUniquePaths(state[index].paths, action.response);
        const context = [...state];
        context[index].paths = paths;
        return context;
      }
      return state

    case RESOURCEPATHS_DELETE_SUCCESS:
      const indexOfDefaultCollection = state.findIndex(k => k.isDefault);
      if (indexOfDefaultCollection > -1) {
        const list: ResourcePath[] = [...state[indexOfDefaultCollection].paths];
        action.response.forEach((path: ResourcePath) => {
          const pathIndex = list.findIndex(k => k.key === path.key);
          list.splice(pathIndex, 1);
        });
        const newState = [...state];
        newState[indexOfDefaultCollection].paths = list;
        return newState;
      }
      return state

    default:
      return state;
  }
}
