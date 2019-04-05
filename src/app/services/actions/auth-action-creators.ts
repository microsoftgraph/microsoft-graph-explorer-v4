import { IAction } from '../../../types/action';
import { AUTHENTICATE_USER } from '../constants';

export function authenticateUser(response: object): IAction {
    return {
      type: AUTHENTICATE_USER,
      response,
    };
  }
