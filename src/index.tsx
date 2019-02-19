import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './app/views/App';
import { store } from './store';
import './styles/index.scss';

const appState = store({});

ReactDOM.render(
  <Provider store={appState}>
    <App />
  </Provider>,
  document.getElementById('root'));
