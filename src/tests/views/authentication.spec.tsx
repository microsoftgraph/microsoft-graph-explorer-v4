import { shallow } from 'enzyme';
import React from 'react';

import { Authentication } from '../../app/views/authentication/Authentication';

describe('Authentication Component', () => {
  it('renders without crashing', () => {
    shallow(<Authentication tokenPresent={false} />);
  });
});
