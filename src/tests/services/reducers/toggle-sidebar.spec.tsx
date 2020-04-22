import { sidebarProperties } from '../../../app/services/reducers/toggle-sidebar-reducer';
import { TOGGLE_SIDEBAR_SUCCESS } from '../../../app/services/redux-constants';

describe('Toggle Sidebar Reducer', () => {
  it('should toggle the sidebar', () => {
    const initialState = {
      mobileScreen: false,
      showSidebar: false,
    };

    const properties = {
      mobileScreen: true,
      showSidebar: true,
    };

    const dummyAction = {
      type: TOGGLE_SIDEBAR_SUCCESS, response: properties
    };

    const newState = sidebarProperties(initialState, dummyAction);

    expect(newState).toEqual(properties);

  });
});
