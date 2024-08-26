import configureMockStore from 'redux-mock-store';

import { changeTheme } from '../slices/theme.slice';

const mockStore = configureMockStore();

describe('Change theme action creator', () => {
  it('Changes theme to dark', () => {
    const expectedActions = [
      {
        type: 'theme/changeTheme',
        payload: 'dark'
      }
    ];

    const store = mockStore({ theme: '' });

    // @ts-ignore
    store.dispatch(changeTheme('dark'));
    expect(store.getActions()).toEqual(expectedActions);
  })
})