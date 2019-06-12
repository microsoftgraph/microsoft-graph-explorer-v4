import { IDropdownOption } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IQuery, IQueryRunnerProps, IQueryRunnerState } from '../../../types/query-runner';
import * as queryActionCreators from '../../services/actions/query-action-creators';
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
      selectedVerb: 'GET',
      sampleUrl: 'https://graph.microsoft.com/v1.0/me/',
      sampleBody: undefined,
      sampleHeaders: {},
    };
  }

  public componentDidMount = () => {
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

    this.setState({
      sampleUrl,
      sampleBody,
      sampleHeaders,
      selectedVerb: sampleVerb,
    });
  };

  public componentWillUnmount(): void {
    window.removeEventListener('message', this.receiveMessage);
  }

  private receiveMessage = (event: MessageEvent): void => {
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

    this.setState({
      sampleUrl: url,
      sampleBody: body,
      sampleHeaders: headers,
      selectedVerb: verb,
    });
  };

  private handleOnMethodChange = (option?: IDropdownOption) => {
    if (option !== undefined) {
      this.setState({ selectedVerb: option.text });
    }
  };

  private handleOnUrlChange = (newQuery?: string) => {
    if (newQuery) {
      this.setState({ sampleUrl: newQuery });
    }
  };

  private handleOnEditorChange = (body?: string) => {
    this.setState({ sampleBody: body });
  };


  private handleOnRunQuery = () => {
    const { sampleUrl, selectedVerb, sampleBody } = this.state;
    const { actions, headers } = this.props;

    const query: IQuery = {
      sampleUrl,
      selectedVerb,
      sampleBody,
      sampleHeaders: headers
    };

    if (actions) {
      actions.runQuery(query);
    }
  };

  public render() {
    const {
      httpMethods,
      selectedVerb,
      sampleUrl,
    } = this.state;

    const { isLoadingData } = this.props;

    return (
      <div>
        <div className='row'>
          <div className='col-sm-12 col-lg-12'>
            <QueryInput
              handleOnRunQuery={this.handleOnRunQuery}
              handleOnMethodChange={this.handleOnMethodChange}
              handleOnUrlChange={this.handleOnUrlChange}
              httpMethods={httpMethods}
              selectedVerb={selectedVerb}
              sampleUrl={sampleUrl}
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
    actions: bindActionCreators(queryActionCreators, dispatch),
  };
}

function mapStateToProps(state: any) {
  return {
    isLoadingData: state.isLoadingData,
    headers: state.headersAdded
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(QueryRunner);
