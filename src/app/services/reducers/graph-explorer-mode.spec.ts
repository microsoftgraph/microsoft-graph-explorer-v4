import { SET_GRAPH_EXPLORER_MODE_SUCCESS } from '../../../app/services/redux-constants';
import { Mode } from '../../../types/enums';
import { setGraphExplorerMode } from '../slices/explorer-mode.slice';

describe('Graph Explorer Mode Reducer', () => {
  it('should change graph explorer Mode', () => {
    const dummyAction = { type: SET_GRAPH_EXPLORER_MODE_SUCCESS, payload: Mode.TryIt };
    const newState = setGraphExplorerMode(dummyAction.payload);

    expect(newState).toEqual(dummyAction);
  });
});
