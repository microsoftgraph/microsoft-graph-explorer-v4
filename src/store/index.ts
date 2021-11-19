import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import localStorageMiddleware from '../app/middleware/localStorageMiddleware';
import telemetryMiddleware from '../app/middleware/telemetryMiddleware';
import reducers from '../app/services/reducers';
import { getCurrentCloud, globalCloud } from '../modules/sovereign-clouds';

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

const currentCloud = getCurrentCloud() || null;
const { baseUrl } = (currentCloud) ? currentCloud : globalCloud;

const initialState: any = {
  authToken: { token: false, pending: false },
  consentedScopes: [],
  isLoadingData: false,
  profile: null,
  queryRunnerStatus: null,
  sampleQuery: {
    sampleUrl: `${baseUrl}/v1.0/me`,
    selectedVerb: 'GET',
    sampleBody: undefined,
    sampleHeaders: [],
    selectedVersion: 'v1.0'
  },
  termsOfUse: true
};

export const store = createStore(
  reducers,
  initialState,
  applyMiddleware(...middlewares)
);
