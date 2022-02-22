import { PERMISSIONS_PANEL_OPEN } from '../../../app/services/redux-constants';
import { togglePermissionsPanel } from '../../../app/services/actions/permissions-panel-action-creator';

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