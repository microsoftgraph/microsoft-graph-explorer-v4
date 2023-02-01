import { FormattedMessage } from 'react-intl';
import {
  getTheme, IStyle, ITheme, Label, Link,
  MessageBar, MessageBarType, styled
} from '@fluentui/react';

import { componentNames, telemetry } from '../../../../telemetry';
import { lookupToolkitUrl } from '../../../utils/graph-toolkit-lookup';
import { translateMessage } from '../../../utils/translate-messages';
import { queryResponseStyles } from '../queryResponse.styles';
import { useAppSelector } from '../../../../store';
import { convertVhToPx, getResponseHeight } from '../../common/dimensions/dimensions-adjustment';

const GraphToolkit = () => {
  const { sampleQuery, dimensions: {response },responseAreaExpanded } = useAppSelector((state) => state);
  const { toolkitUrl, exampleUrl } = lookupToolkitUrl(sampleQuery);

  const currentTheme: ITheme = getTheme();
  const textStyle = queryResponseStyles(currentTheme).queryResponseText.root as IStyle;
  const linkStyle = queryResponseStyles(currentTheme).link as IStyle;
  
  const height = convertVhToPx(getResponseHeight(response.height, responseAreaExpanded), 155);

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
            styles={{root: linkStyle}}
            underline
          >
            <FormattedMessage id='graph toolkit playground' />
          </Link>
          .
        </MessageBar>
        <iframe width='100%' height={height} src={toolkitUrl} title={translateMessage('Graph toolkit')} />
      </>
    );
  }

  return (
    <Label styles={{ root: textStyle }}>
      <FormattedMessage id='We did not find a Graph toolkit for this query' />
      &nbsp;
      <Link
        tabIndex={0}
        href='https://aka.ms/mgt'
        rel='noopener noreferrer'
        target='_blank'
        styles={{root: linkStyle}}
        underline
      >
        <FormattedMessage id='Learn more about the Microsoft Graph Toolkit' />
        .
      </Link>

    </Label>
  );
}

const styledGraphToolkit = styled(GraphToolkit, queryResponseStyles as any);
export default styledGraphToolkit;