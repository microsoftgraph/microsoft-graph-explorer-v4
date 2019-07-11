import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { setGraphExplorerMode } from '../../../app/services/actions/auth-action-creators';
import { SET_GRAPH_EXPLORER_MODE_SUCCESS } from '../../../app/services/redux-constants';
import { Mode } from '../../../types/action';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Graph Explorer Mode Action Creators', () => {
  it('Sets Graph Explorer Mode to TryIt', () => {
    const expectedActions = [
      {
        type: SET_GRAPH_EXPLORER_MODE_SUCCESS,
        response:  Mode.TryIt
      },
    ];

    const store = mockStore({ graphExplorerMode: '' });

    // @ts-ignore
    store.dispatch(setGraphExplorerMode(Mode.TryIt));
    expect(store.getActions()).toEqual(expectedActions);
  });
});

