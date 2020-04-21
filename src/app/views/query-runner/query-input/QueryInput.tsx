import { Dropdown } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { bindActionCreators, Dispatch } from 'redux';
import { Mode } from '../../../../types/enums';
import { IQueryInputProps } from '../../../../types/query-runner';
import * as autoCompleteActionCreators from '../../../services/actions/autocomplete-action-creators';
import { getStyleFor } from '../../../utils/badge-color';
import { parseSampleUrl } from '../../../utils/sample-url-generation';
import SubmitButton from '../../common/submit-button/SubmitButton';
import { queryRunnerStyles } from '../QueryRunner.styles';
import AutoComplete from './AutoComplete';

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

  public contentChanged = (value: string) => {
    this.props.handleOnUrlChange(value);
    this.props.handleOnBlur();
  }

  public handleKeyDown = (event: any) => {
    if (event.keyCode === 13) {
      this.props.handleOnBlur();

      // allows the state to be populated with the new url before running it
      setTimeout(() => {
        this.props.handleOnRunQuery();
      }, 500);

    }
  }



  public selected = (value: any) => {
    // allows the state to be populated with the new url before running it
    setTimeout(() => {
      this.props.handleOnUrlChange(value);
      this.props.handleOnBlur();
    }, 500);
  }

  public render() {
    const { httpMethods, urlVersions } = this.state;

    const {
      handleOnRunQuery,
      handleOnMethodChange,
      handleOnVersionChange,
      selectedVerb,
      selectedVersion,
      submitting,
      mode,
      authenticated,
    } = this.props;

    const {
      intl: { messages },
    }: any = this.props;

    const verbSelector: any = queryRunnerStyles().verbSelector;
    verbSelector.title = {
      ...verbSelector.title,
      background: getStyleFor(selectedVerb),
    };

    const httpMethodsToDisplay = (mode === Mode.TryIt && !authenticated ) ? [httpMethods[0]] : httpMethods;

    return (
      <div className='row'>
        <div className='col-2'>
          <Dropdown
            ariaLabel='Query sample option'
            role='listbox'
            selectedKey={selectedVerb}
            options={httpMethodsToDisplay}
            styles={verbSelector}
            onChange={(event, method) => handleOnMethodChange(method)}
          />
        </div>

        <div className='col-2'>
          <Dropdown
            ariaLabel='Query sample option'
            role='listbox'
            selectedKey={selectedVersion || 'v1.0'}
            options={urlVersions}
            onChange={(event, method) => handleOnVersionChange(method)}
          />
        </div>
        <div className='col-7'>
          <AutoComplete
            suggestionSelected={this.selected}
            contentChanged={this.contentChanged}
          />
        </div>
        <div className='col-1'>
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
    mode: state.graphExplorerMode,
    authenticated: !!state.authToken,
    autoCompleteOptions: state.autoComplete.data
  };
}

function mapDispatchToProps(dispatch: Dispatch): object {
  return {
    actions: bindActionCreators(
      {
        ...autoCompleteActionCreators,
      },
      dispatch
    )
  };
}

// @ts-ignore
const IntlQueryInput = injectIntl(QueryInput);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IntlQueryInput);
