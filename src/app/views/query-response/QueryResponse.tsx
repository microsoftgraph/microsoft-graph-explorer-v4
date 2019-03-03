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
            <MonacoEditor
              width={857}
              height={450}
              value={body && JSON.stringify(body)}
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

function mapStateToProps(state: { graphResponse: object; }) {
  return {
    body: state.graphResponse,
  };
}

export default connect(mapStateToProps)(QueryResponse);
