import { Dropdown, PrimaryButton, TextField } from 'office-ui-fabric-react';
import React from 'react';

interface IQueryInputControl {
  handleOnClick: Function;
  handleOnOptionsChange: Function;
  handleQuerySampleChange: Function;
  options: Array<{ key: string; text: string}>;
  selectedVerb: string,
}

export const QueryInputControl = ({
  handleOnClick,
  handleOnOptionsChange,
  handleQuerySampleChange,
  options,
  selectedVerb,
}: IQueryInputControl) => {

  return (
    <div  className='query-input-controls'>
      <Dropdown
        className='query-verb-dropdown'
        defaultSelectedKey={selectedVerb}
        options={options}
        onChange={(event, option) => handleOnOptionsChange(event, option)}
      />
      <TextField
        placeholder='Query Sample'
        className='query-text-field'
        onChange={(event, value) => handleQuerySampleChange(event, value)}
      />
      <PrimaryButton
        onClick={() => handleOnClick()}
      >
        Run Query
      </PrimaryButton>
    </div>
  );
};
