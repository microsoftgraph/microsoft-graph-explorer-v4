import { IDropdownOption } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { IQueryRunnerProps, IQueryRunnerState } from '../../../types/query-runner';
import * as queryActionCreators from '../../services/actions/query-action-creators';
import './query-runner.scss';
import { QueryInputControl } from './QueryInput';
import { Request } from './request/Request';

export class QueryRunner extends Component<IQueryRunnerProps, IQueryRunnerState> {
  constructor(props: any) {
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
      sampleHeaders: {},
      sampleBody: {},
    };
  }

  public componentDidMount() {
    window.addEventListener('message', this.receiveMessage, false);
  }

  public componentWillUnmount() {
    window.removeEventListener('message', this.receiveMessage);
  }

  private receiveMessage = (event: MessageEvent) => {
    const {
      sampleVerb,
      sampleHeaders,
      sampleUrl,
      sampleBody,
    } = event.data;

    if (event.origin !== 'http://docs.microsoft.com' || event.source === null) {
      return;
    }

    this.setState({
      sampleUrl,
      sampleBody,
      sampleHeaders,
      selectedVerb: sampleVerb,
    });

    // @ts-ignore
    event.source.postMessage('Opened Graph Explorer', event.origin);
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

  private handleOnRunQuery = () => {
    const { sampleUrl } = this.state;
    const { actions } = this.props;

    if (actions) {
      actions.runQuery(sampleUrl);
    }
  };

  public render() {
    const {
      httpMethods,
      selectedVerb,
      sampleUrl,
    } = this.state;

    return (
      <div className='query-input-container'>
        <QueryInputControl
          handleOnRunQuery={this.handleOnRunQuery}
          handleOnMethodChange={this.handleOnMethodChange}
          handleOnUrlChange={this.handleOnUrlChange}
          httpMethods={httpMethods}
          selectedVerb={selectedVerb}
          sampleUrl={sampleUrl}
        />
        <Request />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch): object {
  return {
    actions: bindActionCreators(queryActionCreators, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(QueryRunner);
