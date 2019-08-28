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

import { loadGETheme } from '../../themes';
import { dark } from '../../themes/dark';
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
    // TODO: delete these calls and and make them where relevant.
    this.props.actions!.clearQueryError();
    this.props.actions!.runQuery();
    this.props.actions!.addRequestHeader();
    this.props.actions!.setSampleQuery();

    // Listens for messages from host document
    window.addEventListener('message', this.receiveMessage, false);
    // tslint:disable-next-line:no-console
    console.log('adding listener');
  }

  public componentWillUnmount(): void {
    window.removeEventListener('message', this.receiveMessage);
  }

  private handleThemeChangeMsg = (msg: IThemeChangedMessage) => {
    // tslint:disable-next-line:no-console
    console.log('received theme', msg.theme);
    loadGETheme(msg.theme);
    // tslint:disable-next-line:no-console
    console.log('loaded theme');
  };

  private receiveMessage = (event: MessageEvent): void => {
    const msgEvent: IThemeChangedMessage | IInitMessage = event.data;

    switch (msgEvent.type) {
      case 'theme-changed':
        this.handleThemeChangeMsg(msgEvent);
        break;
      default:
        return;
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
        ? 'col-sm-12 col-lg-8 offset-lg-2'
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
                      <a tabIndex={0} href='https://developer.microsoft.com/en-us/graph/graph-explorer' target='_blank'>
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
