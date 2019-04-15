import { IAction } from '../../types/action';

const localStorageMiddleware = (store: any) => (next: any) => (action: IAction) => {
    next(action);
    if (action.type === 'AUTHENTICATE_USER') {
      localStorage.setItem('authenticatedUser', JSON.stringify(action.response));
    }
    return next(action);
  };

export default localStorageMiddleware;
