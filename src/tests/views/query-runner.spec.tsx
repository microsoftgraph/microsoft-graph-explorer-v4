import { mount, shallow } from 'enzyme';
import React from 'react';
import configureMockStore from 'redux-mock-store';

import { QueryInputControl } from '../../app/views/query-runner';
import { QueryRunner } from '../../app/views/query-runner/QueryRunner';

describe('Query Runner Component', () => {
  it('renders without crashing', () => {
    shallow(<QueryRunner/>);
  });

  it('has default sample url', () => {
    const wrapper = shallow(<QueryRunner/>);
    const props = wrapper.children().find(QueryInputControl).props();

    expect(props.sampleUrl).toBe('https://graph.microsoft.com/v1.0/me/');
  });
});
