import { Dropdown, TextField } from 'office-ui-fabric-react';
import React from 'react';
import SubmitButton from '../common/submit-button/SubmitButton';

import { IQueryInputControl } from '../../../types/query-runner';

export const QueryInputControl = ({
  handleOnRunQuery,
  handleOnMethodChange,
  handleOnUrlChange,
  httpMethods,
  selectedVerb,
  sampleUrl,
  submitting,
}: IQueryInputControl) => {

  return (
    <div className='row'>
      <div className='col-sm-2'>
        <Dropdown
          defaultSelectedKey={selectedVerb}
          selectedKey={selectedVerb}
          options={httpMethods}
          onChange={(event, method) => handleOnMethodChange(method)}
        />
      </div>
      <div className='col-sm-8'>
        <TextField
          ariaLabel='Query Sample Input'
          placeholder='Query Sample'
          onChange={(event, value) => handleOnUrlChange(value)}
          defaultValue={sampleUrl}
        />
      </div>
      <div className='col-sm-2 run-query-button'>
        <SubmitButton
          className='run-query-button'
          text='Run Query'
          handleOnClick={() => handleOnRunQuery()}
          submitting={submitting}
        />
      </div>
    </div>
  );
};
