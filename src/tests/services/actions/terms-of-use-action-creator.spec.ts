import { clearTermsOfUse } from '../../../app/services/actions/terms-of-use-action-creator';
import { CLEAR_TERMS_OF_USE } from '../../../app/services/redux-constants';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Terms of Use Action Creators', () => {
    it('Sets terms of use flag to false', () => {
      const expectedAction = [
        {
          type: CLEAR_TERMS_OF_USE,
          response: {
            termsOfUse: false
          }
        },
      ];

      const store = mockStore({ termsOfUseInfo: {} });

    // @ts-ignore
    store.dispatch(clearTermsOfUse({
        termsOfUse: false
    }));
    expect(store.getActions()).toEqual(expectedAction);
  });
});