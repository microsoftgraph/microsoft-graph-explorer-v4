import React, { Component } from 'react';

import './app.scss';
import { Authentication } from './authentication';
import { QueryResponse } from './query-response';
import { QueryRunner } from './query-runner';

class App extends Component {
  public render() {
    return (
      <div className='app'>
        <Authentication/>
        <QueryRunner/>
        <QueryResponse/>
      </div>
    );
  }
}

export default App;
