import configureMockStore from 'redux-mock-store';

import { setGraphExplorerMode } from '../slices/explorer-mode.slice';
import { SET_GRAPH_EXPLORER_MODE_SUCCESS } from '../redux-constants';
import { Mode } from '../../../types/enums';

const mockStore = configureMockStore();

describe('Graph Explorer Mode Action Creators', () => {
  it('should dispatch SET_GRAPH_EXPLORER_MODE_SUCCESS when setGraphExplorerMode() is called', () => {
    const expectedActions = [
      {
        type: SET_GRAPH_EXPLORER_MODE_SUCCESS,
        payload: Mode.TryIt
      }
    ];

    const store = mockStore({ graphExplorerMode: '' });

    // @ts-ignore
    store.dispatch(setGraphExplorerMode(Mode.TryIt));
    expect(store.getActions()).toEqual(expectedActions);
  });
});

