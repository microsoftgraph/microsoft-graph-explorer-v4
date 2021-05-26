import { applyMiddleware, createStore, Store } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import localStorageMiddleware from '../app/middleware/localStorageMiddleware';
import telemetryMiddleware from '../app/middleware/telemetryMiddleware';
import reducers from '../app/services/reducers';

const loggerMiddleware = createLogger({
  level: 'error',
  collapsed: true,
});

const { NODE_ENV } = process.env;

const middlewares = [
  thunkMiddleware,
  localStorageMiddleware,
  telemetryMiddleware,
];

if (NODE_ENV === 'development') {
  middlewares.push(loggerMiddleware);
}

export const store = (initialState: object): Store => {
  return createStore(reducers, initialState, applyMiddleware(...middlewares));
};
