import { shallow } from 'enzyme';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import ResponseHeaders from '../../app/views/query-response/headers/ResponseHeaders';
import { store } from '../../store/index';

describe(`Components`, () => {

  const Wrapper = () => {
    const appState: any = store({});
    return (
      <Provider store={appState}>
        <ResponseHeaders />
      </Provider>
    )
  }

  it('ResponseHeaders renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Wrapper />, div);
    ReactDOM.unmountComponentAtNode(div);
  })
});