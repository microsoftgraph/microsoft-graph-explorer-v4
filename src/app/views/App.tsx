import { FocusTrapZone, ITheme, MessageBar, MessageBarType, styled } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { Mode } from '../../types/action';
import { clearQueryError } from '../services/actions/error-action-creator';
import { appStyles } from './App.styles';
import { Authentication } from './authentication';
import { classNames } from './classnames';
import { QueryResponse } from './query-response';
import { QueryRunner } from './query-runner';

interface IAppProps {
  theme?: ITheme;
  styles?: object;
  error: object | null;
  graphExplorerMode: Mode;
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

  public handleSelectVerb = (verb: string) => {
    this.setState({
      selectedVerb: verb
    });
  }

  public render() {
    const classes = classNames(this.props);
    const { graphExplorerMode, error, actions }: any = this.props;

    return (
      <FocusTrapZone>
        <div className={`container-fluid ${classes.app}`}>
          <div className='row'>
            <div className='col-sm-12 col-lg-8 offset-lg-2'>
              {graphExplorerMode === Mode.Complete && <Authentication />}
              {graphExplorerMode === Mode.TryIt &&
                <div style={{ marginBottom: 8 }}>
                  <MessageBar
                    messageBarType={MessageBarType.warning}
                    isMultiline={false}
                  >
                    <p>
                      To experience more functionalities, please access the main Graph Explorer site
                    <a href='https://developer.microsoft.com/en-us/graph/graph-explorer' target='_blank'>here</a>
                    </p>
                  </MessageBar>
                </div>
              }
              <QueryRunner
                onSelectVerb={this.handleSelectVerb}
              />
              {error &&
                <MessageBar
                  messageBarType={MessageBarType.error}
                  isMultiline={false}
                  onDismiss={actions.clearQueryError}
                >
                  {`${error.statusText} - ${error.status}`}
                </MessageBar>
              }
              {
                // @ts-ignore
                <QueryResponse
                  verb={this.state.selectedVerb}
                />
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
    graphExplorerMode: state.graphExplorerMode
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    actions: bindActionCreators({ clearQueryError }, dispatch)
  };
};

const StyledApp = styled(App, appStyles);

export default connect(mapStateToProps, mapDispatchToProps)(StyledApp);
