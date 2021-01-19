import { getId, getTheme, Icon, PivotItem, TooltipHost } from 'office-ui-fabric-react';
import React from 'react';
import { useSelector } from 'react-redux';

import { telemetry } from '../../../../telemetry';
import { GRAPH_TOOLKIT_LINK } from '../../../../telemetry/component-names';
import { TAB_CLICK_EVENT } from '../../../../telemetry/event-types';
import { ThemeContext } from '../../../../themes/theme-context';
import { Mode } from '../../../../types/enums';
import { IQuery } from '../../../../types/query-runner';
import { lookupTemplate } from '../../../utils/adaptive-cards-lookup';
import { validateExternalLink } from '../../../utils/external-link-validation';
import { lookupToolkitUrl } from '../../../utils/graph-toolkit-lookup';
import { sanitizeQueryUrl } from '../../../utils/query-url-sanitization';
import { translateMessage } from '../../../utils/translate-messages';
import AdaptiveCard from '../adaptive-cards/AdaptiveCard';
import { darkThemeHostConfig, lightThemeHostConfig } from '../adaptive-cards/AdaptiveHostConfig';
import GraphToolkit from '../graph-toolkit/GraphToolkit';
import { ResponseHeaders } from '../headers';
import { queryResponseStyles } from '../queryResponse.styles';
import { Response } from '../response';
import { Snippets } from '../snippets';

export const getPivotItems = () => {

  const { graphExplorerMode: mode, sampleQuery, graphResponse: { body } } = useSelector((state: any) => state);

  const currentTheme = getTheme();
  const dotStyle = queryResponseStyles(currentTheme).dot;

  function showDotIfAdaptiveCardPresent() {
    if (!!body) {
      const template = lookupTemplate(sampleQuery);
      if (template) {
        return <span style={dotStyle} />;
      }
    }
    return null;
  }

  function showDotIfGraphToolkitPresent() {
    if (!!body) {
      const { toolkitUrl, exampleUrl } = lookupToolkitUrl(sampleQuery);
      if (toolkitUrl && exampleUrl) {
        validateExternalLink(toolkitUrl, GRAPH_TOOLKIT_LINK, null, sampleQuery);
        return <span style={dotStyle} />;
      }
    }
    return null;
  }

  function renderItemLink(link: any) {
    return (
      <TooltipHost content={link.title} id={getId()} calloutProps={{ gapSpace: 0 }}>
        <Icon iconName={link.itemIcon} style={{ paddingRight: 5 }} />
        {link.headerText}

        {link.ariaLabel === 'Adaptive Cards' && showDotIfAdaptiveCardPresent()}
        {link.ariaLabel === 'Graph Toolkit' && showDotIfGraphToolkitPresent()}
      </TooltipHost>
    );
  }

  const pivotItems = [
    <PivotItem
      key='response-preview'
      ariaLabel='Response Preview'
      itemIcon='Reply'
      headerText={translateMessage('Response Preview')}
      title={translateMessage('Response Preview')}
      onRenderItemLink={renderItemLink}
    >
      <Response />
    </PivotItem>,
    <PivotItem
      key='response-headers'
      ariaLabel='Response Headers'
      headerText={translateMessage('Response Headers')}
      itemIcon='FileComment'
      title={translateMessage('Response Headers')}
      onRenderItemLink={renderItemLink}
    >
      <ResponseHeaders />
    </PivotItem>
  ];

  if (mode === Mode.Complete) {
    pivotItems.push(
      <PivotItem
        key='code-snippets'
        ariaLabel='Code Snippets'
        title={translateMessage('Snippets')}
        headerText={translateMessage('Snippets')}
        itemIcon='PasteAsCode'
        onRenderItemLink={renderItemLink}
      >
        <Snippets />
      </PivotItem>,
      <PivotItem
        key='graph-toolkit'
        ariaLabel='Graph Toolkit'
        itemIcon='CustomizeToolbar'
        headerText={translateMessage('Graph toolkit')}
        title={translateMessage('Graph toolkit')}
        onRenderItemLink={renderItemLink}
      >
        <GraphToolkit />
      </PivotItem>,
      <PivotItem
        key='adaptive-cards'
        ariaLabel='Adaptive Cards'
        headerText={translateMessage('Adaptive Cards')}
        title={translateMessage('Adaptive Cards')}
        itemIcon='ContactCard'
        onRenderItemLink={renderItemLink}
      >
        <ThemeContext.Consumer >
          {(theme) => (
            // @ts-ignore
            <AdaptiveCard
              body={body}
              hostConfig={theme === 'light' ? lightThemeHostConfig : darkThemeHostConfig}
            />
          )}
        </ThemeContext.Consumer>
      </PivotItem>
    );
  }

  return pivotItems;
};

export const onPivotItemClick = (query: IQuery, item?: PivotItem) => {
  if (!item) { return; }
  const tabTitle = item.props.title;
  if (tabTitle) {
    trackTabClickEvent(query, tabTitle);
  }
};

function trackTabClickEvent(query: IQuery, tabTitle: string) {
  const sanitizedUrl = sanitizeQueryUrl(query.sampleUrl);
  telemetry.trackEvent(TAB_CLICK_EVENT,
    {
      ComponentName: `${tabTitle} tab`,
      QuerySignature: `${query.selectedVerb} ${sanitizedUrl}`
    });
}


