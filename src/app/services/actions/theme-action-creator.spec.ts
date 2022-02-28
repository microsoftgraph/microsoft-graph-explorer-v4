import { changeThemeSuccess, changeTheme } from '../../../app/services/actions/theme-action-creator';
import { CHANGE_THEME_SUCCESS } from '../../../app/services/redux-constants';
import configureMockStore from 'redux-mock-store';

import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Change theme action creator', () => {
  it('Changes theme to dark', () => {
    const expectedActions = [
      {
        type: CHANGE_THEME_SUCCESS,
        response: 'dark'
      }
    ];

    const store = mockStore({ theme: '' });

    // @ts-ignore
    store.dispatch(changeThemeSuccess('dark'));
    expect(store.getActions()).toEqual(expectedActions);
  })

  it('dispatches an action that changes the theme ', () => {
    const expectedActions = [
      {
        type: CHANGE_THEME_SUCCESS,
        response: 'dark'
      }
    ];

    const store = mockStore({ theme: '' });

    // @ts-ignore
    store.dispatch(changeTheme('dark'));
    expect(store.getActions()).toEqual(expectedActions);
  })
})