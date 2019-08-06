import { Pivot, PivotItem } from 'office-ui-fabric-react';
import React from 'react';

import SampleQueries from './sample-queries/SampleQueries';

export const Sidebar = () => {
  return (
    <div>
      <Pivot>
        <PivotItem headerText='Sample Queries'>
          <SampleQueries />
        </PivotItem>
      </Pivot>
    </div>
  );
};
