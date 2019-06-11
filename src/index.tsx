import 'bootstrap/dist/css/bootstrap-grid.min.css';
import { loadTheme, styled } from 'office-ui-fabric-react';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import React from 'react';
import ReactDOM from 'react-dom';
import { addLocaleData, IntlProvider } from 'react-intl';
import br from 'react-intl/locale-data/br';
import de from 'react-intl/locale-data/de';
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';
import jp from 'react-intl/locale-data/ja';
import ru from 'react-intl/locale-data/ru';
import zh from 'react-intl/locale-data/zh';
import { Provider } from 'react-redux';
import { getAuthTokenSuccess } from './app/services/actions/auth-action-creators';
import { HelloAuthProvider } from './app/services/graph-client/HelloAuthProvider';

import App from './app/views/App';
import messages from './messages';
import { store } from './store';
import './styles/index.scss';
import { dark, light } from './themes';

initializeIcons();

const appState = store({
  authToken: '',
  isLoadingData: false,
  queryRunnerError: null,
  sampleQuery: {
    sampleUrl: 'https://graph.microsoft.com/v1.0/me/',
    selectedVerb: 'GET',
  }
});


new HelloAuthProvider().getAccessToken()
  .then((token) => {
    if (token) {
      appState.dispatch(getAuthTokenSuccess(token));
    }
  });



const supportedLocales = ['de-DE', 'en-US', 'es-ES', 'fr-FR', 'ja-JP', 'pt-BR', 'ru-RU', 'zh-CN'];

const locale = supportedLocales.indexOf(navigator.language) !== -1 ? navigator.language : 'en-US';

addLocaleData([
  ...br,
  ...de,
  ...en,
  ...fr,
  ...jp,
  ...ru,
  ...zh,
]);

loadTheme(light);

const Root = () => {
  return (
    <Provider store={appState}>
      <IntlProvider locale={locale} messages={(messages as {[key: string]: object})[locale]}>
        <App />
      </IntlProvider>
    </Provider>
  );
};

ReactDOM.render(<Root />, document.getElementById('root'));
