import { IDropdownOption, loadTheme } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { loadGETheme } from '../../../themes';
import {
  IInitMessage,
  IQuery,
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

  public componentDidMount = () => {
    const { actions } = this.props;
    const whiteListedDomains = [
      'https://docs.microsoft.com',
      'https://review.docs.microsoft.com',
      'https://ppe.docs.microsoft.com',
      'https://docs.azure.cn'
    ];

    // Notify host document that GE is ready to receive messages
    const hostOrigin = new URLSearchParams(location.search).get('host-origin');
    const originIsWhitelisted =
      hostOrigin && whiteListedDomains.indexOf(hostOrigin) !== -1;

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
    const { sampleVerb, sampleHeaders, sampleUrl, sampleBody } = data;

    const query = {
      sampleUrl,
      sampleBody,
      sampleHeaders,
      selectedVerb: sampleVerb
    };

    if (actions) {
      actions.setSampleQuery(query);
    }
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
    const { actions } = this.props;
    const { verb, headers, url, body }: any = parse(msg.code);

    if (actions) {
      actions.setSampleQuery({
        sampleUrl: url,
        selectedVerb: verb
      });
    }

    // Sets selected verb in App Component
    this.props.onSelectVerb(verb);

    /**
     * We are delaying this by 1 second here so that we give Monaco's formatter time to initialize.
     * If we don't put this delay, the body won't be formatted.
     */
    setTimeout(() => {
      if (actions) {
        actions.setSampleQuery({
          sampleBody: body
        });
      }
    }, 1000);

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
              selectedVerb={sampleQuery.selectedVerb}
              sampleUrl={sampleQuery.sampleUrl}
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
