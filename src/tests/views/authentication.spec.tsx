import { shallow } from 'enzyme';
import React from 'react';

import { Authentication } from '../../app/views/authentication';

describe('Authentication Component', () => {
  it('renders without crashing', () => {
    return shallow(<Authentication />);
  });
});
