import {
  Button, ButtonProps, makeStyles, SelectTabData, SelectTabEvent, Tab, TabList, tokens
} from '@fluentui/react-components';
import {
  GroupList20Regular, History20Regular, PanelLeftContract20Regular, PanelLeftExpand20Regular, Rocket20Regular
} from '@fluentui/react-icons';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { IDimensions } from '../../../types/dimensions';
import { setDimensions } from '../../services/slices/dimensions.slice';
import { translateMessage } from '../../utils/translate-messages';
import { HistoryV9 } from './history/HistoryV9';
import ResourceExplorer from './resource-explorer';
import { SampleQueriesV9 } from './sample-queries/SampleQueriesV9';

interface IShowSidebar {
  show: boolean
  handleShow: ()=>void
}
const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    height: '100vh',
    padding: `0 ${tokens.spacingHorizontalS}`,
    backgroundColor: tokens.colorNeutralBackground6,
    borderRightStyle: 'solid',
    borderRightColor: tokens.colorStrokeFocus2,
    borderRightWidth: tokens.strokeWidthThin
  },
  sidebarToggle: {
    marginLeft: 'auto'
  },
  tabList: {
    margin: '8px 0'
  }
})
const SidebarToggle = (props: IShowSidebar & ButtonProps)=>{
  const {show, handleShow} = props;
  const PanelIcon = ()=> show ? <PanelLeftContract20Regular/>: <PanelLeftExpand20Regular/>

  return <Button appearance="subtle" icon={PanelIcon()} onClick={handleShow} {...props}></Button>
}

interface SidebarProps {
  handleToggleSelect: (showSidebarValue: boolean) => void;
}
const SidebarV9 = (props: SidebarProps)=>{
  const sidebarStyles = useStyles();
  const sidebarProps = useAppSelector(state=> state.sidebarProperties)
  const dimensions = useAppSelector(state=> state.dimensions)
  const dispatch = useAppDispatch()
  const {showSidebar} = sidebarProps;
  const [selectedValue, setSelectedValue] = useState<string>('sample-queries');

  const onTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value as string);
    setShowSidebarValue(true);
    const dims = getDimensions(true, dimensions)
    dispatch(setDimensions(dims))
  };

  const [showSidebarValue, setShowSidebarValue] = useState(showSidebar);
  const handleShow = ()=>{
    const tempDimensions = getDimensions(!showSidebarValue, dimensions)
    dispatch(setDimensions(tempDimensions))
    setShowSidebarValue(!showSidebarValue);
    props.handleToggleSelect(!showSidebarValue)
  }

  // TODO: change these to V9 components
  const tabItems: Record<string, JSX.Element> = {
    'sample-queries': <SampleQueriesV9 />,
    'resources': <ResourceExplorer />,
    'history': <HistoryV9 />
  }
  // TODO: Resizing is not showing/ hiding sidebar. Should be checked when
  // updated to v9

  return (
    <div className={sidebarStyles.container}>
      <div id="sidebar">
        <SidebarToggle className={sidebarStyles.sidebarToggle} show={showSidebarValue} handleShow={handleShow}/>
        <TabList
          className={sidebarStyles.tabList}
          selectedValue={selectedValue} onTabSelect={onTabSelect} size="large" vertical>
          {renderTablistItems(showSidebarValue)}
        </TabList>
        <div>
          {showSidebarValue && tabItems[selectedValue]}
        </div>
      </div>
    </div>
  )
}

const renderTablistItems = (showSidebar: boolean) =>{
  if (showSidebar) {
    return (
      <>
        <Tab id="sample-queries" value="sample-queries" icon={<Rocket20Regular />}>
          {translateMessage('Sample Queries')}</Tab>
        <Tab id="resources" value="resources" icon={<GroupList20Regular />}>{translateMessage('Resources')}</Tab>
        <Tab id="history" value="history" icon={<History20Regular />}>{translateMessage('History')}</Tab>
      </>
    )
  }
  return (
    <>
      <Tab id="sample-queries" value="sample-queries" icon={<Rocket20Regular />}></Tab>
      <Tab id="resources" value="resources" icon={<GroupList20Regular />}></Tab>
      <Tab id="history" value="history" icon={<History20Regular />}></Tab>
    </>
  )
}

const getDimensions = (show: boolean, dimensions: IDimensions)=>{
  let tempDimensions = {...dimensions}
  if (!show){
    tempDimensions = {
      ...dimensions,
      sidebar: {width: '2.85%', height: ''}
    }
  } else {
    tempDimensions = {
      ...dimensions,
      sidebar: {width: '28%', height: ''}
    }
  }
  return tempDimensions
}

export { SidebarV9 };

