import { getId, getTheme, Icon, IconButton, PivotItem, TooltipHost } from 'office-ui-fabric-react';
import React from 'react';

import { ThemeContext } from '../../../../themes/theme-context';
import { ContentType, Mode } from '../../../../types/enums';
import { IQuery } from '../../../../types/query-runner';
import { isImageResponse } from '../../../services/actions/query-action-creator-util';
import { lookupTemplate } from '../../../utils/adaptive-cards-lookup';
import { lookupToolkitUrl } from '../../../utils/graph-toolkit-lookup';
import { Image, Monaco } from '../../common';
import { genericCopy } from '../../common/copy';
import { formatXml } from '../../common/monaco/util/format-xml';
import AdaptiveCard from '../adaptive-cards/AdaptiveCard';
import { darkThemeHostConfig, lightThemeHostConfig } from '../adaptive-cards/AdaptiveHostConfig';
import GraphToolkit from '../graph-toolkit/GraphToolkit';
import { queryResponseStyles } from '../queryResponse.styles';
import { Snippets } from '../snippets';

export const getPivotItems = (properties: any) => {

  const { headers, body, messages, mobileScreen, mode, sampleQuery } = properties;
  const resultComponent = displayResultComponent(headers, body);
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
      headerText={messages['Response Preview']}
      title={messages['Response Preview']}
      onRenderItemLink={renderItemLink}
    >
      {resultComponent}
    </PivotItem>,
    <PivotItem
      key='response-headers'
      ariaLabel='Response Headers'
      headerText={messages['Response Headers']}
      itemIcon='FileComment'
      title={messages['Response Headers']}
      onRenderItemLink={renderItemLink}
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
        key='code-snippets'
        ariaLabel='Code Snippets'
        title={messages.Snippets}
        headerText={(mobileScreen) ? '' : messages.Snippets}
        itemIcon='PasteAsCode'
        onRenderItemLink={renderItemLink}
      >
        <Snippets />
      </PivotItem>,
      <PivotItem
        key='graph-toolkit'
        ariaLabel='Graph Toolkit'
        itemIcon='CustomizeToolbar'
        headerText={(mobileScreen) ? '' : messages['Graph toolkit']}
        title={messages['Graph toolkit']}
        onRenderItemLink={renderItemLink}
      >
        <GraphToolkit />
      </PivotItem>,

      <PivotItem
        key='adaptive-cards'
        ariaLabel='Adaptive Cards'
        headerText={messages['Adaptive Cards']}
        title={messages['Adaptive Cards']}
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
    pivotItems.push(
      <PivotItem
        key='code-snippets'
        ariaLabel='Code Snippets'
        title={messages.Snippets}
        headerText={messages.Snippets}
        itemIcon='PasteAsCode'
        onRenderItemLink={renderItemLink}
      >
        <Snippets />
      </PivotItem>
    );
  }

  return pivotItems;
};




function displayResultComponent(headers: any, body: any) {
  const language = 'json';
  let contentType = null;

  if (headers) {
    const contentTypes = headers['content-type'];
    if (contentTypes) {
      /* Example: application/json;odata.metadata=minimal;odata.streaming=true;IEEE754Compatible=false;charset=utf-8
      * Take the first option after splitting since it is the only value useful in the description of the content
      */
      const splitContentTypes = contentTypes.split(';');
      if (splitContentTypes.length > 0) {
        contentType = splitContentTypes[0];
      }
    }

    switch (contentType) {
      case ContentType.XML:
        return <Monaco body={formatXml(body)} language='xml' />;

      default:
        if (isImageResponse(contentType)) {
          return <Image
            styles={{ padding: '10px' }}
            body={body}
            alt='profile image'
          />;
        }
        return <Monaco body={body} language={language} />;
    }
  }
}



