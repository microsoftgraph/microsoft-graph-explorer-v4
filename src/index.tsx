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
import App from './app/views/App';

import messages from './messages';
import { store } from './store';
import './styles/index.scss';

initializeIcons();
const appState = store({});

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

ReactDOM.render(
  <Provider store={appState}>
    <IntlProvider locale={locale} messages={(messages as any)[locale]}>
      <App />
    </IntlProvider>
  </Provider>,
  document.getElementById('root'));
