import { Pivot, PivotItem } from 'office-ui-fabric-react';
import React from 'react';

import { telemetry } from '../../../telemetry';
import { TAB_CLICK_EVENT } from '../../../telemetry/event-types';
import History from './history/History';
import SampleQueries from './sample-queries/SampleQueries';


export const Sidebar = ({sampleHeaderText, historyHeaderText}: any) => {
  return (
    <div>
      <Pivot onLinkClick={onPivotItemClick}>
        <PivotItem headerText={sampleHeaderText} itemIcon='Rocket' itemKey='sample-queries'>
          <SampleQueries />
        </PivotItem>
        <PivotItem headerText={historyHeaderText} itemIcon='History' itemKey='history'>
          <History />
        </PivotItem>
      </Pivot>
    </div>
  );
};

function onPivotItemClick (item?: PivotItem) {
  if (!item) { return; }
  const key = item.props.itemKey;
  if (key) {
    trackTabClickEvent(key);
  }
}

function trackTabClickEvent(tabKey: string) {
  switch (tabKey) {
    case 'history': {
      telemetry.trackEvent(TAB_CLICK_EVENT, { ComponentName: 'History tab' });
      break;
    }
    default: {
      break;
    }
  }
}
