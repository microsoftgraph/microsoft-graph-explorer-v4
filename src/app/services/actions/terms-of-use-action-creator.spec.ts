import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { clearTermsOfUse } from '../../../app/services/actions/terms-of-use-action-creator';
import { CLEAR_TERMS_OF_USE } from '../../../app/services/redux-constants';
import { AppAction } from '../../../types/action';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Terms of Use Action Creators', () => {
  it('should set terms of use flag to false', () => {
    const expectedAction: AppAction[] = [
      {
        type: CLEAR_TERMS_OF_USE,
        response: null
      }
    ];

    const store = mockStore({ termsOfUse: {} });

    // @ts-ignore
    store.dispatch(clearTermsOfUse({
      termsOfUse: false
    }));
    expect(store.getActions()).toEqual(expectedAction);
  });
});