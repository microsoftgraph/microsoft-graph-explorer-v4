import { shallow } from 'enzyme';
import React from 'react';

import { QueryRunner } from '../../app/views/query-runner/QueryRunner';

const queryProps = {
  isLoadingData: false,
  headers: [],
  sampleQuery: {
    selectedVerb: 'GET',
    sampleUrl: 'https://graph.microsoft.com/v1.0/me/',
  }
};

describe('Query Runner Component', () => {
  it('renders without crashing', () => {
    shallow(<QueryRunner {...queryProps}/>);
  });
});
