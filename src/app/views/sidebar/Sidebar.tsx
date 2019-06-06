import { DetailsList, SelectionMode } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import * as queryActionCreators from '../../services/actions/query-action-creators';
import { SampleQueries } from './sample-queries';

export class Sidebar extends Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            samples: SampleQueries,
        };
    }

    public render() {
        const { samples } = this.state;
        const categories: any[] = [];
        const map = new Map();

        const columns = [
            { key: 'category', name: 'Sample Queries', fieldName: 'humanName', minWidth: 100, maxWidth: 200 }
        ];

        const getNumberOfOccurrences = (category: any) => {
            let occurs = 0;
            samples.forEach((element: { category: any; }) => {
                if (element.category === category) {
                    occurs++;
                }
            });
            return occurs;
        };

        for (const item of samples) {
            if (!map.has(item.category)) {
                map.set(item.category, true);
                categories.push({
                    name: item.category,
                    key: item.category,
                    startIndex: 0,
                    count: 0
                });
            }
        }

        return (
            <div>
                <DetailsList
                    items={samples}
                    selectionMode={SelectionMode.none}
                    columns={columns}
                    groups={categories}
                    groupProps={{
                        showEmptyGroups: true
                    }}
                />
            </div>
        );
    }
}

function mapDispatchToProps(dispatch: Dispatch): object {
    return {
        actions: bindActionCreators(queryActionCreators, dispatch),
    };
}

function mapStateToProps(state: any) {
    return {
        isLoadingData: state.isLoadingData
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
