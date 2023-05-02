import { AppAction } from '../../../types/action';
import { Collection, IResourceLink } from '../../../types/resources';
import {
  COLLECTION_CREATE_SUCCESS,
  RESOURCEPATHS_ADD_SUCCESS, RESOURCEPATHS_DELETE_SUCCESS
} from '../redux-constants';

const initialState: Collection[] = [];

export function collections(state: Collection[] = initialState, action: AppAction): Collection[] {
  switch (action.type) {

    case COLLECTION_CREATE_SUCCESS:
      const items = [...state];
      items.push(action.response);
      return items;

    case RESOURCEPATHS_ADD_SUCCESS:
      const index = 0;
      if (index > -1) {
        const paths: IResourceLink[] = [...state[index].paths];
        action.response.forEach((element: any) => {
          const exists = !!paths.find(k => k.key === element.key);
          if (!exists) {
            paths.push(element);
          }
        });
        const context = [...state];
        context[index].paths = paths;
        return context;
      }
      return state

    case RESOURCEPATHS_DELETE_SUCCESS:
      const indexOfDefaultCollection = 0;
      if (indexOfDefaultCollection > -1) {
        const list: IResourceLink[] = [...state[indexOfDefaultCollection].paths];
        action.response.forEach((path: IResourceLink) => {
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
