import 'bootstrap/dist/css/bootstrap-grid.min.css';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import React from 'react';
import ReactDOM from 'react-dom';
import { addLocaleData, IntlProvider } from 'react-intl';
import br from 'react-intl/locale-data/br';
import de from 'react-intl/locale-data/de';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';
import fr from 'react-intl/locale-data/fr';
import jp from 'react-intl/locale-data/ja';
import ru from 'react-intl/locale-data/ru';
import zh from 'react-intl/locale-data/zh';
import { Provider } from 'react-redux';

import { getAuthTokenSuccess, getConsentedScopesSuccess } from './app/services/actions/auth-action-creators';
import { setGraphExplorerMode } from './app/services/actions/explorer-mode-action-creator';
import { addHistoryItem } from './app/services/actions/request-history-action-creators';
import { changeTheme } from './app/services/actions/theme-action-creator';
import { msalApplication } from './app/services/graph-client/msal-agent';
import { DEFAULT_USER_SCOPES } from './app/services/graph-constants';
import App from './app/views/App';
import messages from './messages';
import { store } from './store';
import { readData } from './store/cache';
import './styles/index.scss';
import { loadGETheme } from './themes';
import { Mode } from './types/action';
import { IHistoryItem } from './types/history';

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

initializeIcons();

const appState = store({
  authToken: '',
  consentedScopes: [],
  headersAdded: [{ name: '', value: '' }],
  isLoadingData: false,
  queryRunnerStatus: null,
  sampleQuery: {
    sampleUrl: 'https://graph.microsoft.com/v1.0/me/',
    selectedVerb: 'GET',
    sampleBody: undefined,
    sampleHeaders: {},
    selectedVersion: 'v1.0',
  },
  termsOfUse: true,
  theme: 'light',

});

msalApplication.acquireTokenSilent({ scopes: DEFAULT_USER_SCOPES.split(' ') }).then((authResponse: any) => {
  if (authResponse && authResponse.accessToken) {
    appState.dispatch(getAuthTokenSuccess(authResponse.accessToken));
    appState.dispatch(getConsentedScopesSuccess(authResponse.scopes));
  }
}).catch(() => {
  // ignore the error as it means that a User login is required
});

const localeMap: any = {
  'de-de': 'de-DE',
  'en-us': 'en-US',
  'es-es': 'es-ES',
  'fr-fr': 'fr-FR',
  'ja-jp': 'ja-JP',
  'pt-br': 'pt-BR',
  'ru-ru': 'ru-RU',
  'zh-cn': 'zh-CN'
};
const hostDocumentLocale = new URLSearchParams(location.search).get('locale');
const geLocale = hostDocumentLocale && localeMap[hostDocumentLocale] || 'en-US';

addLocaleData([
  ...br,
  ...de,
  ...en,
  ...fr,
  ...jp,
  ...ru,
  ...zh,
  ...es,
]);


const theme = new URLSearchParams(location.search).get('theme');

if (theme) {
  loadGETheme(theme);
  appState.dispatch(changeTheme(theme));
}

if (hostDocumentLocale) {
  appState.dispatch(setGraphExplorerMode(Mode.TryIt));
}

readData().then((data: any) => {
  if (data.length > 0) {
    data.forEach((element: IHistoryItem) => {
      appState.dispatch(addHistoryItem(element));
    });
  }
});

/**
 * Set's up Monaco Editor's Workers.
 */
enum Workers {
  Json = 'json',
  Editor = 'editor'
}

const Root = () => {
  return (
    <Provider store={appState}>
      <IntlProvider locale={geLocale} messages={(messages as { [key: string]: object })[geLocale]}>
        <App />
      </IntlProvider>
    </Provider>
  );
};

ReactDOM.render(<Root />, document.getElementById('root'));
