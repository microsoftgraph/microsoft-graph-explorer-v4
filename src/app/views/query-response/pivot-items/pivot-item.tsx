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
  ResponseHeadersV9,
  SnippetsV9
} from '../../common/lazy-loader/component-registry';
import AdaptiveCards from '../adaptive-cards/AdaptiveCard';
import {
  darkThemeHostConfig,
  lightThemeHostConfig
} from '../adaptive-cards/AdaptiveHostConfig';
import { default as GraphToolkitV9 } from '../graph-toolkit/GraphToolkitV9';
import { Response } from '../response';
import {
  ArrowResetRegular,
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
    flex: 1,
    height: '100%',
    overflow: 'hidden'
  },
  tabContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingHorizontalS,
    marginTop: tokens.spacingHorizontalS,
    backgroundColor: tokens.colorNeutralBackground1,
    overflow: 'hidden'
  }
});

const OverflowMenuItem = ({ tab, onClick }:
  { tab: { id: string; name: string; icon: JSX.Element }; onClick: () => void }) => {
  const isVisible = useIsOverflowItemVisible(tab.id);
  if (isVisible) {return null;}
  return (
    <MenuItem key={tab.id} icon={tab.icon} onClick={onClick}>
      {tab.name}
    </MenuItem>
  );
};

const OverflowMenu = ({ onTabSelect, tabs }:
  { onTabSelect: (tabId: string) => void; tabs: { id: string; name: string; icon: JSX.Element }[] }) => {
  const { ref, isOverflowing, overflowCount } = useOverflowMenu<HTMLButtonElement>();

  if (!isOverflowing) {
    return null;
  }

  return (
    <Menu hasIcons>
      <MenuTrigger disableButtonEnhancement>
        <Button appearance='transparent' ref={ref}
          icon={<MoreHorizontalRegular />} aria-label={`${overflowCount} more tabs`} role='tab' />
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {tabs.map((tab) => (
            <OverflowMenuItem key={tab.id} tab={tab} onClick={() => onTabSelect(tab.id)} />
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};

export const GetPivotItems = () => {
  const body = useAppSelector((state) => state.graphResponse.response.body);
  const styles = useStyles();
  const selected = translateMessage('Response Preview');
  const { mobileScreen } = useAppSelector((state) => state.sidebarProperties);

  const [selectedValue, setSelectedValue] = useState<TabValue>(selected);

  const onTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value);
  };

  const tabs = [
    { id: translateMessage('Response Preview'), name:translateMessage('Response Preview'), icon:<ArrowResetRegular />},
    { id: translateMessage('Response Headers'),
      name:translateMessage('Response Headers'), icon:<DocumentChevronDoubleRegular /> },
    { id: translateMessage('Snippets'), name: translateMessage('Snippets'), icon: <ClipboardCodeRegular /> },
    { id: translateMessage('Graph toolkit'), name: translateMessage('Graph toolkit'), icon: <WindowWrenchRegular /> },
    { id: translateMessage('Adaptive Cards'), name: translateMessage('Adaptive Cards'), icon: <CardUiRegular /> }
  ];

  return (
    <div className={styles.container}>
      {mobileScreen ? (
        <Overflow minimumVisible={2}>
          <TabList selectedValue={selectedValue} onTabSelect={onTabSelect} size='small'>
            {tabs.map((tab) => (
              <OverflowItem key={tab.id} id={tab.id} priority={tab.id === selectedValue ? 2 : 1}>
                <Tab value={tab.id} icon={tab.icon}>
                  {tab.name}
                </Tab>
              </OverflowItem>
            ))}
            <OverflowMenu onTabSelect={setSelectedValue} tabs={tabs} />
          </TabList>
        </Overflow>
      ) : (
        <TabList selectedValue={selectedValue} onTabSelect={onTabSelect} size='small'>
          {tabs.map((tab) => (
            <Tab key={tab.id} value={tab.id} icon={tab.icon}>
              {tab.name}
            </Tab>
          ))}
        </TabList>
      )}
      <div className={styles.tabContent}>
        {selectedValue === translateMessage('Response Preview') && <Response />}
        {selectedValue === translateMessage('Response Headers') && <ResponseHeadersV9 />}
        {selectedValue === translateMessage('Snippets') && <SnippetsV9 />}
        {selectedValue === translateMessage('Graph toolkit') && <GraphToolkitV9 />}
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
