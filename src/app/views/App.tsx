import { classNamesFunction, ITheme, styled } from 'office-ui-fabric-react';
import React, { Component } from 'react';

import { appStyles } from './App.styles';
import { Authentication } from './authentication';
import { classNames } from './classnames';
import { QueryResponse } from './query-response';
import { QueryRunner } from './query-runner';

interface IAppProps {
  theme?: ITheme;
  styles?: object;
}

class App extends Component<IAppProps> {
  public render() {
    const classes = classNames(this.props);

    return (
      <div className={`container-fluid ${classes.app}`}>
        <div className='row'>
          <div className='col-sm-12 col-lg-8 offset-lg-2'>
            <Authentication/>
            <QueryRunner/>
            <QueryResponse/>
          </div>
        </div>
      </div>
    );
  }
}

export default styled(App, appStyles);
