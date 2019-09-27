import { IDropdownOption, styled } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import {
  IQueryRunnerProps,
  IQueryRunnerState,
} from '../../../types/query-runner';
import * as queryActionCreators from '../../services/actions/query-action-creators';
import * as queryInputActionCreators from '../../services/actions/query-input-action-creators';
import { addRequestHeader } from '../../services/actions/request-headers-action-creators';
import './query-runner.scss';
import QueryInput from './QueryInput';
import Request from './request/Request';

export class QueryRunner extends Component<
  IQueryRunnerProps,
  IQueryRunnerState
> {
  constructor(props: IQueryRunnerProps) {
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
        { key: 'v2.0', text: 'v2.0' }
      ],
      selectedVersion: '',
      url: ''
    };
  }

  private handleOnMethodChange = (option?: IDropdownOption) => {
    const query = { ...this.props.sampleQuery };
    const { actions } = this.props;
    if (option !== undefined) {
      query.selectedVerb = option.text;
      if (actions) {
        actions.setSampleQuery(query);
      }

      // Sets selected verb in App Component
      this.props.onSelectVerb(option.text);
    }
  };

  private handleOnUrlChange = (newQuery = '') => {
    this.setState({ url: newQuery });
  };

  private handleOnBlur = () => {
    const { url } = this.state;
    const query = { ...this.props.sampleQuery };
    const { actions } = this.props;

    if (url) {
      query.sampleUrl = url;
      if (actions) {
        actions.setSampleQuery(query);
      }
    }
  }

  private handleOnEditorChange = (body?: string) => {
    this.setState({ sampleBody: body });
  };

  private handleOnRunQuery = () => {
    const { sampleBody } = this.state;
    const { actions, headers, sampleQuery } = this.props;

    if (headers) {
      sampleQuery.sampleHeaders = headers;
    }

    if (sampleBody) {
      sampleQuery.sampleBody = JSON.parse(sampleBody);
    }

    if (actions) {
      actions.runQuery(sampleQuery);
    }
  };

  private handleOnVersionChange = (option?: IDropdownOption) => {
    const { sampleQuery } = this.props;
    if (option !== undefined) {
      this.setState({
        selectedVersion: option.text
      });
      if (this.props.actions !== undefined) {
        this.props.actions.setSampleQuery({
          ...sampleQuery,
          sampleUrl: sampleQuery.sampleUrl.replace(
            /v[0-9]+\.[0-9]+/g,
            option.text
          )
        });
      }
    }
  };

  public render() {
    const { httpMethods, urlVersions, selectedVersion } = this.state;
    const { isLoadingData, sampleQuery } = this.props;

    return (
      <div>
        <div className='row'>
          <div className='col-sm-12 col-lg-12'>
            <QueryInput
              handleOnRunQuery={this.handleOnRunQuery}
              handleOnMethodChange={this.handleOnMethodChange}
              handleOnVersionChange={this.handleOnVersionChange}
              handleOnUrlChange={this.handleOnUrlChange}
              handleOnBlur={this.handleOnBlur}
              httpMethods={httpMethods}
              submitting={isLoadingData}
              urlVersions={urlVersions}
              selectedVersion={selectedVersion}
            />
          </div>
        </div>
        {sampleQuery.selectedVerb !== 'GET' && (
          <div className='row'>
            <div className='col-sm-12 col-lg-12'>
              <Request handleOnEditorChange={this.handleOnEditorChange} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch): object {
  return {
    actions: bindActionCreators(
      { ...queryActionCreators, ...queryInputActionCreators, addRequestHeader },
      dispatch
    )
  };
}

function mapStateToProps(state: any) {
  return {
    isLoadingData: state.isLoadingData,
    headers: state.headersAdded,
    sampleQuery: state.sampleQuery
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QueryRunner);
