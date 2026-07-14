import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

const defaultState: Record<string, any> = {
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
  theme: 'light',
  graphExplorerMode: 'TryIt',
  sidebarProperties: {
    showSidebar: true,
    mobileScreen: false
  },
  dimensions: {
    request: { width: '100%', height: '50vh' },
    response: { width: '100%', height: '50vh' },
    content: { width: '100%', height: '100vh' }
  },
  graphResponse: {
    isLoadingData: false,
    response: {
      body: undefined,
      headers: undefined
    }
  },
  history: [],
  collections: {
    collections: [],
    saved: false
  },
  samples: {
    queries: [],
    pending: false
  },
  snippets: {
    pending: false,
    data: []
  },
  scopes: {
    pending: { isSpecificPermissions: false, isTenantWide: false, isFullPermissions: false },
    data: {
      specificPermissions: [],
      fullPermissions: [],
      tenantWidePermissions: []
    }
  },
  responseAreaExpanded: false,
  autoComplete: {
    data: null,
    pending: false
  },
  devxApi: {
    baseUrl: 'https://graphexplorerapi.azurewebsites.net',
    parameters: ''
  },
  resources: {
    pending: false,
    data: { children: [], segment: '/', labels: [], version: '' },
    error: null
  },
  proxyUrl: 'https://proxy.example.com',
  permissionGrants: null
};

function createIdentityReducer(initialState: any) {
  return (state = initialState) => state;
}

export function createMockStore(preloadedState?: DeepPartial<any>) {
  const mergedState = { ...defaultState, ...preloadedState };
  const reducerMap: Record<string, any> = {};
  for (const key of Object.keys(mergedState)) {
    reducerMap[key] = createIdentityReducer(mergedState[key]);
  }
  return configureStore({
    reducer: reducerMap,
    preloadedState: mergedState
  });
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = createMockStore(preloadedState),
    ...renderOptions
  }: {
    preloadedState?: DeepPartial<any>;
    store?: ReturnType<typeof createMockStore>;
  } & Omit<RenderOptions, 'wrapper'> = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(Provider as any, { store }, children);
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
