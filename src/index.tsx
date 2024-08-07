import { AuthenticationResult } from '@azure/msal-browser';
import { initializeIcons } from '@fluentui/react';
import '@ms-ofb/officebrowserfeedbacknpm/styles/officebrowserfeedback.css';
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './app/views/App';

import { CURRENT_THEME } from './app/services/graph-constants';
import { getAuthTokenSuccess, getConsentedScopesSuccess } from './app/services/slices/auth.slice';
import { createCollection } from './app/services/slices/collections.slice';
import { setDevxApiUrl } from './app/services/slices/devxapi.slice';
import { setGraphExplorerMode } from './app/services/slices/explorer-mode.slice';
import { bulkAddHistoryItems } from './app/services/slices/history.slice';
import { getGraphProxyUrl } from './app/services/slices/proxy.slice';
import { fetchResources } from './app/services/slices/resources.slice';
import { setSampleQuery } from './app/services/slices/sample-query.slice';
import { toggleSidebar } from './app/services/slices/sidebar-properties.slice';
import { changeTheme } from './app/services/slices/theme.slice';
import variantService from './app/services/variant-service';
import { isValidHttpsUrl } from './app/utils/external-link-validation';
import { readFromLocalStorage } from './app/utils/local-storage';
import { authenticationWrapper } from './modules/authentication';
import { collectionsCache } from './modules/cache/collections.cache';
import { historyCache } from './modules/cache/history-utils';
import { store } from './store';
import './styles/index.scss';
import { telemetry } from './telemetry';
import ITelemetry from './telemetry/ITelemetry';
import { loadGETheme } from './themes';
import { IDevxAPI } from './types/devx-api';
import { Mode } from './types/enums';
import { IHistoryItem } from './types/history';
import { Collection } from './types/resources';


const appRoot: HTMLElement = document.getElementById('root')!;
initializeIcons();

let currentTheme = readFromLocalStorage(CURRENT_THEME) || 'light';
export function removeSpinners() {
  // removes the loading spinner from GE html after the app is loaded
  const spinner = document.getElementById('spinner');
  if (spinner !== null) {
    (spinner as any).parentElement.removeChild(spinner);
  }

  // removes the loading spinner from the portal team html after GE loads
  const apiExplorer = document.getElementsByTagName('api-explorer')[0];
  if (apiExplorer) {
    (apiExplorer as any).parentElement.removeChild(apiExplorer);
  }

  // makes appRoot visible
  appRoot.classList.remove('hidden');
}

function setCurrentSystemTheme(): void {
  const themeFromLocalStorage = readFromLocalStorage(CURRENT_THEME);

  if (themeFromLocalStorage) {
    currentTheme = themeFromLocalStorage;
  } else {
    currentTheme = getOSTheme();
  }

  applyCurrentSystemTheme(currentTheme);
}
function getOSTheme(): string {
  let currentSystemTheme: string;
  const currentSystemThemeDark = window.matchMedia(
    '(prefers-color-scheme: dark)'
  );

  const currentSystemThemeLight = window.matchMedia(
    '(prefers-color-scheme: light)'
  );

  if (currentSystemThemeDark.matches === true) {
    currentSystemTheme = 'dark';
  } else if (currentSystemThemeLight.matches === true) {
    currentSystemTheme = 'light';
  } else {
    currentSystemTheme = 'high-contrast';
  }

  return currentSystemTheme;
}

function applyCurrentSystemTheme(themeToApply: string): void {
  loadGETheme(themeToApply);
  appStore.dispatch(changeTheme(themeToApply));
}

const appStore: any = store;

setCurrentSystemTheme();
appStore.dispatch(getGraphProxyUrl());

function refreshAccessToken() {
  authenticationWrapper.getToken().then((authResponse: AuthenticationResult) => {
    if (authResponse && authResponse.accessToken) {
      appStore.dispatch(getAuthTokenSuccess());
      appStore.dispatch(getConsentedScopesSuccess(authResponse.scopes));
    }
  })
    .catch(() => {
      // ignore the error as it means that a User login is required
    });
}
refreshAccessToken();

setInterval(refreshAccessToken, 1000 * 60 * 10); // refresh access token every 10 minutes

const theme = new URLSearchParams(location.search).get('theme');

if (theme) {
  loadGETheme(theme);
  appStore.dispatch(changeTheme(theme));
  appStore.dispatch(setGraphExplorerMode(Mode.TryIt));
} else {
  appStore.dispatch(setGraphExplorerMode(Mode.Complete));
  appStore.dispatch(toggleSidebar({
    mobileScreen: false,
    showSidebar: true
  }))
}

const devxApiUrl = new URLSearchParams(location.search).get('devx-api');

if (devxApiUrl && isValidHttpsUrl(devxApiUrl)) {
  const org = new URLSearchParams(location.search).get('org');
  const branchName = new URLSearchParams(location.search).get('branchName');

  const devxApi: IDevxAPI = {
    baseUrl: devxApiUrl,
    parameters: ''
  };

  if (org && branchName) {
    devxApi.parameters = `org=${org}&branchName=${branchName}`;
  }
  appStore.dispatch(setDevxApiUrl(devxApi));
}

historyCache.readHistoryData().then((data: IHistoryItem[]) => {
  if (data && data.length > 0) {
    appStore.dispatch(bulkAddHistoryItems(data));
  }
});

collectionsCache.read().then((data: Collection[]) => {
  if (!data || data.length === 0) {
    appStore.dispatch(createCollection({
      id: new Date().getTime().toString(),
      name: 'My Collection',
      paths: [],
      isDefault: true
    }));
  } else {
    data.forEach((collection: Collection) => {
      appStore.dispatch(createCollection(collection));
    });
  }
});

function loadResources() {
  appStore.dispatch(fetchResources());
}
loadResources();

appStore.dispatch(setSampleQuery(
  {
    sampleUrl: 'https://graph.microsoft.com/v1.0/me',
    selectedVerb: 'GET',
    sampleBody: undefined,
    sampleHeaders: [],
    selectedVersion: 'v1.0'
  }
));

/**
 * Set's up Monaco Editor's Workers.
 */
enum Workers {
  Json = 'json',
  Editor = 'editor',
  Typescript='ts',
  Css='css',
  Html='html'
}

window.MonacoEnvironment = {
  getWorkerUrl(moduleId: any, label: string) {
    switch (label) {
      case 'json':
        return getWorkerFor(Workers.Json);
      case 'css':
        return getWorkerFor(Workers.Css);
      case 'html':
        return getWorkerFor(Workers.Html);
      case 'typescript':
        return getWorkerFor(Workers.Typescript);
      default:
        return getWorkerFor(Workers.Editor);
    }
  }
};

function getWorkerFor(worker: string): string {
  // tslint:disable-next-line:max-line-length
  const WORKER_PATH =
    'https://graphstagingblobstorage.blob.core.windows.net/staging/vendor/bower_components/explorer-v2/build';

  return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
	    importScripts('${WORKER_PATH}/${worker}.worker.js');`)}`;
}

variantService.initialize();
const telemetryProvider: ITelemetry = telemetry;
telemetryProvider.initialize();

window.onerror = (message, url, lineNumber, columnNumber, error) => {
  telemetry.trackException(error!, 0, {
    message,
    url,
    lineNumber,
    columnNumber
  });
}

const Root = () => {
  return (
    <Provider store={appStore}>
      <App />
    </Provider>
  );
};
const root = ReactDOM.createRoot(appRoot);
root.render(<Root />);
