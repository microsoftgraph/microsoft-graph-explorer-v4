import { Pivot, PivotItem } from 'office-ui-fabric-react';
import React from 'react';

import History from './history/History';
import SampleQueries from './sample-queries/SampleQueries';

export const Sidebar = ({sampleHeaderText, historyHeaderText}: any) => {
  return (
    <div>
      <Pivot>
        <PivotItem headerText={sampleHeaderText} itemIcon='Rocket'>
          <SampleQueries />
        </PivotItem>
        <PivotItem headerText={historyHeaderText} itemIcon='History'>
          <History />
        </PivotItem>
      </Pivot>
    </div>
  );
};
