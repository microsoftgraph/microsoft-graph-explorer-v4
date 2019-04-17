import { classNamesFunction, styled } from 'office-ui-fabric-react';
import React, { Component } from 'react';

import './app.scss';
import { appStyles } from './App.styles';
import { Authentication } from './authentication';
import { QueryResponse } from './query-response';
import { QueryRunner } from './query-runner';

class App extends Component<{}> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    // @ts-ignore
    const { styles, theme } = this.props;
    const getClassNames = classNamesFunction();
    const classNames = getClassNames(styles, theme);

    return (
      <div className={`container ${(classNames as any).app}`}>
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
