import { Pivot, PivotItem } from 'office-ui-fabric-react';
import React from 'react';

import { telemetry } from '../../../telemetry';
import History from './history/History';
import SampleQueries from './sample-queries/SampleQueries';
import Apps from './apps/Apps';

export const Sidebar = ({ sampleHeaderText, historyHeaderText, appHeaderText }: any) => {
  return (
    <div>
      <Pivot onLinkClick={onPivotItemClick}>
        <PivotItem headerText={sampleHeaderText} itemIcon='Rocket' itemKey='sample-queries'>
          <SampleQueries />
        </PivotItem>
        <PivotItem headerText={historyHeaderText} itemIcon='History' itemKey='history'>
          <History />
        </PivotItem>
        <PivotItem headerText={appHeaderText} itemIcon='App' itemKey='app'>
          <Apps />
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
