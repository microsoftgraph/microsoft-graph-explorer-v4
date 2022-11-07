import { AppAction } from '../../../types/action';
import { IAdaptiveCardResponse } from '../../../types/adaptivecard';
import {
  FETCH_ADAPTIVE_CARD_ERROR,
  FETCH_ADAPTIVE_CARD_PENDING,
  FETCH_ADAPTIVE_CARD_SUCCESS
} from '../redux-constants';

const initialState: IAdaptiveCardResponse = {
  pending: false,
  data: undefined,
  error: ''
};

export function adaptiveCard(state = initialState, action: AppAction): any {
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
        data: null,
        error: action.response
      };
    default:
      return state;
  }
}