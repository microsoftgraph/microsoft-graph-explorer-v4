import {
  getTheme,
  IPivotItemProps,
  ITheme,
  makeStyles,
  PivotItem
} from '@fluentui/react';
import { useAppSelector } from '../../../../store';

import {
  Button,
  SelectTabData,
  SelectTabEvent,
  Tab,
  TabList,
  TabListProps,
  TabValue
} from '@fluentui/react-components';
import React, { useState } from 'react';
import { componentNames } from '../../../../telemetry';
import { ThemeContext } from '../../../../themes/theme-context';
import { Mode } from '../../../../types/enums';
import { lookupTemplate } from '../../../utils/adaptive-cards-lookup';
import { validateExternalLink } from '../../../utils/external-link-validation';
import { lookupToolkitUrl } from '../../../utils/graph-toolkit-lookup';
import { translateMessage } from '../../../utils/translate-messages';
import {
  ResponseHeadersV9,
  SnippetsV9
} from '../../common/lazy-loader/component-registry';
import AdaptiveCardsV9 from '../adaptive-cards/AdaptiveCardV9';
import {
  darkThemeHostConfig,
  lightThemeHostConfig
} from '../adaptive-cards/AdaptiveHostConfig';
import { default as GraphToolkitV9 } from '../graph-toolkit/GraphToolkitV9';
import { queryResponseStyles } from '../queryResponse.styles';
import { ResponseV9 } from '../response';

// export const GetPivotItems = () => {
//   const mode = useAppSelector((state)=> state.graphExplorerMode);
//   const sampleQuery= useAppSelector((state)=> state.sampleQuery);
//   const body = useAppSelector((state)=> state.graphResponse.response.body);

//   const currentTheme: ITheme = getTheme();
//   const dotStyle = queryResponseStyles(currentTheme).dot;

//   function showDotIfAdaptiveCardPresent() {
//     if (!!body) {
//       const template = lookupTemplate(sampleQuery);
//       if (template) {
//         return <span style={dotStyle} />;
//       }
//     }
//     return null;
//   }

//   function showDotIfGraphToolkitPresent() {
//     if (!!body) {
//       const { toolkitUrl, exampleUrl } = lookupToolkitUrl(sampleQuery);
//       if (toolkitUrl && exampleUrl) {
//         validateExternalLink(toolkitUrl, componentNames.GRAPH_TOOLKIT_PLAYGROUND_LINK, null, sampleQuery);
//         return <span style={dotStyle} />;
//       }
//     }
//     return null;
//   }
//   function renderItemLink(
//     link?: IPivotItemProps,
//     defaultRenderer?: (link?: IPivotItemProps) => JSX.Element | null,
//   ): JSX.Element | null {
//     if (!link || !defaultRenderer) {
//       return null;
//     }

//     return (
//       <span>
//         {defaultRenderer({ ...link, itemKey: 'adaptive-cards' })}
//         {link.itemKey === 'adaptive-cards' && showDotIfAdaptiveCardPresent()}
//         {link.itemKey === 'toolkit-component' && showDotIfGraphToolkitPresent()}
//       </span>
//     );
//   }

