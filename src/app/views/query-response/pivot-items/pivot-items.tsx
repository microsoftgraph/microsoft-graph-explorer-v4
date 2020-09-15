import { getId, getTheme, Icon, IconButton, PivotItem, TooltipHost } from 'office-ui-fabric-react';
import React from 'react';

import { telemetry } from '../../../../telemetry';
import { TAB_CLICK_EVENT } from '../../../../telemetry/event-types';
import { ThemeContext } from '../../../../themes/theme-context';
import { ContentType, Mode } from '../../../../types/enums';
import { IQuery } from '../../../../types/query-runner';
import { isImageResponse } from '../../../services/actions/query-action-creator-util';
import { lookupTemplate } from '../../../utils/adaptive-cards-lookup';
import { Image, Monaco } from '../../common';
import { genericCopy } from '../../common/copy';
import { formatXml } from '../../common/monaco/util/format-xml';
import AdaptiveCard from '../adaptive-cards/AdaptiveCard';
import { darkThemeHostConfig, lightThemeHostConfig } from '../adaptive-cards/AdaptiveHostConfig';
import { queryResponseStyles } from '../queryResponse.styles';
import { Snippets } from '../snippets';

export const getPivotItems = (properties: any) => {

  const { headers, body, verb, messages, mobileScreen, mode, sampleQuery } = properties;
  const resultComponent = displayResultComponent(headers, body, verb);

  const pivotItems = [
    <PivotItem
      key='response-preview'
      itemKey='response-preview'
      ariaLabel='Response Preview'
      itemIcon='Reply'
      headerText={messages['Response Preview']}
      title={messages['Response Preview']}
      onRenderItemLink={getTooltipDisplay}
    >
      {resultComponent}
    </PivotItem>,
    <PivotItem
      key='response-headers'
      itemKey='response-headers'
      ariaLabel='Response Headers'
      headerText={messages['Response Headers']}
      itemIcon='FileComment'
      title={messages['Response Headers']}
      onRenderItemLink={getTooltipDisplay}
    >
      {headers && <div><IconButton style={{ float: 'right', zIndex: 1 }} iconProps={{
        iconName: 'copy',
      }} onClick={async () => genericCopy(JSON.stringify(headers))} />
        <Monaco body={headers} /></div>}
    </PivotItem>
  ];

  if (mode === Mode.Complete) {
    pivotItems.push(
      <PivotItem
        key='adaptive-cards'
        itemKey='adaptive-cards'
        ariaLabel='Adaptive Cards'
        headerText={messages['Adaptive Cards']}
        title={messages['Adaptive Cards']}
        itemIcon='ContactCard'
        resource={(!!body) ? sampleQuery : null}
        onRenderItemLink={getTooltipDisplay}
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
    pivotItems.push(
      <PivotItem
        key='code-snippets'
        itemKey='code-snippets'
        ariaLabel='Code Snippets'
        title={messages.Snippets}
        headerText={messages.Snippets}
        itemIcon='PasteAsCode'
        onRenderItemLink={getTooltipDisplay}
      >
        <Snippets />
      </PivotItem>
    );
  }

  return pivotItems;
};

export const onPivotItemClick = (query: IQuery, item?: PivotItem) => {
  if (!item) { return; }
  const key = item.props.itemKey;
  if (key) { trackTabClickEvent(query, key); }
};

function trackTabClickEvent(query: IQuery, tabKey: string) {
  let componentName = '';
  switch (tabKey) {
    case 'adaptive-cards': {
      componentName = 'Adaptive Cards Tab';
      break;
    }
    case 'code-snippets': {
      componentName = 'Code Snippets Tab';
      break;
    }
    default: {
      break;
    }
  }
  if (componentName) {
    const queryUrl = query.selectedVerb + ' ' + query.sampleUrl;
    telemetry.trackEvent(TAB_CLICK_EVENT, { ComponentName: componentName, QueryUrl: queryUrl });
  }
}

function getTooltipDisplay(link: any) {
  return (
    <TooltipHost content={link.title} id={getId()} calloutProps={{ gapSpace: 0 }}>
      <Icon iconName={link.itemIcon} style={{ paddingRight: 5 }} />
      {link.headerText}

      {link.ariaLabel === 'Adaptive Cards' && link.resource && adaptiveCardPresentDot(link.resource)}
    </TooltipHost>
  );
}

function adaptiveCardPresentDot(sampleQuery: IQuery) {
  const currentTheme = getTheme();
  const dotStyle = queryResponseStyles(currentTheme).dot;
  const template = lookupTemplate(sampleQuery);
  if (template) {
    return <span style={dotStyle} />;
  }
  return null;
}

function displayResultComponent(headers: any, body: any, verb: string) {
  const language = 'json';
  if (headers) {
    const contentType = headers['content-type'].split(';')[0];
    switch (contentType) {
      case ContentType.XML:
        return <Monaco body={formatXml(body)} verb={verb} language='xml' />;

      default:
        if (isImageResponse(contentType)) {
          return <Image
            styles={{ padding: '10px' }}
            body={body}
            alt='profile image'
          />;
        }
        return <Monaco body={body} verb={verb} language={language} />;
    }
  }
}



