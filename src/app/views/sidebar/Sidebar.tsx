import {
  Button, ButtonProps, DrawerBody, DrawerHeader, DrawerHeaderTitle, OverlayDrawer,
  SelectTabData, SelectTabEvent, Tab, TabList, Tooltip, useRestoreFocusSource
} from '@fluentui/react-components';
import {
  Dismiss20Regular, GroupList20Regular, History20Regular, PanelLeftContract20Regular,
  PanelLeftExpand20Regular, Rocket20Regular
} from '@fluentui/react-icons';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../store';
import { translateMessage } from '../../utils/translate-messages';
import History from './history/History';
import ResourceExplorer from './resource-explorer';
import { SampleQueries } from './sample-queries/SampleQueries';
import { MOBILE_SIDEBAR_ID, useSidebarStyles } from './Sidebar.styles';

interface IShowSidebar {
  show: boolean
  handleShow: ()=>void
}
const SidebarToggle = (props: IShowSidebar & ButtonProps)=>{
  const {show, handleShow} = props;
  const PanelIcon = ()=> show ? <PanelLeftContract20Regular/>: <PanelLeftExpand20Regular/>

  return (
    <Tooltip content={show? translateMessage('Minimize sidebar'): translateMessage('Maximize sidebar')}
      relationship='label'>
      <Button appearance='subtle' icon={PanelIcon()} onClick={handleShow} {...props}>
      </Button>
    </Tooltip>
  )
}

interface SidebarProps {
  handleToggleSelect: (showSidebarValue: boolean) => void;
  expanded: boolean;
}

const Sidebar = ({ handleToggleSelect, expanded }: SidebarProps) => {
  const styles = useSidebarStyles();
  const { mobileScreen, showSidebar } = useAppSelector(state => state.sidebarProperties);
  const [selectedValue, setSelectedValue] = useState<string>('sample-queries');
  const restoreFocusSource = useRestoreFocusSource();
  const showLabels = mobileScreen || expanded;

  // The drawer renders outside the app root, so make the page behind it inert while it is open. Fluent's
  // aria-hidden handling alone can leave the page exposed to screen readers after focus wraps.
  useEffect(() => {
    const appRoot = mobileScreen && showSidebar ? document.getElementById('root') : null;
    appRoot?.setAttribute('inert', '');
    return () => appRoot?.removeAttribute('inert');
  }, [mobileScreen, showSidebar]);

  const onTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value as string);
    if (!mobileScreen && !expanded) {
      handleToggleSelect(true);
    }
  };

  const tabs = (
    <TabList className={styles.tabs} selectedValue={selectedValue} onTabSelect={onTabSelect} size='large' vertical>
      <Tab id='sample-queries' value='sample-queries' icon={<Rocket20Regular />}>
        {showLabels && translateMessage('Sample Queries')}
      </Tab>
      <Tab id='resources' value='resources' icon={<GroupList20Regular />}>
        {showLabels && translateMessage('Resources')}
      </Tab>
      <Tab id='history' value='history' icon={<History20Regular />}>
        {showLabels && translateMessage('History')}
      </Tab>
    </TabList>
  );

  const tabItems: Record<string, JSX.Element> = {
    'sample-queries': <SampleQueries />,
    'resources': <ResourceExplorer />,
    'history': <History />
  };

  if (mobileScreen) {
    return (
      <OverlayDrawer
        {...restoreFocusSource}
        id={MOBILE_SIDEBAR_ID}
        aria-labelledby={`${MOBILE_SIDEBAR_ID}-title`}
        className={styles.drawer}
        size='full'
        open={showSidebar}
        onOpenChange={(_event, data) => handleToggleSelect(data.open)}
      >
        <DrawerHeader className={styles.drawerHeader}>
          <DrawerHeaderTitle
            heading={{ id: `${MOBILE_SIDEBAR_ID}-title` }}
            action={<Button
              appearance='subtle'
              icon={<Dismiss20Regular />}
              aria-label={translateMessage('Close')}
              onClick={() => handleToggleSelect(false)}
            />}
          >
            {translateMessage('Queries')}
          </DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody className={styles.drawerBody}>
          {tabs}
          <div className={styles.body}>{tabItems[selectedValue]}</div>
        </DrawerBody>
      </OverlayDrawer>
    );
  }

  return showSidebar ? (
    <div className={styles.container}>
      <SidebarToggle
        className={styles.sidebarToggle}
        show={expanded}
        handleShow={() => handleToggleSelect(!expanded)}
      />
      {tabs}
      {expanded && <div className={styles.body}>{tabItems[selectedValue]}</div>}
    </div>
  ) : null;
};

export { Sidebar };
