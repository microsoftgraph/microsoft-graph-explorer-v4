import React, { Component } from 'react';

import './app.scss';
import { QueryRunner } from './query-runner';

class App extends Component {
  public render() {
    return (
      <div className='app'>
        <div className='query-runner'>
          <QueryRunner/>
        </div>
      </div>
    );
  }
}

export default App;
