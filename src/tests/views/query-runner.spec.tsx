import { shallow } from 'enzyme';
import React from 'react';

import { QueryRunner } from '../../app/views/query-runner/QueryRunner';

describe('Query Runner Component', () => {

  function renderQueryRunner(args?: any) {
    const defaultProps = {
      isLoadingData: false,
      headers: [],
      sampleQuery: {
        sampleUrl: 'https://graph.microsoft.com/v1.0/me/'
      }
    };

    const props = { ...defaultProps, ...args };
    return shallow(<QueryRunner {...props} />);
  }

  it('renders without crashing', () => {
    renderQueryRunner();
  });

});
