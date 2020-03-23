import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { Label } from 'office-ui-fabric-react';
import { IQuery } from '../../../../types/query-runner';
import { parseSampleUrl } from '../../../utils/sample-url-generation';
import templates from './toolkit';

// const templateMap: any = {
//   '/me/planner/tasks' : 'https://mgt.dev/iframe.html?id=components-mgt-tasks--tasks',
//   '/me': 'https://mgt.dev/iframe.html?id=components-mgt-person-card--person-card-hover',
//   '/me/people' : 'https://mgt.dev/iframe.html?id=components-mgt-people--people',
// };

class GraphToolkit extends Component<any> {
  constructor(props: any) {
    super(props);
  }

  public lookupToolkitUrl = (sampleQuery: IQuery): any => {
    if (sampleQuery) {
      const { requestUrl, search } = parseSampleUrl(sampleQuery.sampleUrl);
      const query = '/' + requestUrl + search;
      const url: string = (templates as any)[query];
      if (url) {
        return url;
      }
    }
    return null;
  }

  public render() {
    const { sampleQuery } = this.props;
    const toolkitUrl = this.lookupToolkitUrl(sampleQuery);

    if (toolkitUrl) {
      return (
        <iframe width='100%' height='470px' src={toolkitUrl} />
      );
    }

    return (
      <Label style={{
        display: 'flex',
        width: '100%',
        minHeight: '470px',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <FormattedMessage id='We did not find a Graph toolkit for this query' />
      </Label>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    sampleQuery: state.sampleQuery
  };
}

export default connect(mapStateToProps, null)(GraphToolkit);
