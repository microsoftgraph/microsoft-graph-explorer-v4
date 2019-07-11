import { IDropdownOption, loadTheme } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { loadGETheme } from '../../../themes';
import {
  IInitMessage, IQuery, IQueryRunnerProps,
  IQueryRunnerState, IThemeChangedMessage
} from '../../../types/query-runner';
import * as queryActionCreators from '../../services/actions/query-action-creators';
import { addRequestHeader } from '../../services/actions/request-headers-action-creators';
import './query-runner.scss';
import { QueryInputControl } from './QueryInput';
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
      sampleHeaders: [],
    };
  }

  public componentDidMount = () => {
    const whiteListedDomains = [
      'https://docs.microsoft.com',
      'https://review.docs.microsoft.com',
      'https://ppe.docs.microsoft.com',
      'https://docs.azure.cn'
    ];

    // Notify host document that GE is ready to receive messages
    const hostOrigin = new URLSearchParams(location.search).get('host-origin');
    const originIsWhitelisted = hostOrigin && whiteListedDomains.indexOf(hostOrigin) !== -1;

    if (hostOrigin && originIsWhitelisted) {
      window.parent.postMessage({ type: 'ready' }, hostOrigin);
    }

    // Listens for messages from host document
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
    const msgEvent: IThemeChangedMessage | IInitMessage = event.data;

    switch (msgEvent.type) {
      case 'init':
        this.handleInitMsg(msgEvent);
        break;
      case 'theme-changed':
        this.handleThemeChangeMsg(msgEvent);
        break;
      default:
        return;
    }
  };

  private handleInitMsg = (msg: IInitMessage) => {
    const {
      verb,
      headers,
      url,
      body
    }: any = parse(msg.code);

    this.setState({
      sampleUrl: url,
      sampleBody: body,
      selectedVerb: verb,
    });

    const { actions } = this.props;

    if (actions) {
      const requestHeadears = headers.map((header: any) => {
        return {
          name: Object.keys(header)[0],
          value: Object.values(header)[0]
        };
      });
      actions.addRequestHeader(requestHeadears);
    }
  };

  private handleThemeChangeMsg = (msg: IThemeChangedMessage) => {
    loadGETheme(msg.theme);
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
    if (body) {
      this.setState({ sampleBody: body });
    }
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
      sampleBody,
      sampleHeaders,
    } = this.state;

    const { isLoadingData } = this.props;

    return (
      <div>
        <div className='row'>
          <div className='col-sm-12 col-lg-12'>
            <QueryInputControl
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
              sampleBody={sampleBody}
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
    actions: bindActionCreators({ ...queryActionCreators, addRequestHeader }, dispatch),
  };
}

function mapStateToProps(state: any) {
  return {
    isLoadingData: state.isLoadingData,
    headers: state.headersAdded
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(QueryRunner);
