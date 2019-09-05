import { Pivot, PivotItem } from 'office-ui-fabric-react';
import React from 'react';

import History from './history/History';
import SampleQueries from './sample-queries/SampleQueries';

export const Sidebar = () => {
  return (
    <div>
      <Pivot>
        <PivotItem headerText='Sample Queries' itemIcon='Rocket'>
          <SampleQueries />
        </PivotItem>
        <PivotItem headerText='History' itemIcon='History'>
          <History />
        </PivotItem>
      </Pivot>
    </div>
  );
};
