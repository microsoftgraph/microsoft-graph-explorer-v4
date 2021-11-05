import { getId, getTheme, Icon, ITheme, PivotItem, TooltipHost } from '@fluentui/react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { componentNames, telemetry } from '../../../../telemetry';
import { ThemeContext } from '../../../../themes/theme-context';
import { Mode } from '../../../../types/enums';
import { IQuery } from '../../../../types/query-runner';
import { IRootState } from '../../../../types/root';
import { toggleTourState } from '../../../services/actions/tour-action-creator';
import { lookupTemplate } from '../../../utils/adaptive-cards-lookup';
import { validateExternalLink } from '../../../utils/external-link-validation';
import { lookupToolkitUrl } from '../../../utils/graph-toolkit-lookup';
import { translateMessage } from '../../../utils/translate-messages';
import { contextMenuItems, findTarget, getTargetStepIndex } from '../../tour/utils/contextHelpers';
import LinkItem from '../../tour/utils/LinkItem';
import AdaptiveCard from '../adaptive-cards/AdaptiveCard';
import { darkThemeHostConfig, lightThemeHostConfig } from '../adaptive-cards/AdaptiveHostConfig';
import GraphToolkit from '../graph-toolkit/GraphToolkit';
import { ResponseHeaders } from '../headers';
import { queryResponseStyles } from '../queryResponse.styles';
import { Response } from '../response';
import { Snippets } from '../snippets';

export const getPivotItems = () => {
  const dispatch = useDispatch();

  const { graphExplorerMode: mode, sampleQuery, graphResponse: { body },
    tour } = useSelector((state: IRootState) => state);

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
  const selectContextItem = (e: any, item: any, link: any) => {
    if(link.itemKey !== null){
      const { itemKey } = link;
      const itemKeyString: string = itemKey.toString();
      const target = findTarget(itemKeyString);
      const targetStepIndex = getTargetStepIndex(target, item.key, tour.tourSteps, tour.beginner)
      if(targetStepIndex >= 0){
        dispatch(toggleTourState({
          isRunning: true,
          beginner: false,
          continuous: item.key.toString() === 'info'? false : true,
          step: targetStepIndex,
          pending: false
        }))
      }

    }
  }

  function renderItemLink(link: any) {
    return (
      <LinkItem
        style={{
          flexGrow: 1,
          textAlign: 'left',
          boxSizing: 'border-box'
        }}
        key={link.title}
        items={contextMenuItems}
        onItemClick={(e: any, item: any) => selectContextItem(e, item, link)}
      >
        <TooltipHost content={link.title} id={getId()} calloutProps={{ gapSpace: 0 }}>
          <Icon iconName={link.itemIcon} style={{ paddingRight: 5 }} />
          {link.headerText}

          {link.ariaLabel === 'Adaptive Cards' && showDotIfAdaptiveCardPresent()}
          {link.ariaLabel === 'Graph Toolkit' && showDotIfGraphToolkitPresent()}
        </TooltipHost>
      </LinkItem>
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
    >
      <Response />
    </PivotItem>,
    <PivotItem
      key='response-headers'
      ariaLabel={translateMessage('Response Headers')}
      headerText={translateMessage('Response Headers')}
      itemIcon='FileComment'
      itemKey='response-headers'
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
        ariaLabel={translateMessage('Snippets')}
        title={translateMessage('Snippets')}
        headerText={translateMessage('Snippets')}
        itemIcon='PasteAsCode'
        itemKey='code-snippets'
        onRenderItemLink={renderItemLink}
      >
        <Snippets />
      </PivotItem>,
      <PivotItem
        key='graph-toolkit'
        ariaLabel={translateMessage('Graph toolkit')}
        itemIcon='CustomizeToolbar'
        itemKey='toolkit-component'
        headerText={translateMessage('Graph toolkit')}
        title={translateMessage('Graph toolkit')}
        onRenderItemLink={renderItemLink}
      >
        <GraphToolkit />
      </PivotItem>,
      <PivotItem
        key='adaptive-cards'
        ariaLabel={translateMessage('Adaptive Cards')}
        headerText={translateMessage('Adaptive Cards')}
        title={translateMessage('Adaptive Cards')}
        itemIcon='ContactCard'
        itemKey='adaptive-cards'
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
  const tabKey = item.props.itemKey;
  if (tabKey) {
    telemetry.trackTabClickEvent(tabKey, query);
  }
};
