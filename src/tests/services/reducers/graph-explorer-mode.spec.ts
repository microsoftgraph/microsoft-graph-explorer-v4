import { graphExplorerMode } from '../../../app/services/reducers/graph-explorer-mode-reducer';
import { SET_GRAPH_EXPLORER_MODE_SUCCESS } from '../../../app/services/redux-constants';
import { Mode } from '../../../types/action';

describe('Graph Explorer Mode Reducer', () => {
  it('should change graph explorer Mode', () => {
    const initialState = {};
    const dummyAction = { type: SET_GRAPH_EXPLORER_MODE_SUCCESS, response: Mode.TryIt };
    const newState = graphExplorerMode(initialState, dummyAction);

    expect(newState).toEqual(Mode.TryIt);
  });
});
