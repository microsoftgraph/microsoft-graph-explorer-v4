import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../store';
import { telemetry } from '../../../../telemetry';
import { Mode } from '../../../../types/enums';
import { translateMessage } from '../../../utils/translate-messages';
import { Auth, Permissions, RequestHeaders } from '../../common/lazy-loader/component-registry';
import { RequestBody } from './body';
import './request.scss';
import { IQuery } from '../../../../types/query-runner';
import {
  makeStyles,
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
import {
  SendRegular,
  DocumentTableRegular,
  ShieldKeyholeRegular,
  KeyRegular,
  MoreHorizontalRegular } from '@fluentui/react-icons';

interface IRequestProps {
  handleOnEditorChange: () => void;
  sampleQuery: IQuery;
}

const useStyles = makeStyles({
  container: {
    height: '-webkit-fill-available',
    display: 'flex',
    flexDirection: 'column'
  },
  tabContainer: {
    display: 'flex',
    flexShrink: 0,
    overflowX: 'hidden'
  },
  tabList: {
    padding: '5px 5px'
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
    minHeight: '0',
    overflow: 'auto'
  },
  menuButton: {
    alignSelf: 'center'
  }
});

const OverflowMenuItem = ({ tab, onClick }: { tab: { id: string; name: string; icon: JSX.Element };
  onClick: () => void }) => {
  const isVisible = useIsOverflowItemVisible(tab.id);

  if (isVisible) {
    return null;
  }

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

const Request = (props: IRequestProps) => {
  const styles = useStyles();
  const [selectedTab, setSelectedTab] = useState<TabValue>('request-body');
  const mode = useAppSelector((state) => state.graphExplorerMode);
  const  mobileScreen = useAppSelector((state) => state.sidebarProperties.mobileScreen);

  const tabs = [
    { id: 'request-body', name: translateMessage('Request Body'), icon: <SendRegular /> },
    { id: 'request-headers', name: translateMessage('Request Headers'), icon: <DocumentTableRegular /> },
    { id: 'modify-permissions', name: translateMessage('Modify Permissions'), icon: <ShieldKeyholeRegular /> }
  ];

  if (mode === Mode.Complete) {
    tabs.push({ id: 'access-token', name: translateMessage('Access Token'), icon: <KeyRegular /> });
  }

  const handleTabSelect = (tab: TabValue) => {
    setSelectedTab(tab);
    telemetry.trackTabClickEvent(tab as string, props.sampleQuery);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabContainer}>
        {mobileScreen ? (
          <Overflow minimumVisible={2}>
            <TabList selectedValue={selectedTab} onTabSelect={(_, data) => handleTabSelect(data.value)} size='small'>
              {tabs.map((tab) => (
                <OverflowItem key={tab.id} id={tab.id} priority={tab.id === selectedTab ? 2 : 1}>
                  <Tab value={tab.id} icon={tab.icon}>
                    {tab.name}
                  </Tab>
                </OverflowItem>
              ))}
              <OverflowMenu onTabSelect={handleTabSelect} tabs={tabs} />
            </TabList>
          </Overflow>
        ) : (
          <TabList selectedValue={selectedTab}
            onTabSelect={(_, data) => handleTabSelect(data.value)}
            size='small' className={styles.tabList}
          >
            {tabs.map((tab) => (
              <Tab key={tab.id} value={tab.id} icon={tab.icon}>
                {tab.name}
              </Tab>
            ))}
          </TabList>
        )}
      </div>
      <div className={styles.tabContent}>
        {selectedTab === 'request-body' && (
          <div style={{ flex: 1, display: 'flex' }}>
            <RequestBody handleOnEditorChange={props.handleOnEditorChange} isVisible={selectedTab === 'request-body'} />
          </div>
        )}
        {selectedTab === 'request-headers' && (
          <div style={{ flex: 1, display: 'flex' }}>
            <RequestHeaders />
          </div>
        )}
        {selectedTab === 'modify-permissions' && <Permissions />}
        {selectedTab === 'access-token' && mode === Mode.Complete && <Auth />}
      </div>
    </div>
  );
};

export default Request;
