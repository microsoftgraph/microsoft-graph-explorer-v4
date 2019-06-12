import { DetailsList, DetailsRow, IColumn, IconButton, Selection, SelectionMode } from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { IQuery } from '../../../types/query-runner';
import * as queryActionCreators from '../../services/actions/query-action-creators';
import * as queryInputActionCreators from '../../services/actions/query-input-action-creators';
import { GRAPH_URL } from '../../services/graph-constants';
import { SampleQueries } from './sample-queries';
import './sidebar.scss';

export class Sidebar extends Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            samples: SampleQueries,
        };
    }

    public renderRow = (props: any): any => {
        const { tokenPresent } = this.props;
        let selectionDisabled = false;
        if (props) {
            if (!tokenPresent && props.item.method !== 'GET') {
                selectionDisabled = true;
            }
            return (
                <div className={'row-disabled-' + selectionDisabled} data-selection-disabled={selectionDisabled}>
                    <DetailsRow {...props} className='query-row' />
                </div>
            );
        }
      };

    public onDocumentationLinkClicked = (event: any, item: any) => {
        console.log(item.docLink);
    };

    public renderItemColumn = (item: any, index: number | undefined, column: IColumn | undefined) => {
        if (column) {
            const queryContent = item[column.fieldName as keyof any] as string;
            switch (column.key) {

                case 'button':
                    return <IconButton
                        className='pull-right doc-link'
                        iconProps={{ iconName: 'NavigateExternalInline' }}
                        title={item.docLink}
                        ariaLabel={item.docLink}
                        onClick={(event) => this.onDocumentationLinkClicked(event, item)}
                    />;

                case 'method':
                    return <span className={'badge badge-' + item.method}>{item.method}</span>;

                default:
                    return <span className='query-content'>{queryContent}</span>;
            }
        }
    };

    public getNumberOfOccurrences = (category: any) => {
        const { samples } = this.state;
        let occurs = 0;
        samples.forEach((element: { category: any; }) => {
            if (element.category === category) {
                occurs++;
            }
        });
        return occurs;
    };


    public render() {
        const { samples } = this.state;
        const categories: any[] = [];
        const map = new Map();

        const columns = [
            { key: 'method', name: '', fieldName: 'method', minWidth: 20, maxWidth: 50 },
            { key: 'category', name: 'Sample Queries', fieldName: 'humanName', minWidth: 100, maxWidth: 200 },
            { key: 'button', name: '', fieldName: 'button', minWidth: 20, maxWidth: 20 },
        ];

        const selection = new Selection({
            onSelectionChanged: () => {
                const { actions } = this.props;
                const item = selection.getSelection()[0] as any;
                const query: IQuery = {
                    sampleUrl: GRAPH_URL + item.requestUrl,
                    selectedVerb: item.method,
                    sampleBody: item.postBody,
                  };

                if (actions) {
                    if (query.selectedVerb === 'GET') {
                        query.sampleBody = JSON.parse('{}');
                        actions.queryActions.runQuery(query);
                    } else {
                        query.sampleBody = (query.sampleBody) ? JSON.parse(query.sampleBody) : undefined;
                    }
                    actions.queryInputActions.setSampleQuerySuccess(query);
                }
            }
        });

        let previousCount = 0;
        let isCollapsed = false;
        for (const item of samples) {
            if (!map.has(item.category)) {
                map.set(item.category, true);
                const count = this.getNumberOfOccurrences(item.category);

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
                        showEmptyGroups: true,
                    }}
                    onRenderItemColumn={this.renderItemColumn}
                    onRenderRow={this.renderRow}
                />
            </div>
        );
    }
}
function mapStateToProps(state: any) {
    return {
      tokenPresent: !!state.authToken
    };
  }

function mapDispatchToProps(dispatch: Dispatch): object {
    return {
        actions: {
            queryActions: bindActionCreators(queryActionCreators, dispatch),
            queryInputActions: bindActionCreators(queryInputActionCreators, dispatch)
          }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
