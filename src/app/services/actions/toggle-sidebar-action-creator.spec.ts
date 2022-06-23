import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { toggleSidebar } from './toggle-sidebar-action-creator';
import { TOGGLE_SIDEBAR_SUCCESS } from '../redux-constants';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

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

