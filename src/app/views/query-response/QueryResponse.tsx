import { Pivot, PivotItem } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Monaco } from '../common';
import './query-response.scss';

interface IQueryResponseProps {
  graphResponse?: object | undefined;
}

class QueryResponse extends Component<IQueryResponseProps> {
  public render() {
    let body;
    let headers;

    const { graphResponse } = this.props;
    if (graphResponse) {
      // @ts-ignore
      body = graphResponse.body;
      // @ts-ignore
      headers = graphResponse.headers;
    }

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
            <Monaco
              body={headers}
            />
          </PivotItem>
        </Pivot>
      </div>
    );
  }
}

function mapStateToProps(state: { graphResponse: object; }) {

  return {
    graphResponse: state.graphResponse,
  };
}

export default connect(mapStateToProps)(QueryResponse);
