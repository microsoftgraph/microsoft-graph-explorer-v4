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

import { getAuthTokenSuccess, setGraphExplorerMode } from './app/services/actions/auth-action-creators';
import { HelloAuthProvider } from './app/services/graph-client/HelloAuthProvider';
import App from './app/views/App';
import messages from './messages';
import { store } from './store';
import './styles/index.scss';
import { loadGETheme } from './themes';
import { Mode } from './types/action';
import { IInitMessage, IThemeChangedMessage } from './types/query-runner';

initializeIcons();

const appState = store({
  authToken: '',
  isLoadingData: false,
  queryRunnerError: null,
  headersAdded: [{ name: '', value: '' }],
  sampleQuery: {
    sampleUrl: 'https://graph.microsoft.com/v1.0/me/',
    selectedVerb: 'GET',
    sampleBody: undefined,
    sampleHeaders: {},
  },
});


new HelloAuthProvider().getAccessToken()
  .then((token) => {
    if (token) {
      appState.dispatch(getAuthTokenSuccess(token));
    }
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
}

if (hostDocumentLocale) {
  appState.dispatch(setGraphExplorerMode(Mode.TryIt));
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

window.addEventListener('message', receiveMessage, false);

function receiveMessage(event: MessageEvent) {
  const msgEvent: IThemeChangedMessage | IInitMessage = event.data;

  switch (msgEvent.type) {
    case 'theme-changed':
      console.log('Received theme');
      loadGETheme(msgEvent.theme);
      ReactDOM.render(<Root />, document.getElementById('root'));
      break;
    default:
      return;
  }
}
