import { Pivot, PivotItem } from '@fluentui/react';
import React from 'react';

import { telemetry } from '../../../telemetry';
import { translateMessage } from '../../utils/translate-messages';
import History from './history/History';
import { ResourceExplorer } from './resource-explorer';
import SampleQueries from './sample-queries/SampleQueries';

export const Sidebar = () => {
  return (
    <div>
      <Pivot onLinkClick={onPivotItemClick} overflowBehavior='menu'>
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
    </div>
  );
};

function onPivotItemClick(item?: PivotItem) {
  if (!item) { return; }
  const key = item.props.itemKey;
  if (key) {
    telemetry.trackTabClickEvent(key);
  }
}
