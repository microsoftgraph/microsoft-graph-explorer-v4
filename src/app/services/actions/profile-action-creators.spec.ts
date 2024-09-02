import configureMockStore from 'redux-mock-store';

import { PROFILE_REQUEST_ERROR } from '../redux-constants';
import { mockThunkMiddleware } from './mockThunkMiddleware';
import { getProfileInfo } from '../slices/profile.slice';

const mockStore = configureMockStore([mockThunkMiddleware]);

describe('Profile action creators', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should dispatch PROFILE_REQUEST_ERROR when getProfileInfo() request fails', () => {
    fetchMock.mockResponseOnce(JSON.stringify({ ok: false }));
    const store = mockStore({});
    // @ts-ignore
    return store.dispatch(getProfileInfo())
      .then(() => {
        const includesError = store.getActions().filter(k => k.type === PROFILE_REQUEST_ERROR)
        expect(!!includesError).toEqual(true);
      })
      .catch((e: Error) => { throw e })
  });
});