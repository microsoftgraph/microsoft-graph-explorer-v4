import { termsOfUse } from '../../../app/services/reducers/terms-of-use-reducer';
import { CLEAR_TERMS_OF_USE } from '../../../app/services/redux-constants';

describe('Terms of Use Action Creators', () => {
    it('should return initial state', () => {
      const initialState = true;

      const dummyAction: any = {
        type: CLEAR_TERMS_OF_USE, response: false
      };
      const newState = termsOfUse(initialState, dummyAction);

      expect(newState).toEqual(false);

    });
  });