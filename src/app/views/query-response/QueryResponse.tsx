import { Pivot, PivotItem } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import MonacoEditor from 'react-monaco-editor';

import './query-response.scss';

class QueryResponse extends Component {
  public render() {
    return (
      <div className='query-response'>
        <Pivot className='pivot-response'>
          <PivotItem
            headerText='Response Body'
          >
            <MonacoEditor
              width={857}
              height={450}
              value={'{ "age": 7}'}
              language='json'
            />
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
