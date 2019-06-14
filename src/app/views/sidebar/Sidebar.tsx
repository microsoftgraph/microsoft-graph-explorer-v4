import { Pivot, PivotItem } from 'office-ui-fabric-react';
import React from 'react';

import SampleQueries from './sample-queries/SampleQueries';
import './sidebar.scss';

export const Sidebar = () => {
    return (
        <div className='query-list'>
            <Pivot>
                <PivotItem headerText='Sample Categories'>
                    <SampleQueries />
                </PivotItem>
            </Pivot>
        </div>

    );
};