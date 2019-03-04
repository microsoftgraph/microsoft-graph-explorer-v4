import { Pivot, PivotItem } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Monaco } from '../common';
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
            <Monaco
              body={body}
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
