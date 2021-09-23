import { Dispatch } from 'redux';
import { CLEAR_TERMS_OF_USE } from '../redux-constants';

export function clearTermsOfUse(): Function {
  return (dispatch: Dispatch) => {
    dispatch({
      type: CLEAR_TERMS_OF_USE
    });
  };
}