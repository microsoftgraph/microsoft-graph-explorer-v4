import { Dropdown, PrimaryButton, TextField } from 'office-ui-fabric-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { IQueryInputControl } from '../../../types/query-runner';

export const QueryInputControl = ({
  handleOnRunQuery,
  handleOnMethodChange,
  handleOnUrlChange,
  httpMethods,
  selectedVerb,
  sampleUrl,
}: IQueryInputControl) => {

  return (
    <div className='row'>
      <div className='col-sm-2'>
        <Dropdown
          defaultSelectedKey={selectedVerb}
          options={httpMethods}
          onChange={(event, method) => handleOnMethodChange(method)}
        />
      </div>
      <div className='col-sm-8'>
        <TextField
          placeholder='Query Sample'
          onChange={(event, value) => handleOnUrlChange(value)}
          defaultValue={sampleURL}
        />
      </div>
      <div className='col-sm-2 run-query-button'>
        <PrimaryButton
          onClick={() => handleOnRunQuery()}
        >
          <FormattedMessage
            id='Run Query'
          />
        </PrimaryButton>
      </div>
    </div>
  );
};
