import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import {
  Label,
  MessageBar,
  MessageBarType,
  styled,
} from 'office-ui-fabric-react';
import { lookupToolkitUrl } from '../../../utils/graph-toolkit-lookup';
import { componentNames, telemetry } from '../../../../telemetry';
import { classNames } from '../../classnames';
import { queryResponseStyles } from '../queryResponse.styles';
import { IRootState } from '../../../../types/root';
import { translateMessage } from '../../../utils/translate-messages';

class GraphToolkit extends Component<any> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    const { sampleQuery } = this.props;
    const { toolkitUrl, exampleUrl } = lookupToolkitUrl(sampleQuery);
    const classes = classNames(this.props);

    if (toolkitUrl && exampleUrl) {
      return (
        <>
          <MessageBar messageBarType={MessageBarType.info}>
            <FormattedMessage id='Open this example in' />
            <a onClick={(e) => telemetry.trackLinkClickEvent(e.currentTarget.href, componentNames.GRAPH_TOOLKIT_PLAYGROUND_LINK)}
              tabIndex={0} href={exampleUrl} target='_blank' rel='noopener noreferrer'
              className={classes.link}>
              <FormattedMessage id='graph toolkit playground' />
            </a>
            .
          </MessageBar>
          <iframe width='100%' height='470px' src={toolkitUrl} title={translateMessage('Graph toolkit')} />
        </>
      );
    }

    return (
      <Label className={classes.emptyStateLabel}>
        <FormattedMessage id='We did not find a Graph toolkit for this query' />
        &nbsp;
        <a
          className={classes.link}
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

function mapStateToProps({ sampleQuery }: IRootState) {
  return {
    sampleQuery
  };
}
const styledGraphToolkit = styled(GraphToolkit, queryResponseStyles as any);
export default connect(mapStateToProps, null)(styledGraphToolkit);
