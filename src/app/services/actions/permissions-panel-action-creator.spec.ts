import { PERMISSIONS_PANEL_OPEN } from '../redux-constants';
import { togglePermissionsPanel } from './permissions-panel-action-creator';
import { AppAction } from '../../../types/action';

describe('Permissions panel action creator', () => {
  it('should dispatch PERMISSIONS_PANEL_OPEN when togglePermissionsPanel({true/false}) is called', () => {
    // Arrange
    const response: boolean = true;
    const expectedAction: AppAction = {
      type: PERMISSIONS_PANEL_OPEN,
      response
    }

    // Act
    const action = togglePermissionsPanel(response);

    // Assert
    expect(action).toEqual(expectedAction);
  })
})