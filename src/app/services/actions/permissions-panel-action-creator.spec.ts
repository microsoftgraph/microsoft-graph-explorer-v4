import { PERMISSIONS_PANEL_OPEN } from '../redux-constants';
import { togglePermissionsPanel } from './permissions-panel-action-creator';

describe('Tests permissions panel action creator', () => {
  it('tests permissions panel action creator', () => {
    // Arrange
    const response: boolean = true;
    const expectedAction = {
      type: PERMISSIONS_PANEL_OPEN,
      response
    }

    // Act
    const action = togglePermissionsPanel(response);

    // Assert
    expect(action).toEqual(expectedAction);
  })
})