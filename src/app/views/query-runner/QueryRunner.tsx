import { IDropdownOption, loadTheme } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { loadGETheme } from '../../../themes';
import {
  IInitMessage,
  IQueryRunnerProps,
  IQueryRunnerState,
  IThemeChangedMessage
} from '../../../types/query-runner';
import * as queryActionCreators from '../../services/actions/query-action-creators';
import * as queryInputActionCreators from '../../services/actions/query-input-action-creators';
import { addRequestHeader } from '../../services/actions/request-headers-action-creators';
import './query-runner.scss';
import QueryInput from './QueryInput';
import Request from './request/Request';
import { parse } from './util/iframe-message-parser';

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
      ]
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

  private handleOnUrlChange = (newQuery?: string) => {
    const query = { ...this.props.sampleQuery };
    const { actions } = this.props;
    if (newQuery) {
      query.sampleUrl = newQuery;
      if (actions) {
        actions.setSampleQuery(query);
      }
    }
  };

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

  public render() {
    const { httpMethods } = this.state;
    const { isLoadingData, sampleQuery } = this.props;

    return (
      <div>
        <div className='row'>
          <div className='col-sm-12 col-lg-12'>
            <QueryInput
              handleOnRunQuery={this.handleOnRunQuery}
              handleOnMethodChange={this.handleOnMethodChange}
              handleOnUrlChange={this.handleOnUrlChange}
              httpMethods={httpMethods}
              submitting={isLoadingData}
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
