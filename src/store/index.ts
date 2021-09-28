import { applyMiddleware, createStore, Store } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import localStorageMiddleware from '../app/middleware/localStorageMiddleware';
import telemetryMiddleware from '../app/middleware/telemetryMiddleware';
import reducers from '../app/services/reducers';

const loggerMiddleware = createLogger({
  level: 'error',
  collapsed: true
});

const { NODE_ENV } = process.env;

const middlewares = [
  thunkMiddleware,
  localStorageMiddleware,
  telemetryMiddleware
];

if (NODE_ENV === 'development') {
  middlewares.push(loggerMiddleware);
}

const initialState: any = {
  authToken: { token: false, pending: false },
  consentedScopes: [],
  isLoadingData: false,
  profile: null,
  queryRunnerStatus: null,
  sampleQuery: {
    sampleUrl: 'https://graph.microsoft.com/v1.0/me',
    selectedVerb: 'GET',
    sampleBody: undefined,
    sampleHeaders: [],
    selectedVersion: 'v1.0'
  },
  termsOfUse: true,
  tourState: { runState: false, beginnerTour: true }
};

export const store = createStore(
  reducers,
  initialState,
  applyMiddleware(...middlewares)
);
