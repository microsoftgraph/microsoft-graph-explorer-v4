import { Pivot, PivotItem } from '@fluentui/react';
import React from 'react';

import { telemetry } from '../../../telemetry';
import { translateMessage } from '../../utils/translate-messages';
import History from './history/History';
import SampleQueries from './sample-queries/SampleQueries';
import { ResourceExplorer } from './resource-explorer';
export const Sidebar = () => {
  return (
    <div>
      <Pivot onLinkClick={onPivotItemClick} overflowBehavior='menu'>
        <PivotItem headerText={translateMessage('Sample Queries')} itemIcon='Rocket' itemKey='sample-queries'>
          <SampleQueries />
        </PivotItem>
        <PivotItem headerText={translateMessage('Resources')} itemIcon='ExploreData' itemKey='resources'>
          <ResourceExplorer />
        </PivotItem>
        <PivotItem headerText={translateMessage('History')} itemIcon='History' itemKey='history'>
          <History />
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
