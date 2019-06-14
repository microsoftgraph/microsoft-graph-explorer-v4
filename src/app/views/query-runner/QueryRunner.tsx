import { IDropdownOption } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { IQueryRunnerProps, IQueryRunnerState } from '../../../types/query-runner';
import * as queryActionCreators from '../../services/actions/query-action-creators';
import * as queryInputActionCreators from '../../services/actions/query-input-action-creators';
import './query-runner.scss';
import QueryInput from './QueryInput';
import Request from './request/Request';
import { parse } from './util/iframe-message-parser';

export class QueryRunner extends Component<IQueryRunnerProps, IQueryRunnerState> {
  constructor(props: IQueryRunnerProps) {
    super(props);
    this.state = {
      httpMethods: [
        { key: 'GET', text: 'GET' },
        { key: 'POST', text: 'POST' },
        { key: 'PUT', text: 'PUT' },
        { key: 'PATCH', text: 'PATCH' },
        { key: 'DELETE', text: 'DELETE' },
      ],
    };
  }

  public componentDidMount = () => {
    const { actions } = this.props;
    window.addEventListener('message', this.receiveMessage, false);
    const urlParams = new URLSearchParams(window.location.search);
    const base64Token = urlParams.getAll('query')[0];

    if (!base64Token) {
      return;
    }

    const data = JSON.parse(atob(base64Token));
    const {
      sampleVerb,
      sampleHeaders,
      sampleUrl,
      sampleBody,
    } = data;

    const query = {
      sampleUrl,
      sampleBody,
      sampleHeaders,
      selectedVerb: sampleVerb,
    };

    if (actions) {
      actions.setSampleQuery(query);
    }

  };

  public componentWillUnmount(): void {
    window.removeEventListener('message', this.receiveMessage);
  }

  private receiveMessage = (event: MessageEvent): void => {
    const { actions } = this.props;
    const {
      verb,
      headerKey,
      headerValue,
      url,
      body
    }: any = parse(event.data);

    if (event.origin !== 'http://docs.microsoft.com' || event.source === null) {
      return;
    }

    const headers: any = {};
    headers[headerKey] = headerValue;

    const query = {
      sampleUrl: url,
      sampleBody: body,
      sampleHeaders: headers,
      selectedVerb: verb,
    };

    if (actions) {
      actions.setSampleQuery(query);
    }
  };

  private handleOnMethodChange = (option?: IDropdownOption) => {
    const query = {...this.props.sampleQuery};
    const { actions } = this.props;
    if (option !== undefined) {
      query.selectedVerb = option.text;
      if (actions) {
        actions.setSampleQuery(query);
      }
    }
  };

  private handleOnUrlChange = (newQuery?: string) => {
    const query = {...this.props.sampleQuery};
    const { actions } = this.props;
    if (newQuery !== undefined) {
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
    const {
      httpMethods,
    } = this.state;

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
              selectedVerb={sampleQuery.selectedVerb}
              sampleUrl={sampleQuery.sampleUrl}
              submitting={isLoadingData}
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-12 col-lg-12'>
            <Request
              handleOnEditorChange={this.handleOnEditorChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch): object {
  return {
    actions:  bindActionCreators({ ...queryActionCreators, ...queryInputActionCreators }, dispatch),
  };
}

function mapStateToProps(state: any) {
  return {
    isLoadingData: state.isLoadingData,
    headers: state.headersAdded,
    sampleQuery: state.sampleQuery,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(QueryRunner);
