import { IconButton, Pivot, PivotItem, Stack } from '@fluentui/react';
import React from 'react';

import { telemetry } from '../../../telemetry';
import { translateMessage } from '../../utils/translate-messages';
import History from './history/History';
import { ResourceExplorer } from './resource-explorer';
import SampleQueries from './sample-queries/SampleQueries';

interface ISidebar {
  currentTab: string;
  setSidebarTabSelection: Function;
  showSidebar: Boolean;
  toggleSidebar: Function;
}
export const Sidebar = (props: ISidebar) =>{
  const showSidebar = props.showSidebar;


  const onPivotItemClick = (item?: PivotItem) => {
    if (!item) { return; }
    const key = item.props.itemKey;
    if (key) {
      props.setSidebarTabSelection(key);
      telemetry.trackTabClickEvent(key);
    }
  }
  const openComponent = (key: string) => {
    props.toggleSidebar();
    props.setSidebarTabSelection(key);
  }

  return (
    <div>
      {showSidebar &&
      <Pivot onLinkClick={onPivotItemClick} overflowBehavior='menu' defaultSelectedKey={props.currentTab}>
        <PivotItem
          headerText={translateMessage('Sample Queries')}
          itemIcon='Rocket'
          itemKey='sample-queries'
          headerButtonProps={{
            'aria-controls': 'sample-queries-tab'
          }}
        >
          <div id={'sample-queries-tab'}><SampleQueries /></div>
        </PivotItem>
        <PivotItem
          headerText={translateMessage('Resources')}
          itemIcon='ExploreData'
          itemKey='resources'
          headerButtonProps={{
            'aria-controls': 'resources-tab'
          }}
        >
          <div id={'resources-tab'}><ResourceExplorer /></div>
        </PivotItem>
        <PivotItem
          headerText={translateMessage('History')}
          itemIcon='History'
          itemKey='history'
          headerButtonProps={{
            'aria-controls': 'history-tab'
          }}
        >
          <div id={'history-tab'}><History /></div>
        </PivotItem>
      </Pivot>
      }
      { !showSidebar &&(
        <Stack tokens={{childrenGap: 10, padding: 10}}>
          <IconButton
            iconProps={{iconName: 'Rocket'}}
            title={translateMessage('Sample Queries')}
            ariaLabel={translateMessage('Sample Queries')}
            onClick={() => openComponent('sample-queries')}
          />
          <IconButton
            iconProps={{iconName: 'ExploreData'}}
            title={translateMessage('Resources')}
            ariaLabel={translateMessage('Resources')}
            onClick={() => openComponent('resources')}
          />
          <IconButton
            iconProps={{iconName: 'History'}}
            title={translateMessage('History')}
            ariaLabel={translateMessage('History')}
            onClick={() => openComponent('history')}
          />
        </Stack>)
      }
    </div>
  );
};


