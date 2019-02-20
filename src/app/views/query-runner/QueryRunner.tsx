import { Dropdown,
  PrimaryButton,
  TextField,
} from 'office-ui-fabric-react';
import React, { Component } from 'react';

import './query-runner.scss';

export class QueryRunner extends Component {
  public render() {
    return (
      <div className='query-controls'>
        <Dropdown
          className='query-verb-dropdown'
          defaultSelectedKey='GET'
          options={[
            { key: 'GET', text: 'GET' },
            { key: 'POST', text: 'POST' },
            { key: 'PUT', text: 'PUT' },
            { key: 'PATCH', text: 'PATCH'},
            { key: 'DELETE', text: 'DELETE' },
          ]}
        />
        <TextField
          placeholder='Query Sample'
          className='query-text-field'
        />
        <PrimaryButton>
          Run Query
        </PrimaryButton>
      </div>
    );
  }
}
