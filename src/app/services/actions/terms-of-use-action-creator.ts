import { CLEAR_TERMS_OF_USE } from '../redux-constants';

export function clearTermsOfUse() {
  return {
    type: CLEAR_TERMS_OF_USE,
    response: null
  };
}