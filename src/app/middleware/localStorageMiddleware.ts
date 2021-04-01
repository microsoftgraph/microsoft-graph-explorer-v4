import { IAction } from '../../types/action';

const localStorageMiddleware = (_store: any) => (next: any) => (action: IAction) => {
  if (action.type === 'AUTHENTICATE_USER') {
    localStorage.setItem('authenticatedUser', JSON.stringify(action.response));
  }
  return next(action);
};

export default localStorageMiddleware;
