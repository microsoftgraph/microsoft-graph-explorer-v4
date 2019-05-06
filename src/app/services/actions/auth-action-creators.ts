import { IAction } from '../../../types/action';
import { AUTHENTICATE_USER } from '../constants';
import { HelloAuthProvider } from '../graph-client/HelloAuthProvider';

export function authenticateUserSuccess(response: object): IAction {
  return {
    type: AUTHENTICATE_USER,
    response,
  };
}

export function authenticateUser(): void {
  new HelloAuthProvider()
    .login();
}
