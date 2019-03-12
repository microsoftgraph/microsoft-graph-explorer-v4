import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import React from 'react';
import ReactDOM from 'react-dom';
import { addLocaleData, IntlProvider } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import { Provider } from 'react-redux';
import App from './app/views/App';

import messages from './messages';
import { store } from './store';
import './styles/index.scss';

initializeIcons();
const appState = store({});

const locale = 'en-US';

addLocaleData(enLocaleData);

ReactDOM.render(

  <Provider store={appState}>
    <IntlProvider locale={locale} messages={messages[locale]}>
      <App />
    </IntlProvider>
  </Provider>,
  document.getElementById('root'));
