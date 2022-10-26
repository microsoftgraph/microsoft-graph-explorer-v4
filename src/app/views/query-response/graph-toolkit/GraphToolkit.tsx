import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import {
  getTheme, IStyle, ITheme, Label, Link,
  MessageBar, MessageBarType, styled
} from '@fluentui/react';
import { componentNames, telemetry } from '../../../../telemetry';
import { ApplicationState } from '../../../../types/root';
import { lookupToolkitUrl } from '../../../utils/graph-toolkit-lookup';
import { translateMessage } from '../../../utils/translate-messages';
import { queryResponseStyles } from '../queryResponse.styles';

class GraphToolkit extends Component<any> {
  constructor(props: any) {
    super(props);
  }

  currentTheme: ITheme = getTheme();
  textStyle = queryResponseStyles(this.currentTheme).queryResponseText.root as IStyle

  public render() {
    const { sampleQuery } = this.props;
    const { toolkitUrl, exampleUrl } = lookupToolkitUrl(sampleQuery);

    if (toolkitUrl && exampleUrl) {
      return (
        <>
          <MessageBar messageBarType={MessageBarType.info}>
            <FormattedMessage id='Open this example in' />
            <Link
              tabIndex={0} href={exampleUrl} target='_blank' rel='noopener noreferrer'
              onClick={(e) =>
                telemetry.trackLinkClickEvent((e.currentTarget as HTMLAnchorElement).href,
                  componentNames.GRAPH_TOOLKIT_PLAYGROUND_LINK)}
            >
              <FormattedMessage id='graph toolkit playground' />
            </Link>
            .
          </MessageBar>
          <iframe width='100%' height='470px' src={toolkitUrl} title={translateMessage('Graph toolkit')} />
        </>
      );
    }

    return (
      <Label styles={{ root: this.textStyle }}>
        <FormattedMessage id='We did not find a Graph toolkit for this query' />
        &nbsp;
        <Link
          tabIndex={0}
          href='https://aka.ms/mgt'
          rel='noopener noreferrer'
          target='_blank'
        >
          <FormattedMessage id='Learn more about the Microsoft Graph Toolkit' />
          .
        </Link>

      </Label>
    );
  }
}

function mapStateToProps({ sampleQuery }: ApplicationState) {
  return {
    sampleQuery
  };
}
const styledGraphToolkit = styled(GraphToolkit, queryResponseStyles as any);
export default connect(mapStateToProps, null)(styledGraphToolkit);
