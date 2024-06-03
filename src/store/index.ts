import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { ActionCreator } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware, { ThunkAction } from 'redux-thunk';

import localStorageMiddleware from '../app/middleware/localStorageMiddleware';
import telemetryMiddleware from '../app/middleware/telemetryMiddleware';
import { reducers } from '../app/services/reducers';
import { AppAction } from '../types/action';
import { ApplicationState } from '../types/root';

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

const combinedReducer = combineReducers(reducers);

const initialState: Partial<ApplicationState> = {
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
  collections: undefined
}

const logger = process.env.NODE_ENV === 'development' ? loggerMiddleware : undefined;

export const store = configureStore({
  reducer: combinedReducer,
  preloadedState: {
    ...initialState,
    adaptiveCard: undefined,
    authToken: undefined,
    autoComplete: undefined,
    collections: [] as never,
    consentedScopes: undefined,
    devxApi: undefined,
    dimensions: undefined as undefined,
    graphResponse: undefined as undefined,
    history: undefined as undefined,
    samples: undefined as undefined,
    isLoadingData: undefined as undefined,
    profile: undefined as undefined,
    sampleQuery: undefined as undefined,
    theme: undefined as undefined,
    sidebarProperties: undefined as undefined,
    termsOfUse: undefined as undefined,
    snippets: undefined as undefined,
    scopes: undefined as undefined,
    queryRunnerStatus: undefined as undefined,
    responseAreaExpanded: undefined as undefined,
    resources: undefined as undefined,
    graphExplorerMode: undefined as undefined
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
    .concat(logger!)
    .concat(thunkMiddleware)
    .concat(localStorageMiddleware)
    .concat(telemetryMiddleware)
});

export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<ApplicationState> = useSelector;
export type AppThunk = ActionCreator<ThunkAction<void, ApplicationState, null, AppAction>>;