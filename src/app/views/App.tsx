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

class App extends Component<IAppProps> {
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
                <MessageBar
                  messageBarType={MessageBarType.warning}
                  isMultiline={true}
                  className={classes.tryItMessage}
                >
                  <p>This part of Graph Explorer is still under construction and
                     doesn't support POST, PUT, PATCH and DELETE requests</p>
                  <p>
                    Use the complete <a href='https://developer.microsoft.com/en-us/graph/graph-explorer'
                      target='_blank'>Graph Explorer</a>
                  </p>
                </MessageBar>
              }
              <QueryRunner />
              {error &&
                <MessageBar
                  messageBarType={MessageBarType.error}
                  isMultiline={false}
                  onDismiss={actions.clearQueryError}
                >
                  {`${error.statusText} - ${error.status}`}
                </MessageBar>
              }
              <QueryResponse />
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
