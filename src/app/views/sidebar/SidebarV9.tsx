import { SelectTabData, SelectTabEvent, Tab, TabList } from '@fluentui/react-components';
import { GroupList20Regular, History20Regular, Rocket20Regular } from '@fluentui/react-icons';

import { useState } from 'react';
import { translateMessage } from '../../utils/translate-messages';
import { History } from './history';
import ResourceExplorer from './resource-explorer';
import SampleQueries from './sample-queries/SampleQueries';
const SidebarV9 = ()=>{
  const [selectedValue, setSelectedValue] = useState<string>('sample-queries');

  const onTabSelect = (_event: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value as string);
  };

  // TODO: change these to V9 components
  const tabItems: Record<string, JSX.Element> = {
    'sample-queries': <SampleQueries />,
    'resources': <ResourceExplorer />,
    'history': <History />
  }

  return (
    <div>
      <TabList selectedValue={selectedValue} onTabSelect={onTabSelect} size="large" vertical>
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

