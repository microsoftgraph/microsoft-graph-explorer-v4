import { makeStyles, SelectTabData, SelectTabEvent, Tab, TabList } from '@fluentui/react-components';
import { GroupList20Regular, History20Regular, Rocket20Regular } from '@fluentui/react-icons';

import { useState } from 'react';
import { translateMessage } from '../../utils/translate-messages';
import { History } from './history';
import ResourceExplorer from './resource-explorer';
import { SampleQueriesV9 } from './sample-queries/SampleQueriesV9';
const useStyles = makeStyles({
  tabList: {
    margin: '8px 0'
  }
})
const SidebarV9 = ()=>{
  const sidebarStyles = useStyles();

  const [selectedValue, setSelectedValue] = useState<string>('sample-queries');

  const onTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value as string);
  };

  // TODO: change these to V9 components
  const tabItems: Record<string, JSX.Element> = {
    'sample-queries': <SampleQueriesV9 />,
    'resources': <ResourceExplorer />,
    'history': <History />
  }

  return (
    <div>
      <TabList
        className={sidebarStyles.tabList}
        selectedValue={selectedValue} onTabSelect={onTabSelect} size="large" vertical>
        <Tab id="sample-queries" value="sample-queries" icon={<Rocket20Regular />}>
          {translateMessage('Sample Queries')}</Tab>
        <Tab id="resources" value="resources" icon={<GroupList20Regular />}>{translateMessage('Resources')}</Tab>
        <Tab id="history" value="history" icon={<History20Regular />}>{translateMessage('History')}</Tab>
      </TabList>
      <div>
        {tabItems[selectedValue]}
      </div>
    </div>
  )
}

export { SidebarV9 };

