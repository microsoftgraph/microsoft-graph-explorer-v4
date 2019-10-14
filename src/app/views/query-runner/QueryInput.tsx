import { Dropdown, TextField } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Mode } from '../../../types/action';
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
      handleOnVersionChange,
      handleOnBlur,
      httpMethods,
      selectedVerb,
      selectedVersion,
      urlVersions,
      sampleUrl,
      submitting,
      mode
    } = this.props;

    return (
      <div className='row'>
        <div className='col-sm-1' style={{ paddingRight: 0 }}>
          <Dropdown
            ariaLabel='Query sample option'
            role='listbox'
            selectedKey={selectedVerb}
            options={httpMethods}
            disabled={mode === Mode.TryIt}
            styles={{ title: { paddingRight: 0 } }}
            onChange={(event, method) => handleOnMethodChange(method)}
          />
        </div>

        <div className='col-sm-1'>
          <Dropdown
            ariaLabel='Query sample option'
            role='listbox'
            selectedKey={selectedVersion || 'v1.0'}
            options={urlVersions}
            onChange={(event, method) => handleOnVersionChange(method)}
          />
        </div>
        <div className='col-sm-8' style={{ paddingRight: 0, paddingLeft: 0 }}>
          <TextField
            ariaLabel='Query Sample Input'
            role='textbox'
            placeholder='Query Sample'
            onChange={(event, value) => handleOnUrlChange(value)}
            defaultValue={sampleUrl}
            onBlur={() => handleOnBlur()}
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
    selectedVerb: state.sampleQuery.selectedVerb,
    appTheme: state.theme,
    mode: state.graphExplorerMode,
    selectedVersion: state.selectedVersion,
  };
}
export default connect(
  mapStateToProps,
  null
)(QueryInput);
