import { Pivot, PivotItem } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { connect } from 'react-redux';

import './query-response.scss';

class QueryResponse extends Component<{ body?: object; }> {
  public render() {
    const { body } = this.props;
    return (
      <div className='query-response'>
        <Pivot className='pivot-response'>
          <PivotItem
            headerText='Response Body'
          >
            <div className='monaco-editor'>
              <MonacoEditor
                width='800'
                height='300'
                value={body && JSON.stringify(body).split(',').join(',\n')}
                language='json'
                options={{ lineNumbers: 'off' }}
              />
            </div>
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

function mapStateToProps(state: { graphResponse: object; }) {
  return {
    body: state.graphResponse,
  };
}

export default connect(mapStateToProps)(QueryResponse);
