import { DetailsList, IColumn, IconButton, Selection, SelectionMode } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { IQuery } from '../../../types/query-runner';
import * as queryActionCreators from '../../services/actions/query-action-creators';
import { GRAPH_URL } from '../../services/graph-constants';
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
            { key: 'category', name: 'Sample Queries', fieldName: 'humanName', minWidth: 100, maxWidth: 200 },
            { key: 'button', name: '', fieldName: 'button', minWidth: 100, maxWidth: 200 }
        ];

        const onDocumentationLinkClicked = (event: any, item: any) => {
            console.log(item.docLink);
        };

        const selection = new Selection({
            onSelectionChanged: () => {
                const { actions } = this.props;
                const item = selection.getSelection()[0] as any;
                const query: IQuery = {
                    sampleUrl: GRAPH_URL + item.requestUrl,
                    selectedVerb: item.method,
                    sampleBody: item.body,
                  };

                if (actions) {
                actions.runQuery(query);
                }
            }
        });

        const renderItemColumn = (item: any, index: number | undefined, column: IColumn | undefined) => {
            if (column) {

                const fieldContent = item[column.fieldName as keyof any] as string;
                switch (column.key) {
                    case 'button':
                        return <IconButton
                            iconProps={{ iconName: 'NavigateExternalInline' }}
                            title={item.docLink}
                            ariaLabel={item.docLink}
                            onClick={(event) => onDocumentationLinkClicked(event, item)}
                        />;

                    default:
                        return <span>{fieldContent}</span>;
                }
            }
        };

        const getNumberOfOccurrences = (category: any) => {
            let occurs = 0;
            samples.forEach((element: { category: any; }) => {
                if (element.category === category) {
                    occurs++;
                }
            });
            return occurs;
        };

        let previousCount = 0;
        let isCollapsed = false;
        for (const item of samples) {
            if (!map.has(item.category)) {
                map.set(item.category, true);
                const count = getNumberOfOccurrences(item.category);

                if (categories.length > 0) {
                    isCollapsed = true;
                }

                categories.push({
                    name: item.category,
                    key: item.category,
                    startIndex: previousCount,
                    isCollapsed,
                    count
                });

                previousCount += count;
            }
        }

        return (
            <div className='query-list'>
                <DetailsList
                    items={samples}
                    selectionMode={SelectionMode.none}
                    columns={columns}
                    groups={categories}
                    selection={selection}
                    groupProps={{
                        showEmptyGroups: true
                    }}
                    onRenderItemColumn={renderItemColumn}
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

export default connect(null, mapDispatchToProps)(Sidebar);
