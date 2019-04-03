import React, { Component } from 'react';

import './app.scss';
import { QueryResponse } from './query-response';
import { QueryRunner } from './query-runner';

class App extends Component {
  public render() {
    return (
      <div className='app container'>
        <div className='row'>
          <div className='col-sm-12 col-lg-9 offset-lg-2'>
            <QueryRunner/>
            <QueryResponse/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
