import React, { Component } from 'react';

import './app.scss';
import { Authentication } from './authentication';
import { QueryResponse } from './query-response';
import { QueryRunner } from './query-runner';

class App extends Component {
  public render() {
    return (
      <div className='app container'>
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

export default App;
