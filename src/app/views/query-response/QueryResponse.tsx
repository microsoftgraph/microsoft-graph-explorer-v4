import { Pivot, PivotItem } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { IQueryResponseProps } from '../../../types/query-response';
import { Monaco } from '../common';
import './query-response.scss';

class QueryResponse extends Component<IQueryResponseProps, {}> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    let body;
    let headers;

    const { graphResponse } = this.props;
    if (graphResponse) {
      body = graphResponse.body;
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

function mapStateToProps(state: IQueryResponseProps) {
  return {
    graphResponse: state.graphResponse,
  };
}

export default connect(mapStateToProps)(QueryResponse);
