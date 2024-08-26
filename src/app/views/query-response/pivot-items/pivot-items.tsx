import { getTheme, IPivotItemProps, ITheme, PivotItem } from '@fluentui/react';
import { useAppSelector } from '../../../../store';

import { componentNames } from '../../../../telemetry';
import { ThemeContext } from '../../../../themes/theme-context';
import { Mode } from '../../../../types/enums';
import { lookupTemplate } from '../../../utils/adaptive-cards-lookup';
import { validateExternalLink } from '../../../utils/external-link-validation';
import { lookupToolkitUrl } from '../../../utils/graph-toolkit-lookup';
import { translateMessage } from '../../../utils/translate-messages';
import { darkThemeHostConfig, lightThemeHostConfig } from '../adaptive-cards/AdaptiveHostConfig';
import { queryResponseStyles } from '../queryResponse.styles';
import { Response } from '../response';
import {
  AdaptiveCards, GraphToolkit, ResponseHeaders,
  Snippets
} from '../../common/lazy-loader/component-registry';

export const GetPivotItems = () => {

  const { graphExplorerMode: mode, sampleQuery,
    graphResponse: { response: { body } } } = useAppSelector((state) => state);

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
  function renderItemLink(
    link?: IPivotItemProps,
    defaultRenderer?: (link?: IPivotItemProps) => JSX.Element | null,
  ): JSX.Element | null {
    if (!link || !defaultRenderer) {
      return null;
    }

    return (
      <span>
        {defaultRenderer({ ...link, itemKey: 'adaptive-cards' })}
        {link.itemKey === 'adaptive-cards' && showDotIfAdaptiveCardPresent()}
        {link.itemKey === 'toolkit-component' && showDotIfGraphToolkitPresent()}
      </span>
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
      headerButtonProps={{
        'aria-controls': 'response-tab'
      }}
    >
      <div id={'response-tab'} tabIndex={0}><Response /></div>
    </PivotItem>,
    <PivotItem
      key='response-headers'
      ariaLabel={translateMessage('Response Headers')}
      headerText={translateMessage('Response Headers')}
      itemIcon='FileComment'
      itemKey='response-headers'
      title={translateMessage('Response Headers')}
      headerButtonProps={{
        'aria-controls': 'response-headers-tab'
      }}
    >
      <div id={'response-headers-tab'} tabIndex={0}><ResponseHeaders /></div>
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
        headerButtonProps={{
          'aria-controls': 'code-snippets-tab'
        }}
      >
        <div id={'code-snippets-tab'} tabIndex={0}><Snippets /></div>
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
        <div id={'toolkit-tab'} tabIndex={0}><GraphToolkit /></div>
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
            <div id={'adaptive-cards-tab'} tabIndex={0}>
              <AdaptiveCards
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
