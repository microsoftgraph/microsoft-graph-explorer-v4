import { shallow } from 'enzyme';
import React from 'react';

import { QueryRunner } from '../../app/views/query-runner';

describe('Query Runner Component', () => {
  it('renders without crashing', () => {
    shallow(<QueryRunner/>);
  });
});
