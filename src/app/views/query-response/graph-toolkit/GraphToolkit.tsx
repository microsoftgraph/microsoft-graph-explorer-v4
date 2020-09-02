import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { Label, MessageBar, MessageBarType } from 'office-ui-fabric-react';
import { lookupToolkitUrl } from '../../../utils/graph-toolkit-lookup';

class GraphToolkit extends Component<any> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    const { sampleQuery } = this.props;
    const { toolkitUrl, exampleUrl } = lookupToolkitUrl(sampleQuery);

    if (toolkitUrl && exampleUrl) {
      return (
        <>
          <MessageBar messageBarType={MessageBarType.info}>
            <FormattedMessage id='Open this example in' />
            <a
              tabIndex={0}
              href={exampleUrl} target='_blank'>
              <FormattedMessage id='graph toolkit playground' />
            </a>.
          </MessageBar>
          <iframe width='100%' height='470px' src={toolkitUrl} />
        </>
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
        <FormattedMessage id='We did not find a Graph toolkit for this query' /> <a
          tabIndex={0}
          href='https://aka.ms/mgt' target='_blank'>
          <FormattedMessage id='Learn more about the Microsoft Graph Toolkit' />.
          </a>
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
