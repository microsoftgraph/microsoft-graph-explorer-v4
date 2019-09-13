import { IAction } from '../../../types/action';
import { FETCH_ADAPTIVE_CARD_ERROR, FETCH_ADAPTIVE_CARD_PENDING, FETCH_ADAPTIVE_CARD_SUCCESS } from '../redux-constants';

const initialState = {
  pending: false,
  data: ''
};

export function adaptiveCard(state = initialState, action: IAction): any {
  switch (action.type) {
    case FETCH_ADAPTIVE_CARD_SUCCESS:
      return {
        pending: false,
        data: action.response
      };
    case FETCH_ADAPTIVE_CARD_PENDING:
      return {
        pending: true,
        data: null
      };
    case FETCH_ADAPTIVE_CARD_ERROR:
      return {
        pending: false,
        data: null
      };
    default:
      return state;
  }
}