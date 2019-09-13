import { sidebarProperties } from '../../../app/services/reducers/toggle-sidebar-reducer';
import { TOGGLE_SIDEBAR_SUCCESS } from '../../../app/services/redux-constants';

describe('Toggle Sidebar Reducer', () => {
  it('should toggle the sidebar', () => {
    const initialState = {
      showToggle: false,
      showSidebar: false,
    };

    const properties = {
      showToggle: true,
      showSidebar: true,
    };

    const dummyAction = {
      type: TOGGLE_SIDEBAR_SUCCESS, response: properties
    };

    const newState = sidebarProperties(initialState, dummyAction);

    expect(newState).toEqual(properties);

  });
});
