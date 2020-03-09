import { Dropdown, TextField } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { IQueryInputProps } from '../../../types/query-runner';
import { getStyleFor } from '../../utils/badge-color';
import SubmitButton from '../common/submit-button/SubmitButton';
import { queryRunnerStyles } from './QueryRunner.styles';

export class QueryInput extends Component<IQueryInputProps, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      httpMethods: [
        { key: 'GET', text: 'GET' },
        { key: 'POST', text: 'POST' },
        { key: 'PUT', text: 'PUT' },
        { key: 'PATCH', text: 'PATCH' },
        { key: 'DELETE', text: 'DELETE' }
      ],
      urlVersions: [
        { key: 'v1.0', text: 'v1.0' },
        { key: 'beta', text: 'beta' }
      ],
    };
  }

  public handleKeyDown = (event: any) => {
    if (event.keyCode === 13) {
      this.props.handleOnRunQuery();
    }
  }

  public render() {
    const { httpMethods, urlVersions } = this.state;

    const {
      handleOnRunQuery,
      handleOnMethodChange,
      handleOnUrlChange,
      handleOnVersionChange,
      handleOnBlur,
      selectedVerb,
      selectedVersion,
      sampleUrl,
      submitting,
    } = this.props;

    const {
      intl: { messages },
    }: any = this.props;

    const verbSelector: any = queryRunnerStyles().verbSelector;
    verbSelector.title = {
      ...verbSelector.title,
      background: getStyleFor(selectedVerb),
    };

    return (
      <div className='row'>
        <div className='col-sm-3 col-md-2'>
          <Dropdown
            ariaLabel='Query sample option'
            role='listbox'
            selectedKey={selectedVerb}
            options={httpMethods}
            styles={verbSelector}
            onChange={(event, method) => handleOnMethodChange(method)}
          />
        </div>

        <div className='col-sm-2 col-md-2'>
          <Dropdown
            ariaLabel='Query sample option'
            role='listbox'
            selectedKey={selectedVersion || 'v1.0'}
            options={urlVersions}
            onChange={(event, method) => handleOnVersionChange(method)}
          />
        </div>
        <div className='col-sm-5 col-md-6'>
          <TextField
            ariaLabel='Query Sample Input'
            role='textbox'
            placeholder={messages['Query Sample']}
            onChange={(event, value) => handleOnUrlChange(value)}
            defaultValue={sampleUrl}
            onBlur={() => handleOnBlur()}
            onKeyDown={this.handleKeyDown}
          />
        </div>
        <div className='col-sm-1 col-md-2 run-query-button'>
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
    selectedVersion: state.sampleQuery.selectedVersion,
    submitting: state.isLoadingData,
    theme: state.theme,
  };
}

// @ts-ignore
const IntlQueryInput = injectIntl(QueryInput);
export default connect(
  mapStateToProps,
  null
)(IntlQueryInput);
