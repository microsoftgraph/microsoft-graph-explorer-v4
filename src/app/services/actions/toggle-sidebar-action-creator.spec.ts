import configureMockStore from 'redux-mock-store';

import { TOGGLE_SIDEBAR_SUCCESS } from '../redux-constants';
import { toggleSidebar } from '../slices/sidebar-properties.slice';

const mockStore = configureMockStore();

describe('Toggle Sidebar Action Creators', () => {
  it('should dispatch TOGGLE_SIDEBAR_SUCCESS and  set sidebar toggle to visible when toggleSidebar() is called', () => {
    const expectedActions = [
      {
        type: TOGGLE_SIDEBAR_SUCCESS,
        payload: {
          mobileScreen: true,
          showSidebar: false
        }
      }
    ];

    const store = mockStore({ sidebarProperties: {} });

    // @ts-ignore
    store.dispatch(toggleSidebar({
      mobileScreen: true,
      showSidebar: false
    }))
    expect(store.getActions()).toEqual(expectedActions);
  });
});

