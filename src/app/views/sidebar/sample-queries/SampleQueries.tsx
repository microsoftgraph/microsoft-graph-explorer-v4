import {
    DetailsList, DetailsRow, IColumn, IconButton,
    SearchBox, Selection, SelectionMode
} from 'office-ui-fabric-react';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { IQuery } from '../../../../types/query-runner';
import * as queryActionCreators from '../../../services/actions/query-action-creators';
import * as queryInputActionCreators from '../../../services/actions/query-input-action-creators';
import { GRAPH_URL } from '../../../services/graph-constants';
import { queries } from './queries';

export class SampleQueries extends Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            samples: queries,
            groupedList: {
              samples: queries,
              categories: [],
            }
        };
    }

    public componentDidMount = () => {
        const { samples } = this.state;
        const groupedList = this.generateSamples(samples);
        this.setState({ groupedList });
    }

    public searchValueChanged = (value: any): void => {
        const { samples } = this.state;
        const keyword = value.toLowerCase();

        const filteredSamples = samples.filter((sample: any) => {
            const name = sample.humanName.toLowerCase();
            return name.toLowerCase().includes(keyword);
        });

        const groupedList = this.generateSamples(filteredSamples);
        this.setState({ groupedList });
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
        window.open(item.docLink, '_blank');
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
                    return <span className='query-content'><FormattedMessage id={queryContent} /></span>;
            }
        }
    };

    public getNumberOfOccurrences = (category: any, samples: any) => {
        let occurs = 0;
        samples.forEach((element: { category: any; }) => {
            if (element.category === category) {
                occurs++;
            }
        });
        return occurs;
    };

    public generateSamples(samples: any) {
        const map = new Map();
        const categories: any[] = [];
        let isCollapsed = false;

        let previousCount = 0;
        let count = 0;
        for (const item of samples) {
            if (!map.has(item.category)) {
                map.set(item.category, true);
                count = this.getNumberOfOccurrences(item.category, samples);
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
        return {
            samples,
            categories
        };
    }


    public render() {
        const { groupedList } = this.state;
        const columns = [
            { key: 'method', name: '', fieldName: 'method', minWidth: 20, maxWidth: 50 },
            { key: 'category', name: 'Samples', fieldName: 'humanName', minWidth: 100, maxWidth: 200 },
            { key: 'button', name: '', fieldName: 'button', minWidth: 20, maxWidth: 20 },
        ];

        const selection = new Selection({
            onSelectionChanged: () => {
                const { actions } = this.props;
                const item = selection.getSelection()[0] as any;
                if (!item) { return; }
                const query: IQuery = {
                    sampleUrl: GRAPH_URL + item.requestUrl,
                    selectedVerb: item.method,
                    sampleBody: item.postBody,
                };

                if (actions) {
                    if (query.selectedVerb === 'GET') {
                        query.sampleBody = JSON.parse('{}');
                        actions.runQuery(query);
                    } else {
                        query.sampleBody = (query.sampleBody) ? JSON.parse(query.sampleBody) : undefined;
                    }
                    actions.setSampleQuery(query);
                }
            }
        });

        return (
            <div>
                <SearchBox placeholder='Search'
                    onChange={(value) => this.searchValueChanged(value)}
                />
                <hr />
                <DetailsList
                    items={groupedList.samples}
                    selectionMode={SelectionMode.none}
                    columns={columns} groups={groupedList.categories}
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
        actions:  bindActionCreators({ ...queryActionCreators, ...queryInputActionCreators }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SampleQueries);
