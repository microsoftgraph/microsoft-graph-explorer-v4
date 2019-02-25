import { Dropdown, PrimaryButton, TextField } from 'office-ui-fabric-react';
import React from 'react';
import { IQueryInputControl } from '../../../types/query-runner';

export const QueryInputControl = ({
  handleOnClick,
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
        onClick={() => handleOnClick()}
      >
        Run Query
      </PrimaryButton>
    </div>
  );
};
