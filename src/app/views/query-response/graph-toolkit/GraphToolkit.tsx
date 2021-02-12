import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import {
  getTheme,
  Label,
  MessageBar,
  MessageBarType,
} from 'office-ui-fabric-react';
import { lookupToolkitUrl } from '../../../utils/graph-toolkit-lookup';
import { queryResponseStyles } from '../queryResponse.styles';
import { componentNames, telemetry } from '../../../../telemetry';

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
            <a onClick={(e) => telemetry.trackLinkClickEvent(e.currentTarget.href, componentNames.GRAPH_TOOLKIT_PLAYGROUND_LINK)}
              tabIndex={0} href={exampleUrl} target='_blank' rel='noopener noreferrer'
              style={queryResponseStyles(getTheme()).link}>
              <FormattedMessage id='graph toolkit playground' />
            </a>
            .
          </MessageBar>
          <iframe width='100%' height='470px' src={toolkitUrl} />
        </>
      );
    }

    return (
      <Label style={queryResponseStyles(getTheme()).emptyStateLabel}>
        <FormattedMessage id='We did not find a Graph toolkit for this query' />
        &nbsp;
        <a
          style={queryResponseStyles(getTheme()).link}
          tabIndex={0}
          href='https://aka.ms/mgt'
          rel='noopener noreferrer'
          target='_blank'
        >
          <FormattedMessage id='Learn more about the Microsoft Graph Toolkit' />
          .
        </a>
      </Label>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    sampleQuery: state.sampleQuery,
  };
}

export default connect(mapStateToProps, null)(GraphToolkit);
