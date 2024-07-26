import configureMockStore from 'redux-mock-store';

import { PayloadAction } from '@reduxjs/toolkit';
import { CLEAR_TERMS_OF_USE } from '../../../app/services/redux-constants';
import { clearTermsOfUse } from '../slices/terms-of-use.slice';
import { mockThunkMiddleware } from './mockThunkMiddleware';

const mockStore = configureMockStore([mockThunkMiddleware]);

describe('Terms of Use Action Creators', () => {
  it('should set terms of use flag to false', () => {
    const expectedAction: PayloadAction<undefined>[] = [
      {
        type: CLEAR_TERMS_OF_USE,
        payload: undefined
      }
    ];

    const store = mockStore({ termsOfUse: {} });

    store.dispatch(clearTermsOfUse());
    expect(store.getActions()).toEqual(expectedAction);
  });
});