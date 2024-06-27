// This is a simple custom middleware that allows us to dispatch functions (like redux-thunk)
export const mockThunkMiddleware = (store: any) => (next: any) => (action: any) => {
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }

  return next(action);
};
