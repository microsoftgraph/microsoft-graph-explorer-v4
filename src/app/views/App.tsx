import {
  FocusTrapZone,
  ITheme,
  MessageBar,
  MessageBarType,
  styled
} from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { renderApp } from '../..';
import { loadGETheme } from '../../themes';
import { Mode } from '../../types/action';
import { IInitMessage, IThemeChangedMessage } from '../../types/query-runner';
import { clearQueryError } from '../services/actions/error-action-creator';
import { runQuery } from '../services/actions/query-action-creators';
import { setSampleQuery } from '../services/actions/query-input-action-creators';
import { addRequestHeader } from '../services/actions/request-headers-action-creators';
import { appStyles } from './App.styles';
import { Authentication } from './authentication';
import { classNames } from './classnames';
import { QueryResponse } from './query-response';
import { QueryRunner } from './query-runner';
import { parse } from './query-runner/util/iframe-message-parser';
import { Sidebar } from './sidebar/Sidebar';

interface IAppProps {
  theme?: ITheme;
  styles?: object;
  error: object | null;
  graphExplorerMode: Mode;
  actions: {
    addRequestHeader: Function;
    clearQueryError: Function;
    setSampleQuery: Function;
    runQuery: Function;
  };
}

interface IAppState {
  selectedVerb: string;
}

class App extends Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);
    this.state = {
      selectedVerb: 'GET'
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
  }

  public componentWillUnmount(): void {
    window.removeEventListener('message', this.receiveMessage);
  }

  private handleThemeChangeMsg = (msg: IThemeChangedMessage) => {
    // tslint:disable
    console.log('received theme', msg.theme);
    loadGETheme(msg.theme);

    console.log('loaded theme');
    console.log('Rerendering...');

    renderApp(Math.random().toString())
    // tslint:enable
  };

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
    this.handleSelectVerb(verb);

    /**
     * We are delaying this by 1 second here so that we give Monaco's formatter time to initialize.
     * If we don't put this delay, the body won't be formatted.
     */
    setTimeout(() => {
      // tslint:disable
      console.log('Sample body');
      console.log(body);
      // tslint:enable
      if (actions) {
        actions.setSampleQuery({
          sampleUrl: url,
          selectedVerb: verb,
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

  public handleSelectVerb = (verb: string) => {
    this.setState({
      selectedVerb: verb
    });
  };

  public render() {
    const classes = classNames(this.props);
    const { graphExplorerMode, error, actions, sampleQuery }: any = this.props;
    const layout =
      graphExplorerMode === Mode.TryIt
        ? 'col-sm-12'
        : 'col-sm-12 col-lg-9';
    return (
      <FocusTrapZone>
        <div className={`container-fluid ${classes.app}`}>
          <div className='row'>
            {graphExplorerMode === Mode.Complete && (
              <div className={`col-sm-3 col-lg-3 col-md-3 ${classes.sidebar}`}>
                <Sidebar />
              </div>
            )}
            <div className={layout}>
              {graphExplorerMode === Mode.Complete && <Authentication />}
              {graphExplorerMode === Mode.TryIt && (
                <div style={{ marginBottom: 8 }}>
                  <MessageBar
                    messageBarType={MessageBarType.warning}
                    isMultiline={true}
                  >
                    <p>
                      To try operations other than GET or to access your own data, sign in to
                      <a className={classes.toGraphExplorer}
                        tabIndex={0}
                        href='https://developer.microsoft.com/en-us/graph/graph-explorer' target='_blank'>
                        Graph Explorer.
                      </a>
                    </p>
                  </MessageBar>
                </div>
              )}
              <div style={{ marginBottom: 8 }}>
                <QueryRunner onSelectVerb={this.handleSelectVerb} />
              </div>
              {error && (
                <MessageBar
                  messageBarType={MessageBarType.error}
                  isMultiline={false}
                  onDismiss={actions.clearQueryError}
                >
                  {`${error.statusText} - ${error.status}`}
                </MessageBar>
              )}
              {sampleQuery && (<div/>)}
              {
                // @ts-ignore
                <QueryResponse verb={this.state.selectedVerb} />
              }
            </div>
          </div>
        </div>
      </FocusTrapZone>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    error: state.queryRunnerError,
    receivedSampleQuery: state.sampleQuery,
    graphExplorerMode: state.graphExplorerMode
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    actions: bindActionCreators({ clearQueryError, runQuery, setSampleQuery, addRequestHeader }, dispatch)
  };
};

const StyledApp = styled(App, appStyles);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StyledApp);
