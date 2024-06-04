import configureMockStore from 'redux-mock-store';

import { toggleSidebar } from './toggle-sidebar-action-creator';
import { TOGGLE_SIDEBAR_SUCCESS } from '../redux-constants';

const mockStore = configureMockStore();

describe('Toggle Sidebar Action Creators', () => {
  it('should dispatch TOGGLE_SIDEBAR_SUCCESS and  set sidebar toggle to visible when toggleSidebar() is called', () => {
    const expectedActions = [
      {
        type: TOGGLE_SIDEBAR_SUCCESS,
        response: {
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

