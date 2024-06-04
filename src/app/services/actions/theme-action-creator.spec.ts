import configureMockStore from 'redux-mock-store';

import { changeTheme } from '../../../app/services/actions/theme-action-creator';
import { CHANGE_THEME_SUCCESS } from '../../../app/services/redux-constants';

const mockStore = configureMockStore();

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
    store.dispatch(changeTheme('dark'));
    expect(store.getActions()).toEqual(expectedActions);
  })
})