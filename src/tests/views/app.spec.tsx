import React from 'react';
import { shallow } from 'enzyme';
import App from '../../app/views/App';

describe(`Component: App`, () => {
  test(`App renders with default props`, () => {
    const wrapper = shallow(<App />);
    expect(wrapper).toMatchSnapshot();
  });
});