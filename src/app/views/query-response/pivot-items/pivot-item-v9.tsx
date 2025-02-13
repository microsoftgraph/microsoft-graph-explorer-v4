import { useAppSelector } from '../../../../store';

import {
  makeStyles,
  SelectTabData,
  SelectTabEvent,
  Tab,
  TabList,
  TabValue
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
        <Tab value={translateMessage('Graph toolkit')}>
          {translateMessage('Graph toolkit')}
        </Tab>
        <Tab value={translateMessage('Adaptive Cards')}>
          {translateMessage('Adaptive Cards')}
        </Tab>
      </TabList>
      {selectedValue === translateMessage('Response Preview') && <ResponseV9 />}
      {selectedValue === translateMessage('Response Headers') && (
        <ResponseHeadersV9 />
      )}
      {selectedValue === translateMessage('Snippets') && <SnippetsV9 />}
      {selectedValue === translateMessage('Graph toolkit') && (
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
  );
};
