import {
  Button, ButtonProps, SelectTabData, SelectTabEvent, Tab, TabList,
  Tooltip
} from '@fluentui/react-components';
import {
  GroupList20Regular, History20Regular, PanelLeftContract20Regular, PanelLeftExpand20Regular, Rocket20Regular
} from '@fluentui/react-icons';

import { useState } from 'react';
import { translateMessage } from '../../utils/translate-messages';
import History from './history/History';
import ResourceExplorer from './resource-explorer';
import { SampleQueries } from './sample-queries/SampleQueries';
import { useSidebarStyles } from './Sidebar.styles';

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
}
const Sidebar = (props: SidebarProps)=>{
  const sidebarStyles = useSidebarStyles();
  const [showSidebarValue, setShowSidebarValue] = useState(true);
  const [selectedValue, setSelectedValue] = useState<string>('sample-queries');

  const onTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value as string);
    if (!showSidebarValue) {
      handleShow();
    }
  };

  const handleShow = () => {
    const newState = !showSidebarValue;
    setShowSidebarValue(newState);
    props.handleToggleSelect(newState);
  };

  const tabItems: Record<string, JSX.Element> = {
    'sample-queries': <SampleQueries />,
    'resources': <ResourceExplorer />,
    'history': <History />
  }

  return (
    <div className={sidebarStyles.container}>
      <SidebarToggle className={sidebarStyles.sidebarToggle} show={showSidebarValue} handleShow={handleShow}/>
      <TabList
        selectedValue={selectedValue} onTabSelect={onTabSelect} size='large' vertical>
        {renderTablistItems(showSidebarValue)}
      </TabList>
      <div>
        {showSidebarValue && tabItems[selectedValue]}
      </div>
    </div>
  )
}

const renderTablistItems = (showSidebar: boolean) =>{
  if (showSidebar) {
    return (
      <>
        <Tab id='sample-queries' value='sample-queries' icon={<Rocket20Regular />}>
          {translateMessage('Sample Queries')}</Tab>
        <Tab id='resources' value='resources' icon={<GroupList20Regular />}>{translateMessage('Resources')}</Tab>
        <Tab id='history' value='history' icon={<History20Regular />}>{translateMessage('History')}</Tab>
      </>
    )
  }
  return (
    <div style={{height: '100%'}}>
      <Tab id='sample-queries' value='sample-queries' icon={<Rocket20Regular />}></Tab>
      <Tab id='resources' value='resources' icon={<GroupList20Regular />}></Tab>
      <Tab id='history' value='history' icon={<History20Regular />}></Tab>
    </div>
  )
}

export { Sidebar };