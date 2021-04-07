import { shallow } from 'enzyme';
import React from 'react';
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

  test(`ResponseHeaders renders with default props`, () => {
    const wrapper = shallow(<Wrapper />);
    expect(wrapper).toMatchSnapshot();
  });
});