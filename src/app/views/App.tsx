import React, { Component } from 'react';

import './app.scss';
import { QueryResponse } from './query-response';
import { QueryRunner } from './query-runner';

class App extends Component {
  public render() {
    return (
      <div className='app'>
        <QueryRunner/>
        <QueryResponse/>
      </div>
    );
  }
}

export default App;