//   const pivotItems = [
//     <PivotItem
//       key='response-preview'
//       ariaLabel={translateMessage('Response Preview')}
//       itemIcon='Reply'
//       itemKey='response-preview' // To be used to construct component name for telemetry data
//       headerText={translateMessage('Response Preview')}
//       title={translateMessage('Response Preview')}
//       headerButtonProps={{
//         'aria-controls': 'response-tab'
//       }}
//     >
//       {/* <div id={'response-tab'} tabIndex={0}><Response /></div> */}
//       <div id={'response-tab'} tabIndex={0}><ResponseV9 /></div>
//     </PivotItem>,
//     <PivotItem
//       key='response-headers'
//       ariaLabel={translateMessage('Response Headers')}
//       headerText={translateMessage('Response Headers')}
//       itemIcon='FileComment'
//       itemKey='response-headers'
//       title={translateMessage('Response Headers')}
//       headerButtonProps={{
//         'aria-controls': 'response-headers-tab'
//       }}
//     >
//       <div id={'response-headers-tab'} tabIndex={0}><ResponseHeadersV9 /></div>
//     </PivotItem>
//   ];
//   if (mode === Mode.Complete) {
//     pivotItems.push(
//       <PivotItem
//         key='code-snippets'
//         ariaLabel={translateMessage('Snippets')}
//         title={translateMessage('Snippets')}
//         headerText={translateMessage('Snippets')}
//         itemIcon='PasteAsCode'
//         itemKey='code-snippets'
//         headerButtonProps={{
//           'aria-controls': 'code-snippets-tab'
//         }}
//       >
//         {/* <div id={'code-snippets-tab'} tabIndex={0}><Snippets /></div> */}
//         <div id={'code-snippets-tab'} tabIndex={0}><SnippetsV9 /></div>
//       </PivotItem>,
//       <PivotItem
//         key='graph-toolkit'
//         ariaLabel={translateMessage('Graph toolkit')}
//         itemIcon='CustomizeToolbar'
//         itemKey='toolkit-component'
//         headerText={translateMessage('Graph toolkit')}
//         title={translateMessage('Graph toolkit')}
//         onRenderItemLink={renderItemLink}
//         headerButtonProps={{
//           'aria-controls': 'toolkit-tab'
//         }}
//       >
//         {/* <div id={'toolkit-tab'} tabIndex={0}><GraphToolkit /></div> */}
//         <div id={'toolkit-tab'} tabIndex={0}><GraphToolkitV9 /></div>
//       </PivotItem>,
//       <PivotItem
//         key='adaptive-cards'
//         ariaLabel={translateMessage('Adaptive Cards')}
//         headerText={translateMessage('Adaptive Cards')}
//         title={translateMessage('Adaptive Cards')}
//         itemIcon='ContactCard'
//         itemKey='adaptive-cards'
//         onRenderItemLink={renderItemLink}
//         headerButtonProps={{
//           'aria-controls': 'adaptive-cards-tab'
//         }}
//       >
//         <ThemeContext.Consumer >
//           {(theme) => (
//             // @ts-ignore
//             <div id={'adaptive-cards-tab'} tabIndex={0}>
//               <AdaptiveCardsV9
//                 body={body as string} hostConfig={theme === 'light' ? lightThemeHostConfig : darkThemeHostConfig}
//               />
//             </div>
//           )}
//         </ThemeContext.Consumer>
//       </PivotItem>
//     );
//   }

//   return pivotItems;
// };

const useStyles = makeStyles({
  root: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: '50px 20px',
    rowGap: '20px'
  }
});

export const GetPivotItems = () => {
  const mode = useAppSelector((state) => state.graphExplorerMode);
  const sampleQuery = useAppSelector((state) => state.sampleQuery);
  const body = useAppSelector((state) => state.graphResponse.response.body);
  const styles = useStyles();
  const selected = translateMessage('Response Preview');

  const [selectedValue, setSelectedValue] = useState<TabValue>(selected);

  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value);
  };

  return (
    <div>
      <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
        <Tab value={translateMessage('Response Preview')}>
          {translateMessage('Response Preview')}
        </Tab>
        <Tab value={translateMessage('Response Headers')}>
          {translateMessage('Response Headers')}
        </Tab>
        <Tab value={translateMessage('Snippets')}>
          {translateMessage('Snippets')}
        </Tab>
        <Tab value={translateMessage('Graph Toolkit')}>
          {translateMessage('Graph Toolkit')}
        </Tab>
        <Tab value={translateMessage('Adaptive Cards')}>
          {translateMessage('Adaptive Cards')}
        </Tab>
      </TabList>
      <div>
        {selectedValue === translateMessage('Response Preview') && (
          <ResponseV9 />
        )}
        {selectedValue === translateMessage('Response Headers') && (
          <ResponseHeadersV9 />
        )}
        {selectedValue === translateMessage('Snippets') && <SnippetsV9 />}
        {selectedValue === translateMessage('Graph Toolkit') && (
          <GraphToolkitV9 />
        )}
        {selectedValue === translateMessage('Adaptive Cards') && (
          <ThemeContext.Consumer>
            {(theme) => (
              // @ts-ignore
              <div id={'adaptive-cards-tab'} tabIndex={0}>
                <AdaptiveCardsV9
                  body={body as string}
                  hostConfig={
                    theme === 'light'
                      ? lightThemeHostConfig
                      : darkThemeHostConfig
                  }
                />
              </div>
            )}
          </ThemeContext.Consumer>
        )}
      </div>
    </div>
  );
};
