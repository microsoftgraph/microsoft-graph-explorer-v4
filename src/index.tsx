import { AuthenticationResult } from '@azure/msal-browser';
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import '@ms-ofb/officebrowserfeedbacknpm/styles/officebrowserfeedback.css';
import { initializeIcons } from '@fluentui/react';
import ReactDOM from 'react-dom/client';
import { IntlProvider } from 'react-intl';

import { Provider } from 'react-redux';
import { getAuthTokenSuccess, getConsentedScopesSuccess } from './app/services/actions/auth-action-creators';
import { setDevxApiUrl } from './app/services/actions/devxApi-action-creators';
import { setGraphExplorerMode } from './app/services/actions/explorer-mode-action-creator';
import { getGraphProxyUrl } from './app/services/actions/proxy-action-creator';
import { bulkAddHistoryItems } from './app/services/actions/request-history-action-creators';
import { changeTheme, changeThemeSuccess } from './app/services/actions/theme-action-creator';
import { isValidHttpsUrl } from './app/utils/external-link-validation';
import App from './app/views/App';
import { historyCache } from './modules/cache/history-utils';
import { geLocale } from './appLocale';
import messages from './messages';
import { authenticationWrapper } from './modules/authentication';
import { store } from './store';
import './styles/index.scss';
import { telemetry } from './telemetry';
import ITelemetry from './telemetry/ITelemetry';
import { loadGETheme } from './themes';
import { readTheme } from './themes/theme-utils';
import { IDevxAPI } from './types/devx-api';
import { Mode } from './types/enums';
import { fetchResources } from './app/services/actions/resource-explorer-action-creators';

const appRoot: HTMLElement = document.getElementById('root')!;
initializeIcons();

let currentTheme = readTheme() || 'light';
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
  const themeFromLocalStorage = readTheme();

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
      appStore.dispatch(getAuthTokenSuccess(true));
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
  appStore.dispatch(changeThemeSuccess(theme));
  appStore.dispatch(setGraphExplorerMode(Mode.TryIt));
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

historyCache.readHistoryData().then((data: any) => {
  if (data.length > 0) {
    appStore.dispatch(bulkAddHistoryItems(data));
  }
});

function loadResources() {
  appStore.dispatch(fetchResources());
}
loadResources();

/**
 * Set's up Monaco Editor's Workers.
 */
enum Workers {
  Json = 'json',
  Editor = 'editor',
}

(window as any).MonacoEnvironment = {
  getWorkerUrl(moduleId: any, label: string) {
    if (label === 'json') {
      return getWorkerFor(Workers.Json);
    }
    return getWorkerFor(Workers.Editor);
  }
};

function getWorkerFor(worker: string): string {
  // tslint:disable-next-line:max-line-length
  const WORKER_PATH =
    'https://graphstagingblobstorage.blob.core.windows.net/staging/vendor/bower_components/explorer-v2/build';

  return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
	    importScripts('${WORKER_PATH}/${worker}.worker.js');`)}`;
}

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
      <IntlProvider
        locale={geLocale}
        messages={(messages as { [key: string]: object })[geLocale]}
      >
        <App />
      </IntlProvider>
    </Provider>
  );
};
const root = ReactDOM.createRoot(appRoot);
root.render(<Root />);
