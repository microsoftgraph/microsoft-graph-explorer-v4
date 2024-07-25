import configureMockStore from 'redux-mock-store';

import { CLEAR_TERMS_OF_USE } from '../../../app/services/redux-constants';
import { AppAction } from '../../../types/action';
import { clearTermsOfUse } from '../slices/terms-of-use.slice';
import { mockThunkMiddleware } from './mockThunkMiddleware';

const mockStore = configureMockStore([mockThunkMiddleware]);

describe('Terms of Use Action Creators', () => {
  it('should set terms of use flag to false', () => {
    const expectedAction: AppAction[] = [
      {
        type: CLEAR_TERMS_OF_USE,
      }
    ];

    const store = mockStore({ termsOfUse: {} });

    store.dispatch(clearTermsOfUse());
    expect(store.getActions()).toEqual(expectedAction);
  });
});