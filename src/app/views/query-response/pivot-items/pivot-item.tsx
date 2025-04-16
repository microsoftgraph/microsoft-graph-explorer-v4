import { useAppSelector } from '../../../../store';
import {
  makeStyles,
  SelectTabData,
  SelectTabEvent,
  Tab,
  TabList,
  TabValue,
  tokens,
  Button,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Overflow,
  OverflowItem,
  useOverflowMenu,
  useIsOverflowItemVisible
} from '@fluentui/react-components';
import { useState } from 'react';
import { ThemeContext } from '../../../../themes/theme-context';
import { translateMessage } from '../../../utils/translate-messages';
import {
  ResponseHeaders,
  Snippets
} from '../../common/lazy-loader/component-registry';
import AdaptiveCards from '../adaptive-cards/AdaptiveCard';
import {
  darkThemeHostConfig,
  lightThemeHostConfig
} from '../adaptive-cards/AdaptiveHostConfig';
import GraphToolkit from '../graph-toolkit/GraphToolkit';
import { Response } from '../response';
import { Mode } from '../../../../types/enums';
import {
  ArrowHookDownRightRegular,
  DocumentChevronDoubleRegular,
  ClipboardCodeRegular,
  WindowWrenchRegular,
  CardUiRegular,
  MoreHorizontalRegular
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  },
  tabHeader: {
    display: 'flex'
  },
  tabContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalS,
    marginTop: tokens.spacingHorizontalS,
    backgroundColor: tokens.colorNeutralBackground1,
    height: '100%',
    minHeight: '600px',
    overflow: 'hidden'
  }
});

const OverflowMenu = ({
  onTabSelect,
  tabs
}: {
  onTabSelect: (tabId: string) => void;
  tabs: { id: string; name: string; icon: JSX.Element }[];
}) => {
  const { ref, isOverflowing, overflowCount } = useOverflowMenu<HTMLButtonElement>();

  const visibilityMap = Object.fromEntries(
    tabs.map((tab) => [tab.id, useIsOverflowItemVisible(tab.id)])
  );

  if (!isOverflowing) {return null;}

  return (
    <Menu hasIcons>
      <MenuTrigger disableButtonEnhancement>
        <Button
          appearance='transparent'
          ref={ref}
          icon={<MoreHorizontalRegular />}
          aria-label={`${overflowCount} more tabs`}
          role='tab'
        />
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {tabs
            .filter((tab) => !visibilityMap[tab.id])
            .map((tab) => (
              <MenuItem key={tab.id} icon={tab.icon} onClick={() => onTabSelect(tab.id)}>
                {tab.name}
              </MenuItem>
            ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};

export const GetPivotItems = () => {
  const styles = useStyles();
  const mode = useAppSelector((state)=> state.graphExplorerMode);
  const body = useAppSelector((state) => state.graphResponse.response.body);
  const selected = translateMessage('Response Preview');
  const [selectedValue, setSelectedValue] = useState<TabValue>(selected);

  const onTabSelect = (_: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value);
  };

  let tabs = [
    {
      id: translateMessage('Response Preview'),
      name: translateMessage('Response Preview'),
      icon: <ArrowHookDownRightRegular />
    },
    {
      id: translateMessage('Response Headers'),
      name: translateMessage('Response Headers'),
      icon: <DocumentChevronDoubleRegular />
    }]

  if (mode === Mode.Complete) {
    const newTabs = [{
      id: translateMessage('Snippets'),
      name: translateMessage('Snippets'),
      icon: <ClipboardCodeRegular />
    },
    {
      id: translateMessage('Graph toolkit'),
      name: translateMessage('Graph toolkit'),
      icon: <WindowWrenchRegular />
    },
    {
      id: translateMessage('Adaptive Cards'),
      name: translateMessage('Adaptive Cards'),
      icon: <CardUiRegular />
    }];
    tabs = [...tabs, ...newTabs];
  }

  return (
    <div className={styles.container}>
      <div className={styles.tabHeader}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Overflow minimumVisible={2}>
            <TabList
              selectedValue={selectedValue}
              onTabSelect={onTabSelect}
              size="small"
            >
              {tabs.map((tab) => (
                <OverflowItem
                  key={tab.id}
                  id={tab.id}
                  priority={tab.id === selectedValue ? 2 : 1}
                >
                  <Tab value={tab.id} icon={tab.icon}>
                    {tab.name}
                  </Tab>
                </OverflowItem>
              ))}
              <OverflowMenu onTabSelect={setSelectedValue} tabs={tabs} />
            </TabList>
          </Overflow>
        </div>
      </div>

      <div className={styles.tabContent}>
        {selectedValue === translateMessage('Response Preview') && <Response />}
        {selectedValue === translateMessage('Response Headers') && <ResponseHeaders />}
        {selectedValue === translateMessage('Snippets') && <Snippets />}
        {selectedValue === translateMessage('Graph toolkit') && <GraphToolkit />}
        {selectedValue === translateMessage('Adaptive Cards') && (
          <ThemeContext.Consumer>
            {(theme) => (
              <div id={'adaptive-cards-tab'} tabIndex={0}>
                <AdaptiveCards
                  body={body as string}
                  hostConfig={theme === 'light' ? lightThemeHostConfig : darkThemeHostConfig}
                />
              </div>
            )}
          </ThemeContext.Consumer>
        )}
      </div>
    </div>
  );
};
