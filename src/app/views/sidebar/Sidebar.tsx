import { Pivot, PivotItem } from 'office-ui-fabric-react';
import React from 'react';

import History from './history/History';
import SampleQueries from './sample-queries/SampleQueries';
import { telemetry } from '../../../telemetry';
import { TAB_CLICK_EVENT } from '../../../telemetry/event-types';


function onPivotItemClick (item?: PivotItem): void {
  if (!item) { return; }
  const itemKey = item.props.itemKey;
  switch (itemKey) {
    case 'history': {
      telemetry.trackEvent(TAB_CLICK_EVENT, { ComponentName: 'History Tab' });
      break;
    }
    default: {
      break;
    }
  }
}

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
