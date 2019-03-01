import { Pivot, PivotItem } from 'office-ui-fabric-react';
import React, { Component } from 'react';

import './query-response.scss';

class QueryResponse extends Component {
  public render() {
    return (
      <div className='query-response'>
        <Pivot className='pivot-response'>
          <PivotItem
            headerText='Response Body'
          >
            <h1>Response from Graph</h1>
          </PivotItem>
          <PivotItem
            headerText='Response Headers'
          >
            <h1>Response Headers</h1>
          </PivotItem>
        </Pivot>
      </div>
    );
  }
}

export default QueryResponse;
