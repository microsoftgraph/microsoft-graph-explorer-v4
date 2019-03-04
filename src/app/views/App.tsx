import React, { Component } from 'react';

import './app.scss';
import { QueryRunner } from './query-runner';

class App extends Component {
  public render() {
    return (
      <div className='app'>
        <QueryRunner/>
      </div>
    );
  }
}

export default App;
