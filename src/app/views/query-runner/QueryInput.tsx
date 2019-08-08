import { Dropdown, TextField } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { IQueryInputProps } from '../../../types/query-runner';
import SubmitButton from '../common/submit-button/SubmitButton';

export class QueryInput extends Component<IQueryInputProps, any> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    const {
      handleOnRunQuery,
      handleOnMethodChange,
      handleOnUrlChange,
      httpMethods,
      selectedVerb,
      sampleUrl,
      submitting
    } = this.props;

    return (
      <div className='row'>
        <div className='col-sm-2'>
          <Dropdown
            ariaLabel='Query sample option'
            role='listbox'
            selectedKey={selectedVerb}
            options={httpMethods}
            onChange={(event, method) => handleOnMethodChange(method)}
          />
        </div>
        <div className='col-sm-8'>
          <TextField
            ariaLabel='Query Sample Input'
            role='textbox'
            placeholder='Query Sample'
            onChange={(event, value) => handleOnUrlChange(value)}
            defaultValue={sampleUrl}
          />
        </div>
        <div className='col-sm-2 run-query-button'>
          <SubmitButton
            className='run-query-button'
            text='Run Query'
            role='button'
            handleOnClick={() => handleOnRunQuery()}
            submitting={submitting}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    sampleUrl: state.sampleQuery.sampleUrl,
    selectedVerb: state.sampleQuery.selectedVerb
  };
}

export default connect(
  mapStateToProps,
  null
)(QueryInput);
