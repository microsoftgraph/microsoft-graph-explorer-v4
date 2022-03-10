import { getId, getTheme, Icon, ITheme, PivotItem, TooltipHost } from '@fluentui/react';
import React from 'react';
import { useSelector } from 'react-redux';

import { componentNames, telemetry } from '../../../../telemetry';
import { ThemeContext } from '../../../../themes/theme-context';
import { Mode } from '../../../../types/enums';
import { IQuery } from '../../../../types/query-runner';
import { IRootState } from '../../../../types/root';
import { lookupTemplate } from '../../../utils/adaptive-cards-lookup';
import { validateExternalLink } from '../../../utils/external-link-validation';
import { lookupToolkitUrl } from '../../../utils/graph-toolkit-lookup';
import { translateMessage } from '../../../utils/translate-messages';
import AdaptiveCard from '../adaptive-cards/AdaptiveCard';
import { darkThemeHostConfig, lightThemeHostConfig } from '../adaptive-cards/AdaptiveHostConfig';
import GraphToolkit from '../graph-toolkit/GraphToolkit';
import { ResponseHeaders } from '../headers';
import { queryResponseStyles } from '../queryResponse.styles';
import { Response } from '../response';
import { Snippets } from '../snippets';

export const getPivotItems = () => {

  const { graphExplorerMode: mode, sampleQuery, graphResponse: { body } } = useSelector((state: IRootState) => state);

  const currentTheme: ITheme = getTheme();
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
        validateExternalLink(toolkitUrl, componentNames.GRAPH_TOOLKIT_PLAYGROUND_LINK, null, sampleQuery);
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

        {link.itemKey === 'adaptive-cards' && showDotIfAdaptiveCardPresent()}
        {link.itemKey === 'toolkit-component' && showDotIfGraphToolkitPresent()}
      </TooltipHost>
    );
  }

  const pivotItems = [
    <PivotItem
      key='response-preview'
      ariaLabel={translateMessage('Response Preview')}
      itemIcon='Reply'
      itemKey='response-preview' // To be used to construct component name for telemetry data
      headerText={translateMessage('Response Preview')}
      title={translateMessage('Response Preview')}
      onRenderItemLink={renderItemLink}
      headerButtonProps={{
        'aria-controls': 'response-tab'
      }}
    >
      <div id={'response-tab'}><Response /></div>
    </PivotItem>,
    <PivotItem
      key='response-headers'
      ariaLabel={translateMessage('Response Headers')}
      headerText={translateMessage('Response Headers')}
      itemIcon='FileComment'
      itemKey='response-headers'
      title={translateMessage('Response Headers')}
      onRenderItemLink={renderItemLink}
      headerButtonProps={{
        'aria-controls': 'response-headers-tab'
      }}
    >
      <div id={'response-headers-tab'}><ResponseHeaders/></div>
    </PivotItem>
  ];

  if (mode === Mode.Complete) {
    pivotItems.push(
      <PivotItem
        key='code-snippets'
        ariaLabel={translateMessage('Snippets')}
        title={translateMessage('Snippets')}
        headerText={translateMessage('Snippets')}
        itemIcon='PasteAsCode'
        itemKey='code-snippets'
        onRenderItemLink={renderItemLink}
        headerButtonProps={{
          'aria-controls': 'code-snippets-tab'
        }}
      >
        <div id={'code-snippets-tab'}><Snippets /></div>
      </PivotItem>,
      <PivotItem
        key='graph-toolkit'
        ariaLabel={translateMessage('Graph toolkit')}
        itemIcon='CustomizeToolbar'
        itemKey='toolkit-component'
        headerText={translateMessage('Graph toolkit')}
        title={translateMessage('Graph toolkit')}
        onRenderItemLink={renderItemLink}
        headerButtonProps={{
          'aria-controls': 'toolkit-tab'
        }}
      >
        <div id={'toolkit-tab'}><GraphToolkit /></div>
      </PivotItem>,
      <PivotItem
        key='adaptive-cards'
        ariaLabel={translateMessage('Adaptive Cards')}
        headerText={translateMessage('Adaptive Cards')}
        title={translateMessage('Adaptive Cards')}
        itemIcon='ContactCard'
        itemKey='adaptive-cards'
        onRenderItemLink={renderItemLink}
        headerButtonProps={{
          'aria-controls': 'adaptive-cards-tab'
        }}
      >
        <ThemeContext.Consumer >
          {(theme) => (
            // @ts-ignore
            <div id={'adaptive-cards-tab'}>
              <AdaptiveCard
                body={body}
                hostConfig={theme === 'light' ? lightThemeHostConfig : darkThemeHostConfig}
              />
            </div>
          )}
        </ThemeContext.Consumer>
      </PivotItem>
    );
  }

  return pivotItems;
};

export const onPivotItemClick = (query: IQuery, item?: PivotItem) => {
  if (!item) { return; }
  const tabKey = item.props.itemKey;
  if (tabKey) {
    telemetry.trackTabClickEvent(tabKey, query);
  }
};
