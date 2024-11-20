import {
  Dispatch, Middleware, Store,
  ThunkDispatch, UnknownAction,
  combineReducers, configureStore
} from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { createLogger } from 'redux-logger';

import localStorageMiddleware from '../app/middleware/localStorageMiddleware';
import telemetryMiddleware from '../app/middleware/telemetryMiddleware';
import { reducers } from '../app/services/reducers';

const loggerMiddleware = createLogger({
  level: 'error',
  collapsed: true
}) as Middleware<{}, unknown, Dispatch<UnknownAction>>;

const middleware = [
  localStorageMiddleware,
  telemetryMiddleware
];

const { NODE_ENV } = process.env;
if (NODE_ENV === 'development') {
  middleware.push(loggerMiddleware);
}

const combinedReducer = combineReducers(reducers);

const initialState = {
  auth: {
    authToken: { token: false, pending: false },
    consentedScopes: []
  },
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
  collections: {
    collections: [],
    saved: false
  },
  graphResponse: {
    isLoadingData: false,
    response: {
      body: undefined,
      headers: undefined
    }
  }
}

export const store = configureStore({
  reducer: combinedReducer,
  middleware: (getDefaultMiddleware: any) => getDefaultMiddleware().concat(...middleware),
  preloadedState: {
    ...initialState,
    auth: {
      authToken: { pending: false, token: false },
      consentedScopes: []
    },
    autoComplete: undefined,
    collections: {
      collections: [],
      saved: false
    },
    devxApi: undefined,
    dimensions: undefined as undefined,
    graphResponse: undefined as undefined,
    history: undefined as undefined,
    samples: undefined as undefined,
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
  }
});

export type ApplicationState = ReturnType<typeof store.getState>;

export type AppDispatch = ThunkDispatch<ApplicationState, unknown, UnknownAction>;

export type AppStore = Omit<Store<ApplicationState, UnknownAction>, 'dispatch'> & {
  dispatch: AppDispatch;
};

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<ApplicationState> = useSelector;
