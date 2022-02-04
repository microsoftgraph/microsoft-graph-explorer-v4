import { IAction } from '../../../types/action';
import { permissionsPanelOpen } from '../../../app/services/reducers/permissions-panel-reducer';
import { PERMISSIONS_PANEL_OPEN } from '../../../app/services/redux-constants';

const initialState = true;

describe('Permissions panel reducer', () => {
  it('should handle PERMISSIONS_PANEL_OPEN', () => {
    const action = {
      type: PERMISSIONS_PANEL_OPEN,
      response: false
    }
    const expectedState = false;

    const newState = permissionsPanelOpen(initialState, action);
    expect(newState).toEqual(expectedState);
  });
})