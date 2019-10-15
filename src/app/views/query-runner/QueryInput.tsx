import { Dropdown, TextField } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
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
      handleOnBlur,
      httpMethods,
      selectedVerb,
      sampleUrl,
      submitting,
      mode,
    } = this.props;

    const {
      intl: { messages },
    }: any = this.props;

    return (
      <div className='row'>
        <div className='col-sm-3'>
          <Dropdown
            ariaLabel='Query sample option'
            role='listbox'
            selectedKey={selectedVerb}
            options={httpMethods}
            disabled={mode === Mode.TryIt}
            onChange={(event, method) => handleOnMethodChange(method)}
          />
        </div>
        <div className='col-sm-7'>
          <TextField
            ariaLabel='Query Sample Input'
            role='textbox'
            placeholder={messages['Query Sample']}
            onChange={(event, value) => handleOnUrlChange(value)}
            defaultValue={sampleUrl}
            onBlur={() => handleOnBlur()}
          />
        </div>
        <div className='col-sm-2 run-query-button'>
          <SubmitButton
            className='run-query-button'
            text={messages['Run Query']}
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
  };
}

// @ts-ignore
const IntlQueryInput = injectIntl(QueryInput);
export default connect(
  mapStateToProps,
  null
)(IntlQueryInput);
