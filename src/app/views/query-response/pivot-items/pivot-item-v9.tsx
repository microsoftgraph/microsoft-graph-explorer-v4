import { useAppSelector } from '../../../../store';

import {
  makeStyles,
  SelectTabData,
  SelectTabEvent,
  Tab,
  TabList,
  TabValue,
  tokens
} from '@fluentui/react-components';
import { useState } from 'react';
import { ThemeContext } from '../../../../themes/theme-context';
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
import { ResponseV9 } from '../response';

const useStyles = makeStyles({
  container: {
    flex: '1'
  },
  tabContent: {
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: `0 0 ${tokens.borderRadiusMedium} ${tokens.borderRadiusMedium}`,
    padding: tokens.spacingHorizontalS,
    marginTop: tokens.spacingHorizontalS,
    backgroundColor: tokens.colorNeutralBackground1
  }
});

export const GetPivotItems = () => {
  const body = useAppSelector((state) => state.graphResponse.response.body);
  const styles = useStyles();
  const selected = translateMessage('Response Preview');

  const [selectedValue, setSelectedValue] = useState<TabValue>(selected);

  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value);
  };

  return (
    <div className={styles.container}>
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
      <div className={styles.tabContent}>
        {selectedValue === translateMessage('Response Preview') && <ResponseV9 />}
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
                    theme === 'light' ? lightThemeHostConfig : darkThemeHostConfig
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
