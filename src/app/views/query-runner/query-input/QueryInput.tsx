import { Dropdown } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { bindActionCreators, Dispatch } from 'redux';
import { IQueryInputProps } from '../../../../types/query-runner';
import * as queryInputActionCreators from '../../../services/actions/query-input-action-creators';
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
      classes: {
        textField: 'col-sm-12 col-lg-9',
        gridElements: 'col-sm-12 col-lg-1',
      }
    };
  }

  public contentChanged = (value: string) => {
    const { sampleQuery } = this.props;
    const query = { ...sampleQuery, ...{ sampleUrl: value } };
    this.changeUrlVersion(value);
    this.props.actions!.setSampleQuery(query);
  }

  private changeUrlVersion(newUrl: string) {
    const query = { ...this.props.sampleQuery };
    const { queryVersion: newQueryVersion } = parseSampleUrl(newUrl);
    const { queryVersion: oldQueryVersion } = parseSampleUrl(query.sampleUrl);

    if (newQueryVersion !== oldQueryVersion) {
      if (newQueryVersion === 'v1.0' || newQueryVersion === 'beta') {
        const sampleQuery = { ...query };
        sampleQuery.selectedVersion = newQueryVersion;
        sampleQuery.sampleUrl = newUrl;
        this.props.actions!.setSampleQuery(sampleQuery);
      }
    }
  }

  public handleOnRunQuery = (event: any) => {
    // allows the state to be populated with the new url before running it
    setTimeout(() => {
      this.props.handleOnRunQuery();
    }, 500);
  }

  public render() {
    const { httpMethods, urlVersions } = this.state;

    const {
      handleOnRunQuery,
      handleOnMethodChange,
      handleOnVersionChange,
      sampleQuery,
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
      background: getStyleFor(sampleQuery.selectedVerb),
    };

    const httpMethodsToDisplay = (!authenticated) ? [httpMethods[0]] : httpMethods;

    return (
      <div className='row'>
        <div className='col-xs-12 col-lg-2'>
          <Dropdown
            ariaLabel='Query sample option'
            role='listbox'
            selectedKey={sampleQuery.selectedVerb}
            options={httpMethodsToDisplay}
            styles={verbSelector}
            onChange={(event, method) => handleOnMethodChange(method)}
          />
        </div>
        <div className='col-xs-12 col-lg-2'>
          <Dropdown
            ariaLabel='Query sample option'
            role='listbox'
            selectedKey={sampleQuery.selectedVersion || 'v1.0'}
            options={urlVersions}
            onChange={(event, method) => handleOnVersionChange(method)}
          />
        </div>
        <div className='col-xs-12 col-lg-6'>
          <AutoComplete
            contentChanged={this.contentChanged}
            runQuery={this.handleOnRunQuery}
          />
        </div>
        <div className='col-xs-12 col-lg-2'>
          <SubmitButton
            className='run-query-button'
            text={messages['Run Query']}
            role='button'
            handleOnClick={() => handleOnRunQuery()}
            submitting={submitting}
          />
        </div>
      </div >
    );
  }
}

function mapStateToProps(state: any) {
  return {
    sampleQuery: state.sampleQuery,
    submitting: state.isLoadingData,
    theme: state.theme,
    mode: state.graphExplorerMode,
    authenticated: !!state.authToken,
  };
}

function mapDispatchToProps(dispatch: Dispatch): object {
  return {
    actions: bindActionCreators(
      {
        ...queryInputActionCreators,
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
