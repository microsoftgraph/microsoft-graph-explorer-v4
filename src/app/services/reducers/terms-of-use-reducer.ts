import { IAction } from '../../../types/action';
import { CLEAR_TERMS_OF_USE } from '../redux-constants';

export function termsOfUse(state = true, action: IAction): boolean {
    switch (action.type) {
      case CLEAR_TERMS_OF_USE:
        return false;
      default:
        return state;
    }
  }