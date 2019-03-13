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
  sampleURL,
}: IQueryInputControl) => {

  return (
    <div  className='query-input-controls'>
      <Dropdown
        className='query-verb-dropdown'
        defaultSelectedKey={selectedVerb}
        options={httpMethods}
        onChange={(event, method) => handleOnMethodChange(method)}
      />
      <TextField
        placeholder='Query Sample'
        className='query-text-field'
        onChange={(event, value) => handleOnUrlChange(value)}
        defaultValue={sampleURL}
      />
      <PrimaryButton
        onClick={() => handleOnRunQuery()}
      >
        <FormattedMessage
          id='Run Query'
        />
      </PrimaryButton>
    </div>
  );
};
